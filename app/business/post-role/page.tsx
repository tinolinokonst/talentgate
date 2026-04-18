"use client";

import { postRoleSchema } from "../../../lib/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

export default function PostRole() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [otherIndustry, setOtherIndustry] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [qualification, setQualification] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [workType, setWorkType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const COUNTRIES: Record<string, string[]> = {
    "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
    "United States": [
      "New York",
      "California",
      "Texas",
      "Florida",
      "Illinois",
      "Other",
    ],
    Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Other"],
    Australia: [
      "New South Wales",
      "Victoria",
      "Queensland",
      "Western Australia",
      "Other",
    ],
    Germany: ["Berlin", "Bavaria", "Hamburg", "Other"],
    France: ["Île-de-France", "Provence", "Other"],
    Netherlands: ["North Holland", "South Holland", "Utrecht", "Other"],
    Ireland: ["Dublin", "Cork", "Galway", "Other"],
    Spain: ["Madrid", "Catalonia", "Other"],
    Italy: ["Lombardy", "Lazio", "Other"],
    "Remote / Anywhere": [],
    Other: [],
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
    "Media",
    "Manufacturing",
    "Other",
  ];
  const workTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];

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
    setError("");

    const result = postRoleSchema.safeParse({
      title,
      description,
      location,
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      salaryMax: salaryMax ? parseInt(salaryMax) : null,
      qualifications,
      deadline,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
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

    const finalIndustry =
      industry === "Other" && otherIndustry ? otherIndustry : industry;

    const { error: jobError } = await supabase.from("job_listings").insert({
      business_id: biz.id,
      title,
      description,
      location,
      country,
      region,
      industry: finalIndustry,
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      deadline: deadline || null,
      qualifications,
      work_type: workType,
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
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "0.9rem 1rem",
    color: "#f5f5f7",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  };

  const pillButton = (active: boolean) => ({
    padding: "0.45rem 0.9rem",
    borderRadius: "980px",
    border: "1px solid",
    borderColor: active ? "#fff" : "rgba(255,255,255,0.12)",
    background: active ? "#fff" : "transparent",
    color: active ? "#000" : "rgba(255,255,255,0.55)",
    fontSize: "0.82rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    transition: "all 0.15s",
  });

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
        <Link
          href="/business/dashboard"
          style={{
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            fontSize: "0.85rem",
          }}
        >
          ← Back to dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Post a new role
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            marginBottom: "3rem",
            lineHeight: 1.6,
          }}
        >
          Describe the role clearly so the right people can find it.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Title */}
          <div>
            <label
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
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
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Industry *
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {industries.map((i) => (
                <button
                  key={i}
                  onClick={() => setIndustry(i)}
                  style={pillButton(industry === i) as React.CSSProperties}
                >
                  {i}
                </button>
              ))}
            </div>
            {industry === "Other" && (
              <input
                type="text"
                placeholder="Please specify your industry..."
                value={otherIndustry}
                onChange={(e) => setOtherIndustry(e.target.value)}
                style={{ ...inputStyle, marginTop: "0.75rem" }}
              />
            )}
          </div>

          {/* Work type */}
          <div>
            <label
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Work type *
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {workTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setWorkType(t)}
                  style={pillButton(workType === t) as React.CSSProperties}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Country */}
          <div>
            <label
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Country *
            </label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setRegion("");
              }}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Select country</option>
              {Object.keys(COUNTRIES).map((c) => (
                <option key={c} value={c} style={{ background: "#111" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          {country && COUNTRIES[country]?.length > 0 && (
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.45)",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Region / State
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">Select region</option>
                {COUNTRIES[country].map((r) => (
                  <option key={r} value={r} style={{ background: "#111" }}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* City */}
          <div>
            <label
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              City / Town
            </label>
            <input
              type="text"
              placeholder="e.g. London or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Salary */}
          <div>
            <label
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Salary range (USD/year)
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              <input
                type="number"
                placeholder="Min e.g. 40000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Max e.g. 60000"
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
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
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
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              What are you looking for in a candidate?
            </label>
            <p
              style={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "0.75rem",
              }}
            >
              Add specific qualifications, experience, or qualities you want
              applicants to have.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="e.g. 3+ years React, strong communicator..."
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addQualification()}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addQualification}
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "0 1.2rem",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
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
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                      padding: "0.3rem 0.85rem",
                      borderRadius: "980px",
                      fontSize: "0.82rem",
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
                        color: "rgba(255,255,255,0.35)",
                        cursor: "pointer",
                        fontSize: "1rem",
                        lineHeight: 1,
                        padding: 0,
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
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Role description *
            </label>
            <p
              style={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "0.75rem",
              }}
            >
              Describe the role, the team, day-to-day responsibilities, and what
              success looks like.
            </p>
            <textarea
              placeholder="e.g. We're a small but fast-growing fintech looking for someone to lead our customer success team..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={7}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(255,60,60,0.1)",
                border: "1px solid rgba(255,60,60,0.2)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#ff6b6b",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !title ||
              !description ||
              !location ||
              !industry ||
              !workType
            }
            style={{
              background: "#fff",
              color: "#000",
              padding: "0.9rem",
              borderRadius: "980px",
              fontWeight: 500,
              fontSize: "0.95rem",
              border: "none",
              cursor:
                loading ||
                !title ||
                !description ||
                !location ||
                !industry ||
                !workType
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading ||
                !title ||
                !description ||
                !location ||
                !industry ||
                !workType
                  ? 0.4
                  : 1,
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Posting..." : "Post role →"}
          </button>
        </div>
      </div>
    </main>
  );
}
