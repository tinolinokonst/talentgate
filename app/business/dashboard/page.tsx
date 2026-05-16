"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

// ── Shared styles ──────────────────────────────────────────
const SS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:#0a0f1e;--navy-mid:#111827;--navy-card:#161d30;--navy-card-2:#1a2236;
    --navy-border:rgba(99,130,255,0.12);--accent:#4f7cff;--accent-soft:rgba(79,124,255,0.12);
    --teal:#2dd4bf;--teal-soft:rgba(45,212,191,0.1);--gold:#f59e0b;--gold-soft:rgba(245,158,11,0.1);
    --green:#34d399;--green-soft:rgba(52,211,153,0.1);--red:#f87171;--red-soft:rgba(248,113,113,0.1);
    --text-primary:#f0f4ff;--text-secondary:rgba(176,196,255,0.7);--text-muted:rgba(176,196,255,0.4);
    --serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,sans-serif;
  }
  a{text-decoration:none;color:inherit;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(79,124,255,0.2);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  .fade{animation:fadeUp 0.45s ease forwards;}
  .row-hover{transition:background 0.15s,border-color 0.15s;}
  .row-hover:hover{background:rgba(79,124,255,0.04)!important;}
  .tab-btn{background:transparent;border:none;padding:0.55rem 0;font-family:var(--sans);font-size:0.9rem;cursor:pointer;transition:color 0.15s;position:relative;}
  .tab-active{color:var(--text-primary);font-weight:500;}
  .tab-active::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--accent);border-radius:2px;}
  .tab-inactive{color:var(--text-muted);}
  .tab-inactive:hover{color:var(--text-secondary);}
  .filter-pill{padding:0.35rem 0.9rem;border-radius:100px;font-family:var(--sans);font-size:0.78rem;cursor:pointer;transition:all 0.15s;}
  .filter-active{background:var(--accent-soft);border:1px solid rgba(79,124,255,0.35);color:#a5b8ff;}
  .filter-inactive{background:transparent;border:1px solid var(--navy-border);color:var(--text-muted);}
  .filter-inactive:hover{border-color:rgba(79,124,255,0.25);color:var(--text-secondary);}
`;

// ── Status badge ───────────────────────────────────────────
function InterviewStatusBadge({ status }: { status?: string | null }) {
  const map: Record<string, { label: string; color: string }> = {
    invited: { label: "Invited", color: "#a5b8ff" },
    scheduled: { label: "Scheduled", color: "#5eead4" },
    in_progress: { label: "In progress", color: "#fcd34d" },
    completed: { label: "Completed", color: "#6ee7b7" },
    not_started: { label: "Not started", color: "rgba(176,196,255,0.3)" },
  };
  const s = map[status ?? "not_started"] ?? map["not_started"];
  return (
    <span
      style={{
        fontSize: "0.7rem",
        color: s.color,
        background: `${s.color}15`,
        border: `1px solid ${s.color}35`,
        padding: "0.18rem 0.6rem",
        borderRadius: 100,
        whiteSpace: "nowrap" as const,
      }}
    >
      {s.label}
    </span>
  );
}

// ── Recommendation badge ───────────────────────────────────
function RecommendationBadge({ value }: { value?: string }) {
  if (!value) return null;
  const map: Record<string, { label: string; color: string; bg: string }> = {
    strong_yes: {
      label: "Strong yes",
      color: "#6ee7b7",
      bg: "rgba(52,211,153,0.1)",
    },
    yes: { label: "Recommend", color: "#6ee7b7", bg: "rgba(52,211,153,0.1)" },
    consider: {
      label: "Consider",
      color: "#fcd34d",
      bg: "rgba(245,158,11,0.1)",
    },
    no: { label: "Pass", color: "#fca5a5", bg: "rgba(248,113,113,0.1)" },
    strong_no: { label: "Pass", color: "#fca5a5", bg: "rgba(248,113,113,0.1)" },
  };
  const s = map[value] ?? map["consider"];
  return (
    <span
      style={{
        fontSize: "0.7rem",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}35`,
        padding: "0.18rem 0.6rem",
        borderRadius: 100,
        whiteSpace: "nowrap" as const,
      }}
    >
      {s.label}
    </span>
  );
}

