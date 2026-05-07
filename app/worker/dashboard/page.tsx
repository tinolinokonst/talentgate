"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

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
  businesses: { company_name: string; verified: boolean } | null;
};

type InterviewStatusMap = Record<string, string>;

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
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
    color: "rgba(176,196,255,0.4)",
    bg: "rgba(255,255,255,0.04)",
  },
};

function StatusBadge({ status }: { status?: string }) {
  const s =
    statusConfig[status ?? "not_started"] ?? statusConfig["not_started"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: "0.72rem",
        fontWeight: 500,
        padding: "0.22rem 0.7rem",
        borderRadius: 100,
        border: `1px solid ${s.color}30`,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function SalaryText({
  min,
  max,
}: {
  min?: number | null;
  max?: number | null;
}) {
  if (!min && !max) return null;
  const fmt = (n: number) => `£${(n / 1000).toFixed(0)}k`;
  if (min && max)
    return (
      <>
        {fmt(min)} – {fmt(max)}
      </>
    );
  if (min) return <>From {fmt(min)}</>;
  return <>Up to {fmt(max!)}</>;
}

const SS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:#0a0f1e;--navy-mid:#111827;--navy-card:#161d30;--navy-border:rgba(99,130,255,0.12);
    --accent:#4f7cff;--accent-soft:rgba(79,124,255,0.12);--teal:#2dd4bf;--gold:#f59e0b;
    --text-primary:#f0f4ff;--text-secondary:rgba(176,196,255,0.7);--text-muted:rgba(176,196,255,0.4);
    --serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,sans-serif;
  }
  a{text-decoration:none;color:inherit;}
  input,select{font-family:var(--sans);}
  input::placeholder{color:var(--text-muted);}
  input:focus,select:focus{outline:none;border-color:rgba(79,124,255,0.5)!important;background:rgba(79,124,255,0.05)!important;}
  select option{background:#111827;color:#f0f4ff;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(79,124,255,0.2);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  .card-hover{transition:all 0.2s;}
  .card-hover:hover{border-color:rgba(79,124,255,0.28)!important;transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,0.35);}
  .tab-btn{background:transparent;border:none;padding:0.5rem 0;font-family:var(--sans);font-size:0.9rem;cursor:pointer;transition:all 0.15s;position:relative;}
  .tab-active{color:#f0f4ff;font-weight:500;}
  .tab-active::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--accent);border-radius:2px;}
  .tab-inactive{color:rgba(176,196,255,0.4);}
  .tab-inactive:hover{color:rgba(176,196,255,0.7);}
  .apply-btn{background:var(--accent);color:#fff;border:none;padding:0.55rem 1.25rem;border-radius:8px;font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .apply-btn:hover{background:#3d6aee;box-shadow:0 4px 16px rgba(79,124,255,0.35);}
  .apply-btn:disabled{background:rgba(79,124,255,0.25);color:rgba(176,196,255,0.4);cursor:not-allowed;box-shadow:none;}
  .cancel-btn{background:transparent;color:rgba(248,113,113,0.7);border:1px solid rgba(248,113,113,0.2);padding:0.45rem 1rem;border-radius:8px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;}
  .cancel-btn:hover{background:rgba(248,113,113,0.08);border-color:rgba(248,113,113,0.4);color:#fca5a5;}
`;

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
    if (search)
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.location?.toLowerCase().includes(search.toLowerCase()) ||
          (j.businesses?.company_name ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
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
    if (appError || !newApp) return;
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
      const n = { ...prev };
      delete n[jobId];
      return n;
    });
    setInterviewStatuses((prev) => {
      const n = { ...prev };
      if (appId) delete n[appId];
      return n;
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
            href="/worker/profile"
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              transition: "color 0.2s",
            }}
          >
            {profile?.full_name || "Profile"}
          </Link>
          <button
            onClick={handleSignOut}
            style={{
              background: "transparent",
              border: "1px solid var(--navy-border)",
              color: "var(--text-muted)",
              padding: "0.4rem 1rem",
              borderRadius: "8px",
              fontFamily: "var(--sans)",
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "2.5rem",
            animation: "fadeUp 0.5s ease forwards",
          }}
        >
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
            Worker dashboard
          </p>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
            {profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "0.4rem",
              fontSize: "0.95rem",
              fontWeight: 300,
            }}
          >
            {filteredJobs.length} role{filteredJobs.length !== 1 ? "s" : ""}{" "}
            open right now.
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            borderBottom: "1px solid var(--navy-border)",
            marginBottom: "2rem",
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
                fontSize: "0.7rem",
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
                  background: "rgba(45,212,191,0.1)",
                  color: "var(--teal)",
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.5rem",
                  borderRadius: 100,
                }}
              >
                {appliedJobs.length}
              </span>
            )}
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
                marginBottom: "1.75rem",
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
                    opacity: 0.4,
                  }}
                  width="16"
                  height="16"
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
                  style={{
                    width: "100%",
                    background: "var(--navy-card)",
                    border: "1px solid var(--navy-border)",
                    borderRadius: 8,
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    fontFamily: "var(--sans)",
                  }}
                />
              </div>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                  color: industryFilter
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                  fontSize: "0.88rem",
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                  minWidth: 140,
                }}
              >
                <option value="">All industries</option>
                {industries.map((i) => (
                  <option key={i} value={i!}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                style={{
                  background: "var(--navy-card)",
                  border: "1px solid var(--navy-border)",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                  color: countryFilter
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                  fontSize: "0.88rem",
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                  minWidth: 130,
                }}
              >
                <option value="">All countries</option>
                {availableCountries.map((c) => (
                  <option key={c} value={c!}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Job cards */}
            {filteredJobs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  color: "var(--text-muted)",
                }}
              >
                <p style={{ fontSize: "1rem" }}>No roles match your search.</p>
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  Try clearing your filters.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {filteredJobs.map((job) => {
                  const applied = appliedJobs.includes(job.id);
                  const appId = applicationIds[job.id];
                  const status = appId ? interviewStatuses[appId] : undefined;
                  const locked = interviewLocked(job.id);
                  return (
                    <div
                      key={job.id}
                      className="card-hover"
                      style={{
                        background: "var(--navy-card)",
                        border: "1px solid var(--navy-border)",
                        borderRadius: 14,
                        padding: "1.5rem",
                      }}
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
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                              marginBottom: "0.35rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <h3
                              style={{
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "var(--text-primary)",
                              }}
                            >
                              {job.title}
                            </h3>
                            {job.businesses?.verified && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.3rem",
                                  background: "rgba(45,212,191,0.1)",
                                  color: "var(--teal)",
                                  fontSize: "0.68rem",
                                  fontWeight: 500,
                                  padding: "0.15rem 0.55rem",
                                  borderRadius: 100,
                                  border: "1px solid rgba(45,212,191,0.2)",
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
                          </div>
                          <p
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: "0.88rem",
                              marginBottom: "0.75rem",
                              fontWeight: 300,
                            }}
                          >
                            {job.businesses?.company_name}
                            {job.location && <> · {job.location}</>}
                            {job.country && <>, {job.country}</>}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              flexWrap: "wrap",
                            }}
                          >
                            {job.industry && (
                              <span
                                style={{
                                  background: "var(--accent-soft)",
                                  color: "#a5b8ff",
                                  fontSize: "0.72rem",
                                  fontWeight: 500,
                                  padding: "0.2rem 0.65rem",
                                  borderRadius: 100,
                                  border: "1px solid rgba(79,124,255,0.15)",
                                }}
                              >
                                {job.industry}
                              </span>
                            )}
                            {job.work_type && (
                              <span
                                style={{
                                  background: "rgba(245,158,11,0.08)",
                                  color: "#fcd34d",
                                  fontSize: "0.72rem",
                                  fontWeight: 500,
                                  padding: "0.2rem 0.65rem",
                                  borderRadius: 100,
                                  border: "1px solid rgba(245,158,11,0.15)",
                                }}
                              >
                                {job.work_type}
                              </span>
                            )}
                            {(job.salary_min || job.salary_max) && (
                              <span
                                style={{
                                  background: "rgba(52,211,153,0.08)",
                                  color: "#6ee7b7",
                                  fontSize: "0.72rem",
                                  fontWeight: 500,
                                  padding: "0.2rem 0.65rem",
                                  borderRadius: 100,
                                  border: "1px solid rgba(52,211,153,0.15)",
                                }}
                              >
                                <SalaryText
                                  min={job.salary_min}
                                  max={job.salary_max}
                                />
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "0.6rem",
                            flexShrink: 0,
                          }}
                        >
                          {applied && <StatusBadge status={status} />}
                          {!applied ? (
                            <button
                              className="apply-btn"
                              onClick={() => handleApply(job.id)}
                            >
                              Apply now
                            </button>
                          ) : locked ? (
                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.8rem",
                              }}
                            >
                              In progress
                            </span>
                          ) : (
                            <button
                              className="cancel-btn"
                              onClick={() => handleCancelApplication(job.id)}
                            >
                              Withdraw
                            </button>
                          )}
                          {applied &&
                            appId &&
                            interviewStatuses[appId] === "invited" && (
                              <button
                                onClick={() =>
                                  router.push(
                                    `/worker/schedule-interview/${appId}`
                                  )
                                }
                                style={{
                                  background: "var(--accent-soft)",
                                  color: "var(--accent)",
                                  border: "1px solid rgba(79,124,255,0.2)",
                                  padding: "0.4rem 0.9rem",
                                  borderRadius: 8,
                                  fontSize: "0.78rem",
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                  fontFamily: "var(--sans)",
                                }}
                              >
                                Schedule interview
                              </button>
                            )}
                        </div>
                      </div>
                      {job.description && (
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.83rem",
                            lineHeight: 1.6,
                            marginTop: "1rem",
                            paddingTop: "1rem",
                            borderTop: "1px solid var(--navy-border)",
                            fontWeight: 300,
                          }}
                        >
                          {job.description.slice(0, 180)}
                          {job.description.length > 180 ? "…" : ""}
                        </p>
                      )}
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
                  textAlign: "center",
                  padding: "4rem 2rem",
                  color: "var(--text-muted)",
                }}
              >
                <p style={{ fontSize: "1rem" }}>No applications yet.</p>
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  Switch to Browse to explore open roles.
                </p>
                <button
                  onClick={() => setActiveTab("browse")}
                  style={{
                    marginTop: "1.5rem",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid rgba(79,124,255,0.2)",
                    padding: "0.65rem 1.5rem",
                    borderRadius: 8,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                  }}
                >
                  Browse roles
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {appliedJobsList.map((job) => {
                  const appId = applicationIds[job.id];
                  const status = appId ? interviewStatuses[appId] : undefined;
                  return (
                    <div
                      key={job.id}
                      style={{
                        background: "var(--navy-card)",
                        border: "1px solid var(--navy-border)",
                        borderRadius: 14,
                        padding: "1.5rem",
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
                              marginBottom: "0.25rem",
                            }}
                          >
                            {job.title}
                          </h3>
                          <p
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: "0.85rem",
                              fontWeight: 300,
                            }}
                          >
                            {job.businesses?.company_name}
                            {job.location && ` · ${job.location}`}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <StatusBadge status={status} />
                          {status === "invited" && appId && (
                            <button
                              onClick={() =>
                                router.push(
                                  `/worker/schedule-interview/${appId}`
                                )
                              }
                              style={{
                                background: "var(--accent)",
                                color: "#fff",
                                border: "none",
                                padding: "0.45rem 1rem",
                                borderRadius: 8,
                                fontSize: "0.82rem",
                                fontWeight: 500,
                                cursor: "pointer",
                                fontFamily: "var(--sans)",
                                transition: "all 0.2s",
                              }}
                            >
                              Schedule
                            </button>
                          )}
                        </div>
                      </div>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.78rem",
                          marginTop: "0.6rem",
                        }}
                      >
                        Applied · {job.industry}{" "}
                        {job.country && `· ${job.country}`}
                      </p>
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
