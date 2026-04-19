"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type Business = {
  company_name: string;
  verified: boolean;
};

type Job = {
  id: string;
  title: string;
  location: string;
  country: string;
  region: string;
  industry: string;
  salary_min: number;
  salary_max: number;
  deadline: string;
  qualifications: string[];
  status: string;
  description: string;
  work_type: string;
  businesses: Business | null;
};

type InterviewStatusMap = Record<string, string>;

// ── Progress Pipeline ──────────────────────────────────────────
const PIPELINE_STEPS = ["Applied", "Interview", "AI Review", "Decision"];

function statusToStep(status: string): number {
  if (status === "not_started" || status === "invited") return 1;
  if (status === "scheduled") return 1;
  if (status === "in_progress") return 2;
  if (status === "completed") return 3;
  return 0;
}

function stepSubLabel(i: number, status: string): string {
  if (status === "declined") return i === 0 ? "Submitted" : "";
  if (i === 0) return "Submitted";
  if (i === 1) {
    if (status === "invited" || status === "not_started")
      return "Action needed";
    if (status === "scheduled") return "Scheduled";
    if (status === "in_progress") return "Underway";
    return "Done";
  }
  if (i === 2) return status === "completed" ? "Ready" : "";
  if (i === 3) return status === "completed" ? "Pending" : "";
  return "";
}

function ProgressPipeline({ status }: { status: string }) {
  const activeStep = statusToStep(status);
  const declined = status === "declined";
  const stepComplete = (i: number) => !declined && i < activeStep;
  const stepActive = (i: number) => !declined && i === activeStep;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        margin: "0.9rem 0 0.5rem",
      }}
    >
      {PIPELINE_STEPS.map((label, i) => {
        const complete = stepComplete(i);
        const active = stepActive(i);
        const isLast = i === PIPELINE_STEPS.length - 1;
        const dotColor = declined
          ? i === 0
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.08)"
          : complete
          ? "rgba(80,200,120,0.9)"
          : active
          ? "#fff"
          : "rgba(255,255,255,0.12)";
        const lineColor = complete
          ? "rgba(80,200,120,0.5)"
          : "rgba(255,255,255,0.08)";
        const labelColor = declined
          ? i === 0
            ? "rgba(255,255,255,0.3)"
            : "rgba(255,255,255,0.12)"
          : complete
          ? "rgba(80,200,120,0.8)"
          : active
          ? "rgba(255,255,255,0.9)"
          : "rgba(255,255,255,0.2)";
        const subColor =
          active && !declined
            ? status === "invited" || status === "not_started"
              ? "rgba(255,200,60,0.8)"
              : "rgba(80,200,120,0.7)"
            : "rgba(255,255,255,0.2)";

        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "flex-start",
              flex: isLast ? 0 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 56,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: dotColor,
                  marginBottom: 4,
                  boxShadow:
                    active && !declined ? `0 0 6px ${dotColor}` : "none",
                  transition: "background 0.2s",
                }}
              />
              <span
                style={{
                  fontSize: "0.65rem",
                  color: labelColor,
                  fontWeight: active ? 600 : 400,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "0.6rem",
                  color: subColor,
                  textAlign: "center",
                  marginTop: 1,
                  lineHeight: 1.2,
                  minHeight: 10,
                }}
              >
                {stepSubLabel(i, status)}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: lineColor,
                  marginTop: 3.5,
                  transition: "background 0.2s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Interview Badge ────────────────────────────────────────────
function InterviewBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    not_started: {
      label: "Schedule interview",
      color: "rgba(255,200,60,0.9)",
      bg: "rgba(255,200,60,0.08)",
    },
    invited: {
      label: "Schedule interview",
      color: "rgba(255,200,60,0.9)",
      bg: "rgba(255,200,60,0.08)",
    },
    scheduled: {
      label: "Interview scheduled",
      color: "rgba(80,200,120,0.9)",
      bg: "rgba(80,200,120,0.08)",
    },
    in_progress: {
      label: "Interview in progress",
      color: "rgba(80,160,255,0.9)",
      bg: "rgba(80,160,255,0.08)",
    },
    completed: {
      label: "Interview complete",
      color: "rgba(80,200,120,0.9)",
      bg: "rgba(80,200,120,0.08)",
    },
    declined: {
      label: "Interview declined",
      color: "rgba(255,255,255,0.3)",
      bg: "rgba(255,255,255,0.04)",
    },
  };
  const s = map[status] ?? map["not_started"];
  return (
    <span
      style={{
        background: s.bg,
        border: `1px solid ${s.color}`,
        color: s.color,
        fontSize: "0.72rem",
        fontWeight: 500,
        padding: "0.2rem 0.65rem",
        borderRadius: "980px",
        letterSpacing: "0.02em",
      }}
    >
      {s.label}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function WorkerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
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
    open_to_work?: boolean;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "applied">("browse");
  const supabase = createClient();

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
      .select("full_name, skills, location, open_to_work")
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
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.location?.toLowerCase().includes(search.toLowerCase()) ||
          (j.businesses?.company_name ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }
    if (industryFilter)
      filtered = filtered.filter((j) => j.industry === industryFilter);
    if (countryFilter)
      filtered = filtered.filter((j) => j.country === countryFilter);
    setFilteredJobs(filtered);
  }, [search, industryFilter, countryFilter, jobs]);

  async function handleApply(jobId: string) {
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
    if (appError || !newApp) {
      console.error("Failed to create application:", appError);
      return;
    }
    await supabase
      .from("interviews")
      .insert({
        application_id: newApp.id,
        worker_id: user.id,
        job_id: jobId,
        status: "scheduled",
      });
    setAppliedJobs((prev) => [...prev, jobId]);
    setApplicationIds((prev) => ({ ...prev, [jobId]: newApp.id }));
    setInterviewStatuses((prev) => ({ ...prev, [newApp.id]: "invited" }));
    router.push(`/worker/schedule-interview/${newApp.id}`);
  }

  async function handleCancelApplication(jobId: string) {
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
      const next = { ...prev };
      delete next[jobId];
      return next;
    });
    setInterviewStatuses((prev) => {
      const next = { ...prev };
      if (appId) delete next[appId];
      return next;
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function interviewLocked(jobId: string): boolean {
    const appId = applicationIds[jobId];
    if (!appId) return false;
    const s = interviewStatuses[appId];
    return s === "in_progress" || s === "completed";
  }

  const industries = [...new Set(jobs.map((j) => j.industry).filter(Boolean))];
  const availableCountries = [
    ...new Set(jobs.map((j) => j.country).filter(Boolean)),
  ];
  const appliedJobsList = jobs.filter((j) => appliedJobs.includes(j.id));

  const metaPill: React.CSSProperties = {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "0.2rem 0.6rem",
    borderRadius: "980px",
    whiteSpace: "nowrap",
  };

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
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>
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

      {/* NAV */}
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
            {profile?.full_name}
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
        <div style={{ marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: "0.5rem",
            }}
          >
            Good to see you, {profile?.full_name?.split(" ")[0]}.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
            {filteredJobs.length} verified roles open right now.
          </p>
        </div>

        {/* Skills snapshot */}
        {profile?.skills && profile.skills.length > 0 && (
          <div
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "1.5rem",
              marginBottom: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                }}
              >
                Your skills
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {profile.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: "0.2rem 0.7rem",
                      borderRadius: "980px",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "0.4rem",
              }}
            >
              {profile.location && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.85rem",
                    margin: 0,
                  }}
                >
                  📍 {profile.location}
                </p>
              )}
              {profile.open_to_work && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(80,200,120,0.9)",
                    background: "rgba(80,200,120,0.08)",
                    border: "1px solid rgba(80,200,120,0.2)",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "980px",
                    fontWeight: 500,
                  }}
                >
                  Open to work
                </span>
              )}
            </div>
          </div>
        )}

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
          {(["browse", "applied"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.5rem 1.2rem",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontFamily: "-apple-system, sans-serif",
                fontWeight: 500,
                fontSize: "0.85rem",
                background: activeTab === tab ? "#fff" : "transparent",
                color: activeTab === tab ? "#000" : "rgba(255,255,255,0.5)",
                transition: "all 0.2s",
              }}
            >
              {tab === "browse"
                ? `Browse roles (${filteredJobs.length})`
                : `Applied (${appliedJobs.length})`}
            </button>
          ))}
        </div>

        {/* ── BROWSE TAB ── */}
        {activeTab === "browse" && (
          <>
            {/* Filters */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="Search roles, companies, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 200,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "0.75rem 1rem",
                  color: "#f5f5f7",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "-apple-system, sans-serif",
                }}
              />
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "0.75rem 1rem",
                  color: countryFilter ? "#f5f5f7" : "rgba(255,255,255,0.4)",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "-apple-system, sans-serif",
                  cursor: "pointer",
                }}
              >
                <option value="">All countries</option>
                {availableCountries.map((c) => (
                  <option key={c} value={c} style={{ background: "#111" }}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "0.75rem 1rem",
                  color: industryFilter ? "#f5f5f7" : "rgba(255,255,255,0.4)",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "-apple-system, sans-serif",
                  cursor: "pointer",
                }}
              >
                <option value="">All industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind} style={{ background: "#111" }}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Empty state: no filter results ── */}
            {filteredJobs.length === 0 ? (
              <div
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  padding: "4rem 2rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  No roles match your search
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.88rem",
                    marginBottom: "1.5rem",
                    lineHeight: 1.6,
                  }}
                >
                  Try adjusting your filters or clearing the search to see all
                  available roles.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setIndustryFilter("");
                    setCountryFilter("");
                  }}
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "980px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "-apple-system, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.88rem",
                  }}
                >
                  Clear filters
                </button>
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
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: "#111",
                      padding: "1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Left: avatar + content */}
                    <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                      {/* Company avatar */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.5)",
                          flexShrink: 0,
                        }}
                      >
                        {(job.businesses?.company_name ?? "?")[0].toUpperCase()}
                      </div>

                      <div style={{ flex: 1 }}>
                        {/* Company + verified */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.82rem",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {job.businesses?.company_name}
                          </span>
                          {job.businesses?.verified && (
                            <span
                              style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.5)",
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                padding: "0.1rem 0.5rem",
                                borderRadius: "980px",
                              }}
                            >
                              ✓ Verified
                            </span>
                          )}
                        </div>

                        {/* Title */}
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

                        {/* Salary */}
                        {job.salary_min && job.salary_max && (
                          <p
                            style={{
                              fontSize: "0.92rem",
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.85)",
                              marginBottom: "0.5rem",
                            }}
                          >
                            ${job.salary_min.toLocaleString()}
                            <span
                              style={{
                                color: "rgba(255,255,255,0.3)",
                                fontWeight: 400,
                              }}
                            >
                              {" "}
                              –{" "}
                            </span>
                            ${job.salary_max.toLocaleString()}
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 400,
                                color: "rgba(255,255,255,0.3)",
                                marginLeft: "0.3rem",
                              }}
                            >
                              / yr
                            </span>
                          </p>
                        )}

                        {/* Meta pills */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.35rem",
                            marginBottom: "0.65rem",
                          }}
                        >
                          {job.location && (
                            <span style={metaPill}>📍 {job.location}</span>
                          )}
                          {job.work_type && (
                            <span style={metaPill}>{job.work_type}</span>
                          )}
                          {job.industry && (
                            <span style={metaPill}>{job.industry}</span>
                          )}
                          {job.deadline && (
                            <span
                              style={{
                                ...metaPill,
                                color: "rgba(255,200,60,0.8)",
                                background: "rgba(255,200,60,0.06)",
                                border: "1px solid rgba(255,200,60,0.15)",
                              }}
                            >
                              ⏳ Closes {job.deadline}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {job.description && (
                          <p
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              fontSize: "0.83rem",
                              lineHeight: 1.55,
                              marginBottom: "0.65rem",
                              maxWidth: 520,
                            }}
                          >
                            {job.description.length > 130
                              ? job.description.slice(0, 130) + "…"
                              : job.description}
                          </p>
                        )}

                        {/* Qualifications */}
                        {job.qualifications?.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.35rem",
                            }}
                          >
                            {job.qualifications.map((q, i) => (
                              <span
                                key={i}
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "rgba(255,255,255,0.4)",
                                  fontSize: "0.73rem",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "980px",
                                }}
                              >
                                {q}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Apply button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        paddingTop: "0.25rem",
                      }}
                    >
                      <button
                        onClick={() =>
                          appliedJobs.includes(job.id)
                            ? handleCancelApplication(job.id)
                            : handleApply(job.id)
                        }
                        style={{
                          background: appliedJobs.includes(job.id)
                            ? "transparent"
                            : "#fff",
                          color: appliedJobs.includes(job.id)
                            ? "rgba(255,80,80,0.8)"
                            : "#000",
                          border: appliedJobs.includes(job.id)
                            ? "1px solid rgba(255,80,80,0.3)"
                            : "none",
                          padding: "0.6rem 1.3rem",
                          borderRadius: "980px",
                          fontWeight: 500,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontFamily: "-apple-system, sans-serif",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s",
                        }}
                      >
                        {appliedJobs.includes(job.id) ? "Cancel" : "Apply"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── APPLIED TAB ── */}
        {activeTab === "applied" && (
          <div>
            {/* ── Empty state: no applications yet ── */}
            {appliedJobsList.length === 0 ? (
              <div
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  padding: "4rem 2rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>✦</p>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your applications will live here
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    marginBottom: "1.75rem",
                    maxWidth: 340,
                    margin: "0 auto 1.75rem",
                  }}
                >
                  Once you apply to a role, you'll be able to track your
                  interview progress right here — step by step.
                </p>
                <button
                  onClick={() => setActiveTab("browse")}
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "0.65rem 1.6rem",
                    borderRadius: "980px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "-apple-system, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  Browse open roles →
                </button>
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
                {appliedJobsList.map((job) => {
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
                      style={{ background: "#111", padding: "1.5rem" }}
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
                          {/* Company + verified */}
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
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              {job.businesses?.company_name}
                            </span>
                            {job.businesses?.verified && (
                              <span
                                style={{
                                  background: "rgba(255,255,255,0.06)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  color: "rgba(255,255,255,0.5)",
                                  fontSize: "0.68rem",
                                  fontWeight: 600,
                                  padding: "0.1rem 0.5rem",
                                  borderRadius: "980px",
                                }}
                              >
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <h3
                            style={{
                              fontSize: "1rem",
                              fontWeight: 600,
                              letterSpacing: "-0.01em",
                              marginBottom: "0.6rem",
                            }}
                          >
                            {job.title}
                          </h3>
                          <ProgressPipeline status={ivStatus} />
                          <div style={{ marginTop: "0.6rem" }}>
                            <InterviewBadge status={ivStatus} />
                          </div>
                        </div>

                        {/* Action buttons */}
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
                              onClick={() =>
                                router.push(
                                  `/worker/schedule-interview/${appId}`
                                )
                              }
                              style={{
                                background: "#fff",
                                color: "#000",
                                border: "none",
                                padding: "0.6rem 1.3rem",
                                borderRadius: "980px",
                                fontWeight: 500,
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                fontFamily: "-apple-system, sans-serif",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Schedule →
                            </button>
                          )}
                          {!locked && (
                            <button
                              onClick={() => handleCancelApplication(job.id)}
                              style={{
                                background: "transparent",
                                color: "rgba(255,80,80,0.7)",
                                border: "1px solid rgba(255,80,80,0.2)",
                                padding: "0.5rem 1.1rem",
                                borderRadius: "980px",
                                fontWeight: 400,
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                fontFamily: "-apple-system, sans-serif",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Cancel
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
      </div>
    </main>
  );
}