// ── Confidence bar ─────────────────────────────────────────
function ConfidenceBar({ value }: { value?: number }) {
  if (value === undefined || value === null) return null;
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? "#34d399" : pct >= 40 ? "#f59e0b" : "#f87171";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        marginTop: "0.5rem",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 3,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          minWidth: "2.2rem",
        }}
      >
        {pct}% fit
      </span>
    </div>
  );
}

// ── Section label helper ───────────────────────────────────
function SL({ text }: { text: string }) {
  return (
    <p
      style={{
        fontSize: "0.68rem",
        color: "var(--text-muted)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        marginBottom: "0.45rem",
        marginTop: "1rem",
      }}
    >
      {text}
    </p>
  );
}

// ── AI Summary panel ───────────────────────────────────────
function AISummaryPanel({ summary }: { summary: any }) {
  if (!summary || summary.parse_error) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--navy-border)",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            marginBottom: "0.5rem",
          }}
        >
          AI Interview Summary
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Summary could not be generated for this interview.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(79,124,255,0.04)",
        border: "1px solid var(--navy-border)",
        borderRadius: 14,
        padding: "1.5rem",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--accent)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            fontWeight: 500,
          }}
        >
          AI Interview Summary
        </p>
        {summary.confidence_level !== undefined && (
          <ConfidenceBar value={summary.confidence_level} />
        )}
        {summary.recommendation && (
          <RecommendationBadge value={summary.recommendation} />
        )}
      </div>

      {summary.recommendation_reason && (
        <>
          <SL text="Recommendation" />
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {summary.recommendation_reason}
          </p>
        </>
      )}

      {summary.traits?.length > 0 && (
        <>
          <SL text="Character traits" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {summary.traits.map((t: string) => (
              <span
                key={t}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                  padding: "0.15rem 0.6rem",
                  borderRadius: 100,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </>
      )}

      {summary.relevant_experience && (
        <>
          <SL text="Relevant experience" />
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.83rem",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {summary.relevant_experience}
          </p>
        </>
      )}

      {summary.communication_style && (
        <>
          <SL text="Communication style" />
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.83rem",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {summary.communication_style}
          </p>
        </>
      )}

      {summary.standout_moments?.length > 0 && (
        <>
          <SL text="Standout moments" />
          {summary.standout_moments.map((m: string, i: number) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
                marginBottom: "0.3rem",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#34d399"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginTop: 3, flexShrink: 0 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.83rem",
                  lineHeight: 1.55,
                  fontWeight: 300,
                }}
              >
                {m}
              </p>
            </div>
          ))}
        </>
      )}

      {summary.areas_of_concern?.length > 0 && (
        <>
          <SL text="Areas to probe further" />
          {summary.areas_of_concern.map((c: string, i: number) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
                marginBottom: "0.3rem",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginTop: 3, flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.83rem",
                  lineHeight: 1.55,
                  fontWeight: 300,
                }}
              >
                {c}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────
export default function BusinessDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [jobs, setJobs] = useState<any[]>([]);
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState<number>(0);

  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "pause" | "activate" | "delete" | "signout";
    jobId?: string;
    jobStatus?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "listings" | "applicants" | "talent" | "settings"
  >("listings");

  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [interviewFilter, setInterviewFilter] = useState<
    "all" | "completed" | "pending"
  >("all");

  // ── Data loading ─────────────────────────────────────────
  async function loadJobs() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: biz } = await supabase
      .from("businesses")
      .select("company_name, verified, id")
      .eq("profile_id", user.id)
      .single();
    setBusiness(biz);
    if (!biz) {
      setLoading(false);
      return;
    }

    const { data: jobData } = await supabase
      .from("job_listings")
      .select(
        "id, title, status, created_at, location, country, work_type, industry, salary_min, salary_max, deadline"
      )
      .eq("business_id", biz.id)
      .order("created_at", { ascending: false });

    setJobs(jobData || []);

    if (jobData && jobData.length > 0) {
      const jobIds = jobData.map((j: any) => j.id);
      const { count } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .in("job_id", jobIds);
      setTotalApplicants(count ?? 0);
    }

    setLoading(false);
  }

  async function loadApplicants(jobId: string) {
    setSelectedJob(jobId);
    setActiveTab("applicants");
    setLoadingApplicants(true);
    setInterviewFilter("all");

    const { data } = await supabase
      .from("applications")
      .select(
        `id, status, interview_status, created_at,
        profiles (full_name, skills, location, country, job_type),
        interviews (id, scheduled_at, status, ai_summary)`
      )
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    setApplicants(data ?? []);
    setLoadingApplicants(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  // ── Job actions ──────────────────────────────────────────

  async function confirmAction() {
    if (!confirmDialog) return;
    if (confirmDialog.type === "signout") {
      await supabase.auth.signOut();
      router.push("/");
    } else if (confirmDialog.type === "delete" && confirmDialog.jobId) {
      await supabase
        .from("job_listings")
        .delete()
        .eq("id", confirmDialog.jobId);
      setJobs(jobs.filter((j: any) => j.id !== confirmDialog.jobId));
      if (selectedJob === confirmDialog.jobId) {
        setSelectedJob(null);
        setActiveTab("listings");
      }
    } else if (
      (confirmDialog.type === "pause" || confirmDialog.type === "activate") &&
      confirmDialog.jobId
    ) {
      const newStatus = confirmDialog.type === "pause" ? "paused" : "active";
      await supabase
        .from("job_listings")
        .update({ status: newStatus })
        .eq("id", confirmDialog.jobId);
      setJobs(
        jobs.map((j: any) =>
          j.id === confirmDialog.jobId ? { ...j, status: newStatus } : j
        )
      );
    }
    setConfirmDialog(null);
  }

  // ── Derived state ────────────────────────────────────────
  const selectedJobTitle = jobs.find((j: any) => j.id === selectedJob)?.title;
  const completedCount = applicants.filter(
    (a: any) => a.interview_status === "completed"
  ).length;
  const filteredJobs = jobs.filter((j: any) => {
    const matchesSearch =
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      (j.location ?? "").toLowerCase().includes(jobSearch.toLowerCase()) ||
      (j.industry ?? "").toLowerCase().includes(jobSearch.toLowerCase());
    const matchesStatus =
      jobStatusFilter === "all" || j.status === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredApplicants = applicants.filter((app: any) => {
    if (interviewFilter === "completed")
      return app.interview_status === "completed";
    if (interviewFilter === "pending")
      return app.interview_status !== "completed";
    return true;
  });

  // ── Loading state ────────────────────────────────────────
  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0f1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{SS}</style>
        <p
          style={{
            color: "rgba(176,196,255,0.4)",
            fontFamily: "var(--sans)",
            fontSize: "0.9rem",
          }}
        >
          Loading dashboard...
        </p>
      </div>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        color: "var(--text-primary)",
        fontFamily: "var(--sans)",
      }}
    >
      <style>{SS}</style>

      {/* ── CONFIRM DIALOG ── */}
      {confirmDialog && (
        <div
          onClick={() => setConfirmDialog(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(0,0,0,0.7)",
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
              background: "#131c2e",
              border: "1px solid var(--navy-border)",
              borderRadius: 16,
              padding: "2rem",
              maxWidth: 400,
              width: "100%",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              {confirmDialog.type === "delete" && "Delete this role?"}
              {confirmDialog.type === "pause" && "Pause this role?"}
              {confirmDialog.type === "activate" && "Activate this role?"}
              {confirmDialog.type === "signout" && "Sign out?"}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.88rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
                fontWeight: 300,
              }}
            >
              {confirmDialog.type === "delete" &&
                "This will permanently remove the role and all its applications. This can't be undone."}
              {confirmDialog.type === "pause" &&
                "Workers won't be able to apply to this role while it's paused. You can reactivate it at any time."}
              {confirmDialog.type === "activate" &&
                "This role will go live and workers will be able to apply."}
              {confirmDialog.type === "signout" &&
                "You'll be signed out of your business account."}
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setConfirmDialog(null)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--navy-border)",
                  color: "var(--text-secondary)",
                  padding: "0.5rem 1.25rem",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "var(--sans)",
                  fontSize: "0.85rem",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                style={{
                  background:
                    confirmDialog.type === "delete"
                      ? "rgba(248,113,113,0.15)"
                      : "var(--accent)",
                  border:
                    confirmDialog.type === "delete"
                      ? "1px solid rgba(248,113,113,0.3)"
                      : "none",
                  color: confirmDialog.type === "delete" ? "#f87171" : "#fff",
                  padding: "0.5rem 1.25rem",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "var(--sans)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                {confirmDialog.type === "delete" && "Yes, delete"}
                {confirmDialog.type === "pause" && "Yes, pause"}
                {confirmDialog.type === "activate" && "Yes, activate"}
                {confirmDialog.type === "signout" && "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPLICANT MODAL ── */}
      {selectedApplicant && (
        <div
          onClick={() => setSelectedApplicant(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.82)",
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
              background: "#131c2e",
              border: "1px solid var(--navy-border)",
              borderRadius: 20,
              padding: "2.5rem",
              maxWidth: 660,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedApplicant(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--navy-border)",
                color: "var(--text-muted)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                {(selectedApplicant.profiles?.full_name ?? "?")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selectedApplicant.profiles?.full_name}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  {[
                    selectedApplicant.profiles?.location,
                    selectedApplicant.profiles?.country,
                    selectedApplicant.profiles?.job_type,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                paddingLeft: "0.25rem",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                Applied{" "}
                {new Date(selectedApplicant.created_at).toLocaleDateString()}
              </span>
              <InterviewStatusBadge
                status={selectedApplicant.interview_status}
              />
            </div>

            {/* Skills */}
            {selectedApplicant.profiles?.skills?.length > 0 && (
              <>
                <SL text="Skills" />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.35rem",
                    marginBottom: "1rem",
                  }}
                >
                  {selectedApplicant.profiles.skills.map((s: string) => (
                    <span
                      key={s}
                      style={{
                        background: "var(--accent-soft)",
                        border: "1px solid rgba(79,124,255,0.15)",
                        color: "#a5b8ff",
                        fontSize: "0.75rem",
                        padding: "0.15rem 0.6rem",
                        borderRadius: 100,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* AI summary */}
            {selectedApplicant.interviews?.ai_summary && (
              <AISummaryPanel
                summary={selectedApplicant.interviews.ai_summary}
              />
            )}

            {/* Scheduled interview time */}
            {selectedApplicant.interviews?.scheduled_at && (
              <div
                style={{
                  background: "rgba(45,212,191,0.06)",
                  border: "1px solid rgba(45,212,191,0.15)",
                  borderRadius: 10,
                  padding: "0.9rem 1.1rem",
                  marginTop: "0.75rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--teal)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                    marginBottom: "0.25rem",
                    fontWeight: 500,
                  }}
                >
                  Interview scheduled
                </p>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                  }}
                >
                  {new Date(
                    selectedApplicant.interviews.scheduled_at
                  ).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  at{" "}
                  {new Date(
                    selectedApplicant.interviews.scheduled_at
                  ).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
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
          padding: "0 2.5rem",
          height: "60px",
          background: "rgba(10,15,30,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--navy-border)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Talentgate
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="/business/profile"
            style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}
          >
            {business?.company_name || "Profile"}
          </Link>
          <button
            onClick={() => setConfirmDialog({ type: "signout" })}
            style={{
              background: "transparent",
              border: "1px solid var(--navy-border)",
              color: "var(--text-muted)",
              padding: "0.4rem 1rem",
              borderRadius: 8,
              fontFamily: "var(--sans)",
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "3rem 2rem" }}>
        {/* ── HEADER ── */}
        <div
          className="fade"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                color: "var(--accent)",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.4rem",
              }}
            >
              Business dashboard
            </p>
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.8rem,4vw,2.4rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              {business?.company_name}
              {business?.verified && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    background: "var(--teal-soft)",
                    color: "var(--teal)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    padding: "0.2rem 0.65rem",
                    borderRadius: 100,
                    border: "1px solid rgba(45,212,191,0.2)",
                    verticalAlign: "middle",
                  }}
                >
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified
                </span>
              )}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                marginTop: "0.3rem",
                fontSize: "0.9rem",
                fontWeight: 300,
              }}
            >
              Manage your roles and applicants.
            </p>
          </div>
          <Link
            href="/business/post-role"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--accent)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: 10,
              fontFamily: "var(--sans)",
              fontSize: "0.9rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Post a role
          </Link>
        </div>

        {/* ── STAT CARDS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              label: "Active roles",
              value: jobs.filter((j: any) => j.status === "active").length,
              color: "var(--accent)",
              bg: "var(--accent-soft)",
            },
            {
              label: "Total applicants",
              value: totalApplicants,
              color: "var(--teal)",
              bg: "var(--teal-soft)",
            },
            {
              label: "Roles posted",
              value: jobs.length,
              color: "var(--gold)",
              bg: "var(--gold-soft)",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--navy-card)",
                border: "1px solid var(--navy-border)",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  fontFamily: "var(--serif)",
                  color: s.color,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  marginTop: "0.2rem",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            borderBottom: "1px solid var(--navy-border)",
            marginBottom: "1.5rem",
          }}
        >
          <button
            className={`tab-btn ${
              activeTab === "listings" ? "tab-active" : "tab-inactive"
            }`}
            onClick={() => setActiveTab("listings")}
          >
            Your listings
            <span
              style={{
                marginLeft: "0.5rem",
                background: "var(--accent-soft)",
                color: "var(--accent)",
                fontSize: "0.68rem",
                padding: "0.1rem 0.5rem",
                borderRadius: 100,
              }}
            >
              {jobs.length}
            </span>
          </button>
          <button
            className={`tab-btn ${
              activeTab === "applicants" ? "tab-active" : "tab-inactive"
            }`}
            onClick={() => {
              if (selectedJob) setActiveTab("applicants");
            }}
            style={{
              opacity: selectedJob ? 1 : 0.4,
              cursor: selectedJob ? "pointer" : "not-allowed",
            }}
          >
            {selectedJob ? `Applicants — ${selectedJobTitle}` : "Applicants"}
          </button>
        </div>

        {/* ── LISTINGS TAB ── */}
        {activeTab === "listings" && (
          <div>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="Search roles..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 200,
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 8,
                  padding: "0.55rem 1rem",
                  color: "var(--text-primary)",
                  fontFamily: "var(--sans)",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
              />
              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 8,
                  padding: "0.55rem 1rem",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--sans)",
                  fontSize: "0.88rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            {filteredJobs.length === 0 ? (
              <div
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 16,
                  padding: "4rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}
                >
                  No roles posted yet.
                </p>
                <Link
                  href="/business/post-role"
                  style={{
                    display: "inline-block",
                    background: "var(--accent)",
                    color: "#fff",
                    padding: "0.7rem 1.5rem",
                    borderRadius: 8,
                    fontFamily: "var(--sans)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  Post your first role
                </Link>
              </div>
            ) : (
              <div
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {filteredJobs.map((job: any, i: number) => (
                  <div
                    key={job.id}
                    className="row-hover"
                    onClick={() => loadApplicants(job.id)}
                    style={{
                      padding: "1.35rem 1.5rem",
                      cursor: "pointer",
                      background:
                        selectedJob === job.id
                          ? "rgba(79,124,255,0.05)"
                          : "transparent",
                      borderBottom:
                        i < filteredJobs.length - 1
                          ? "1px solid var(--navy-border)"
                          : "none",
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
                            fontSize: "0.97rem",
                            fontWeight: 600,
                            marginBottom: "0.25rem",
                          }}
                        >
                          {job.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
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
                          gap: "0.6rem",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            padding: "0.18rem 0.6rem",
                            borderRadius: 100,
                            ...(job.status === "active"
                              ? {
                                  background: "rgba(52,211,153,0.1)",
                                  color: "#6ee7b7",
                                  border: "1px solid rgba(52,211,153,0.2)",
                                }
                              : {
                                  background: "rgba(255,255,255,0.04)",
                                  color: "var(--text-muted)",
                                  border: "1px solid var(--navy-border)",
                                }),
                          }}
                        >
                          {job.status === "active"
                            ? "Active"
                            : job.status === "paused"
                            ? "Paused"
                            : job.status}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDialog({
                              type:
                                job.status === "active" ? "pause" : "activate",
                              jobId: job.id,
                              jobStatus: job.status,
                            });
                          }}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--navy-border)",
                            color: "var(--text-secondary)",
                            padding: "0.3rem 0.8rem",
                            borderRadius: 7,
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontFamily: "var(--sans)",
                          }}
                        >
                          {job.status === "active" ? "Pause" : "Activate"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDialog({ type: "delete", jobId: job.id });
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "rgba(248,113,113,0.45)",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontFamily: "var(--sans)",
                            padding: "0.3rem 0.5rem",
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
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.85rem",
                marginBottom: "1.5rem",
                fontFamily: "var(--sans)",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to listings
            </button>

            {/* Filter pills */}
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
                    className={`filter-pill ${
                      interviewFilter === f
                        ? "filter-active"
                        : "filter-inactive"
                    }`}
                    onClick={() => setInterviewFilter(f)}
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
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Loading applicants…
              </p>
            ) : applicants.length === 0 ? (
              <div
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 16,
                  padding: "4rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "var(--text-muted)" }}>
                  No one has applied to this role yet.
                </p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 16,
                  padding: "3rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "var(--text-muted)" }}>
                  No applicants match this filter.
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {filteredApplicants.map((app: any, i: number) => (
                  <div
                    key={app.id}
                    className="row-hover"
                    onClick={() => setSelectedApplicant(app)}
                    style={{
                      padding: "1.35rem 1.5rem",
                      cursor: "pointer",
                      borderBottom:
                        i < filteredApplicants.length - 1
                          ? "1px solid var(--navy-border)"
                          : "none",
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.85rem",
                        }}
                      >
                        {/* Avatar initials */}
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "var(--accent-soft)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "var(--accent)",
                            flexShrink: 0,
                          }}
                        >
                          {(app.profiles?.full_name ?? "?")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              marginBottom: "0.2rem",
                            }}
                          >
                            {app.profiles?.full_name}
                          </h3>
                          <p
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {[app.profiles?.location, app.profiles?.job_type]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          {app.interview_status === "completed" &&
                            app.interviews?.ai_summary?.recommendation && (
                              <div style={{ marginTop: "0.3rem" }}>
                                <RecommendationBadge
                                  value={
                                    app.interviews.ai_summary.recommendation
                                  }
                                />
                              </div>
                            )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.35rem",
                        }}
                      >
                        <InterviewStatusBadge status={app.interview_status} />
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
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
      </div>
    </main>
  );
}
