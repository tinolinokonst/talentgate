"use client";

import { useState } from "react";
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

export default function WorkerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentRegion, setCurrentRegion] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [jobType, setJobType] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [otherIndustry, setOtherIndustry] = useState("");
  const [searchCountries, setSearchCountries] = useState<string[]>([]);
  const [openToRemote, setOpenToRemote] = useState(false);

  // Step 2
  const [experienceSummary, setExperienceSummary] = useState("");
  const [previousRoles, setPreviousRoles] = useState("");
  const [biggestAchievement, setBiggestAchievement] = useState("");

  // Step 3
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [whatYouGoodAt, setWhatYouGoodAt] = useState("");

  // Step 4
  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const supabase = createClient();

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
  const steps = [
    "About you",
    "Your experience",
    "Your skills",
    "Verify identity",
  ];
  const countryList = Object.keys(COUNTRIES);

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

  async function handleComplete() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Upload CV if provided
    let cvUrl = null;
    if (cvFile) {
      const ext = cvFile.name.split(".").pop();
      const path = `${user.id}/cv.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(path, cvFile, { upsert: true });
      if (uploadError) {
        setError("CV upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(path);
      cvUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        // ...all your existing fields...
        cv_url: cvUrl,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/worker/dashboard");
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

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

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

  const backBtn = {
    flex: 1,
    padding: "0.9rem",
    borderRadius: "980px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent",
    color: "rgba(255,255,255,0.6)",
    fontWeight: 500,
    fontSize: "0.9rem",
    cursor: "pointer",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  };

  const step1Valid =
    currentCountry &&
    jobType &&
    selectedIndustries.length > 0 &&
    searchCountries.length > 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#f5f5f7",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        padding: "2rem",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap');`}</style>

      <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: "3rem" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.6rem",
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
          </Link>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            {steps.map((s, i) => (
              <span
                key={s}
                style={{
                  fontSize: "0.75rem",
                  color:
                    i + 1 === step
                      ? "#fff"
                      : i + 1 < step
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.2)",
                  fontWeight: i + 1 === step ? 600 : 400,
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 100,
              height: 2,
            }}
          >
            <div
              style={{
                background: "#fff",
                height: 2,
                borderRadius: 100,
                width: `${(step / 4) * 100}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              Let's start with the basics
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                marginBottom: "2.5rem",
                lineHeight: 1.6,
              }}
            >
              Tell us where you are, what kind of work you're looking for, and
              where you'd like to work.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {/* Current location */}
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  Where are you currently based? *
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <select
                    value={currentCountry}
                    onChange={(e) => {
                      setCurrentCountry(e.target.value);
                      setCurrentRegion("");
                    }}
                    style={selectStyle as React.CSSProperties}
                  >
                    <option value="">Select your country</option>
                    {countryList.map((c) => (
                      <option key={c} value={c} style={{ background: "#111" }}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {currentCountry && COUNTRIES[currentCountry]?.length > 0 && (
                    <select
                      value={currentRegion}
                      onChange={(e) => setCurrentRegion(e.target.value)}
                      style={selectStyle as React.CSSProperties}
                    >
                      <option value="">Select your region / state</option>
                      {COUNTRIES[currentCountry].map((r) => (
                        <option
                          key={r}
                          value={r}
                          style={{ background: "#111" }}
                        >
                          {r}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="text"
                    placeholder="City or town (optional)"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Job search locations */}
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Where are you looking for work? *
                </label>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Select all countries you'd consider working in.
                </p>
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

              {/* Job type */}
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  What kind of work are you looking for? *
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

              {/* Industries */}
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  Which industries have you worked in? *{" "}
                  <span
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "0.78rem",
                    }}
                  >
                    (select all that apply)
                  </span>
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
                {selectedIndustries.includes("Other") && (
                  <input
                    type="text"
                    placeholder="Please specify your industry..."
                    value={otherIndustry}
                    onChange={(e) => setOtherIndustry(e.target.value)}
                    style={{ ...inputStyle, marginTop: "0.75rem" }}
                  />
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              style={{
                width: "100%",
                marginTop: "2.5rem",
                background: "#fff",
                color: "#000",
                padding: "0.9rem",
                borderRadius: "980px",
                fontWeight: 500,
                fontSize: "0.95rem",
                border: "none",
                cursor: !step1Valid ? "not-allowed" : "pointer",
                opacity: !step1Valid ? 0.4 : 1,
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              Tell us about your experience
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                marginBottom: "0.75rem",
                lineHeight: 1.6,
              }}
            >
              This is not a CV. Don't list dates and job titles.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                marginBottom: "2.5rem",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              Just talk about what you've done, what you've learned, and what
              kind of work you've been part of.
            </p>
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
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  In your own words, describe your work experience
                </label>
                <textarea
                  placeholder="e.g. I've spent the last few years working in hospitality..."
                  value={experienceSummary}
                  onChange={(e) => setExperienceSummary(e.target.value)}
                  rows={5}
                  style={textareaStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  What kinds of roles or industries have you worked in?
                </label>
                <textarea
                  placeholder="e.g. Retail, customer service, some freelance graphic design work..."
                  value={previousRoles}
                  onChange={(e) => setPreviousRoles(e.target.value)}
                  rows={3}
                  style={textareaStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  What's something you're particularly proud of from your work
                  experience?
                </label>
                <textarea
                  placeholder="e.g. I helped redesign the customer onboarding process..."
                  value={biggestAchievement}
                  onChange={(e) => setBiggestAchievement(e.target.value)}
                  rows={3}
                  style={textareaStyle}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", gap: "0.75rem", marginTop: "2.5rem" }}
            >
              <button
                onClick={() => setStep(1)}
                style={backBtn as React.CSSProperties}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!experienceSummary}
                style={{
                  flex: 2,
                  padding: "0.9rem",
                  borderRadius: "980px",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  cursor: !experienceSummary ? "not-allowed" : "pointer",
                  opacity: !experienceSummary ? 0.4 : 1,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              What are you good at?
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                marginBottom: "2.5rem",
                lineHeight: 1.6,
              }}
            >
              Add the skills you've built through your experience — technical or
              not.
            </p>
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
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Add your skills
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="e.g. Customer service, Python, Project management..."
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
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginTop: "0.75rem",
                    }}
                  >
                    {skills.map((s) => (
                      <span
                        key={s}
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "rgba(255,255,255,0.8)",
                          padding: "0.3rem 0.85rem",
                          borderRadius: "980px",
                          fontSize: "0.85rem",
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
                            color: "rgba(255,255,255,0.4)",
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
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  What do you genuinely excel at?
                </label>
                <textarea
                  placeholder="e.g. I'm really good at staying calm under pressure..."
                  value={whatYouGoodAt}
                  onChange={(e) => setWhatYouGoodAt(e.target.value)}
                  rows={4}
                  style={textareaStyle}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", gap: "0.75rem", marginTop: "2.5rem" }}
            >
              <button
                onClick={() => setStep(2)}
                style={backBtn as React.CSSProperties}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={skills.length === 0 || !whatYouGoodAt}
                style={{
                  flex: 2,
                  padding: "0.9rem",
                  borderRadius: "980px",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  cursor:
                    skills.length === 0 || !whatYouGoodAt
                      ? "not-allowed"
                      : "pointer",
                  opacity: skills.length === 0 || !whatYouGoodAt ? 0.4 : 1,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              One last step
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                marginBottom: "2.5rem",
                lineHeight: 1.6,
              }}
            >
              To keep Talentgate trusted and safe, we need to confirm you're a
              real person.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              {[
                {
                  id: "passport",
                  label: "Passport",
                  sub: "Any country, must be valid",
                },
                {
                  id: "drivers_licence",
                  label: "Driver's licence",
                  sub: "Front and back required",
                },
                {
                  id: "birth_certificate",
                  label: "Birth certificate",
                  sub: "Official government issued",
                },
                {
                  id: "national_id",
                  label: "National identity card",
                  sub: "Front and back required",
                },
              ].map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setDocType(doc.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background:
                      docType === doc.id
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${
                      docType === doc.id
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                    borderRadius: 12,
                    padding: "1rem 1.2rem",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    transition: "all 0.15s",
                    width: "100%",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.92rem",
                        fontWeight: 500,
                        color: "#f5f5f7",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {doc.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {doc.sub}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${
                        docType === doc.id ? "#fff" : "rgba(255,255,255,0.2)"
                      }`,
                      background: docType === doc.id ? "#fff" : "transparent",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {docType === doc.id && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#000",
                        }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {docType && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Upload your document
                </label>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px dashed ${
                      docFile
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(255,255,255,0.1)"
                    }`,
                    borderRadius: 12,
                    padding: "2rem",
                    cursor: "pointer",
                    textAlign: "center",
                    background: docFile
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                    style={{ display: "none" }}
                  />
                  {docFile ? (
                    <>
                      <div
                        style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}
                      >
                        ✓
                      </div>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          color: "#f5f5f7",
                          fontWeight: 500,
                        }}
                      >
                        {docFile.name}
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
                        Click to upload
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.25)",
                          marginTop: "0.3rem",
                        }}
                      >
                        JPG, PNG or PDF · Max 10MB
                      </div>
                    </>
                  )}
                </label>
              </div>
            )}
            {/* CV Upload */}
            <div style={{ marginTop: "2rem" }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.5)",
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Upload your CV{" "}
                <span
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "0.78rem",
                  }}
                >
                  (optional)
                </span>
              </label>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.25)",
                  marginBottom: "0.75rem",
                }}
              >
                PDF only · Max 10MB
              </p>
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
                  textAlign: "center",
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
                      Click to upload CV
                    </div>
                  </>
                )}
              </label>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "1rem 1.2rem",
                marginBottom: "2rem",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: "0.9rem", marginTop: "0.1rem" }}>
                🔒
              </span>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.3)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Your documents are encrypted and handled securely. Verification
                is powered by Stripe Identity.
              </p>
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
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setStep(3)}
                style={backBtn as React.CSSProperties}
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading || !docType || !docFile}
                style={{
                  flex: 2,
                  padding: "0.9rem",
                  borderRadius: "980px",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  cursor:
                    loading || !docType || !docFile ? "not-allowed" : "pointer",
                  opacity: loading || !docType || !docFile ? 0.4 : 1,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                {loading ? "Saving your profile..." : "Complete profile →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
