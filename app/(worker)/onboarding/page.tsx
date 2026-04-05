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
  const supabase = createClient();

  async function handleVerificationComplete() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ verified: true })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/worker/dashboard");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
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
          </Link>
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
          {["Account", "Verify Identity", "Done"].map((s, i) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background:
                    i + 1 === step
                      ? "var(--accent)"
                      : i + 1 < step
                      ? "rgba(0,229,255,0.3)"
                      : "var(--surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: i + 1 === step ? "#04080F" : "var(--muted)",
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: i + 1 === step ? "var(--text)" : "var(--muted)",
                }}
              >
                {s}
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
          {step === 1 && (
            <>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🪪</div>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    marginBottom: "0.5rem",
                  }}
                >
                  Verify your identity
                </h1>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  To keep Talentgate safe and trusted, we need to verify you're
                  a real person. This takes less than 2 minutes.
                </p>
              </div>

              {/* What you need */}
              <div style={{ marginBottom: "2rem" }}>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    marginBottom: "1rem",
                    fontWeight: 600,
                  }}
                >
                  You'll need one of the following:
                </p>
                {[
                  {
                    icon: "🪪",
                    label: "Government-issued ID (passport, driver's license)",
                  },
                  { icon: "📄", label: "Birth certificate" },
                  { icon: "🌍", label: "National identity card" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      marginBottom: "0.5rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                    <span style={{ fontSize: "0.88rem", color: "var(--text)" }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Security note */}
              <div
                style={{
                  background: "rgba(0,229,255,0.05)",
                  border: "1px solid rgba(0,229,255,0.15)",
                  borderRadius: 10,
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1rem" }}>🔒</span>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--muted)",
                    lineHeight: 1.6,
                  }}
                >
                  Your documents are encrypted and handled securely. We never
                  store raw ID images — verification is powered by Stripe
                  Identity.
                </p>
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
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                style={{
                  width: "100%",
                  background: "var(--accent)",
                  color: "#04080F",
                  padding: "0.9rem",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Start Verification →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    marginBottom: "0.5rem",
                  }}
                >
                  Upload your document
                </h1>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  Take a clear photo of your ID document. Make sure all details
                  are visible.
                </p>
              </div>

              {/* Simulated upload area */}
              <div
                style={{
                  border: "2px dashed rgba(0,229,255,0.3)",
                  borderRadius: 16,
                  padding: "3rem",
                  textAlign: "center",
                  marginBottom: "1.5rem",
                  background: "rgba(0,229,255,0.03)",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                  📁
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  Click to upload or drag and drop
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.8rem",
                    marginTop: "0.3rem",
                  }}
                >
                  JPG, PNG or PDF · Max 10MB
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    color: "var(--muted)",
                    padding: "0.9rem",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleVerificationComplete}
                  disabled={loading}
                  style={{
                    flex: 2,
                    background: "var(--accent)",
                    color: "#04080F",
                    padding: "0.9rem",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {loading ? "Verifying..." : "Complete Verification →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
