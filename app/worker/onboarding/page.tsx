"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

export default function WorkerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — About you
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  // Step 2 — Your experience
  const [experienceSummary, setExperienceSummary] = useState("");
  const [previousRoles, setPreviousRoles] = useState("");
  const [biggestAchievement, setBiggestAchievement] = useState("");

  // Step 3 — Your skills
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [whatYouGoodAt, setWhatYouGoodAt] = useState("");

  const supabase = createClient();

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

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        verified: true,
        location,
        job_type: jobType,
        experience_summary: experienceSummary,
        previous_roles: previousRoles,
        biggest_achievement: biggestAchievement,
        skills,
        what_good_at: whatYouGoodAt,
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

  const textareaStyle = {
    ...inputStyle,
    resize: "vertical" as const,
    lineHeight: 1.6,
  };

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Open to anything",
  ];

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
      <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: "3rem" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{ fontSize: "1.3rem", fontWeight: 600, color: "#f5f5f7" }}
            >
              Talentgate
            </span>
          </Link>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            {[
              "About you",
              "Your experience",
              "Your skills",
              "Verify identity",
            ].map((s, i) => (
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

        {/* STEP 1 — About you */}
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
              Tell us a little about where you are and what kind of work you're
              looking for.
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
                  Where are you based?
                </label>
                <input
                  type="text"
                  placeholder="e.g. London, UK"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  What kind of work are you looking for?
                </label>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {jobTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setJobType(t)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "980px",
                        border: "1px solid",
                        borderColor:
                          jobType === t ? "#fff" : "rgba(255,255,255,0.12)",
                        background: jobType === t ? "#fff" : "transparent",
                        color: jobType === t ? "#000" : "rgba(255,255,255,0.6)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, sans-serif",
                        transition: "all 0.15s",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!location || !jobType}
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
                cursor: !location || !jobType ? "not-allowed" : "pointer",
                opacity: !location || !jobType ? 0.4 : 1,
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — Your experience */}
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
              This isn't a CV. Don't list dates and job titles.
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
              kind of work you've been part of. Businesses want to understand
              who you are — not read a document.
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
                  placeholder="e.g. I've spent the last few years working in hospitality, mostly front-of-house roles in busy restaurants. I've learned how to handle high-pressure environments, manage customer expectations, and work as part of a team..."
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
                  placeholder="e.g. Retail, customer service, some freelance graphic design work. I've also done some volunteer work organising community events..."
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
                  placeholder="e.g. I helped redesign the customer onboarding process at my last job which reduced complaints by about 30%..."
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
                style={{
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
                }}
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

        {/* STEP 3 — Skills */}
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
              not. Then tell us what you genuinely excel at.
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
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, sans-serif",
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
                  placeholder="e.g. I'm really good at staying calm under pressure and making quick decisions. I tend to be the person people come to when something goes wrong because I'm good at problem-solving on the spot..."
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
                style={{
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
                }}
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

        {/* STEP 4 — Verify identity */}
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
              real person. This takes less than 2 minutes.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              {[
                {
                  icon: "🪪",
                  label: "Government-issued ID (passport, driver's licence)",
                },
                { icon: "📄", label: "Birth certificate" },
                { icon: "🌍", label: "National identity card" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "1rem 1.2rem",
                  }}
                >
                  <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: "0.88rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
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
              <span>🔒</span>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Your documents are handled securely. We never store raw ID
                images — verification is powered by Stripe Identity.
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
                style={{
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
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                style={{
                  flex: 2,
                  padding: "0.9rem",
                  borderRadius: "980px",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
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
