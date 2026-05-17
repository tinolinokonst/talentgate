"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

// ── Types ──────────────────────────────────────────────────
type Business = { company_name: string; verified: boolean };

type Job = {
  id: string;
  title: string;
  location: string | null;
  country: string | null;
  region: string | null;
  industry: string | null;
  salary_min: number | null;
  salary_max: number | null;
  deadline: string | null;
  qualifications: string[] | null;
  status: string;
  description: string | null;
  work_type: string | null;
  businesses: Business | null;
};

type InterviewStatusMap = Record<string, string>;

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Ireland",
  "Spain",
  "Italy",
  "Remote / Anywhere",
  "Other",
];

// ── Shared styles ──────────────────────────────────────────
const SS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:#0a0f1e;--navy-card:#161d30;--navy-card-2:#1a2236;--navy-border:rgba(99,130,255,0.12);
    --accent:#4f7cff;--accent-soft:rgba(79,124,255,0.12);
    --teal:#2dd4bf;--teal-soft:rgba(45,212,191,0.1);
    --gold:#f59e0b;--gold-soft:rgba(245,158,11,0.1);
    --green:#34d399;--green-soft:rgba(52,211,153,0.1);
    --red:#f87171;--red-soft:rgba(248,113,113,0.1);
    --text-primary:#f0f4ff;--text-secondary:rgba(176,196,255,0.7);--text-muted:rgba(176,196,255,0.4);
    --serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,sans-serif;
  }
  a{text-decoration:none;color:inherit;}
  input::placeholder{color:var(--text-muted);}
  input:focus,select:focus{outline:none;border-color:rgba(79,124,255,0.5)!important;background:rgba(79,124,255,0.05)!important;}
  select option{background:#111827;color:#f0f4ff;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(79,124,255,0.2);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
  .fade{animation:fadeUp 0.5s ease forwards;}
  .modal-inner{animation:slideUp 0.3s ease forwards;}
  .tab-btn{background:transparent;border:none;padding:0.55rem 0;font-family:var(--sans);font-size:0.9rem;cursor:pointer;transition:color 0.15s;position:relative;}
  .tab-active{color:var(--text-primary);font-weight:500;}
  .tab-active::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--accent);border-radius:2px;}
  .tab-inactive{color:var(--text-muted);}
  .tab-inactive:hover{color:var(--text-secondary);}
  .job-card{background:var(--navy-card);border:1px solid var(--navy-border);border-radius:14px;padding:1.35rem 1.5rem;transition:border-color 0.2s,box-shadow 0.2s;cursor:pointer;}
  .job-card:hover{border-color:rgba(79,124,255,0.35);box-shadow:0 8px 28px rgba(0,0,0,0.35);}
  .apply-btn{background:var(--accent);color:#fff;border:none;padding:0.55rem 1.25rem;border-radius:8px;font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.2s;white-space:nowrap;font-family:var(--sans);}
  .apply-btn:hover{background:#3d6aee;box-shadow:0 4px 16px rgba(79,124,255,0.35);}
  .apply-btn-lg{background:var(--accent);color:#fff;border:none;padding:0.75rem 2rem;border-radius:10px;font-size:0.92rem;font-weight:600;cursor:pointer;transition:all 0.2s;white-space:nowrap;font-family:var(--sans);}
  .apply-btn-lg:hover{background:#3d6aee;box-shadow:0 4px 20px rgba(79,124,255,0.4);}
  .cancel-btn{background:transparent;color:rgba(248,113,113,0.7);border:1px solid rgba(248,113,113,0.2);padding:0.45rem 1rem;border-radius:8px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;white-space:nowrap;font-family:var(--sans);}
  .cancel-btn:hover{background:rgba(248,113,113,0.08);border-color:rgba(248,113,113,0.4);color:#fca5a5;}
  .cancel-btn-lg{background:transparent;color:rgba(248,113,113,0.7);border:1px solid rgba(248,113,113,0.2);padding:0.7rem 1.5rem;border-radius:10px;font-size:0.88rem;cursor:pointer;transition:all 0.2s;white-space:nowrap;font-family:var(--sans);}
  .cancel-btn-lg:hover{background:rgba(248,113,113,0.08);border-color:rgba(248,113,113,0.4);color:#fca5a5;}
  .schedule-btn{background:#fff;color:#000;border:none;padding:0.5rem 1.1rem;border-radius:8px;font-weight:500;font-size:0.82rem;cursor:pointer;white-space:nowrap;font-family:var(--sans);transition:all 0.2s;}
  .schedule-btn:hover{background:#e8edff;box-shadow:0 4px 12px rgba(79,124,255,0.2);}
`;

// ── Verified badge ─────────────────────────────────────────
function VerifiedBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        background: "var(--teal-soft)",
        color: "var(--teal)",
        fontSize: "0.68rem",
        fontWeight: 500,
        padding: "0.1rem 0.5rem",
        borderRadius: 100,
        border: "1px solid rgba(45,212,191,0.2)",
      }}
    >
      <svg
        width="8"
        height="8"
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
  );
}

// ── InterviewBadge ─────────────────────────────────────────
function InterviewBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    not_started: {
      label: "Schedule interview",
      color: "#fcd34d",
      bg: "rgba(245,158,11,0.1)",
    },
    invited: {
      label: "Schedule interview",
      color: "#fcd34d",
      bg: "rgba(245,158,11,0.1)",
    },
    scheduled: {
      label: "Interview scheduled",
      color: "#6ee7b7",
      bg: "rgba(52,211,153,0.1)",
    },
    in_progress: {
      label: "Interview in progress",
      color: "#a5b8ff",
      bg: "rgba(79,124,255,0.1)",
    },
    completed: {
      label: "Interview complete",
      color: "#6ee7b7",
      bg: "rgba(52,211,153,0.1)",
    },
    declined: {
      label: "Interview declined",
      color: "rgba(176,196,255,0.3)",
      bg: "rgba(255,255,255,0.04)",
    },
  };
  const s = map[status] ?? map["not_started"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: "0.75rem",
        fontWeight: 500,
        padding: "0.22rem 0.7rem",
        borderRadius: 100,
        border: `1px solid ${s.color}35`,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

// ── StatusBadge ────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    invited: { label: "Invited", color: "#a5b8ff", bg: "rgba(79,124,255,0.1)" },
    scheduled: {
      label: "Scheduled",
      color: "#5eead4",
      bg: "rgba(45,212,191,0.1)",
    },
    in_progress: {
      label: "In progress",
      color: "#fcd34d",
      bg: "rgba(245,158,11,0.1)",
    },
    completed: {
      label: "Completed",
      color: "#6ee7b7",
      bg: "rgba(52,211,153,0.1)",
    },
    not_started: {
      label: "Not started",
      color: "rgba(176,196,255,0.35)",
      bg: "rgba(255,255,255,0.04)",
    },
  };
  const s = map[status ?? "not_started"] ?? map["not_started"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: "0.7rem",
        fontWeight: 500,
        padding: "0.2rem 0.65rem",
        borderRadius: 100,
        border: `1px solid ${s.color}35`,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

// ── Meta pill ──────────────────────────────────────────────
function MetaPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--navy-border)",
        borderRadius: 8,
        padding: "0.4rem 0.75rem",
        fontSize: "0.82rem",
        color: "var(--text-secondary)",
      }}
    >
      {icon}
      {text}
    </div>
  );
}

// ── Role Detail Modal ──────────────────────────────────────
function RoleModal({
  job,
  applied,
  appId,
  interviewStatus,
  onClose,
  onApply,
  onCancel,
  onSchedule,
  locked,
}: {
  job: Job;
  applied: boolean;
  appId?: string;
  interviewStatus?: string;
  onClose: () => void;
  onApply: () => void;
  onCancel: () => void;
  onSchedule: () => void;
  locked: boolean;
}) {
  const needsScheduling =
    interviewStatus === "not_started" || interviewStatus === "invited";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        className="modal-inner"
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
          onClick={onClose}
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

        {/* Company + verified */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              fontWeight: 300,
            }}
          >
            {job.businesses?.company_name}
          </span>
          {job.businesses?.verified && <VerifiedBadge />}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.6rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
            lineHeight: 1.2,
          }}
        >
          {job.title}
        </h2>

        {/* Meta pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1.75rem",
          }}
        >
          {job.location && (
            <MetaPill
              icon={
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
              text={job.location}
            />
          )}
          {job.work_type && (
            <MetaPill
              icon={
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              }
              text={job.work_type}
            />
          )}
          {job.industry && (
            <MetaPill
              icon={
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              }
              text={job.industry}
            />
          )}
          {job.salary_min && job.salary_max && (
            <MetaPill
              icon={
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
              text={`£${job.salary_min.toLocaleString()} – £${job.salary_max.toLocaleString()}`}
            />
          )}
          {job.deadline && (
            <MetaPill
              icon={
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              text={`Deadline: ${job.deadline}`}
            />
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "var(--navy-border)",
            marginBottom: "1.75rem",
          }}
        />

        {/* Description */}
        {job.description && (
          <div style={{ marginBottom: "1.75rem" }}>
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
              }}
            >
              About the role
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              {job.description}
            </p>
          </div>
        )}

        {/* Qualifications */}
        {(job.qualifications ?? []).length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
              }}
            >
              Requirements
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {(job.qualifications ?? []).map((q, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginTop: 2, flexShrink: 0 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      fontWeight: 300,
                    }}
                  >
                    {q}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "var(--navy-border)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Interview status (if applied) */}
        {applied && interviewStatus && (
          <div style={{ marginBottom: "1.25rem" }}>
            <InterviewBadge status={interviewStatus} />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {!applied && (
            <button className="apply-btn-lg" onClick={onApply}>
              Apply for this role
            </button>
          )}
          {applied && needsScheduling && appId && (
            <button className="apply-btn-lg" onClick={onSchedule}>
              Schedule interview →
            </button>
          )}
          {applied && !locked && (
            <button className="cancel-btn-lg" onClick={onCancel}>
              Cancel application
            </button>
          )}
          {applied && locked && (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                alignSelf: "center",
              }}
            >
              Your interview is underway — good luck!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
// ── Open to Work Banner ────────────────────────────────────
function OpenToWorkBanner({ supabase }: { supabase: any }) {
  const [openToWork, setOpenToWork] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("open_to_work")
        .eq("id", user.id)
        .single();
      setOpenToWork(data?.open_to_work ?? false);
    }
    load();
  }, []);

  if (openToWork === null || openToWork === true || dismissed) return null;

  return (
    <div
      style={{
        background: "rgba(79,124,255,0.06)",
        border: "1px solid rgba(79,124,255,0.2)",
        borderRadius: 14,
        padding: "1.1rem 1.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p
          style={{
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
            fontWeight: 300,
          }}
        >
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
            You're not visible to businesses.
          </span>{" "}
          Turn on "Open to work" in Settings so verified employers can find you.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontFamily: "var(--sans)",
          padding: 0,
          whiteSpace: "nowrap",
        }}
      >
        Dismiss
      </button>
    </div>
  );
}

// ── Open to Work Toggle ────────────────────────────────────
function OpenToWorkToggle({ supabase }: { supabase: any }) {
  const [openToWork, setOpenToWork] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select("open_to_work")
        .eq("id", user.id)
        .single();
      setOpenToWork(data?.open_to_work ?? false);
    }
    load();
  }, []);

  async function toggle() {
    if (!userId) return;
    setSaving(true);
    const newVal = !openToWork;
    await supabase
      .from("profiles")
      .update({ open_to_work: newVal })
      .eq("id", userId);
    setOpenToWork(newVal);
    setSaving(false);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          onClick={toggle}
          disabled={saving}
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: openToWork ? "var(--teal)" : "rgba(255,255,255,0.1)",
            position: "relative",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#fff",
              position: "absolute",
              top: 3,
              transition: "left 0.2s",
              left: openToWork ? 23 : 3,
            }}
          />
        </button>
        <span
          style={{
            fontSize: "0.88rem",
            color: openToWork ? "var(--teal)" : "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          {saving
            ? "Saving…"
            : openToWork
            ? "On — businesses can find you"
            : "Off — you're hidden from businesses"}
        </span>
      </div>
    </div>
  );
}
//–– Main components –––––––––––––––––––––
export default function WorkerDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const [confirmApply, setConfirmApply] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applicationIds, setApplicationIds] = useState<Record<string, string>>(
    {}
  );
  const [interviewStatuses, setInterviewStatuses] =
    useState<InterviewStatusMap>({});

  const [profile, setProfile] = useState<{
    full_name: string;
    skills: string[];
    location: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "applied" | "settings">(
    "browse"
  );

  // ── Role detail modal ────────────────────────────────────
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // ── Data loading ─────────────────────────────────────────
  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: prof } = await supabase
      .from("profiles")
      .select("full_name, skills, location")
      .eq("id", user.id)
      .single();
    setProfile(prof);

    const { data: listings } = await supabase
      .from("job_listings")
      .select(
        `id, title, location, country, region, industry, salary_min, salary_max, deadline, qualifications, status, description, work_type, businesses (company_name, verified)`
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    const typedListings = (listings || []).map((item: any) => ({
      ...item,
      businesses: Array.isArray(item.businesses)
        ? item.businesses[0] ?? null
        : item.businesses ?? null,
    })) as Job[];
    setJobs(typedListings);
    setFilteredJobs(typedListings);

    const { data: apps } = await supabase
      .from("applications")
      .select("id, job_id, interview_status")
      .eq("worker_id", user.id);
    if (apps) {
      setAppliedJobs(apps.map((a: any) => a.job_id));
      const idMap: Record<string, string> = {};
      const statusMap: InterviewStatusMap = {};
      apps.forEach((a: any) => {
        idMap[a.job_id] = a.id;
        statusMap[a.id] = a.interview_status ?? "not_started";
      });
      setApplicationIds(idMap);
      setInterviewStatuses(statusMap);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel("job_listings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_listings" },
        () => loadData()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let filtered = jobs;
    if (search) {
      const keywords = search.toLowerCase().split(" ").filter(Boolean);
      filtered = filtered.filter((j) => {
        const haystack = [
          j.title,
          j.location,
          j.businesses?.company_name,
          j.description,
          j.industry,
          j.work_type,
          ...(j.qualifications ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return keywords.some((k) => haystack.includes(k));
      });
    }
    if (industryFilter)
      filtered = filtered.filter((j) => j.industry === industryFilter);
    if (countryFilter)
      filtered = filtered.filter((j) => j.country === countryFilter);
    setFilteredJobs(filtered);
  }, [search, industryFilter, countryFilter, jobs]);

  // ── Apply / cancel ───────────────────────────────────────
  async function confirmApplyAction(jobId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: newApp, error: appError } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        worker_id: user.id,
        status: "pending",
        interview_status: "invited",
      })
      .select("id")
      .single();
    if (appError || !newApp) return;
    await supabase.from("interviews").insert({
      application_id: newApp.id,
      worker_id: user.id,
      job_id: jobId,
      status: "scheduled",
    });
    setAppliedJobs((prev) => [...prev, jobId]);
    setApplicationIds((prev) => ({ ...prev, [jobId]: newApp.id }));
    setInterviewStatuses((prev) => ({ ...prev, [newApp.id]: "invited" }));
    setConfirmApply(null);
    setSelectedJob(null);
    router.push(`/worker/schedule-interview/${newApp.id}`);
  }

  async function confirmCancelAction(jobId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("applications")
      .delete()
      .eq("job_id", jobId)
      .eq("worker_id", user.id);
    const appId = applicationIds[jobId];
    setAppliedJobs((prev) => prev.filter((id) => id !== jobId));
    setApplicationIds((prev) => {
      const n = { ...prev };
      delete n[jobId];
      return n;
    });
    setInterviewStatuses((prev) => {
      const n = { ...prev };
      if (appId) delete n[appId];
      return n;
    });
    setConfirmCancel(null);
    setSelectedJob(null);
  }

  function interviewLocked(jobId: string): boolean {
    const appId = applicationIds[jobId];
    if (!appId) return false;
    const s = interviewStatuses[appId];
    return s === "in_progress" || s === "completed";
  }

  const industries = [
    ...new Set(jobs.map((j) => j.industry).filter((x): x is string => !!x)),
  ];
  const appliedJobsList = jobs.filter((j) => appliedJobs.includes(j.id));

  const inputSt: React.CSSProperties = {
    background: "var(--navy-card)",
    border: "1px solid var(--navy-border)",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    color: "var(--text-primary)",
    fontSize: "0.88rem",
    fontFamily: "var(--sans)",
    width: "100%",
  };

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
          Loading your dashboard...
        </p>
      </div>
    );

  {
    /* ── CONFIRM APPLY ── */
  }
  {
    confirmApply && (
      <div
        onClick={() => setConfirmApply(null)}
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
            Apply for this role?
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
            You'll be taken to schedule your AI first-round interview with
            Claude. Once scheduled, you won't be able to undo this.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => setConfirmApply(null)}
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
              onClick={() => confirmApplyAction(confirmApply)}
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "var(--sans)",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              Yes, apply
            </button>
          </div>
        </div>
      </div>
    );
  }

  {
    /* ── CONFIRM CANCEL ── */
  }
  {
    confirmCancel && (
      <div
        onClick={() => setConfirmCancel(null)}
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
            Cancel your application?
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
            This will remove your application for this role. You can reapply
            later if the role is still open.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => setConfirmCancel(null)}
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
              Keep application
            </button>
            <button
              onClick={() => confirmCancelAction(confirmCancel)}
              style={{
                background: "rgba(248,113,113,0.15)",
                color: "#f87171",
                border: "1px solid rgba(248,113,113,0.3)",
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "var(--sans)",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              Yes, cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  {
    /* ── CONFIRM SIGN OUT ── */
  }
  {
    confirmSignOut && (
      <div
        onClick={() => setConfirmSignOut(false)}
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
            Sign out?
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
            You'll be signed out of your worker account on this device.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => setConfirmSignOut(false)}
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
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "var(--sans)",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Derive modal state ────────────────────────────────────
  const modalAppId = selectedJob ? applicationIds[selectedJob.id] : undefined;
  const modalIvStatus = modalAppId ? interviewStatuses[modalAppId] : undefined;
  const modalApplied = selectedJob
    ? appliedJobs.includes(selectedJob.id)
    : false;
  const modalLocked = selectedJob ? interviewLocked(selectedJob.id) : false;

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

      {/* ── ROLE DETAIL MODAL ── */}
      {selectedJob && (
        <RoleModal
          job={selectedJob}
          applied={modalApplied}
          appId={modalAppId}
          interviewStatus={modalIvStatus}
          onClose={() => setSelectedJob(null)}
          onApply={() => {
            const jobId = selectedJob?.id;
            setSelectedJob(null);
            setTimeout(() => setConfirmApply(jobId ?? null), 50);
          }}
          onCancel={() => setConfirmCancel(selectedJob.id)}
          onSchedule={() => {
            setSelectedJob(null);
            router.push(`/worker/schedule-interview/${modalAppId}`);
          }}
          locked={modalLocked}
        />
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
            href="/worker/profile"
            style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}
          >
            {profile?.full_name || "Profile"}
          </Link>
          <button
            onClick={() => setConfirmSignOut(true)}
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
        {/* Header */}
        <div className="fade" style={{ marginBottom: "2rem" }}>
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
            Worker dashboard
          </p>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(1.8rem,4vw,2.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Good to see you
            {profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "0.35rem",
              fontSize: "0.95rem",
              fontWeight: 300,
            }}
          >
            {filteredJobs.length} verified role
            {filteredJobs.length !== 1 ? "s" : ""} open right now.
          </p>
        </div>

        {/* Skills snapshot */}
        {profile?.skills && profile.skills.length > 0 && (
          <div
            style={{
              background: "var(--navy-card)",
              border: "1px solid var(--navy-border)",
              borderRadius: 14,
              padding: "1.25rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "0.6rem",
                }}
              >
                Your skills
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {profile.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "0.2rem 0.7rem",
                      borderRadius: 100,
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {profile.location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {profile.location}
              </div>
            )}
          </div>
        )}
        {/* ── OPEN TO WORK BANNER ── */}
        <OpenToWorkBanner supabase={supabase} />
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            borderBottom: "1px solid var(--navy-border)",
            marginBottom: "1.75rem",
          }}
        >
          <button
            className={`tab-btn ${
              activeTab === "browse" ? "tab-active" : "tab-inactive"
            }`}
            onClick={() => setActiveTab("browse")}
          >
            Browse roles
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
              {filteredJobs.length}
            </span>
          </button>
          <button
            className={`tab-btn ${
              activeTab === "applied" ? "tab-active" : "tab-inactive"
            }`}
            onClick={() => setActiveTab("applied")}
          >
            My applications
            {appliedJobs.length > 0 && (
              <span
                style={{
                  marginLeft: "0.5rem",
                  background: "var(--teal-soft)",
                  color: "var(--teal)",
                  fontSize: "0.68rem",
                  padding: "0.1rem 0.5rem",
                  borderRadius: 100,
                }}
              >
                {appliedJobs.length}
              </span>
            )}
          </button>
          <button
            className={`tab-btn ${
              activeTab === "settings" ? "tab-active" : "tab-inactive"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        {/* ── BROWSE TAB ── */}
        {activeTab === "browse" && (
          <>
            {/* Filters */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "0.75rem",
                marginBottom: "1.5rem",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search roles, companies, locations…"
                  style={{ ...inputSt, paddingLeft: "2.5rem" }}
                />
              </div>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                style={{
                  ...inputSt,
                  width: "auto",
                  minWidth: 145,
                  color: industryFilter
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <option value="">All industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                style={{
                  ...inputSt,
                  width: "auto",
                  minWidth: 135,
                  color: countryFilter
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <option value="">All countries</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
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
                  style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}
                >
                  No roles match your search.
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {filteredJobs.map((job: Job) => {
                  const applied = appliedJobs.includes(job.id);
                  const appId = applicationIds[job.id];
                  const status = appId ? interviewStatuses[appId] : undefined;

                  return (
                    <div
                      key={job.id}
                      className="job-card"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Left */}
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.3rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.82rem",
                                color: "var(--text-secondary)",
                                fontWeight: 300,
                              }}
                            >
                              {job.businesses?.company_name}
                            </span>
                            {job.businesses?.verified && <VerifiedBadge />}
                          </div>
                          <h3
                            style={{
                              fontSize: "1rem",
                              fontWeight: 600,
                              letterSpacing: "-0.01em",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {job.title}
                          </h3>
                          {job.description && (
                            <p
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.85rem",
                                lineHeight: 1.5,
                                marginBottom: "0.65rem",
                                maxWidth: 520,
                                fontWeight: 300,
                              }}
                            >
                              {job.description.length > 120
                                ? job.description.slice(0, 120) + "…"
                                : job.description}
                            </p>
                          )}
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.4rem",
                              fontSize: "0.78rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {job.location && <span>{job.location}</span>}
                            {job.work_type && <span>· {job.work_type}</span>}
                            {job.salary_min && job.salary_max && (
                              <span>
                                · £{job.salary_min.toLocaleString()}–£
                                {job.salary_max.toLocaleString()}
                              </span>
                            )}
                            {job.deadline && (
                              <span>· Deadline: {job.deadline}</span>
                            )}
                          </div>
                        </div>
                        {/* Right */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "0.5rem",
                            flexShrink: 0,
                          }}
                        >
                          {applied && <StatusBadge status={status} />}
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--accent)",
                              fontWeight: 500,
                            }}
                          >
                            View role →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── APPLIED TAB ── */}
        {activeTab === "applied" && (
          <div>
            {appliedJobsList.length === 0 ? (
              <div
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 16,
                  padding: "4rem",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                  You haven't applied to any roles yet.
                </p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="apply-btn"
                  style={{ fontSize: "0.9rem", padding: "0.65rem 1.5rem" }}
                >
                  Browse roles
                </button>
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
                {appliedJobsList.map((job: Job, i: number) => {
                  const appId = applicationIds[job.id];
                  const ivStatus = appId
                    ? interviewStatuses[appId] ?? "not_started"
                    : "not_started";
                  const locked = interviewLocked(job.id);
                  const needsScheduling =
                    ivStatus === "not_started" || ivStatus === "invited";

                  return (
                    <div
                      key={job.id}
                      style={{
                        padding: "1.35rem 1.5rem",
                        borderBottom:
                          i < appliedJobsList.length - 1
                            ? "1px solid var(--navy-border)"
                            : "none",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onClick={() => setSelectedJob(job)}
                      className="row-hover"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.3rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.82rem",
                                color: "var(--text-secondary)",
                                fontWeight: 300,
                              }}
                            >
                              {job.businesses?.company_name}
                            </span>
                            {job.businesses?.verified && <VerifiedBadge />}
                          </div>
                          <h3
                            style={{
                              fontSize: "1rem",
                              fontWeight: 600,
                              letterSpacing: "-0.01em",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {job.title}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.4rem",
                              fontSize: "0.78rem",
                              color: "var(--text-muted)",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {job.location && <span>{job.location}</span>}
                            {job.work_type && <span>· {job.work_type}</span>}
                          </div>
                          <InterviewBadge status={ivStatus} />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            alignItems: "flex-end",
                          }}
                        >
                          {needsScheduling && appId && (
                            <button
                              className="schedule-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/worker/schedule-interview/${appId}`
                                );
                              }}
                            >
                              Schedule interview →
                            </button>
                          )}
                          {!locked && (
                            <button
                              className="cancel-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmCancel(job.id);
                              }}
                            >
                              Cancel application
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.4rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "2rem",
              }}
            >
              Settings
            </h2>

            {/* Account */}
            <div
              style={{
                background: "var(--navy-card)",
                border: "1px solid var(--navy-border)",
                borderRadius: 16,
                padding: "1.75rem",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "1rem",
                }}
              >
                Account
              </p>
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
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {profile?.full_name}
                  </p>
                  <p
                    style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}
                  >
                    Worker account · Free
                  </p>
                </div>
                <Link
                  href="/worker/profile"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--navy-border)",
                    color: "var(--text-secondary)",
                    padding: "0.45rem 1rem",
                    borderRadius: 8,
                    fontSize: "0.82rem",
                  }}
                >
                  Edit profile →
                </Link>
              </div>
            </div>

            {/* Open to work */}
            <div
              style={{
                background: "var(--navy-card)",
                border: "1px solid var(--navy-border)",
                borderRadius: 16,
                padding: "1.75rem",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.75rem",
                }}
              >
                Open to work
              </p>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.88rem",
                  lineHeight: 1.6,
                  fontWeight: 300,
                  marginBottom: "1rem",
                }}
              >
                When this is on, verified businesses can find your profile in
                the talent directory and reach out to you directly. It's off by
                default — you control when you're visible.
              </p>
              <OpenToWorkToggle supabase={supabase} />
            </div>

            {/* Sign out */}
            <div
              style={{
                background: "rgba(248,113,113,0.04)",
                border: "1px solid rgba(248,113,113,0.15)",
                borderRadius: 16,
                padding: "1.75rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "#f87171",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "1rem",
                }}
              >
                Sign out
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                  }}
                >
                  Sign out of your worker account on this device.
                </p>
                <button
                  onClick={() => setConfirmSignOut(true)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(248,113,113,0.3)",
                    color: "#f87171",
                    padding: "0.5rem 1.25rem",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                    fontSize: "0.85rem",
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
