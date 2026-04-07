"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Business = {
  company_name: string;
  verified: boolean;
};

type Job = {
  id: string;
  title: string;
  location: string;
  industry: string;
  salary_min: number;
  salary_max: number;
  deadline: string;
  qualifications: string[];
  status: string;
  description: string;
  businesses: Business | null;
};

export default function WorkerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [profile, setProfile] = useState<{
    full_name: string;
    skills: string[];
    location: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "applied">("browse");
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

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, skills, location")
        .eq("id", user.id)
        .single();
      setProfile(prof);

      const { data: listings } = await supabase
        .from("job_listings")
        .select(
          `
          id, title, location, industry,
          salary_min, salary_max, deadline,
          qualifications, status, description,
          businesses (company_name, verified)
        `
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
        .select("job_id")
        .eq("worker_id", user.id);

      setAppliedJobs(apps?.map((a: any) => a.job_id) || []);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = jobs;
    if (search) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.location.toLowerCase().includes(search.toLowerCase()) ||
          (j.businesses?.company_name ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }
    if (industryFilter) {
      filtered = filtered.filter((j) => j.industry === industryFilter);
    }
    setFilteredJobs(filtered);
  }, [search, industryFilter, jobs]);

  async function handleApply(jobId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("applications").insert({
      job_id: jobId,
      worker_id: user.id,
      status: "pending",
    });
    setAppliedJobs([...appliedJobs, jobId]);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const industries = [...new Set(jobs.map((j) => j.industry).filter(Boolean))];
  const appliedJobsList = jobs.filter((j) => appliedJobs.includes(j.id));

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
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
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

        {/* Profile snapshot */}
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
            {profile.location && (
              <p
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}
              >
                📍 {profile.location}
              </p>
            )}
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

        {activeTab === "browse" && (
          <>
            {/* Search & Filter */}
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
                  minWidth: 240,
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
                {industries.map((i) => (
                  <option key={i} value={i} style={{ background: "#111" }}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            {/* Job listings */}
            {filteredJobs.length === 0 ? (
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
                  No roles found matching your search.
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
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: "#111",
                      padding: "1.8rem",
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.4rem",
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
                          marginBottom: "0.5rem",
                        }}
                      >
                        {job.title}
                      </h3>

                      {job.description && (
                        <p
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                            marginBottom: "0.75rem",
                            maxWidth: 500,
                          }}
                        >
                          {job.description.length > 120
                            ? job.description.slice(0, 120) + "..."
                            : job.description}
                        </p>
                      )}

                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          flexWrap: "wrap",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {job.location && (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              fontSize: "0.82rem",
                            }}
                          >
                            📍 {job.location}
                          </span>
                        )}
                        {job.industry && (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              fontSize: "0.82rem",
                            }}
                          >
                            · {job.industry}
                          </span>
                        )}
                        {job.salary_min && job.salary_max && (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              fontSize: "0.82rem",
                            }}
                          >
                            · ${job.salary_min.toLocaleString()} – $
                            {job.salary_max.toLocaleString()}/yr
                          </span>
                        )}
                        {job.deadline && (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              fontSize: "0.82rem",
                            }}
                          >
                            · Deadline: {job.deadline}
                          </span>
                        )}
                      </div>

                      {job.qualifications?.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.4rem",
                          }}
                        >
                          {job.qualifications.map((q, i) => (
                            <span
                              key={i}
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.45)",
                                fontSize: "0.75rem",
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

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        paddingTop: "0.25rem",
                      }}
                    >
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={appliedJobs.includes(job.id)}
                        style={{
                          background: appliedJobs.includes(job.id)
                            ? "transparent"
                            : "#fff",
                          color: appliedJobs.includes(job.id)
                            ? "rgba(255,255,255,0.5)"
                            : "#000",
                          border: appliedJobs.includes(job.id)
                            ? "1px solid rgba(255,255,255,0.15)"
                            : "none",
                          padding: "0.6rem 1.3rem",
                          borderRadius: "980px",
                          fontWeight: 500,
                          fontSize: "0.85rem",
                          cursor: appliedJobs.includes(job.id)
                            ? "default"
                            : "pointer",
                          fontFamily: "-apple-system, sans-serif",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s",
                        }}
                      >
                        {appliedJobs.includes(job.id) ? "✓ Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "applied" && (
          <div>
            {appliedJobsList.length === 0 ? (
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
                    marginBottom: "1rem",
                  }}
                >
                  You haven't applied to any roles yet.
                </p>
                <button
                  onClick={() => setActiveTab("browse")}
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "980px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "-apple-system, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.85rem",
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
                  gap: "1px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {appliedJobsList.map((job) => (
                  <div
                    key={job.id}
                    style={{ background: "#111", padding: "1.5rem" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "0.82rem",
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {job.businesses?.company_name}
                        </p>
                        <h3
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            marginBottom: "0.4rem",
                          }}
                        >
                          {job.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.82rem",
                            color: "rgba(255,255,255,0.35)",
                          }}
                        >
                          {job.location} · {job.industry}
                        </p>
                      </div>
                      <span
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.5)",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "980px",
                          fontSize: "0.78rem",
                          fontWeight: 500,
                        }}
                      >
                        Applied
                      </span>
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
