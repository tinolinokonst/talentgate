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
          .select("id, title, location, status, created_at, industry")
          .eq("business_id", biz.id)
          .order("created_at", { ascending: false });
        setJobs(listings || []);
      }

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

  async function deleteJob(jobId: string) {
    await supabase.from("job_listings").delete().eq("id", jobId);
    setJobs(jobs.filter((j) => j.id !== jobId));
  }

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
              Manage your roles and find the right people.
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
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            + Post new role
          </Link>
        </div>

        {/* Verification banner */}
        {!business?.verified && (
          <div
            style={{
              background: "rgba(255,200,0,0.05)",
              border: "1px solid rgba(255,200,0,0.15)",
              borderRadius: 12,
              padding: "1rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span>⚠️</span>
            <div>
              <p
                style={{
                  fontWeight: 600,
                  color: "rgba(255,200,0,0.8)",
                  fontSize: "0.88rem",
                }}
              >
                Business verification pending
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.82rem",
                  marginTop: "0.2rem",
                }}
              >
                Your roles won't be visible to workers until your business is
                verified.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: "2.5rem",
          }}
        >
          {[
            {
              label: "Active roles",
              value: jobs.filter((j) => j.status === "active").length,
            },
            {
              label: "Paused",
              value: jobs.filter((j) => j.status === "paused").length,
            },
            {
              label: "Filled",
              value: jobs.filter((j) => j.status === "filled").length,
            },
            { label: "Total posted", value: jobs.length },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ background: "#111", padding: "1.5rem" }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  marginBottom: "0.3rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Job listings */}
        <h2
          style={{
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            marginBottom: "1rem",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            fontSize: "0.75rem",
          }}
        >
          Your listings
        </h2>

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
              style={{ color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem" }}
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
                fontSize: "0.9rem",
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
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: "#111",
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
                      fontSize: "0.95rem",
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
                      padding: "0.25rem 0.75rem",
                      borderRadius: "980px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      background:
                        job.status === "active"
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.04)",
                      color:
                        job.status === "active"
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {job.status}
                  </span>
                  <button
                    onClick={() => toggleJobStatus(job.id, job.status)}
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
                    onClick={() => deleteJob(job.id)}
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
