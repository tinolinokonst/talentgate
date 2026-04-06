"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '../../lib/supabase/client'

export default function BusinessOnboarding() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: bizError } = await supabase.from("businesses").insert({
      profile_id: user.id,
      company_name: companyName,
      registration_number: registrationNumber,
      description,
      website,
    });

    if (bizError) {
      setError(bizError.message);
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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--text)",
            }}
          >
            Talent<span style={{ color: "var(--accent)" }}>gate</span>
          </span>
        </div>

        {/* Progress */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
            justifyContent: "center",
          }}
        >
          {["Account", "Business Details", "Payment"].map((step, i) => (
            <div
              key={step}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background:
                    i === 1
                      ? "var(--accent)"
                      : i === 0
                      ? "rgba(0,229,255,0.3)"
                      : "var(--surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: i === 1 ? "#04080F" : "var(--muted)",
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: i === 1 ? "var(--text)" : "var(--muted)",
                }}
              >
                {step}
              </span>
              {i < 2 && (
                <span style={{ color: "var(--border)", margin: "0 0.25rem" }}>
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "2.5rem",
          }}
        >
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.6rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            Tell us about your business
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.9rem",
              marginBottom: "2rem",
            }}
          >
            This information will be used to verify your business identity.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Company name
              </label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Company registration number
              </label>
              <input
                type="text"
                placeholder="e.g. 12345678"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Website
              </label>
              <input
                type="text"
                placeholder="https://yourcompany.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                What does your business do?
              </label>
              <textarea
                placeholder="Brief description of your company..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
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
              disabled={loading || !companyName || !registrationNumber}
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
                  loading || !companyName || !registrationNumber ? 0.7 : 1,
                fontFamily: "'DM Sans', sans-serif",
                marginTop: "0.5rem",
              }}
            >
              {loading ? "Saving..." : "Continue to Payment →"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
