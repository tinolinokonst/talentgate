"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

// ── Types ──────────────────────────────────────────────────
type Application = {
  id: string;
  status: string;
  interview_status: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    skills: string[] | null;
    location: string | null;
  } | null;
  ai_summary?: {
    name?: string;
    recommendation?: string;
    recommendation_reason?: string;
    confidence_level?: number;
    traits?: string[];
    relevant_experience?: string;
    standout_moments?: string[];
    areas_of_concern?: string[];
    communication_style?: string;
  } | null;
};

type JobListing = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  location: string | null;
  country: string | null;
  work_type: string | null;
  industry: string | null;
  salary_min: number | null;
  salary_max: number | null;
  deadline: string | null;
  applications: Application[];
};

type Business = {
  company_name: string;
  verified: boolean;
};

// ── Shared styles ──────────────────────────────────────────
const SS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:#0a0f1e;--navy-mid:#111827;--navy-card:#161d30;--navy-card-2:#1a2236;--navy-border:rgba(99,130,255,0.12);
    --accent:#4f7cff;--accent-soft:rgba(79,124,255,0.12);--teal:#2dd4bf;--teal-soft:rgba(45,212,191,0.1);
    --gold:#f59e0b;--gold-soft:rgba(245,158,11,0.1);--green:#34d399;--green-soft:rgba(52,211,153,0.1);
    --red:#f87171;--red-soft:rgba(248,113,113,0.1);
    --text-primary:#f0f4ff;--text-secondary:rgba(176,196,255,0.7);--text-muted:rgba(176,196,255,0.4);
    --serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,sans-serif;
  }
  a{text-decoration:none;color:inherit;}
  select,input,textarea{font-family:var(--sans);background:rgba(255,255,255,0.04);border:1px solid var(--navy-border);border-radius:8px;padding:0.75rem 1rem;color:var(--text-primary);font-size:0.9rem;outline:none;transition:border-color 0.2s,background 0.2s;}
  select:focus,input:focus,textarea:focus{border-color:rgba(79,124,255,0.5)!important;background:rgba(79,124,255,0.05)!important;}
  input::placeholder,textarea::placeholder{color:var(--text-muted);}
  select option{background:#111827;color:#f0f4ff;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(79,124,255,0.2);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  .card-hover{transition:all 0.2s;cursor:pointer;}
  .card-hover:hover{border-color:rgba(79,124,255,0.25)!important;box-shadow:0 8px 28px rgba(0,0,0,0.3);}
  .tab-btn{background:transparent;border:none;padding:0.5rem 0;font-family:var(--sans);font-size:0.9rem;cursor:pointer;transition:all 0.15s;position:relative;}
  .tab-active{color:#f0f4ff;font-weight:500;}
  .tab-active::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--accent);border-radius:2px;}
  .tab-inactive{color:rgba(176,196,255,0.4);}
  .tab-inactive:hover{color:rgba(176,196,255,0.7);}
  .rec-strong{background:rgba(52,211,153,0.12);color:#6ee7b7;border:1px solid rgba(52,211,153,0.2);}
  .rec-consider{background:rgba(245,158,11,0.1);color:#fcd34d;border:1px solid rgba(245,158,11,0.2);}
  .rec-pass{background:rgba(248,113,113,0.1);color:#fca5a5;border:1px solid rgba(248,113,113,0.2);}
`;

function StatusBadge({ status }: { status?: string | null }) {
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

function ConfidenceBar({ value }: { value?: number }) {
  if (!value && value !== 0) return null;
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? "#34d399" : pct >= 40 ? "#f59e0b" : "#f87171";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <div
        style={{
          flex: 1,
          height: 4,
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
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          minWidth: "2.5rem",
        }}
      >
        {pct}% fit
      </span>
    </div>
  );
}

function RecommendationBadge({ value }: { value?: string }) {
  if (!value) return null;
  const map: Record<string, string> = {
    strong_yes: "rec-strong",
    yes: "rec-strong",
    consider: "rec-consider",
    no: "rec-pass",
    strong_no: "rec-pass",
  };
  const label: Record<string, string> = {
    strong_yes: "Strong yes",
    yes: "Recommend",
    consider: "Consider",
    no: "Pass",
    strong_no: "Pass",
  };
  const cls = map[value] ?? "rec-consider";
  return (
    <span
      className={`tg-badge ${cls}`}
      style={{
        fontSize: "0.7rem",
        fontWeight: 500,
        padding: "0.2rem 0.65rem",
        borderRadius: 100,
      }}
    >
      {label[value] ?? value}
    </span>
  );
}

function sectionLabel(text: string) {
  return (
    <span
      style={{
        fontSize: "0.68rem",
        color: "var(--text-muted)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        display: "block",
        marginBottom: "0.5rem",
        marginTop: "0.9rem",
      }}
    >
      {text}
    </span>
  );
}

function ApplicationCard({ app }: { app: Application }) {
  const [open, setOpen] = useState(false);
  const summary = app.ai_summary;
  const name = app.profiles?.full_name ?? "Candidate";

  return (
    <div
      className="card-hover"
      onClick={() => setOpen(!open)}
      style={{
        background: "var(--navy-card-2)",
        border: "1px solid var(--navy-border)",
        borderRadius: 12,
        padding: "1.1rem 1.25rem",
        marginBottom: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 500, fontSize: "0.92rem" }}>{name}</p>
            {app.profiles?.location && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                {app.profiles.location}
              </p>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            flexWrap: "wrap",
          }}
        >
          {summary && <RecommendationBadge value={summary.recommendation} />}
          <StatusBadge status={app.interview_status} />
          <svg
            style={{
              color: "var(--text-muted)",
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0)",
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {summary?.confidence_level !== undefined && (
        <div style={{ marginTop: "0.75rem" }}>
          <ConfidenceBar value={summary.confidence_level} />
        </div>
      )}

      {open && summary && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: "1.1rem",
            paddingTop: "1.1rem",
            borderTop: "1px solid var(--navy-border)",
          }}
        >
          {summary.recommendation_reason && (
            <div style={{ marginBottom: "0.9rem" }}>
              {sectionLabel("Recommendation")}
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
            </div>
          )}
          {summary.traits && summary.traits.length > 0 && (
            <div style={{ marginBottom: "0.9rem" }}>
              {sectionLabel("Traits")}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {summary.traits.map((t, i) => (
                  <span
                    key={i}
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
            </div>
          )}
          {summary.relevant_experience && (
            <div style={{ marginBottom: "0.9rem" }}>
              {sectionLabel("Relevant experience")}
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
            </div>
          )}
          {summary.standout_moments && summary.standout_moments.length > 0 && (
            <div style={{ marginBottom: "0.9rem" }}>
              {sectionLabel("Standout moments")}
              {summary.standout_moments.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "flex-start",
                    marginBottom: "0.35rem",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
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
            </div>
          )}
          {summary.areas_of_concern && summary.areas_of_concern.length > 0 && (
            <div>
              {sectionLabel("Areas of concern")}
              {summary.areas_of_concern.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "flex-start",
                    marginBottom: "0.35rem",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginTop: 3, flexShrink: 0 }}
                  >
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                    <circle cx="12" cy="12" r="10" />
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
            </div>
          )}
        </div>
      )}

      {open && !summary && (
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--navy-border)",
          }}
        >
          {app.profiles?.skills && app.profiles.skills.length > 0 && (
            <div style={{ marginBottom: "0.75rem" }}>
              {sectionLabel("Skills")}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {app.profiles.skills.map((s, i) => (
                  <span
                    key={i}
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
            </div>
          )}
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            AI summary not yet available for this candidate.
          </p>
        </div>
      )}
    </div>
  );
}

// ── New job listing modal form ─────────────────────────────
function NewJobModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    country: "",
    work_type: "",
    industry: "",
    salary_min: "",
    salary_max: "",
    deadline: "",
  });

  function set(field: string, val: string) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  async function handleCreate() {
    if (!form.title) {
      setError("Role title is required.");
      return;
    }
    setSaving(true);
    setError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: biz } = await supabase
      .from("businesses")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (!biz) {
      setError("Business not found.");
      setSaving(false);
      return;
    }
    const payload: any = {
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      country: form.country || null,
      work_type: form.work_type || null,
      industry: form.industry || null,
      salary_min: form.salary_min ? parseInt(form.salary_min) : null,
      salary_max: form.salary_max ? parseInt(form.salary_max) : null,
      deadline: form.deadline || null,
      business_id: biz.id,
      status: "active",
    };
    const { error: insErr } = await supabase
      .from("job_listings")
      .insert(payload);
    if (insErr) {
      setError(insErr.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    onCreated();
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--navy-border)",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    fontFamily: "var(--sans)",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    display: "block",
    marginBottom: "0.4rem",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#131c2e",
          border: "1px solid var(--navy-border)",
          borderRadius: 18,
          padding: "2rem",
          maxWidth: 560,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.75rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Post a new role
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "1.2rem",
              lineHeight: 1,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          <div>
            <label style={labelStyle}>Role title *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Senior Product Designer"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
              placeholder="Describe the role, responsibilities, and what you're looking for…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <label style={labelStyle}>Location</label>
              <input
                style={inputStyle}
                placeholder="City"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input
                style={inputStyle}
                placeholder="Country"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <label style={labelStyle}>Work type</label>
              <select
                style={{ ...inputStyle }}
                value={form.work_type}
                onChange={(e) => set("work_type", e.target.value)}
              >
                <option value="">Select…</option>
                {[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Freelance",
                  "Internship",
                ].map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Industry</label>
              <select
                style={{ ...inputStyle }}
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
              >
                <option value="">Select…</option>
                {[
                  "Technology",
                  "Healthcare",
                  "Finance",
                  "Education",
                  "Retail",
                  "Construction",
                  "Hospitality",
                  "Marketing",
                  "Legal",
                  "Media",
                  "Manufacturing",
                  "Other",
                ].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <label style={labelStyle}>Min salary (£)</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="30000"
                value={form.salary_min}
                onChange={(e) => set("salary_min", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Max salary (£)</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="50000"
                value={form.salary_max}
                onChange={(e) => set("salary_max", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Application deadline</label>
            <input
              style={inputStyle}
              type="date"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p
            style={{ color: "#fca5a5", fontSize: "0.82rem", marginTop: "1rem" }}
          >
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid var(--navy-border)",
              color: "var(--text-secondary)",
              padding: "0.8rem",
              borderRadius: 8,
              fontFamily: "var(--sans)",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              flex: 2,
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              padding: "0.8rem",
              borderRadius: 8,
              fontFamily: "var(--sans)",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Posting…" : "Post role"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
export default function BusinessDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [listings, setListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showNewJob, setShowNewJob] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "all">("active");

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
      .select("company_name, verified")
      .eq("profile_id", user.id)
      .single();
    setBusiness(biz);
    const { data: bizRow } = await supabase
      .from("businesses")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (!bizRow) {
      setLoading(false);
      return;
    }
    const { data: jobs } = await supabase
      .from("job_listings")
      .select(
        `id, title, status, created_at, location, country, work_type, industry, salary_min, salary_max, deadline, applications (id, status, interview_status, created_at, ai_summary, profiles (full_name, skills, location))`
      )
      .eq("business_id", bizRow.id)
      .order("created_at", { ascending: false });
    setListings((jobs as any) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function toggleJobStatus(jobId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    await supabase
      .from("job_listings")
      .update({ status: newStatus })
      .eq("id", jobId);
    loadData();
  }

  const displayedListings =
    activeTab === "active"
      ? listings.filter((j) => j.status === "active")
      : listings;
  const totalApplicants = listings.reduce(
    (acc, j) => acc + j.applications.length,
    0
  );
  const selectedJob = listings.find((j) => j.id === selectedJobId);

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
      {showNewJob && (
        <NewJobModal
          onClose={() => setShowNewJob(false)}
          onCreated={loadData}
        />
      )}

      {/* NAV */}
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
            onClick={handleSignOut}
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

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                color: "var(--accent)",
                fontSize: "0.78rem",
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
                fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
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
                    background: "rgba(45,212,191,0.1)",
                    color: "var(--teal)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    padding: "0.2rem 0.65rem",
                    borderRadius: 100,
                    border: "1px solid rgba(45,212,191,0.2)",
                    verticalAlign: "middle",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
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
          </div>
          <button
            onClick={() => setShowNewJob(true)}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: 10,
              fontFamily: "var(--sans)",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
            }}
          >
            <svg
              width="16"
              height="16"
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
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              label: "Active roles",
              value: listings.filter((j) => j.status === "active").length,
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
              label: "Total roles posted",
              value: listings.length,
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
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: "0.2rem",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Layout: listing list + applicant panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: selectedJob ? "1fr 1fr" : "1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Left: listings */}
          <div>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                borderBottom: "1px solid var(--navy-border)",
                marginBottom: "1.25rem",
              }}
            >
              <button
                className={`tab-btn ${
                  activeTab === "active" ? "tab-active" : "tab-inactive"
                }`}
                onClick={() => setActiveTab("active")}
              >
                Active roles
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "all" ? "tab-active" : "tab-inactive"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All roles
              </button>
            </div>

            {displayedListings.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "var(--text-muted)",
                }}
              >
                <p>No roles yet.</p>
                <button
                  onClick={() => setShowNewJob(true)}
                  style={{
                    marginTop: "1rem",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid rgba(79,124,255,0.2)",
                    padding: "0.6rem 1.25rem",
                    borderRadius: 8,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                  }}
                >
                  Post your first role
                </button>
              </div>
            ) : (
              displayedListings.map((job) => (
                <div
                  key={job.id}
                  onClick={() =>
                    setSelectedJobId(selectedJobId === job.id ? null : job.id)
                  }
                  className="card-hover"
                  style={{
                    background:
                      selectedJobId === job.id
                        ? "rgba(79,124,255,0.06)"
                        : "var(--navy-card)",
                    border: `1px solid ${
                      selectedJobId === job.id
                        ? "rgba(79,124,255,0.3)"
                        : "var(--navy-border)"
                    }`,
                    borderRadius: 14,
                    padding: "1.25rem 1.5rem",
                    marginBottom: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          marginBottom: "0.3rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                          {job.title}
                        </h3>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 500,
                            padding: "0.15rem 0.55rem",
                            borderRadius: 100,
                            ...(job.status === "active"
                              ? {
                                  background: "rgba(52,211,153,0.1)",
                                  color: "#6ee7b7",
                                  border: "1px solid rgba(52,211,153,0.2)",
                                }
                              : {
                                  background: "rgba(255,255,255,0.05)",
                                  color: "var(--text-muted)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }),
                          }}
                        >
                          {job.status === "active" ? "Active" : "Closed"}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {job.location && `${job.location} · `}
                        {job.work_type && `${job.work_type} · `}
                        {job.applications.length} applicant
                        {job.applications.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleJobStatus(job.id, job.status);
                      }}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--navy-border)",
                        color: "var(--text-muted)",
                        padding: "0.35rem 0.8rem",
                        borderRadius: 8,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontFamily: "var(--sans)",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}
                    >
                      {job.status === "active" ? "Close" : "Reopen"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: applicant panel */}
          {selectedJob && (
            <div
              style={{
                background: "var(--navy-card)",
                border: "1px solid var(--navy-border)",
                borderRadius: 16,
                padding: "1.5rem",
                position: "sticky",
                top: "80px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {selectedJob.title}
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    {selectedJob.applications.length} applicant
                    {selectedJob.applications.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJobId(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {selectedJob.applications.length === 0 ? (
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.88rem",
                    textAlign: "center",
                    padding: "2rem 0",
                  }}
                >
                  No applicants yet for this role.
                </p>
              ) : (
                <div
                  style={{
                    maxHeight: "60vh",
                    overflowY: "auto",
                    paddingRight: "0.25rem",
                  }}
                >
                  {selectedJob.applications.map((app) => (
                    <ApplicationCard key={app.id} app={app} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
