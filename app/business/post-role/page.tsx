"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from '../../lib/supabase/client'

export default function PostRole() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [qualification, setQualification] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  function addQualification() {
    if (qualification.trim()) {
      setQualifications([...qualifications, qualification.trim()]);
      setQualification("");
    }
  }

  function removeQualification(index: number) {
    setQualifications(qualifications.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: biz } = await supabase
      .from("businesses")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!biz) {
      setError("Business profile not found.");
      setLoading(false);
      return;
    }

    const { error: jobError } = await supabase.from("job_listings").insert({
      business_id: biz.id,
      title,
      description,
      location,
      industry,
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      deadline: deadline || null,
      qualifications,
      status: "active",
    });

    if (jobError) {
      setError(jobError.message);
      setLoading(false);
      return;
    }

    router.push("/business/dashboard");
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "0.85rem 1rem",
    color: "var(--text)",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Construction",
    "Hospitality",
    "Marketing",
    "Legal",
    "Other",
  ];

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
        <Link
          href="/business/dashboard"
          style={{
            color: "var(--muted)",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          ← Back to dashboard
        </Link>
      </nav>

      <div style={{ padding: "3rem 5%", maxWidth: 680, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
          }}
        >
          Post a new role
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "2.5rem" }}>
          Fill in the details below to list your open position.
        </p>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Title */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Job title *
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Software Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Industry */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Industry *
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="" style={{ background: "#0D1521" }}>
                Select an industry
              </option>
              {industries.map((i) => (
                <option key={i} value={i} style={{ background: "#0D1521" }}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Location *
            </label>
            <input
              type="text"
              placeholder="e.g. New York, NY or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Salary */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Salary range (USD/year)
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <input
                type="number"
                placeholder="Min e.g. 50000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Max e.g. 80000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Application deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Qualifications */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Required qualifications
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="e.g. 3+ years React experience"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addQualification()}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addQualification}
                style={{
                  background: "var(--accent)",
                  color: "#04080F",
                  padding: "0 1.2rem",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
              >
                +
              </button>
            </div>
            {qualifications.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.75rem",
                }}
              >
                {qualifications.map((q, i) => (
                  <span
                    key={i}
                    style={{
                      background: "rgba(0,229,255,0.08)",
                      border: "1px solid rgba(0,229,255,0.2)",
                      color: "var(--accent)",
                      padding: "0.3rem 0.8rem",
                      borderRadius: 100,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {q}
                    <button
                      onClick={() => removeQualification(i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent)",
                        cursor: "pointer",
                        fontSize: "1rem",
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Job description *
            </label>
            <textarea
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(255,80,80,0.1)",
                border: "1px solid rgba(255,80,80,0.3)",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                color: "#ff5050",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={
              loading || !title || !description || !location || !industry
            }
            style={{
              background: "var(--accent)",
              color: "#04080F",
              padding: "0.9rem",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "0.95rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity:
                loading || !title || !description || !location || !industry
                  ? 0.7
                  : 1,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? "Posting..." : "Post Role →"}
          </button>
        </div>
      </div>
    </main>
  );
}
