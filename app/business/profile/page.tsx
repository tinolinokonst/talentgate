"use client";

import { businessProfileSchema } from "../../../lib/schema";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

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

export default function BusinessProfile() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    async function loadBusiness() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: biz } = await supabase
        .from("businesses")
        .select("company_name, description, website, industry")
        .eq("profile_id", user.id)
        .single();

      if (biz) {
        setCompanyName(biz.company_name || "");
        setDescription(biz.description || "");
        setWebsite(biz.website || "");
        setIndustry(biz.industry || "");
      }
      setLoading(false);
    }
    loadBusiness();
  }, []);

  async function handleSave() {
    setError("");
    setSuccess(false);

    const result = businessProfileSchema.safeParse({
      companyName,
      description,
      website,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error: updateError } = await supabase
      .from("businesses")
      .update({ company_name: companyName, description, website, industry })
      .eq("profile_id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
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

  const sectionLabel = {
    fontSize: "0.72rem" as const,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "1.25rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "block",
  };

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "-apple-system, sans-serif",
          }}
        >
          Loading...
        </p>
      </main>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#f5f5f7",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap');`}</style>

      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          height: "52px",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Talentgate
        </span>
        <Link
          href="/business/dashboard"
          style={{
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            fontSize: "0.85rem",
          }}
        >
          ← Back to dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Business profile
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            marginBottom: "3rem",
            lineHeight: 1.6,
          }}
        >
          Update your company information. This is what workers see when they
          view your listings.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* COMPANY INFO */}
          <div>
            <span style={sectionLabel}>Company info</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Company name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Website
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  What does your business do?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Brief description of your company, what you do, and the kind of people you're looking to hire..."
                  style={{
                    ...inputStyle,
                    resize: "vertical" as const,
                    lineHeight: 1.6,
                  }}
                />
              </div>
            </div>
          </div>

          {/* INDUSTRY */}
          <div>
            <span style={sectionLabel}>Industry</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "980px",
                    border: "1px solid",
                    borderColor:
                      industry === ind ? "#fff" : "rgba(255,255,255,0.12)",
                    background: industry === ind ? "#fff" : "transparent",
                    color: industry === ind ? "#000" : "rgba(255,255,255,0.6)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
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
              marginTop: "2rem",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              background: "rgba(60,255,120,0.08)",
              border: "1px solid rgba(60,255,120,0.2)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              color: "rgba(60,255,120,0.9)",
              fontSize: "0.85rem",
              marginTop: "2rem",
            }}
          >
            Profile saved successfully.
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !companyName || !description || !industry}
          style={{
            width: "100%",
            marginTop: "2rem",
            background: "#fff",
            color: "#000",
            padding: "0.9rem",
            borderRadius: "980px",
            fontWeight: 500,
            fontSize: "0.95rem",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </main>
  );
}
