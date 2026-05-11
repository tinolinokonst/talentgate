"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// This page is only useful when DEV_BYPASS_SECRET is set in env.
// Nothing links to it from the main app — you access it directly at /dev-login.

export default function DevLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !secret) {
      setError("Fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }
    router.push(json.redirect);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        color: "#f0f4ff",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380, padding: "0 1.5rem" }}>
        <p
          style={{
            fontSize: "0.7rem",
            color: "rgba(248,113,113,0.7)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Dev bypass — do not use in production
        </p>
        <div
          style={{
            background: "#161d30",
            border: "1px solid rgba(99,130,255,0.12)",
            borderRadius: 16,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "0.72rem",
                color: "rgba(176,196,255,0.4)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,130,255,0.12)",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                color: "#f0f4ff",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "0.72rem",
                color: "rgba(176,196,255,0.4)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Bypass secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="DEV_BYPASS_SECRET value"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,130,255,0.12)",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                color: "#f0f4ff",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          {error && (
            <p style={{ color: "#fca5a5", fontSize: "0.83rem" }}>{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: "#4f7cff",
              color: "#fff",
              border: "none",
              padding: "0.85rem",
              borderRadius: 8,
              fontFamily: "inherit",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Signing in…" : "Sign in (bypass)"}
          </button>
        </div>
      </div>
    </main>
  );
}
