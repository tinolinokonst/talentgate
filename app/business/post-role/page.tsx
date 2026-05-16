"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const SS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:#0a0f1e;--navy-card:#161d30;--navy-border:rgba(99,130,255,0.12);
    --accent:#4f7cff;--accent-soft:rgba(79,124,255,0.12);
    --teal:#2dd4bf;--green:#34d399;--red:#f87171;
    --text-primary:#f0f4ff;--text-secondary:rgba(176,196,255,0.7);--text-muted:rgba(176,196,255,0.4);
    --serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,sans-serif;
  }
  a{text-decoration:none;color:inherit;}
  input,textarea,select{font-family:var(--sans);}
  input::placeholder,textarea::placeholder{color:rgba(176,196,255,0.3);}
  select option{background:#111827;color:#f0f4ff;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(79,124,255,0.2);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  @keyframes spin{to{transform:translateY(-50%) rotate(360deg);}}
  .fade{animation:fadeUp 0.4s ease forwards;}
`;

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

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      style={{
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        display: "block",
        marginBottom: "0.6rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
      }}
    >
      {children}
      {required && (
        <span style={{ color: "#f87171", marginLeft: "0.25rem" }}>*</span>
      )}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.68rem",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 500,
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--navy-border)",
        }}
      >
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {children}
      </div>
    </div>
  );
}

export default function PostRole() {
  const router = useRouter();
  const supabase = createClient();

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  function getCountryCode(countryName: string): string {
    const map: Record<string, string> = {
      "United Kingdom": "gb",
      "United States": "us",
      Canada: "ca",
      Australia: "au",
      Germany: "de",
      France: "fr",
      Netherlands: "nl",
      Ireland: "ie",
      Spain: "es",
      Italy: "it",
    };
    return map[countryName] ?? "";
  }

  async function fetchCitySuggestions(query: string) {
    if (query.length < 2) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setCityLoading(true);
    try {
      const countryParam =
        country && country !== "Remote / Anywhere" && country !== "Other"
          ? `&countrycodes=${getCountryCode(country)}`
          : "";
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}${countryParam}&format=json&addressdetails=1&limit=6&featuretype=city`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      setCitySuggestions(data);
      setShowSuggestions(true);
    } catch {
      setCitySuggestions([]);
    } finally {
      setCityLoading(false);
    }
  }

  function selectCity(suggestion: any) {
    const c =
      suggestion.address?.city ||
      suggestion.address?.town ||
      suggestion.address?.village ||
      suggestion.address?.municipality ||
      suggestion.name;
    setCity(c ?? suggestion.display_name.split(",")[0]);
    setShowSuggestions(false);
    setCitySuggestions([]);
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

  const inp: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--navy-border)",
    borderRadius: 10,
    padding: "0.85rem 1rem",
    color: "var(--text-primary)",
    fontSize: "0.92rem",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  };

  const pill = (active: boolean): React.CSSProperties => ({
    padding: "0.45rem 1rem",
    borderRadius: 100,
    border: `1px solid ${active ? "var(--accent)" : "var(--navy-border)"}`,
    background: active ? "var(--accent-soft)" : "transparent",
    color: active ? "#a5b8ff" : "var(--text-muted)",
    fontSize: "0.82rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  const regions = country ? COUNTRIES[country] ?? [] : [];

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{SS}</style>
        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
            fontSize: "0.9rem",
          }}
        >
          Loading...
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
        paddingBottom: "7rem",
      }}
    >
      <style>{SS}</style>

      {/* ── NAV ── */}
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
        <Link
          href="/business/dashboard"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to dashboard
        </Link>
      </nav>

      <div
        className="fade"
        style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 2rem" }}
      >
        <p
          style={{
            color: "var(--accent)",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}
        >
          Post a role
        </p>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(1.8rem,4vw,2.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          Create a new listing
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "3rem",
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          Fill in the details — workers will see this when browsing open roles.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* ── ROLE DETAILS ── */}
          <Section title="Role details">
            <div>
              <Label required>Job title</Label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                style={inp}
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will this person be doing day to day?"
                rows={5}
                style={{ ...inp, resize: "vertical", lineHeight: 1.7 }}
              />
            </div>
            <div>
              <Label required>Industry</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    style={pill(industry === ind)}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label required>Work type</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {WORK_TYPES.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWorkType(w)}
                    style={pill(workType === w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* ── LOCATION ── */}
          <Section title="Location">
            <div>
              <Label required>Country</Label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setRegion("");
                }}
                style={{ ...inp, cursor: "pointer" }}
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
                <Label>Region</Label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ ...inp, cursor: "pointer" }}
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
            <div style={{ position: "relative" }}>
              <Label>City / Town</Label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    fetchCitySuggestions(e.target.value);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onFocus={() =>
                    city.length >= 2 &&
                    citySuggestions.length > 0 &&
                    setShowSuggestions(true)
                  }
                  placeholder="e.g. Manchester"
                  style={{
                    ...inp,
                    paddingRight: cityLoading ? "2.5rem" : "1rem",
                  }}
                />
                {cityLoading && (
                  <div
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(255,255,255,0.15)",
                      borderTopColor: "rgba(255,255,255,0.6)",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                )}
              </div>
              {showSuggestions && citySuggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "#1a2236",
                    border: "1px solid rgba(99,130,255,0.2)",
                    borderRadius: 12,
                    overflow: "hidden",
                    zIndex: 50,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  {citySuggestions.map((s, i) => {
                    const cityName =
                      s.address?.city ||
                      s.address?.town ||
                      s.address?.village ||
                      s.address?.municipality ||
                      s.name;
                    const regionName =
                      s.address?.state || s.address?.county || "";
                    const countryName = s.address?.country || "";
                    return (
                      <div
                        key={i}
                        onMouseDown={() => selectCity(s)}
                        style={{
                          padding: "0.75rem 1rem",
                          cursor: "pointer",
                          borderBottom:
                            i < citySuggestions.length - 1
                              ? "1px solid rgba(255,255,255,0.05)"
                              : "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(79,124,255,0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(176,196,255,0.35)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <div>
                          <div
                            style={{
                              fontSize: "0.88rem",
                              color: "#f0f4ff",
                              fontWeight: 500,
                            }}
                          >
                            {cityName}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "rgba(176,196,255,0.4)",
                              marginTop: "0.1rem",
                            }}
                          >
                            {[regionName, countryName]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Section>

          {/* ── COMPENSATION ── */}
          <Section title="Compensation">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <Label>Min salary (annual)</Label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="e.g. 40000"
                  style={inp}
                />
              </div>
              <div>
                <Label>Max salary (annual)</Label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="e.g. 60000"
                  style={inp}
                />
              </div>
            </div>
          </Section>

          {/* ── REQUIREMENTS ── */}
          <Section title="Requirements">
            <div>
              <Label>Application deadline</Label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ ...inp, colorScheme: "dark" }}
              />
            </div>
            <div>
              <Label>Qualifications / requirements</Label>
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
                  style={{ ...inp, flex: 1 }}
                />
                <button
                  onClick={addQualification}
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    padding: "0 1.25rem",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: 500,
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
                        background: "var(--accent-soft)",
                        border: "1px solid rgba(79,124,255,0.2)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: 100,
                        fontSize: "0.82rem",
                        color: "#a5b8ff",
                      }}
                    >
                      {q}
                      <button
                        onClick={() => removeQualification(q)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "rgba(165,184,255,0.5)",
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
          </Section>
        </div>
      </div>

      {/* ── STICKY SAVE BAR ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,15,30,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--navy-border)",
          padding: "1rem 2.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1 }}>
            {error && (
              <p style={{ color: "#f87171", fontSize: "0.82rem" }}>{error}</p>
            )}
          </div>
          <Link
            href="/business/dashboard"
            style={{
              background: "transparent",
              border: "1px solid var(--navy-border)",
              color: "var(--text-secondary)",
              padding: "0.7rem 1.5rem",
              borderRadius: 10,
              fontSize: "0.88rem",
            }}
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: saving ? "rgba(79,124,255,0.5)" : "var(--accent)",
              color: "#fff",
              padding: "0.75rem 2rem",
              borderRadius: 10,
              fontFamily: "var(--sans)",
              fontWeight: 600,
              fontSize: "0.92rem",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
          >
            {saving ? "Posting…" : "Post role"}
          </button>
        </div>
      </div>
    </main>
  );
}
