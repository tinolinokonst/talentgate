"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from '../../../lib/supabase/client'

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "worker";

  const [userType, setUserType] = useState<"business" | "worker">(
    type as "business" | "worker"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleSignup() {
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: userType,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: userType,
      });

      if (userType === "business") {
        router.push("/business/onboarding");
      } else {
        router.push("/worker/onboarding");
      }
    }
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
      <div style={{ width: "100%", maxWidth: 480 }}>
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
            Create your account
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.9rem",
              marginBottom: "2rem",
            }}
          >
            Join Talentgate — it only takes a minute.
          </p>

          {/* Toggle */}
          <div
            style={{
              display: "flex",
              background: "var(--bg)",
              borderRadius: 10,
              padding: "0.3rem",
              marginBottom: "1.8rem",
            }}
          >
            {(["worker", "business"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setUserType(t)}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  background: userType === t ? "var(--accent)" : "transparent",
                  color: userType === t ? "#04080F" : "var(--muted)",
                  transition: "all 0.2s",
                }}
              >
                {t === "worker" ? "👤 Job Seeker" : "🏢 Business"}
              </button>
            ))}
          </div>

          {/* Form */}
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
                {userType === "business" ? "Your full name" : "Full name"}
              </label>
              <input
                type="text"
                placeholder="John Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                Email address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
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
              onClick={handleSignup}
              disabled={loading}
              style={{
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
                marginTop: "0.5rem",
              }}
            >
              {loading
                ? "Creating account..."
                : userType === "business"
                ? "Continue to Payment →"
                : "Create Free Account →"}
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              fontSize: "0.85rem",
              marginTop: "1.5rem",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Log in
            </Link>
          </p>
        </div>

        {userType === "business" && (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              fontSize: "0.8rem",
              marginTop: "1rem",
            }}
          >
            🔒 You'll be asked to pay $39/month and verify your business after
            signup
          </p>
        )}
      </div>
    </main>
  );
}
