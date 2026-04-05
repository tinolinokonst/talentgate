"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Job = {
  id: string;
  title: string;
  location: string;
  status: string;
  created_at: string;
  industry: string;
};

type Business = {
  id: string;
  company_name: string;
  verified: boolean;
  subscription_active: boolean;
};

export default function BusinessDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
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

      const { data: biz } = await supabase
        .from("businesses")
        .select("id, company_name, verified, subscription_active")
        .eq("profile_id", user.id)
        .single();

      setBusiness(biz);

      const { data: listings } = await supabase
        .from("job_listings")
        .select("id, title, location, status, created_at, industry")
        .eq("business_id", biz?.id)
        .order("created_at", { ascending: false });

      setJobs(listings || []);
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function toggleJobStatus(jobId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    await supabase
      .from("job_listings")
      .update({ status: newStatus })
      .eq("id", jobId);
    setJobs(
      jobs.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
  }

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
        <p style={{ color: "var(--muted)" }}>Loading your dashboard...</p>
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
            {business?.company_name}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.8rem",
                fontWeight: 800,
              }}
            >
              Welcome back, {business?.company_name} 👋
            </h1>
            <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>
              Manage your job listings and applications
            </p>
          </div>
          <Link
            href="/business/post-role"
            style={{
              background: "var(--accent)",
              color: "#04080F",
              padding: "0.75rem 1.5rem",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            + Post New Role
          </Link>
        </div>

        {/* Status cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              label: "Active Listings",
              value: jobs.filter((j) => j.status === "active").length,
            },
            {
              label: "Paused Listings",
              value: jobs.filter((j) => j.status === "paused").length,
            },
            {
              label: "Filled Roles",
              value: jobs.filter((j) => j.status === "filled").length,
            },
            { label: "Total Posted", value: jobs.length },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--accent)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "0.85rem",
                  marginTop: "0.3rem",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Verification banner */}
        {!business?.verified && (
          <div
            style={{
              background: "rgba(255,200,0,0.08)",
              border: "1px solid rgba(255,200,0,0.25)",
              borderRadius: 12,
              padding: "1rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <div>
              <p
                style={{
                  fontWeight: 600,
                  color: "#ffc800",
                  fontSize: "0.9rem",
                }}
              >
                Business verification pending
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                Your business is being reviewed. You can still post roles but
                they won't be visible until verified.
              </p>
            </div>
          </div>
        )}

        {/* Job listings */}
        <div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBottom: "1.2rem",
            }}
          >
            Your Job Listings
          </h2>

          {jobs.length === 0 ? (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "3rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>📋</p>
              <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
                You haven't posted any roles yet.
              </p>
              <Link
                href="/business/post-role"
                style={{
                  background: "var(--accent)",
                  color: "#04080F",
                  padding: "0.75rem 1.5rem",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Post your first role
              </Link>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {jobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    >
                      {job.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.85rem",
                        marginTop: "0.3rem",
                      }}
                    >
                      {job.location} · {job.industry} · Posted{" "}
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.3rem 0.8rem",
                        borderRadius: 100,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background:
                          job.status === "active"
                            ? "rgba(0,229,255,0.1)"
                            : "rgba(255,255,255,0.05)",
                        color:
                          job.status === "active"
                            ? "var(--accent)"
                            : "var(--muted)",
                        border: `1px solid ${
                          job.status === "active"
                            ? "rgba(0,229,255,0.3)"
                            : "var(--border)"
                        }`,
                      }}
                    >
                      {job.status}
                    </span>
                    <button
                      onClick={() => toggleJobStatus(job.id, job.status)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                        padding: "0.3rem 0.8rem",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                      }}
                    >
                      {job.status === "active" ? "Pause" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
