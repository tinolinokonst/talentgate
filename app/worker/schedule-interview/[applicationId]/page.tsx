"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../../lib/supabase/client";

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
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  .fade{animation:fadeUp 0.5s ease forwards;}
  .slot-btn{
    background:rgba(255,255,255,0.03);border:1px solid var(--navy-border);
    border-radius:9px;padding:0.65rem 1rem;font-family:var(--sans);font-size:0.85rem;
    color:var(--text-secondary);cursor:pointer;transition:all 0.15s;text-align:center;
  }
  .slot-btn:hover{border-color:rgba(79,124,255,0.35);color:var(--text-primary);background:var(--accent-soft);}
  .slot-selected{background:var(--accent-soft)!important;border-color:rgba(79,124,255,0.6)!important;color:#a5b8ff!important;font-weight:500;}
`;

export default function ScheduleInterview() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.applicationId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const supabase = createClient();

  const availableDates = (() => {
    const dates: { value: string; label: string }[] = [];
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() + 1);
    let count = 0;
    let cursor = new Date(start);
    while (count < 14) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) {
        dates.push({
          value: cursor.toISOString().split("T")[0],
          label: cursor.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
        });
        count++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  })();

  const timeSlots = (() => {
    const slots: string[] = [];
    for (let h = 9; h <= 17; h++) {
      ["00", "30"].forEach((m) => {
        if (h === 17 && m === "30") return;
        slots.push(`${String(h).padStart(2, "0")}:${m}`);
      });
    }
    return slots;
  })();

  useEffect(() => {
    async function loadContext() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data: app, error: appErr } = await supabase
        .from("applications")
        .select(
          `id, worker_id, interview_status, job_listings (title, businesses (company_name))`
        )
        .eq("id", applicationId)
        .single();
      if (appErr || !app) {
        setError("Application not found.");
        setLoading(false);
        return;
      }
      if (app.worker_id !== user.id) {
        router.push("/worker/dashboard");
        return;
      }
      const blocked = ["scheduled", "in_progress", "completed"];
      if (blocked.includes(app.interview_status)) {
        router.push("/worker/dashboard");
        return;
      }
      const job = Array.isArray(app.job_listings)
        ? app.job_listings[0]
        : app.job_listings;
      const biz = job?.businesses
        ? Array.isArray(job.businesses)
          ? job.businesses[0]
          : job.businesses
        : null;
      setJobTitle(job?.title ?? "this role");
      setCompanyName(biz?.company_name ?? "the company");
      setLoading(false);
    }
    loadContext();
  }, [applicationId]);

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return;
    setSaving(true);
    setError("");
    const scheduledAt = new Date(
      `${selectedDate}T${selectedTime}:00`
    ).toISOString();
    const { error: ivErr } = await supabase
      .from("interviews")
      .update({ scheduled_at: scheduledAt, status: "scheduled" })
      .eq("application_id", applicationId);
    if (ivErr) {
      setError("Something went wrong. Please try again.");
      setSaving(false);
      return;
    }
    await supabase
      .from("applications")
      .update({ interview_status: "scheduled" })
      .eq("id", applicationId);
    router.push("/worker/dashboard");
  }

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0f1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{SS}</style>
        <p
          style={{
            color: "rgba(176,196,255,0.4)",
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
          background: "rgba(10,15,30,0.9)",
          backdropFilter: "blur(20px)",
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
          href="/worker/dashboard"
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "4rem 2rem" }}>
        <div className="fade">
          {/* Context card */}
          <div
            style={{
              background: "var(--navy-card)",
              border: "1px solid var(--navy-border)",
              borderRadius: 16,
              padding: "1.5rem 2rem",
              marginBottom: "2.5rem",
            }}
          >
            <p
              style={{
                color: "var(--accent)",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Interview invitation
            </p>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.35rem",
              }}
            >
              {jobTitle}
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                fontWeight: 300,
              }}
            >
              at {companyName}
            </p>
          </div>

          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            Choose your interview slot
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "2.5rem",
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Pick a date and time that works for you. Weekday slots, 9am – 5pm.
          </p>

          {/* Date selection */}
          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.9rem",
              }}
            >
              Select a date
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.6rem",
              }}
            >
              {availableDates.map((d) => (
                <button
                  key={d.value}
                  className={`slot-btn ${
                    selectedDate === d.value ? "slot-selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedDate(d.value);
                    setSelectedTime("");
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time selection */}
          {selectedDate && (
            <div style={{ marginBottom: "2.5rem" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.9rem",
                }}
              >
                Select a time
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    className={`slot-btn ${
                      selectedTime === t ? "slot-selected" : ""
                    }`}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected summary */}
          {selectedDate && selectedTime && (
            <div
              style={{
                background: "var(--accent-soft)",
                border: "1px solid rgba(79,124,255,0.25)",
                borderRadius: 12,
                padding: "1rem 1.25rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a5b8ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p
                style={{
                  color: "#a5b8ff",
                  fontSize: "0.9rem",
                  fontWeight: 400,
                }}
              >
                {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString(
                  "en-GB",
                  { weekday: "long", day: "numeric", month: "long" }
                )}{" "}
                at {selectedTime}
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
              }}
            >
              <p style={{ color: "#fca5a5", fontSize: "0.85rem" }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime || saving}
            style={{
              width: "100%",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              padding: "0.95rem",
              borderRadius: 10,
              fontFamily: "var(--sans)",
              fontSize: "1rem",
              fontWeight: 500,
              cursor:
                !selectedDate || !selectedTime || saving
                  ? "not-allowed"
                  : "pointer",
              opacity: !selectedDate || !selectedTime || saving ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            {saving ? "Confirming…" : "Confirm interview slot"}
          </button>
        </div>
      </div>
    </main>
  );
}
