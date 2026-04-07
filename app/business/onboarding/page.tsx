"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function BusinessOnboarding() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

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

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error: bizError } = await supabase.from("businesses").insert({
      profile_id: user.id,
      company_name: companyName,
      registration_number: registrationNumber,
      description,
      website,
      industry,
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
        color: "#f5f5f7",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "3rem" }}>
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

        {/* Progress */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            {["Account", "Business details", "Done"].map((s, i) => (
              <span
                key={s}
                style={{
                  fontSize: "0.75rem",
                  color:
                    i === 1
                      ? "#fff"
                      : i === 0
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.2)",
                  fontWeight: i === 1 ? 600 : 400,
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
                width: "66%",
              }}
            />
          </div>
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Tell us about your business
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            marginBottom: "2.5rem",
            lineHeight: 1.6,
          }}
        >
          This information is used to verify your business and build trust with
          workers on the platform.
        </p>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
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
              Company name *
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
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Company registration number *
            </label>
            <input
              type="text"
              placeholder="e.g. 12345678"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              style={inputStyle}
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.25)",
                marginTop: "0.4rem",
              }}
            >
              Used to verify your business is legitimate.
            </p>
          </div>

          <div>
            <label
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Industry *
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {industries.map((i) => (
                <button
                  key={i}
                  onClick={() => setIndustry(i)}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "980px",
                    border: "1px solid",
                    borderColor:
                      industry === i ? "#fff" : "rgba(255,255,255,0.12)",
                    background: industry === i ? "#fff" : "transparent",
                    color: industry === i ? "#000" : "rgba(255,255,255,0.55)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
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
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              What does your business do? *
            </label>
            <textarea
              placeholder="Brief description of your company, what you do, and the kind of people you're looking to hire..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
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
            onClick={handleSubmit}
            disabled={
              loading ||
              !companyName ||
              !registrationNumber ||
              !industry ||
              !description
            }
            style={{
              background: "#fff",
              color: "#000",
              padding: "0.9rem",
              borderRadius: "980px",
              fontWeight: 500,
              fontSize: "0.95rem",
              border: "none",
              cursor:
                loading ||
                !companyName ||
                !registrationNumber ||
                !industry ||
                !description
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading ||
                !companyName ||
                !registrationNumber ||
                !industry ||
                !description
                  ? 0.4
                  : 1,
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              marginTop: "0.5rem",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Saving..." : "Continue to dashboard →"}
          </button>
        </div>
      </div>
    </main>
  );
}
