"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const SS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:#0a0f1e;--navy-card:#161d30;--navy-border:rgba(99,130,255,0.12);
    --accent:#4f7cff;--accent-soft:rgba(79,124,255,0.12);
    --text-primary:#f0f4ff;--text-secondary:rgba(176,196,255,0.7);--text-muted:rgba(176,196,255,0.4);
    --serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,sans-serif;
  }
  a{text-decoration:none;color:inherit;}
  input{font-family:var(--sans);}
  input::placeholder{color:var(--text-muted);}
  input:focus{outline:none;border-color:rgba(79,124,255,0.5)!important;background:rgba(79,124,255,0.04)!important;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  .fade{animation:fadeUp 0.5s ease forwards;}
`;

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    const user = data.user;
    if (!user) {
      setError("Login failed.");
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "business") router.push("/business/dashboard");
    else router.push("/worker/dashboard");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--navy-border)",
    borderRadius: 10,
    padding: "0.85rem 1rem",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    fontFamily: "var(--sans)",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        color: "var(--text-primary)",
        fontFamily: "var(--sans)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{SS}</style>

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2.5rem",
          height: "60px",
          borderBottom: "1px solid var(--navy-border)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          Talentgate
        </Link>
        <Link
          href="/auth/signup"
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.88rem",
            transition: "color 0.2s",
          }}
        >
          Don't have an account?{" "}
          <span style={{ color: "var(--accent)" }}>Sign up</span>
        </Link>
      </nav>

      {/* Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div className="fade" style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: "2.2rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "0.5rem",
              }}
            >
              Welcome back.
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                fontWeight: 300,
              }}
            >
              Sign in to your Talentgate account.
            </p>
          </div>

          <div
            style={{
              background: "var(--navy-card)",
              border: "1px solid var(--navy-border)",
              borderRadius: 18,
              padding: "2rem",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.07em",
                    display: "block",
                    marginBottom: "0.45rem",
                  }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.07em",
                    display: "block",
                    marginBottom: "0.45rem",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                  marginTop: "1rem",
                }}
              >
                <p style={{ color: "#fca5a5", fontSize: "0.85rem" }}>{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "1.5rem",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                padding: "0.9rem",
                borderRadius: 10,
                fontFamily: "var(--sans)",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              color: "var(--text-muted)",
              fontSize: "0.88rem",
            }}
          >
            New to Talentgate?{" "}
            <Link href="/auth/signup" style={{ color: "var(--accent)" }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
