"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

export default function BusinessDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "applicants">(
    "listings"
  );
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
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
          .select(
            "id, title, location, country, status, created_at, industry, work_type"
          )
          .eq("business_id", biz.id)
          .order("created_at", { ascending: false });
        setJobs(listings || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function loadApplicants(jobId: string) {
    setLoadingApplicants(true);
    setSelectedJob(jobId);
    setActiveTab("applicants");
    const { data } = await supabase
      .from("applications")
      .select(
        "id, status, created_at, profiles(full_name, location, country, skills, experience_summary, what_good_at, job_type, previous_roles, biggest_achievement, industries, cv_url)"
      )
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    console.log("RAW APPLICANT DATA:", JSON.stringify(data));

    const normalized = (data || []).map((app: any) => ({
      ...app,
      profiles: Array.isArray(app.profiles)
        ? app.profiles[0] ?? null
        : app.profiles ?? null,
    }));

    setApplicants(normalized);
    setLoadingApplicants(false);
  }
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
      jobs.map((j: any) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
  }

  async function deleteJob(jobId: string) {
    await supabase.from("job_listings").delete().eq("id", jobId);
    setJobs(jobs.filter((j: any) => j.id !== jobId));
    if (selectedJob === jobId) {
      setSelectedJob(null);
      setActiveTab("listings");
    }
  }

  const selectedJobTitle = jobs.find((j: any) => j.id === selectedJob)?.title;

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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap');`}</style>

      {selectedApplicant && (
        <div
          onClick={() => setSelectedApplicant(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.85)",
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
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "2.5rem",
              maxWidth: 640,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedApplicant(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "-apple-system, sans-serif",
              }}
            >
              x
            </button>

            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "0.4rem",
              }}
            >
              {selectedApplicant.profiles?.full_name}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.85rem",
                marginBottom: "0.3rem",
              }}
            >
              {[
                selectedApplicant.profiles?.location,
                selectedApplicant.profiles?.country,
                selectedApplicant.profiles?.job_type,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.78rem",
                marginBottom: "2rem",
              }}
            >
              Applied{" "}
              {new Date(selectedApplicant.created_at).toLocaleDateString()}
            </p>

            {selectedApplicant.profiles?.industries?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Industries
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                >
                  {selectedApplicant.profiles.industries.map((ind: string) => (
                    <span
                      key={ind}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "0.2rem 0.7rem",
                        borderRadius: "980px",
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedApplicant.profiles?.skills?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Skills
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                >
                  {selectedApplicant.profiles.skills.map((s: string) => (
                    <span
                      key={s}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "0.2rem 0.7rem",
                        borderRadius: "980px",
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedApplicant.profiles?.experience_summary && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Experience
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedApplicant.profiles.experience_summary}
                </p>
              </div>
            )}

            {selectedApplicant.profiles?.previous_roles && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Previous roles
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedApplicant.profiles.previous_roles}
                </p>
              </div>
            )}

            {selectedApplicant.profiles?.biggest_achievement && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Proud of
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedApplicant.profiles.biggest_achievement}
                </p>
              </div>
            )}

            {selectedApplicant.profiles?.what_good_at && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  What they excel at
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {selectedApplicant.profiles.what_good_at}
                </p>
              </div>
            )}

            {selectedApplicant.profiles?.cv_url && (
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <a
                  href={selectedApplicant.profiles.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#fff",
                    color: "#000",
                    padding: "0.7rem 1.5rem",
                    borderRadius: "980px",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  View CV
                </a>
              </div>
            )}
          </div>
        </div>
      )}

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
            href="/business/profile"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            {business?.company_name}
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
              Manage your roles and applicants.
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
            <span>Warning</span>
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
                Your roles will not be visible until verified.
              </p>
            </div>
          </div>
        )}

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
              value: jobs.filter((j: any) => j.status === "active").length,
            },
            {
              label: "Paused",
              value: jobs.filter((j: any) => j.status === "paused").length,
            },
            {
              label: "Filled",
              value: jobs.filter((j: any) => j.status === "filled").length,
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
          <button
            onClick={() => setActiveTab("listings")}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "-apple-system, sans-serif",
              fontWeight: 500,
              fontSize: "0.85rem",
              background: activeTab === "listings" ? "#fff" : "transparent",
              color:
                activeTab === "listings" ? "#000" : "rgba(255,255,255,0.5)",
              transition: "all 0.2s",
            }}
          >
            Your listings ({jobs.length})
          </button>
          <button
            onClick={() => {
              if (selectedJob) setActiveTab("applicants");
            }}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: 10,
              border: "none",
              cursor: selectedJob ? "pointer" : "not-allowed",
              fontFamily: "-apple-system, sans-serif",
              fontWeight: 500,
              fontSize: "0.85rem",
              background: activeTab === "applicants" ? "#fff" : "transparent",
              color:
                activeTab === "applicants"
                  ? "#000"
                  : selectedJob
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.2)",
              transition: "all 0.2s",
            }}
          >
            {selectedJob ? `Applicants - ${selectedJobTitle}` : "Applicants"}
          </button>
        </div>

        {activeTab === "listings" && (
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem",
              }}
            >
              Click a role to see its applicants
            </p>
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
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "1.5rem",
                  }}
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
                {jobs.map((job: any) => (
                  <div
                    key={job.id}
                    style={{
                      background:
                        selectedJob === job.id
                          ? "rgba(255,255,255,0.06)"
                          : "#111",
                      padding: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onClick={() => loadApplicants(job.id)}
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
                        {[job.country, job.industry, job.work_type]
                          .filter(Boolean)
                          .join(" · ")}{" "}
                        · Posted {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                      onClick={(e) => e.stopPropagation()}
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
        )}

        {activeTab === "applicants" && (
          <div>
            <button
              onClick={() => setActiveTab("listings")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.85rem",
                marginBottom: "1.5rem",
                fontFamily: "-apple-system, sans-serif",
                padding: 0,
              }}
            >
              Back to listings
            </button>

            {loadingApplicants ? (
              <p style={{ color: "rgba(255,255,255,0.4)" }}>
                Loading applicants...
              </p>
            ) : applicants.length === 0 ? (
              <div
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: "4rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>👀</p>
                <p style={{ color: "rgba(255,255,255,0.3)" }}>
                  No one has applied to this role yet.
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
                {applicants.map((app: any) => (
                  <div
                    key={app.id}
                    style={{
                      background: "#111",
                      padding: "1.5rem",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onClick={() => setSelectedApplicant(app)}
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
                            marginBottom: "0.3rem",
                          }}
                        >
                          {app.profiles?.full_name}
                        </h3>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "0.82rem",
                          }}
                        >
                          {[app.profiles?.location, app.profiles?.job_type]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {app.profiles?.skills?.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.3rem",
                              marginTop: "0.5rem",
                            }}
                          >
                            {app.profiles.skills
                              .slice(0, 4)
                              .map((s: string) => (
                                <span
                                  key={s}
                                  style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    padding: "0.15rem 0.6rem",
                                    borderRadius: "980px",
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.5)",
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                            {app.profiles.skills.length > 4 && (
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "rgba(255,255,255,0.3)",
                                }}
                              >
                                +{app.profiles.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.5)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "980px",
                          fontSize: "0.75rem",
                        }}
                      >
                        View profile
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
