"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

// ── Shared styles ──────────────────────────────────────────
const SS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:#0a0f1e;--navy-card:#161d30;
    --navy-border:rgba(99,130,255,0.12);--accent:#4f7cff;--accent-soft:rgba(79,124,255,0.12);
    --teal:#2dd4bf;--green:#34d399;
    --text-primary:#f0f4ff;--text-secondary:rgba(176,196,255,0.7);--text-muted:rgba(176,196,255,0.4);
    --serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,sans-serif;
  }
  a{text-decoration:none;color:inherit;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(79,124,255,0.2);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  .fade{animation:fadeUp 0.4s ease forwards;}
  input,textarea,select{font-family:var(--sans);}
  input::placeholder,textarea::placeholder{color:rgba(176,196,255,0.3);}
  select option{background:#111827;}
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
  France: ["Ile-de-France", "Provence", "Auvergne-Rhone-Alpes", "Other"],
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

// ── Field label ────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
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
    </label>
  );
}

// ── Section wrapper ────────────────────────────────────────
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

export default function WorkerProfile() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
        const parts = (profile.location || "").split(", ");
        if (parts.length >= 3) setCurrentCity(parts[0]);
        setJobType(profile.job_type || "");
        setSelectedIndustries(profile.industries || []);
        const locs = profile.job_search_locations || [];
        setOpenToRemote(locs.includes("Remote"));
        setSearchCountries(locs.filter((l: string) => l !== "Remote"));
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
  function toggleSearchCountry(c: string) {
    setSearchCountries((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
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
      if (cvFile.type !== "application/pdf") {
        setError("CV must be a PDF file.");
        setSaving(false);
        return;
      }
      if (cvFile.size > 5 * 1024 * 1024) {
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

  // ── Shared style objects ──────────────────────────────────
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
  };
  const ta: React.CSSProperties = {
    ...inp,
    resize: "vertical",
    lineHeight: 1.7,
  };
  const sel: React.CSSProperties = { ...inp, cursor: "pointer" };

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

  const regions = currentCountry ? COUNTRIES[currentCountry] ?? [] : [];

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
          href="/worker/dashboard"
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
          Worker profile
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
          Edit your profile
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "3rem",
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          Keep your information up to date so businesses get an accurate picture
          of you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* ── OPEN TO WORK ── */}
          <div
            style={{
              background: openToWork
                ? "rgba(52,211,153,0.06)"
                : "rgba(255,255,255,0.02)",
              border: `1px solid ${
                openToWork ? "rgba(52,211,153,0.25)" : "var(--navy-border)"
              }`,
              borderRadius: 14,
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
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
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
                  ? "var(--green)"
                  : "rgba(255,255,255,0.12)",
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

          {/* ── BASICS ── */}
          <Section title="Basics">
            <div>
              <Label>Full name</Label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inp}
              />
            </div>
            <div>
              <Label>Country</Label>
              <select
                value={currentCountry}
                onChange={(e) => {
                  setCurrentCountry(e.target.value);
                  setCurrentRegion("");
                }}
                style={sel}
              >
                <option value="">Select country</option>
                {countryList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {regions.length > 0 && (
              <div>
                <Label>Region / State</Label>
                <select
                  value={currentRegion}
                  onChange={(e) => setCurrentRegion(e.target.value)}
                  style={sel}
                >
                  <option value="">Select region</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label>City / Town</Label>
              <input
                type="text"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                placeholder="e.g. Manchester"
                style={inp}
              />
            </div>
          </Section>

          {/* ── JOB PREFERENCES ── */}
          <Section title="Job preferences">
            <div>
              <Label>Type of work</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {jobTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setJobType(t)}
                    style={pill(jobType === t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Industries</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => toggleIndustry(ind)}
                    style={pill(selectedIndustries.includes(ind))}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Where you're looking for work</Label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {countryList
                  .filter((c) => c !== "Remote / Anywhere" && c !== "Other")
                  .map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleSearchCountry(c)}
                      style={pill(searchCountries.includes(c))}
                    >
                      {c}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => setOpenToRemote(!openToRemote)}
                style={pill(openToRemote)}
              >
                🌍 Open to remote
              </button>
            </div>
          </Section>

          {/* ── EXPERIENCE ── */}
          <Section title="Experience">
            <div>
              <Label>Your experience in your own words</Label>
              <textarea
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
                rows={5}
                style={ta}
              />
            </div>
            <div>
              <Label>Roles and industries you've worked in</Label>
              <textarea
                value={previousRoles}
                onChange={(e) => setPreviousRoles(e.target.value)}
                rows={3}
                style={ta}
              />
            </div>
            <div>
              <Label>Something you're proud of</Label>
              <textarea
                value={biggestAchievement}
                onChange={(e) => setBiggestAchievement(e.target.value)}
                rows={3}
                style={ta}
              />
            </div>
          </Section>

          {/* ── SKILLS ── */}
          <Section title="Skills">
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Add a skill and press Enter…"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  style={{ ...inp, flex: 1 }}
                />
                <button
                  onClick={addSkill}
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    padding: "0 1.25rem",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
              </div>
              {skills.length > 0 && (
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        background: "var(--accent-soft)",
                        border: "1px solid rgba(79,124,255,0.2)",
                        color: "#a5b8ff",
                        padding: "0.3rem 0.85rem",
                        borderRadius: 100,
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
            <div>
              <Label>What you're genuinely good at</Label>
              <textarea
                value={whatYouGoodAt}
                onChange={(e) => setWhatYouGoodAt(e.target.value)}
                rows={4}
                style={ta}
              />
            </div>
          </Section>

          {/* ── CV ── */}
          <Section title="CV">
            <div>
              {existingCvUrl && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--navy-border)",
                    borderRadius: 10,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <a
                    href={existingCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--teal)",
                      fontSize: "0.85rem",
                      flex: 1,
                    }}
                  >
                    View current CV
                  </a>
                  <button
                    onClick={() => setExistingCvUrl(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(248,113,113,0.5)",
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      fontFamily: "var(--sans)",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px dashed ${
                    cvFile ? "var(--accent)" : "var(--navy-border)"
                  }`,
                  borderRadius: 12,
                  padding: "2rem",
                  cursor: "pointer",
                  textAlign: "center",
                  background: cvFile ? "var(--accent-soft)" : "transparent",
                  transition: "all 0.2s",
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      {cvFile.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: "0.3rem",
                      }}
                    >
                      Click to change
                    </div>
                  </>
                ) : (
                  <>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      Upload new CV
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(176,196,255,0.25)",
                        marginTop: "0.25rem",
                      }}
                    >
                      PDF only · max 5MB
                    </div>
                  </>
                )}
              </label>
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
            {success && (
              <p style={{ color: "var(--green)", fontSize: "0.82rem" }}>
                Profile saved successfully.
              </p>
            )}
          </div>
          <button
            onClick={handleSave}
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
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
