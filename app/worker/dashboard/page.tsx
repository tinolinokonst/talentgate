"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Business = { company_name: string; verified: boolean };

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

// Approximate country centroids for distance calculation
const COUNTRY_COORDS: Record<string, [number, number]> = {
  "United Kingdom": [51.5, -0.1],
  "United States": [37.1, -95.7],
  Canada: [56.1, -106.3],
  Australia: [-25.3, 133.8],
  Germany: [51.2, 10.5],
  France: [46.2, 2.2],
  Netherlands: [52.1, 5.3],
  Ireland: [53.4, -8.2],
  Spain: [40.5, -3.7],
  Italy: [41.9, 12.6],
};

// Haversine formula — returns distance in km
function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  if (km < 1) return "< 1 km away";
  if (km < 10) return `~${Math.round(km)} km away`;
  if (km < 100) return `~${Math.round(km / 5) * 5} km away`;
  if (km < 1000) return `~${Math.round(km / 10) * 10} km away`;
  return `~${Math.round(km / 100) * 100} km away`;
}

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

export default function WorkerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [profile, setProfile] = useState<{
    full_name: string;
    skills: string[];
    location: string;
    latitude: number | null;
    longitude: number | null;
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
      .select("full_name, skills, location, latitude, longitude")
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
      .select("job_id")
      .eq("worker_id", user.id);
    setAppliedJobs(apps?.map((a: any) => a.job_id) || []);
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
    await supabase
      .from("applications")
      .insert({ job_id: jobId, worker_id: user.id, status: "pending" });
    setAppliedJobs([...appliedJobs, jobId]);
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
    setAppliedJobs(appliedJobs.filter((id) => id !== jobId));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function getJobDistance(job: Job): string | null {
    if (!profile?.latitude || !profile?.longitude) return null;
    const coords = COUNTRY_COORDS[job.country];
    if (!coords) return null;
    const km = getDistanceKm(
      profile.latitude,
      profile.longitude,
      coords[0],
      coords[1]
    );
    return formatDistance(km);
  }

  const industries = [...new Set(jobs.map((j) => j.industry).filter(Boolean))];
  const availableCountries = [
    ...new Set(jobs.map((j) => j.country).filter(Boolean)),
  ];
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
          <Link
            href="/worker/profile"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            {profile?.full_name}
          </Link>
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
                gap: "0.25rem",
              }}
            >
              {profile.location && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.85rem",
                  }}
                >
                  📍 {profile.location}
                </p>
              )}
              {profile.latitude && profile.longitude && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "0.75rem",
                  }}
                >
                  GPS enabled
                </p>
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
                ? "Browse roles"
                : `Applied (${appliedJobs.length})`}
            </button>
          ))}
        </div>

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
                placeholder="Search roles, companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 200,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "0.6rem 1rem",
                  color: "#f5f5f7",
                  fontSize: "0.85rem",
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
                  borderRadius: 10,
                  padding: "0.6rem 1rem",
                  color: industryFilter ? "#f5f5f7" : "rgba(255,255,255,0.4)",
                  fontSize: "0.85rem",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "-apple-system, sans-serif",
                }}
              >
                <option value="">All industries</option>
                {industries.map((i) => (
                  <option key={i} value={i} style={{ background: "#111" }}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "0.6rem 1rem",
                  color: countryFilter ? "#f5f5f7" : "rgba(255,255,255,0.4)",
                  fontSize: "0.85rem",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "-apple-system, sans-serif",
                }}
              >
                <option value="">All countries</option>
                {availableCountries.map((c) => (
                  <option key={c} value={c} style={{ background: "#111" }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

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
                  No roles match your search.
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
                {filteredJobs.map((job) => {
                  const distance = getJobDistance(job);
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
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: "0.4rem",
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
                            {distance && (
                              <span
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "rgba(255,255,255,0.4)",
                                  fontSize: "0.75rem",
                                  padding: "0.15rem 0.6rem",
                                  borderRadius: "980px",
                                }}
                              >
                                {distance}
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
                            {job.work_type && (
                              <span
                                style={{
                                  color: "rgba(255,255,255,0.35)",
                                  fontSize: "0.82rem",
                                }}
                              >
                                · {job.work_type}
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
                          {appliedJobs.includes(job.id)
                            ? "Cancel application"
                            : "Apply"}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "0.78rem",
                            color: "rgba(255,255,255,0.35)",
                          }}
                        >
                          {job.businesses?.company_name}
                        </span>
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
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "0.82rem",
                          }}
                        >
                          {job.location}
                          {job.country ? ` · ${job.country}` : ""}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
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
                        <button
                          onClick={() => handleCancelApplication(job.id)}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(255,80,80,0.3)",
                            color: "rgba(255,80,80,0.7)",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "980px",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            fontFamily: "-apple-system, sans-serif",
                          }}
                        >
                          Cancel
                        </button>
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
