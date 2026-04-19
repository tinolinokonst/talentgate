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

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Open to anything",
];
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
const countryList = Object.keys(COUNTRIES);

export default function WorkerProfile() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fields
  const [fullName, setFullName] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentRegion, setCurrentRegion] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [jobType, setJobType] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchCountries, setSearchCountries] = useState<string[]>([]);
  const [openToRemote, setOpenToRemote] = useState(false);
  const [experienceSummary, setExperienceSummary] = useState("");
  const [previousRoles, setPreviousRoles] = useState("");
  const [biggestAchievement, setBiggestAchievement] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [whatYouGoodAt, setWhatYouGoodAt] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [existingCvUrl, setExistingCvUrl] = useState<string | null>(null);
  const [openToWork, setOpenToWork] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "full_name, location, country, region, job_type, industries, experience_summary, previous_roles, biggest_achievement, skills, what_good_at, job_search_locations, cv_url, open_to_work"
        )
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setCurrentCountry(profile.country || "");
        setCurrentRegion(profile.region || "");
        // Extract city from location string (format: "city, region, country")
        const locationParts = (profile.location || "").split(", ");
        if (locationParts.length >= 3) setCurrentCity(locationParts[0]);
        setJobType(profile.job_type || "");
        setSelectedIndustries(profile.industries || []);
        const locations = profile.job_search_locations || [];
        setOpenToRemote(locations.includes("Remote"));
        setSearchCountries(locations.filter((l: string) => l !== "Remote"));
        setExperienceSummary(profile.experience_summary || "");
        setPreviousRoles(profile.previous_roles || "");
        setBiggestAchievement(profile.biggest_achievement || "");
        setSkills(profile.skills || []);
        setWhatYouGoodAt(profile.what_good_at || "");
        setExistingCvUrl(profile.cv_url || null);
        setOpenToWork(profile.open_to_work ?? false);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  function toggleIndustry(ind: string) {
    setSelectedIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  }

  function toggleSearchCountry(country: string) {
    setSearchCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  }

  function addSkill() {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
      setSkill("");
    }
  }

  function removeSkill(s: string) {
    setSkills(skills.filter((sk) => sk !== s));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    let cvUrl = existingCvUrl;
    if (cvFile) {
      const allowedTypes = ["application/pdf"];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(cvFile.type)) {
        setError("CV must be a PDF file.");
        setSaving(false);
        return;
      }
      if (cvFile.size > maxSize) {
        setError("CV must be smaller than 5MB.");
        setSaving(false);
        return;
      }
      const ext = cvFile.name.split(".").pop();
      const path = `${user.id}/cv.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(path, cvFile, { upsert: true });
      if (uploadError) {
        setError("CV upload failed: " + uploadError.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(path);
      cvUrl = urlData.publicUrl;
    }

    const location = [currentCity, currentRegion, currentCountry]
      .filter(Boolean)
      .join(", ");

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        location,
        country: currentCountry,
        region: currentRegion,
        job_type: jobType,
        industries: selectedIndustries,
        experience_summary: experienceSummary,
        previous_roles: previousRoles,
        biggest_achievement: biggestAchievement,
        skills,
        what_good_at: whatYouGoodAt,
        cv_url: cvUrl,
        job_search_locations: openToRemote
          ? [...searchCountries, "Remote"]
          : searchCountries,
        open_to_work: openToWork,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
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

  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const textareaStyle = {
    ...inputStyle,
    resize: "vertical" as const,
    lineHeight: 1.6,
  };

  const pillButton = (active: boolean) => ({
    padding: "0.5rem 1rem",
    borderRadius: "980px",
    border: "1px solid",
    borderColor: active ? "#fff" : "rgba(255,255,255,0.12)",
    background: active ? "#fff" : "transparent",
    color: active ? "#000" : "rgba(255,255,255,0.6)",
    fontSize: "0.85rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    transition: "all 0.15s",
  });

  const sectionLabel = {
    fontSize: "0.72rem" as const,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "1.25rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "block",
  };

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
          href="/worker/dashboard"
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
          Edit your profile
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            marginBottom: "3rem",
            lineHeight: 1.6,
          }}
        >
          Keep your information up to date so businesses get an accurate picture
          of you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* OPEN TO WORK */}
          <div
            style={{
              background: openToWork
                ? "rgba(80,200,120,0.06)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${
                openToWork ? "rgba(80,200,120,0.25)" : "rgba(255,255,255,0.08)"
              }`,
              borderRadius: 16,
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              transition: "all 0.25s",
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  marginBottom: "0.2rem",
                }}
              >
                Open to work
              </p>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                }}
              >
                {openToWork
                  ? "Businesses can discover your profile in the talent directory."
                  : "Enable this to appear in the talent directory for businesses."}
              </p>
            </div>
            <button
              onClick={() => setOpenToWork((v) => !v)}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                background: openToWork
                  ? "rgba(80,200,120,0.85)"
                  : "rgba(255,255,255,0.15)",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.25s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: openToWork ? 23 : 3,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.25s",
                  display: "block",
                }}
              />
            </button>
          </div>

          {/* BASICS */}
          <div>
            <span style={sectionLabel}>Basics</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Country
                </label>
                <select
                  value={currentCountry}
                  onChange={(e) => {
                    setCurrentCountry(e.target.value);
                    setCurrentRegion("");
                  }}
                  style={selectStyle as React.CSSProperties}
                >
                  <option value="">Select country</option>
                  {countryList.map((c) => (
                    <option key={c} value={c} style={{ background: "#111" }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {currentCountry && COUNTRIES[currentCountry]?.length > 0 && (
                <div>
                  <label
                    style={{
                      fontSize: "0.82rem",
                      color: "rgba(255,255,255,0.45)",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Region / State
                  </label>
                  <select
                    value={currentRegion}
                    onChange={(e) => setCurrentRegion(e.target.value)}
                    style={selectStyle as React.CSSProperties}
                  >
                    <option value="">Select region</option>
                    {COUNTRIES[currentCountry].map((r) => (
                      <option key={r} value={r} style={{ background: "#111" }}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  City / Town
                </label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="e.g. Manchester"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* JOB PREFERENCES */}
          <div>
            <span style={sectionLabel}>Job preferences</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  Type of work
                </label>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {jobTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setJobType(t)}
                      style={pillButton(jobType === t) as React.CSSProperties}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  Industries
                </label>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => toggleIndustry(ind)}
                      style={
                        pillButton(
                          selectedIndustries.includes(ind)
                        ) as React.CSSProperties
                      }
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  Where you're looking for work
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {countryList
                    .filter((c) => c !== "Remote / Anywhere" && c !== "Other")
                    .map((c) => (
                      <button
                        key={c}
                        onClick={() => toggleSearchCountry(c)}
                        style={
                          pillButton(
                            searchCountries.includes(c)
                          ) as React.CSSProperties
                        }
                      >
                        {c}
                      </button>
                    ))}
                </div>
                <button
                  onClick={() => setOpenToRemote(!openToRemote)}
                  style={pillButton(openToRemote) as React.CSSProperties}
                >
                  🌍 Open to remote
                </button>
              </div>
            </div>
          </div>

          {/* EXPERIENCE */}
          <div>
            <span style={sectionLabel}>Experience</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your experience in your own words
                </label>
                <textarea
                  value={experienceSummary}
                  onChange={(e) => setExperienceSummary(e.target.value)}
                  rows={5}
                  style={textareaStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Roles and industries you've worked in
                </label>
                <textarea
                  value={previousRoles}
                  onChange={(e) => setPreviousRoles(e.target.value)}
                  rows={3}
                  style={textareaStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Something you're proud of
                </label>
                <textarea
                  value={biggestAchievement}
                  onChange={(e) => setBiggestAchievement(e.target.value)}
                  rows={3}
                  style={textareaStyle}
                />
              </div>
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <span style={sectionLabel}>Skills</span>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <input
                type="text"
                placeholder="Add a skill..."
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addSkill}
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
            {skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {skills.map((s) => (
                  <span
                    key={s}
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
                    {s}
                    <button
                      onClick={() => removeSkill(s)}
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
            <div style={{ marginTop: "1.25rem" }}>
              <label
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.45)",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                What you're genuinely good at
              </label>
              <textarea
                value={whatYouGoodAt}
                onChange={(e) => setWhatYouGoodAt(e.target.value)}
                rows={4}
                style={textareaStyle}
              />
            </div>
          </div>

          {/* CV */}
          <div>
            <span style={sectionLabel}>CV</span>
            {existingCvUrl && (
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <a
                  href={existingCvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.85rem",
                  }}
                >
                  View current CV
                </a>
                <span
                  style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}
                >
                  Upload a new one to replace it
                </span>
              </div>
            )}
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: `2px dashed ${
                  cvFile ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"
                }`,
                borderRadius: 12,
                padding: "2rem",
                cursor: "pointer",
                textAlign: "center" as const,
                background: cvFile ? "rgba(255,255,255,0.04)" : "transparent",
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
              {cvFile ? (
                <>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                    ✓
                  </div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      color: "#f5f5f7",
                      fontWeight: 500,
                    }}
                  >
                    {cvFile.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.35)",
                      marginTop: "0.3rem",
                    }}
                  >
                    Click to change
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "0.5rem",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    ↑
                  </div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    Upload new CV (PDF only)
                  </div>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <div
            style={{
              background: "rgba(255,60,60,0.1)",
              border: "1px solid rgba(255,60,60,0.2)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              color: "#ff6b6b",
              fontSize: "0.85rem",
              marginTop: "2rem",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              background: "rgba(60,255,120,0.08)",
              border: "1px solid rgba(60,255,120,0.2)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              color: "rgba(60,255,120,0.9)",
              fontSize: "0.85rem",
              marginTop: "2rem",
            }}
          >
            Profile saved successfully.
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            marginTop: "2rem",
            background: "#fff",
            color: "#000",
            padding: "0.9rem",
            borderRadius: "980px",
            fontWeight: 500,
            fontSize: "0.95rem",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </main>
  );
}
