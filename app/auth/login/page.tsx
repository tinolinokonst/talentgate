"use client";

import { loginSchema } from "../../../lib/schema";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile?.role === "business") {
          router.push("/business/dashboard");
        } else {
          router.push("/worker/dashboard");
        }
      }
    }
    checkSession();
  }, []);

  async function handleLogin() {
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);

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
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Talentgate
            </span>
          </Link>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            Welcome back
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

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
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
