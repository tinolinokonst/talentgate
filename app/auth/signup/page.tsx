"use client";

export const dynamic = "force-dynamic";

import { signupSchema } from "../../../lib/schema";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"business" | "worker">("worker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleSignup() {
    setError("");

    const result = signupSchema.safeParse({ email, password, fullName });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);

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

        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: "0.25rem",
            marginBottom: "2rem",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {(["worker", "business"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setUserType(t)}
              style={{
                flex: 1,
                padding: "0.65rem",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 500,
                fontSize: "0.88rem",
                background: userType === t ? "#fff" : "transparent",
                color: userType === t ? "#000" : "rgba(255,255,255,0.5)",
                transition: "all 0.2s",
              }}
            >
              {t === "worker" ? "Find work" : "Hire talent"}
            </button>
          ))}
        </div>

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
            {userType === "worker"
              ? "Create your free account"
              : "Start hiring"}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.88rem",
              marginBottom: "1.8rem",
            }}
          >
            {userType === "worker"
              ? "Join Talentgate and tell your story to verified businesses."
              : "Post roles and find verified talent for $39/month."}
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
                Full name
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
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              onClick={handleSignup}
              disabled={loading || !fullName || !email || !password}
              style={{
                background: "#fff",
                color: "#000",
                padding: "0.9rem",
                borderRadius: "980px",
                fontWeight: 500,
                fontSize: "0.95rem",
                border: "none",
                cursor:
                  loading || !fullName || !email || !password
                    ? "not-allowed"
                    : "pointer",
                opacity: loading || !fullName || !email || !password ? 0.5 : 1,
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                marginTop: "0.5rem",
              }}
            >
              {loading
                ? "Creating account..."
                : userType === "business"
                ? "Continue to payment →"
                : "Create free account →"}
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
            Already have an account?{" "}
            <Link
              href="/auth/login"
              style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}
            >
              Log in
            </Link>
          </p>
        </div>

        {userType === "business" && (
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.78rem",
              marginTop: "1rem",
              lineHeight: 1.5,
            }}
          >
            You will verify your business and pay $39/month after signup
          </p>
        )}
        {userType === "worker" && (
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.78rem",
              marginTop: "1rem",
              lineHeight: 1.5,
            }}
          >
            A quick identity check keeps the platform safe for everyone
          </p>
        )}
      </div>
    </main>
  );
}
