// app/business/post-role/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const COUNTRIES: Record<string, string[]> = {
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "United States": [
    "New York",
    "California",
    "Texas",
    "Florida",
    "Illinois",
    "Pennsylvania",
    "Ohio",
    "Georgia",
    "North Carolina",
    "Michigan",
    "Other",
  ],
  Canada: [
    "Ontario",
    "Quebec",
    "British Columbia",
    "Alberta",
    "Manitoba",
    "Other",
  ],
  Australia: [
    "New South Wales",
    "Victoria",
    "Queensland",
    "Western Australia",
    "South Australia",
    "Other",
  ],
  Germany: ["Berlin", "Bavaria", "Hamburg", "North Rhine-Westphalia", "Other"],
  France: ["Île-de-France", "Provence", "Auvergne-Rhône-Alpes", "Other"],
  Netherlands: ["North Holland", "South Holland", "Utrecht", "Other"],
  Ireland: ["Dublin", "Cork", "Galway", "Other"],
  Spain: ["Madrid", "Catalonia", "Andalusia", "Other"],
  Italy: ["Lombardy", "Lazio", "Campania", "Other"],
  "Remote / Anywhere": [],
  Other: [],
};

const INDUSTRIES = [
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

const WORK_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

export default function PostRole() {
  const router = useRouter();
  const supabase = createClient();

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [workType, setWorkType] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [qualInput, setQualInput] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
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
        router.push("/business/dashboard");
        return;
      }
      setBusinessId(biz.id);
      setLoading(false);
    }
    load();
  }, []);

  function addQualification() {
    const q = qualInput.trim();
    if (q && !qualifications.includes(q)) {
      setQualifications([...qualifications, q]);
      setQualInput("");
    }
  }

  function removeQualification(q: string) {
    setQualifications(qualifications.filter((x) => x !== q));
  }

  async function handleSubmit() {
    if (!title || !industry || !workType || !country) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError("");

    const location = [city, region, country].filter(Boolean).join(", ");

    const { error: insertError } = await supabase.from("job_listings").insert({
      business_id: businessId,
      title,
      description,
      industry,
      work_type: workType,
      country,
      region,
      location,
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      deadline: deadline || null,
      qualifications,
      status: "active",
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push("/business/dashboard");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "0.9rem 1rem",
    color: "#f5f5f7",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.82rem",
    color: "rgba(255,255,255,0.45)",
    display: "block",
    marginBottom: "0.5rem",
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.25)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    display: "block",
    marginBottom: "1.25rem",
  };

  const regions = country ? COUNTRIES[country] ?? [] : [];

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
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link
          href="/business/dashboard"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textDecoration: "none",
          }}
        >
          Talentgate
        </Link>
        <Link
          href="/business/dashboard"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          ← Back to dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Post a role
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.9rem",
            marginBottom: "3rem",
          }}
        >
          Fill in the details — workers will see this when browsing open roles.
        </p>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
        >
          {/* ── ROLE DETAILS ── */}
          <div>
            <span style={sectionLabel}>Role details</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Job title{" "}
                  <span style={{ color: "rgba(255,80,80,0.7)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will this person be doing day to day?"
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Industry{" "}
                    <span style={{ color: "rgba(255,80,80,0.7)" }}>*</span>
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select…</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>
                    Work type{" "}
                    <span style={{ color: "rgba(255,80,80,0.7)" }}>*</span>
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select…</option>
                    {WORK_TYPES.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── LOCATION ── */}
          <div>
            <span style={sectionLabel}>Location</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Country{" "}
                  <span style={{ color: "rgba(255,80,80,0.7)" }}>*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setRegion("");
                  }}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Select…</option>
                  {Object.keys(COUNTRIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {regions.length > 0 && (
                <div>
                  <label style={labelStyle}>Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select…</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label style={labelStyle}>City / Town</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Manchester"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* ── COMPENSATION ── */}
          <div>
            <span style={sectionLabel}>Compensation</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>Min salary (annual)</label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="e.g. 40000"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Max salary (annual)</label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="e.g. 60000"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* ── REQUIREMENTS ── */}
          <div>
            <span style={sectionLabel}>Requirements</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <label style={labelStyle}>Application deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
              </div>
              <div>
                <label style={labelStyle}>Qualifications / requirements</label>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <input
                    type="text"
                    value={qualInput}
                    onChange={(e) => setQualInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addQualification();
                      }
                    }}
                    placeholder="e.g. 3+ years experience"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={addQualification}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#f5f5f7",
                      padding: "0 1.2rem",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontFamily: "-apple-system, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Add
                  </button>
                </div>
                {qualifications.length > 0 && (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                  >
                    {qualifications.map((q) => (
                      <span
                        key={q}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "980px",
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {q}
                        <button
                          onClick={() => removeQualification(q)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(255,255,255,0.35)",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            padding: 0,
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
            </div>
          </div>

          {/* ── SUBMIT ── */}
          {error && (
            <p style={{ color: "rgba(255,80,80,0.8)", fontSize: "0.88rem" }}>
              {error}
            </p>
          )}
          <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                background: saving ? "rgba(255,255,255,0.5)" : "#fff",
                color: "#000",
                padding: "0.85rem 2rem",
                borderRadius: "980px",
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "-apple-system, sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "opacity 0.15s",
              }}
            >
              {saving ? "Posting…" : "Post role"}
            </button>
            <Link
              href="/business/dashboard"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)",
                padding: "0.85rem 1.5rem",
                borderRadius: "980px",
                textDecoration: "none",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
