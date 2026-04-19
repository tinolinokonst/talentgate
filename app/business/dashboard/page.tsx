"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

// ── Recommendation badge ──────────────────────────────────────
function RecommendationBadge({ value }: { value: string }) {
  const map: Record<
    string,
    { label: string; color: string; bg: string; border: string }
  > = {
    strong_yes: {
      label: "Strong yes",
      color: "rgba(80,200,120,1)",
      bg: "rgba(80,200,120,0.1)",
      border: "rgba(80,200,120,0.3)",
    },
    yes: {
      label: "Yes",
      color: "rgba(80,200,120,0.8)",
      bg: "rgba(80,200,120,0.07)",
      border: "rgba(80,200,120,0.2)",
    },
    maybe: {
      label: "Maybe",
      color: "rgba(255,200,60,0.9)",
      bg: "rgba(255,200,60,0.08)",
      border: "rgba(255,200,60,0.25)",
    },
    no: {
      label: "Not recommended",
      color: "rgba(255,100,100,0.9)",
      bg: "rgba(255,100,100,0.08)",
      border: "rgba(255,100,100,0.25)",
    },
  };
  const s = map[value] ?? map["maybe"];
  return (
    <span
      style={{
        display: "inline-block",
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontSize: "0.8rem",
        fontWeight: 600,
        padding: "0.3rem 0.9rem",
        borderRadius: "980px",
        letterSpacing: "0.02em",
      }}
    >
      {s.label}
    </span>
  );
}

// ── Confidence badge ──────────────────────────────────────────
function ConfidenceBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    high: "rgba(80,200,120,0.7)",
    medium: "rgba(255,200,60,0.7)",
    low: "rgba(255,100,100,0.7)",
  };
  return (
    <span
      style={{
        fontSize: "0.75rem",
        color: colors[value] ?? "rgba(255,255,255,0.4)",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "0.15rem 0.55rem",
        borderRadius: "980px",
      }}
    >
      {value} confidence
    </span>
  );
}

