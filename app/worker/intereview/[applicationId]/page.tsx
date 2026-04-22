"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "../../../../lib/supabase/client";

type Message = {
  role: "assistant" | "user";
  content: string;
};

// How many worker messages before we wrap up
const MAX_WORKER_TURNS = 12;

export default function InterviewPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.applicationId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Context loaded from DB
  const [workerName, setWorkerName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [interviewId, setInterviewId] = useState("");

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [workerTurns, setWorkerTurns] = useState(0);
  const [phase, setPhase] = useState<"chat" | "wrapping_up" | "done">("chat");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function bootstrap() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Load application + interview + worker profile + job
      const { data: app, error: appErr } = await supabase
        .from("applications")
        .select(
          `id, worker_id, interview_status,
           job_listings (
             title, description, qualifications,
             businesses (company_name)
           ),
           interviews (id, transcript, status)`
        )
        .eq("id", applicationId)
        .single();

      if (appErr || !app) {
        setError("Interview not found.");
        setLoading(false);
        return;
      }

      if (app.worker_id !== user.id) {
        router.push("/worker/dashboard");
        return;
      }

      // If already completed, go back to dashboard
      if (app.interview_status === "completed") {
        router.push("/worker/dashboard");
        return;
      }

      // Must be scheduled or in_progress to enter here
      if (!["scheduled", "in_progress"].includes(app.interview_status)) {
        router.push("/worker/dashboard");
        return;
      }

      const job = Array.isArray(app.job_listings)
        ? app.job_listings[0]
        : app.job_listings;
      const biz = job?.businesses
        ? Array.isArray(job.businesses)
          ? job.businesses[0]
          : job.businesses
        : null;
      const interview = Array.isArray(app.interviews)
        ? app.interviews[0]
        : app.interviews;

      setJobTitle(job?.title ?? "this role");
      setCompanyName(biz?.company_name ?? "the company");
      setInterviewId(interview?.id ?? "");

      // Load worker profile
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "full_name, experience_summary, previous_roles, biggest_achievement, skills, what_good_at"
        )
        .eq("id", user.id)
        .single();

      setWorkerName(profile?.full_name?.split(" ")[0] ?? "there");

      // Mark interview as in_progress
      await supabase
        .from("applications")
        .update({ interview_status: "in_progress" })
        .eq("id", applicationId);

      if (interview?.id) {
        await supabase
          .from("interviews")
          .update({
            status: "in_progress",
            started_at: new Date().toISOString(),
          })
          .eq("id", interview.id);
      }

      // If there's an existing transcript (resumed session), restore it
      if (
        interview?.transcript &&
        Array.isArray(interview.transcript) &&
        interview.transcript.length > 0
      ) {
        setMessages(interview.transcript as Message[]);
        const workerMsgCount = (interview.transcript as Message[]).filter(
          (m) => m.role === "user"
        ).length;
        setWorkerTurns(workerMsgCount);
        setLoading(false);
        return;
      }

      // Fresh interview — get the opening message from the AI
      const opening = await fetchAIMessage({
        messages: [],
        profile,
        job,
        biz,
        applicationId,
        isOpening: true,
      });

      const firstMessage: Message = { role: "assistant", content: opening };
      setMessages([firstMessage]);

      // Save opening to transcript
      if (interview?.id) {
        await supabase
          .from("interviews")
          .update({ transcript: [firstMessage] })
          .eq("id", interview.id);
      }

      setLoading(false);
    }

    bootstrap();
  }, [applicationId]);

  async function fetchAIMessage({
    messages,
    profile,
    job,
    biz,
    applicationId,
    isOpening = false,
  }: {
    messages: Message[];
    profile: any;
    job: any;
    biz: any;
    applicationId: string;
    isOpening?: boolean;
  }): Promise<string> {
    const res = await fetch("/api/interview/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId,
        messages,
        profile,
        job: {
          title: job?.title,
          description: job?.description,
          qualifications: job?.qualifications,
        },
        companyName: biz?.company_name,
        isOpening,
      }),
    });

    if (!res.ok) {
      throw new Error("AI response failed");
    }

    const data = await res.json();
    return data.message;
  }

  async function handleSend() {
    if (!input.trim() || sending || phase !== "chat") return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    const newTurnCount = workerTurns + 1;

    setMessages(updatedMessages);
    setInput("");
    setWorkerTurns(newTurnCount);
    setSending(true);

    try {
      // Reload context for the API call (profile + job already in DB,
      // API route fetches them server-side using applicationId)
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          messages: updatedMessages,
          isClosing: newTurnCount >= MAX_WORKER_TURNS,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Save transcript after every exchange
      if (interviewId) {
        await supabase
          .from("interviews")
          .update({ transcript: finalMessages })
          .eq("id", interviewId);
      }

      // If we've hit the turn limit OR the AI signalled completion
      if (newTurnCount >= MAX_WORKER_TURNS || data.isComplete) {
        setPhase("wrapping_up");
        await finishInterview(finalMessages);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function finishInterview(finalMessages: Message[]) {
    // Call the summary endpoint
    const res = await fetch("/api/interview/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, transcript: finalMessages }),
    });

    if (res.ok) {
      // Mark application + interview as completed
      await supabase
        .from("applications")
        .update({ interview_status: "completed" })
        .eq("id", applicationId);

      if (interviewId) {
        await supabase
          .from("interviews")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", interviewId);
      }

      setPhase("done");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Render ────────────────────────────────────────────────

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
            Preparing your interview…
          </p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>
            This takes a few seconds.
          </p>
        </div>
      </main>
    );

  if (error)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <p style={{ color: "rgba(255,100,100,0.8)" }}>{error}</p>
      </main>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#f5f5f7",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap');
        * { box-sizing: border-box; }
        textarea:focus { outline: none; }
        textarea { resize: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* ── NAV ── */}
      <nav
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          height: "52px",
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Talentgate
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  phase === "done"
                    ? "rgba(80,200,120,0.8)"
                    : phase === "wrapping_up"
                    ? "rgba(255,200,60,0.8)"
                    : "rgba(80,160,255,0.8)",
                display: "inline-block",
              }}
            />
            <span
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}
            >
              {phase === "done"
                ? "Interview complete"
                : phase === "wrapping_up"
                ? "Wrapping up…"
                : `Interview in progress · ${jobTitle} at ${companyName}`}
            </span>
          </div>

          {/* Turn counter */}
          {phase === "chat" && (
            <span
              style={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "0.2rem 0.6rem",
                borderRadius: "980px",
              }}
            >
              {MAX_WORKER_TURNS - workerTurns} responses left
            </span>
          )}
        </div>
      </nav>

      {/* ── MESSAGES ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: 720,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {/* AI avatar dot */}
            {msg.role === "assistant" && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginRight: "0.75rem",
                  marginTop: 2,
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                }}
              >
                TG
              </div>
            )}

            <div
              style={{
                maxWidth: "80%",
                padding: "0.85rem 1.1rem",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background:
                  msg.role === "user"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.92rem",
                lineHeight: 1.65,
                color:
                  msg.role === "user"
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.7)",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {sending && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 600,
              }}
            >
              TG
            </div>
            <div
              style={{
                padding: "0.85rem 1.1rem",
                borderRadius: "18px 18px 18px 4px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    display: "inline-block",
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 0.3; transform: scale(0.85); }
                  50% { opacity: 1; transform: scale(1); }
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Wrap-up message */}
        {phase === "wrapping_up" && !sending && (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.82rem",
              padding: "1rem 0",
            }}
          >
            Generating your summary…
          </div>
        )}

        {/* Done state */}
        {phase === "done" && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              background: "rgba(80,200,120,0.05)",
              border: "1px solid rgba(80,200,120,0.15)",
              borderRadius: 16,
              margin: "1rem 0",
            }}
          >
            <p
              style={{
                color: "rgba(80,200,120,0.9)",
                fontWeight: 500,
                marginBottom: "0.5rem",
              }}
            >
              Interview complete
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.88rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              Your interview has been submitted. {companyName} will receive a
              summary shortly.
            </p>
            <button
              onClick={() => router.push("/worker/dashboard")}
              style={{
                background: "#fff",
                color: "#000",
                border: "none",
                padding: "0.7rem 1.8rem",
                borderRadius: "980px",
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                fontFamily: "-apple-system, sans-serif",
              }}
            >
              Back to dashboard
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── INPUT BAR ── */}
      {phase === "chat" && (
        <div
          style={{
            flexShrink: 0,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.9)",
            padding: "1rem 1rem 1.25rem",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response… (Enter to send, Shift+Enter for new line)"
              rows={3}
              disabled={sending}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                padding: "0.85rem 1rem",
                color: "#f5f5f7",
                fontSize: "0.92rem",
                fontFamily: "-apple-system, sans-serif",
                lineHeight: 1.5,
                opacity: sending ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background:
                  input.trim() && !sending ? "#fff" : "rgba(255,255,255,0.08)",
                border: "none",
                cursor: input.trim() && !sending ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 14V2M2 8l6-6 6 6"
                  stroke={
                    input.trim() && !sending ? "#000" : "rgba(255,255,255,0.3)"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.15)",
              fontSize: "0.72rem",
              marginTop: "0.6rem",
            }}
          >
            This conversation is private. The business receives a summary only.
          </p>
        </div>
      )}
    </main>
  );
}
