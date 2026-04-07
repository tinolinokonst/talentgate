"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "business") {
        router.push("/business/dashboard");
      } else {
        router.push("/worker/dashboard");
      }
    }
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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        color: "#f5f5f7",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "#f5f5f7",
                letterSpacing: "-0.02em",
              }}
            >
              Talentgate
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 600,
              marginBottom: "0.4rem",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.88rem",
              marginBottom: "1.8rem",
            }}
          >
            Log in to your Talentgate account.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.45)",
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.45)",
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={inputStyle}
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
              onClick={handleLogin}
              disabled={loading || !email || !password}
              style={{
                background: "#fff",
                color: "#000",
                padding: "0.9rem",
                borderRadius: "980px",
                fontWeight: 500,
                fontSize: "0.95rem",
                border: "none",
                cursor:
                  loading || !email || !password ? "not-allowed" : "pointer",
                opacity: loading || !email || !password ? 0.5 : 1,
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                marginTop: "0.5rem",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Logging in..." : "Log in →"}
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.82rem",
              marginTop: "1.5rem",
            }}
          >
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