// ── Interview status badge (shown on applicant list cards) ────
function InterviewStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    not_started: { label: "Not scheduled", color: "rgba(255,255,255,0.25)" },
    invited: { label: "Invited", color: "rgba(255,200,60,0.7)" },
    scheduled: { label: "Scheduled", color: "rgba(80,160,255,0.8)" },
    in_progress: { label: "In progress", color: "rgba(80,160,255,0.9)" },
    completed: { label: "Interview done", color: "rgba(80,200,120,0.9)" },
    declined: { label: "Declined", color: "rgba(255,255,255,0.25)" },
  };
  const s = map[status] ?? map["not_started"];
  return (
    <span
      style={{
        fontSize: "0.72rem",
        color: s.color,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${s.color}`,
        padding: "0.15rem 0.55rem",
        borderRadius: "980px",
        whiteSpace: "nowrap" as const,
      }}
    >
      {s.label}
    </span>
  );
}

// ── AI Summary panel ──────────────────────────────────────────
function AISummaryPanel({ summary }: { summary: any }) {
  if (!summary || summary.parse_error) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.5rem",
          }}
        >
          AI Interview Summary
        </p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
          Summary could not be generated for this interview.
        </p>
      </div>
    );
  }

  const sectionLabel = (text: string) => (
    <p
      style={{
        fontSize: "0.68rem",
        color: "rgba(255,255,255,0.3)",
        textTransform: "uppercase",
        letterSpacing: "0.09em",
        marginBottom: "0.4rem",
        marginTop: 0,
      }}
    >
      {text}
    </p>
  );

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        padding: "1.4rem",
        marginBottom: "1.75rem",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.25rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            AI Interview Summary
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "0.1rem 0.5rem",
              borderRadius: "980px",
            }}
          >
            Talentgate AI
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {summary.confidence_level && (
            <ConfidenceBadge value={summary.confidence_level} />
          )}
          {summary.recommendation && (
            <RecommendationBadge value={summary.recommendation} />
          )}
        </div>
      </div>

      {/* Recommendation reason */}
      {summary.recommendation_reason && (
        <div style={{ marginBottom: "1.1rem" }}>
          {sectionLabel("Recommendation")}
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.88rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {summary.recommendation_reason}
          </p>
        </div>
      )}

      {/* Traits */}
      {summary.traits?.length > 0 && (
        <div style={{ marginBottom: "1.1rem" }}>
          {sectionLabel("Character traits")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {summary.traits.map((t: string) => (
              <span
                key={t}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.78rem",
                  padding: "0.2rem 0.7rem",
                  borderRadius: "980px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Communication style */}
      {summary.communication_style && (
        <div style={{ marginBottom: "1.1rem" }}>
          {sectionLabel("Communication style")}
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {summary.communication_style}
          </p>
        </div>
      )}

      {/* Relevant experience */}
      {summary.relevant_experience && (
        <div style={{ marginBottom: "1.1rem" }}>
          {sectionLabel("Relevant experience")}
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {summary.relevant_experience}
          </p>
        </div>
      )}

      {/* Standout moments */}
      {summary.standout_moments?.length > 0 && (
        <div style={{ marginBottom: "1.1rem" }}>
          {sectionLabel("Standout moments")}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            {summary.standout_moments.map((m: string, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "rgba(80,200,120,0.6)",
                    fontSize: "0.75rem",
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <p
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.85rem",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {m}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas of concern */}
      {summary.areas_of_concern?.length > 0 && (
        <div>
          {sectionLabel("Areas to probe further")}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            {summary.areas_of_concern.map((c: string, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,180,60,0.6)",
                    fontSize: "0.75rem",
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                >
                  ◎
                </span>
                <p
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "0.85rem",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {c}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────
export default function BusinessDashboard() {
  const [talentWorkers, setTalentWorkers] = useState<any[]>([]);
  const [talentSearch, setTalentSearch] = useState("");
  const [loadingTalent, setLoadingTalent] = useState(false);
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "listings" | "applicants" | "talent"
  >("listings");
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  // Filter: "all" | "completed" | "pending"
  const [interviewFilter, setInterviewFilter] = useState<
    "all" | "completed" | "pending"
  >("all");
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data: biz } = await supabase
        .from("businesses")
        .select("id, company_name, verified, subscription_active")
        .eq("profile_id", user.id)
        .single();
      setBusiness(biz);
      if (biz) {
        const { data: listings } = await supabase
          .from("job_listings")
          .select(
            "id, title, location, country, status, created_at, industry, work_type"
          )
          .eq("business_id", biz.id)
          .order("created_at", { ascending: false });
        setJobs(listings || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // ── UPDATED: now also fetches interviews for each application ──
  async function loadApplicants(jobId: string) {
    setLoadingApplicants(true);
    setSelectedJob(jobId);
    setActiveTab("applicants");
    setInterviewFilter("all");

    const { data } = await supabase
      .from("applications")
      .select(
        `id, status, created_at, interview_status,
         profiles(full_name, location, country, skills, experience_summary,
                  what_good_at, job_type, previous_roles, biggest_achievement,
                  industries, cv_url),
         interviews(ai_summary, status, scheduled_at, completed_at)`
      )
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    const normalized = (data || []).map((app: any) => ({
      ...app,
      profiles: Array.isArray(app.profiles)
        ? app.profiles[0] ?? null
        : app.profiles ?? null,
      interviews: Array.isArray(app.interviews)
        ? app.interviews[0] ?? null
        : app.interviews ?? null,
    }));

    // Sort: completed interviews first, then by applied date
    normalized.sort((a: any, b: any) => {
      const aComplete = a.interview_status === "completed" ? 0 : 1;
      const bComplete = b.interview_status === "completed" ? 0 : 1;
      if (aComplete !== bComplete) return aComplete - bComplete;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    setApplicants(normalized);
    setLoadingApplicants(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function loadTalent() {
    setLoadingTalent(true);
    const { data } = await supabase
      .from("profiles")
      .select(
        "id, full_name, location, country, skills, industries, job_type, experience_summary, what_good_at"
      )
      .eq("open_to_work", true)
      .eq("verified", true);
    setTalentWorkers(data || []);
    setLoadingTalent(false);
  }

  async function toggleJobStatus(jobId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    await supabase
      .from("job_listings")
      .update({ status: newStatus })
      .eq("id", jobId);
    setJobs(
      jobs.map((j: any) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
  }

  async function deleteJob(jobId: string) {
    await supabase.from("job_listings").delete().eq("id", jobId);
    setJobs(jobs.filter((j: any) => j.id !== jobId));
    if (selectedJob === jobId) {
      setSelectedJob(null);
      setActiveTab("listings");
    }
  }

  const selectedJobTitle = jobs.find((j: any) => j.id === selectedJob)?.title;

  // Filtered applicant list
  const filteredApplicants = applicants.filter((app: any) => {
    if (interviewFilter === "completed")
      return app.interview_status === "completed";
    if (interviewFilter === "pending")
      return app.interview_status !== "completed";
    return true;
  });

  const completedCount = applicants.filter(
    (a: any) => a.interview_status === "completed"
  ).length;

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "-apple-system, sans-serif",
          }}
        >
          Loading...
        </p>
      </main>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#f5f5f7",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap');`}</style>

      {/* ── APPLICANT MODAL ── */}
      {selectedApplicant && (
        <div
          onClick={() => setSelectedApplicant(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "2.5rem",
              maxWidth: 660,
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedApplicant(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "-apple-system, sans-serif",
              }}
            >
              ×
            </button>

            {/* Name + meta */}
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "0.4rem",
              }}
            >
              {selectedApplicant.profiles?.full_name}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.85rem",
                marginBottom: "0.3rem",
              }}
            >
              {[
                selectedApplicant.profiles?.location,
                selectedApplicant.profiles?.country,
                selectedApplicant.profiles?.job_type,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "2rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}
              >
                Applied{" "}
                {new Date(selectedApplicant.created_at).toLocaleDateString()}
              </span>
              <InterviewStatusBadge
                status={selectedApplicant.interview_status ?? "not_started"}
              />
            </div>

            {/* ── AI SUMMARY — shown first and prominently ── */}
            {selectedApplicant.interview_status === "completed" && (
              <AISummaryPanel
                summary={selectedApplicant.interviews?.ai_summary}
              />
            )}

            {/* Interview pending state */}
            {selectedApplicant.interview_status &&
              !["completed", "not_started"].includes(
                selectedApplicant.interview_status
              ) && (
                <div
                  style={{
                    background: "rgba(80,160,255,0.05)",
                    border: "1px solid rgba(80,160,255,0.15)",
                    borderRadius: 12,
                    padding: "1.1rem 1.25rem",
                    marginBottom: "1.75rem",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(80,160,255,0.7)",
                      fontSize: "0.85rem",
                    }}
                  >
                    ◎
                  </span>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.85rem",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {selectedApplicant.interview_status === "scheduled"
                      ? `Interview scheduled for ${
                          selectedApplicant.interviews?.scheduled_at
                            ? new Date(
                                selectedApplicant.interviews.scheduled_at
                              ).toLocaleString()
                            : "a time chosen by the candidate"
                        }. The AI summary will appear here once it's complete.`
                      : "This candidate is currently completing their AI interview. Check back shortly."}
                  </p>
                </div>
              )}

            {/* ── PROFILE FIELDS ── */}
            {selectedApplicant.profiles?.industries?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Industries
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                >
                  {selectedApplicant.profiles.industries.map((ind: string) => (
                    <span
                      key={ind}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "0.2rem 0.7rem",
                        borderRadius: "980px",
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedApplicant.profiles?.skills?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Skills
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                >
                  {selectedApplicant.profiles.skills.map((s: string) => (
                    <span
                      key={s}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "0.2rem 0.7rem",
                        borderRadius: "980px",
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedApplicant.profiles?.experience_summary && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Experience
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedApplicant.profiles.experience_summary}
                </p>
              </div>
            )}

            {selectedApplicant.profiles?.previous_roles && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Previous roles
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedApplicant.profiles.previous_roles}
                </p>
              </div>
            )}

            {selectedApplicant.profiles?.biggest_achievement && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Proud of
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedApplicant.profiles.biggest_achievement}
                </p>
              </div>
            )}

            {selectedApplicant.profiles?.what_good_at && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  What they excel at
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedApplicant.profiles.what_good_at}
                </p>
              </div>
            )}

            {selectedApplicant.profiles?.cv_url && (
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <a
                  href={selectedApplicant.profiles.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#fff",
                    color: "#000",
                    padding: "0.7rem 1.5rem",
                    borderRadius: "980px",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  View CV
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          height: "52px",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.3rem",
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
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span
            style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}
          >
            {business?.company_name}
          </span>
          <button
            onClick={handleSignOut}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.6)",
              padding: "0.35rem 0.9rem",
              borderRadius: "980px",
              cursor: "pointer",
              fontFamily: "-apple-system, sans-serif",
              fontSize: "0.8rem",
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              {business?.company_name}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
              Manage your roles and applicants.
            </p>
          </div>
          <Link
            href="/business/post-role"
            style={{
              background: "#fff",
              color: "#000",
              padding: "0.7rem 1.5rem",
              borderRadius: "980px",
              fontWeight: 500,
              fontSize: "0.88rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            + Post a role
          </Link>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12,
            padding: "0.25rem",
            width: "fit-content",
            marginBottom: "2rem",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => setActiveTab("listings")}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "-apple-system, sans-serif",
              fontWeight: 500,
              fontSize: "0.85rem",
              background: activeTab === "listings" ? "#fff" : "transparent",
              color:
                activeTab === "listings" ? "#000" : "rgba(255,255,255,0.5)",
              transition: "all 0.2s",
            }}
          >
            Your listings ({jobs.length})
          </button>
          <button
            onClick={() => {
              if (selectedJob) setActiveTab("applicants");
            }}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: 10,
              border: "none",
              cursor: selectedJob ? "pointer" : "not-allowed",
              fontFamily: "-apple-system, sans-serif",
              fontWeight: 500,
              fontSize: "0.85rem",
              background: activeTab === "applicants" ? "#fff" : "transparent",
              color:
                activeTab === "applicants"
                  ? "#000"
                  : selectedJob
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.2)",
              transition: "all 0.2s",
            }}
          >
            {selectedJob ? `Applicants — ${selectedJobTitle}` : "Applicants"}
          </button>
          <button
            onClick={() => {
              setActiveTab("talent" as any);
              loadTalent();
            }}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "-apple-system, sans-serif",
              fontWeight: 500,
              fontSize: "0.85rem",
              background: activeTab === "talent" ? "#fff" : "transparent",
              color: activeTab === "talent" ? "#000" : "rgba(255,255,255,0.5)",
              transition: "all 0.2s",
            }}
          >
            Talent directory
          </button>
        </div>

        {/* ── LISTINGS TAB ── */}
        {activeTab === "listings" && (
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem",
              }}
            >
              Click a role to see its applicants
            </p>
            {jobs.length === 0 ? (
              <div
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: "4rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "1.5rem",
                  }}
                >
                  No roles posted yet.
                </p>
                <Link
                  href="/business/post-role"
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "0.7rem 1.5rem",
                    borderRadius: "980px",
                    fontWeight: 500,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  Post your first role
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {jobs.map((job: any) => (
                  <div
                    key={job.id}
                    onClick={() => loadApplicants(job.id)}
                    style={{
                      background: "#111",
                      padding: "1.5rem",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            marginBottom: "0.3rem",
                          }}
                        >
                          {job.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "rgba(255,255,255,0.35)",
                          }}
                        >
                          {[job.location, job.work_type, job.industry]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            background:
                              job.status === "active"
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(255,255,255,0.04)",
                            color:
                              job.status === "active"
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(255,255,255,0.3)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "0.25rem 0.7rem",
                            borderRadius: "980px",
                            fontSize: "0.75rem",
                          }}
                        >
                          {job.status}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleJobStatus(job.id, job.status);
                          }}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.5)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "980px",
                            cursor: "pointer",
                            fontSize: "0.78rem",
                            fontFamily: "-apple-system, sans-serif",
                          }}
                        >
                          {job.status === "active" ? "Pause" : "Activate"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteJob(job.id);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "rgba(255,80,80,0.5)",
                            cursor: "pointer",
                            fontSize: "0.78rem",
                            fontFamily: "-apple-system, sans-serif",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPLICANTS TAB ── */}
        {activeTab === "applicants" && (
          <div>
            <button
              onClick={() => setActiveTab("listings")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.85rem",
                marginBottom: "1.5rem",
                fontFamily: "-apple-system, sans-serif",
                padding: 0,
              }}
            >
              ← Back to listings
            </button>

            {/* Interview filter pills */}
            {!loadingApplicants && applicants.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                {(["all", "completed", "pending"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setInterviewFilter(f)}
                    style={{
                      padding: "0.35rem 0.9rem",
                      borderRadius: "980px",
                      border:
                        interviewFilter === f
                          ? "1px solid rgba(255,255,255,0.4)"
                          : "1px solid rgba(255,255,255,0.1)",
                      background:
                        interviewFilter === f
                          ? "rgba(255,255,255,0.08)"
                          : "transparent",
                      color:
                        interviewFilter === f
                          ? "#f5f5f7"
                          : "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontFamily: "-apple-system, sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    {f === "all"
                      ? `All (${applicants.length})`
                      : f === "completed"
                      ? `Interview done (${completedCount})`
                      : `Awaiting interview (${
                          applicants.length - completedCount
                        })`}
                  </button>
                ))}
              </div>
            )}

            {loadingApplicants ? (
              <p style={{ color: "rgba(255,255,255,0.4)" }}>
                Loading applicants…
              </p>
            ) : applicants.length === 0 ? (
              <div
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: "4rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>👀</p>
                <p style={{ color: "rgba(255,255,255,0.3)" }}>
                  No one has applied to this role yet.
                </p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: "3rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.3)" }}>
                  No applicants match this filter.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {filteredApplicants.map((app: any) => (
                  <div
                    key={app.id}
                    style={{
                      background: "#111",
                      padding: "1.5rem",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onClick={() => setSelectedApplicant(app)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            marginBottom: "0.3rem",
                          }}
                        >
                          {app.profiles?.full_name}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "rgba(255,255,255,0.35)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {[app.profiles?.location, app.profiles?.job_type]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {/* Show recommendation inline on card if interview is done */}
                        {app.interview_status === "completed" &&
                          app.interviews?.ai_summary?.recommendation && (
                            <RecommendationBadge
                              value={app.interviews.ai_summary.recommendation}
                            />
                          )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.4rem",
                        }}
                      >
                        <InterviewStatusBadge
                          status={app.interview_status ?? "not_started"}
                        />
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "rgba(255,255,255,0.2)",
                          }}
                        >
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TALENT TAB ── */}
        {activeTab === ("talent" as any) && (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="text"
                placeholder="Search by name, skill, or location..."
                value={talentSearch}
                onChange={(e) => setTalentSearch(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "0.75rem 1rem",
                  color: "#f5f5f7",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "-apple-system, sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {loadingTalent ? (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
                Loading talent...
              </p>
            ) : talentWorkers.length === 0 ? (
              <div
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: "4rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.3)" }}>
                  No workers are currently open to work.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "1rem",
                }}
              >
                {talentWorkers
                  .filter((w) => {
                    const q = talentSearch.toLowerCase();
                    if (!q) return true;
                    return (
                      (w.full_name || "").toLowerCase().includes(q) ||
                      (w.location || "").toLowerCase().includes(q) ||
                      (w.skills || []).some((s: string) =>
                        s.toLowerCase().includes(q)
                      )
                    );
                  })
                  .map((w) => (
                    <div
                      key={w.id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        padding: "1.25rem",
                      }}
                    >
                      {/* Name + status */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            margin: 0,
                          }}
                        >
                          {w.full_name || "Anonymous"}
                        </p>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "rgba(80,200,120,0.9)",
                            background: "rgba(80,200,120,0.08)",
                            border: "1px solid rgba(80,200,120,0.2)",
                            padding: "0.15rem 0.55rem",
                            borderRadius: "980px",
                          }}
                        >
                          Open to work
                        </span>
                      </div>
                      {/* Location + job type */}
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(255,255,255,0.35)",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {[w.location, w.job_type].filter(Boolean).join(" · ") ||
                          "Location not specified"}
                      </p>
                      {/* Skills */}
                      {w.skills?.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.3rem",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {w.skills.slice(0, 5).map((s: string) => (
                            <span
                              key={s}
                              style={{
                                fontSize: "0.72rem",
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                padding: "0.15rem 0.55rem",
                                borderRadius: "980px",
                                color: "rgba(255,255,255,0.6)",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                          {w.skills.length > 5 && (
                            <span
                              style={{
                                fontSize: "0.72rem",
                                color: "rgba(255,255,255,0.25)",
                              }}
                            >
                              +{w.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                      {/* Blurb */}
                      {w.what_good_at && (
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "rgba(255,255,255,0.4)",
                            lineHeight: 1.5,
                            margin: 0,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {w.what_good_at}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
