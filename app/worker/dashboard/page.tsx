"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '../../lib/supabase/client'

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
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      setProfile(prof);

      const { data: listings } = await supabase
        .from("job_listings")
        .select(
          `
          id, title, location, industry,
          salary_min, salary_max, deadline,
          qualifications, status,
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

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--muted)" }}>Loading jobs...</p>
      </main>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.2rem 5%",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "var(--text)",
          }}
        >
          Talent<span style={{ color: "var(--accent)" }}>gate</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            {profile?.full_name}
          </span>
          <button
            onClick={handleSignOut}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              padding: "0.4rem 1rem",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ padding: "3rem 5%", maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.8rem",
              fontWeight: 800,
            }}
          >
            Welcome back, {profile?.full_name?.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>
            {filteredJobs.length} verified roles available right now
          </p>
        </div>

        {/* Search & Filter */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search by title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 260,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              color: "var(--text)",
              fontSize: "0.9rem",
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              color: industryFilter ? "var(--text)" : "var(--muted)",
              fontSize: "0.9rem",
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="">All industries</option>
            {industries.map((i) => (
              <option key={i} value={i} style={{ background: "#0D1521" }}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Job listings */}
        {filteredJobs.length === 0 ? (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "3rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
            <p style={{ color: "var(--muted)" }}>
              No roles found matching your search.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "1.8rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
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
                        style={{ fontSize: "0.85rem", color: "var(--muted)" }}
                      >
                        {job.businesses?.company_name}
                      </span>
                      {job.businesses?.verified && (
                        <span
                          style={{
                            background: "rgba(0,229,255,0.1)",
                            border: "1px solid rgba(0,229,255,0.25)",
                            color: "var(--accent)",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.5rem",
                            borderRadius: 100,
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {job.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{ color: "var(--muted)", fontSize: "0.85rem" }}
                      >
                        📍 {job.location}
                      </span>
                      <span
                        style={{ color: "var(--muted)", fontSize: "0.85rem" }}
                      >
                        🏷️ {job.industry}
                      </span>
                      {job.salary_min && job.salary_max && (
                        <span
                          style={{ color: "var(--muted)", fontSize: "0.85rem" }}
                        >
                          ${job.salary_min} – ${job.salary_max}/yr
                        </span>
                      )}
                      {job.deadline && (
                        <span
                          style={{ color: "var(--muted)", fontSize: "0.85rem" }}
                        >
                          ⏰ Deadline: 
                          {job.deadline}
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
                              border: "1px solid var(--border)",
                              color: "var(--muted)",
                              fontSize: "0.78rem",
                              padding: "0.2rem 0.6rem",
                              borderRadius: 100,
                            }}
                          >
                            {q}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={appliedJobs.includes(job.id)}
                      style={{
                        background: appliedJobs.includes(job.id)
                          ? "transparent"
                          : "var(--accent)",
                        color: appliedJobs.includes(job.id)
                          ? "var(--accent)"
                          : "#04080F",
                        border: appliedJobs.includes(job.id)
                          ? "1px solid var(--accent)"
                          : "none",
                        padding: "0.65rem 1.4rem",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        cursor: appliedJobs.includes(job.id)
                          ? "default"
                          : "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {appliedJobs.includes(job.id) ? "✓ Applied" : "Apply Now"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
