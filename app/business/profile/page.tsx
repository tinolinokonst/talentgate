"use client";

import { businessProfileSchema } from "../../../lib/schema";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const SS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:#0a0f1e;--navy-card:#161d30;--navy-border:rgba(99,130,255,0.12);
    --accent:#4f7cff;--accent-soft:rgba(79,124,255,0.12);
    --teal:#2dd4bf;--green:#34d399;
    --text-primary:#f0f4ff;--text-secondary:rgba(176,196,255,0.7);--text-muted:rgba(176,196,255,0.4);
    --serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,sans-serif;
  }
  a{text-decoration:none;color:inherit;}
  input,textarea,select{font-family:var(--sans);}
  input::placeholder,textarea::placeholder{color:rgba(176,196,255,0.3);}
  select option{background:#111827;}
  ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(79,124,255,0.2);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  .fade{animation:fadeUp 0.4s ease forwards;}
`;

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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        display: "block",
        marginBottom: "0.6rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.68rem",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 500,
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--navy-border)",
        }}
      >
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {children}
      </div>
    </div>
  );
}

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

  const inp: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--navy-border)",
    borderRadius: 10,
    padding: "0.85rem 1rem",
    color: "var(--text-primary)",
    fontSize: "0.92rem",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const pill = (active: boolean): React.CSSProperties => ({
    padding: "0.45rem 1rem",
    borderRadius: 100,
    border: `1px solid ${active ? "var(--accent)" : "var(--navy-border)"}`,
    background: active ? "var(--accent-soft)" : "transparent",
    color: active ? "#a5b8ff" : "var(--text-muted)",
    fontSize: "0.82rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{SS}</style>
        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
            fontSize: "0.9rem",
          }}
        >
          Loading...
        </p>
      </div>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        color: "var(--text-primary)",
        fontFamily: "var(--sans)",
        paddingBottom: "7rem",
      }}
    >
      <style>{SS}</style>

      {/* ── NAV ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2.5rem",
          height: "60px",
          background: "rgba(10,15,30,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--navy-border)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Talentgate
        </Link>
        <Link
          href="/business/dashboard"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to dashboard
        </Link>
      </nav>

      <div
        className="fade"
        style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 2rem" }}
      >
        <p
          style={{
            color: "var(--accent)",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}
        >
          Business profile
        </p>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(1.8rem,4vw,2.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          Edit your profile
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "3rem",
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          Update your company information. This is what workers see when they
          view your listings.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          <Section title="Company info">
            <div>
              <Label>Company name</Label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={inp}
              />
            </div>
            <div>
              <Label>Website</Label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                style={inp}
              />
            </div>
            <div>
              <Label>What does your business do?</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Brief description of your company, what you do, and the kind of people you're looking to hire..."
                style={{ ...inp, resize: "vertical", lineHeight: 1.7 }}
              />
            </div>
          </Section>

          <Section title="Industry">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  style={pill(industry === ind)}
                >
                  {ind}
                </button>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* ── STICKY SAVE BAR ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,15,30,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--navy-border)",
          padding: "1rem 2.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1 }}>
            {error && (
              <p style={{ color: "#f87171", fontSize: "0.82rem" }}>{error}</p>
            )}
            {success && (
              <p style={{ color: "var(--green)", fontSize: "0.82rem" }}>
                Profile saved successfully.
              </p>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !companyName || !description || !industry}
            style={{
              background: saving ? "rgba(79,124,255,0.5)" : "var(--accent)",
              color: "#fff",
              padding: "0.75rem 2rem",
              borderRadius: 10,
              fontFamily: "var(--sans)",
              fontWeight: 600,
              fontSize: "0.92rem",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.2s",
              opacity: !companyName || !description || !industry ? 0.5 : 1,
            }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
