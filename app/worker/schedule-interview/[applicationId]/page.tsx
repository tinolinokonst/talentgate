"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "../../../../lib/supabase/client";

export default function ScheduleInterview() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.applicationId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Job + company context (shown to worker so they know what this is for)
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  // The worker's chosen date and time
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const supabase = createClient();

  // Build selectable dates: next 14 days, no weekends
  const availableDates = (() => {
    const dates: { value: string; label: string }[] = [];
    const now = new Date();
    // Start from tomorrow
    const start = new Date(now);
    start.setDate(start.getDate() + 1);

    let count = 0;
    let cursor = new Date(start);
    while (count < 14) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) {
        // Skip Sunday (0) and Saturday (6)
        const value = cursor.toISOString().split("T")[0]; // YYYY-MM-DD
        const label = cursor.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
        dates.push({ value, label });
        count++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  })();

  // Time slots: 09:00 – 17:30 in 30-minute increments
  const timeSlots = (() => {
    const slots: string[] = [];
    for (let h = 9; h <= 17; h++) {
      ["00", "30"].forEach((m) => {
        if (h === 17 && m === "30") return; // stop at 17:30
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

      // Fetch application + job + business for context
      const { data: app, error: appErr } = await supabase
        .from("applications")
        .select(
          `id, worker_id, interview_status,
           job_listings (
             title,
             businesses (company_name)
           )`
        )
        .eq("id", applicationId)
        .single();

      if (appErr || !app) {
        setError("Application not found.");
        setLoading(false);
        return;
      }

      // Make sure this application belongs to the current user
      if (app.worker_id !== user.id) {
        router.push("/worker/dashboard");
        return;
      }

      // If already scheduled or further along, skip to dashboard
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

    // Combine date + time into a UTC timestamptz
    // We store it as-is (local time awareness is out of scope for v1)
    const scheduledAt = new Date(
      `${selectedDate}T${selectedTime}:00`
    ).toISOString();

    // Update interviews row
    const { error: ivErr } = await supabase
      .from("interviews")
      .update({
        scheduled_at: scheduledAt,
        status: "scheduled",
      })
      .eq("application_id", applicationId);

    if (ivErr) {
      setError("Something went wrong saving your slot. Please try again.");
      setSaving(false);
      return;
    }

    // Update application interview_status
    await supabase
      .from("applications")
      .update({ interview_status: "scheduled" })
      .eq("id", applicationId);

    // Done — back to dashboard
    router.push("/worker/dashboard");
  }

  const canConfirm = selectedDate !== "" && selectedTime !== "";

  // ── Shared styles ──────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: "#111",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "1.5rem",
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
        <button
          onClick={() => router.push("/worker/dashboard")}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.6)",
            padding: "0.35rem 0.9rem",
            borderRadius: "980px",
            cursor: "pointer",
            fontFamily: "-apple-system, sans-serif",
            fontSize: "0.8rem",
          }}
        >
          ← Back
        </button>
      </nav>

      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "4rem 2rem",
        }}
      >
        {/* Context header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.75rem",
            }}
          >
            Next step
          </p>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            Schedule your interview
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            You applied for{" "}
            <strong style={{ color: "#f5f5f7" }}>{jobTitle}</strong> at{" "}
            <strong style={{ color: "#f5f5f7" }}>{companyName}</strong>. Pick a
            date and time for your AI first-round interview — it takes 20–30
            minutes and you'll get a link when the time comes.
          </p>
        </div>

        {/* What to expect */}
        <div style={{ ...cardStyle, marginBottom: "2rem" }}>
          <p
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            What to expect
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {[
              {
                icon: "◎",
                text: "A 20–30 minute chat with our AI interviewer.",
              },
              {
                icon: "◈",
                text: "Questions about your experience, how you think, and what you're good at.",
              },
              {
                icon: "✦",
                text: "No trick questions. Just a real conversation about you.",
              },
              {
                icon: "⊕",
                text: "The business receives a summary — they never see a transcript.",
              },
            ].map((item) => (
              <div
                key={item.icon}
                style={{
                  display: "flex",
                  gap: "0.85rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "0.85rem",
                    marginTop: 2,
                    minWidth: 14,
                  }}
                >
                  {item.icon}
                </span>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Date picker */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Choose a date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "0.9rem 1rem",
              color: selectedDate ? "#f5f5f7" : "rgba(255,255,255,0.35)",
              fontSize: "0.95rem",
              outline: "none",
              fontFamily: "-apple-system, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="" style={{ background: "#111" }}>
              Select a date…
            </option>
            {availableDates.map((d) => (
              <option
                key={d.value}
                value={d.value}
                style={{ background: "#111" }}
              >
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time picker — only shown once a date is chosen */}
        {selectedDate && (
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Choose a time
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "980px",
                    border:
                      selectedTime === slot
                        ? "1px solid rgba(255,255,255,0.6)"
                        : "1px solid rgba(255,255,255,0.1)",
                    background:
                      selectedTime === slot
                        ? "rgba(255,255,255,0.12)"
                        : "transparent",
                    color:
                      selectedTime === slot
                        ? "#f5f5f7"
                        : "rgba(255,255,255,0.45)",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontFamily: "-apple-system, sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(255,60,60,0.1)",
              border: "1px solid rgba(255,60,60,0.2)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              color: "#ff6b6b",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Confirmation summary */}
        {canConfirm && (
          <div
            style={{
              ...cardStyle,
              marginBottom: "1.5rem",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <p
              style={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Your slot
            </p>
            <p
              style={{
                fontSize: "1.05rem",
                fontWeight: 500,
                color: "#f5f5f7",
              }}
            >
              {availableDates.find((d) => d.value === selectedDate)?.label} at{" "}
              {selectedTime}
            </p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={!canConfirm || saving}
          style={{
            width: "100%",
            padding: "0.95rem",
            borderRadius: "980px",
            background:
              canConfirm && !saving ? "#fff" : "rgba(255,255,255,0.1)",
            color: canConfirm && !saving ? "#000" : "rgba(255,255,255,0.25)",
            border: "none",
            fontWeight: 500,
            fontSize: "0.95rem",
            cursor: canConfirm && !saving ? "pointer" : "not-allowed",
            fontFamily: "-apple-system, sans-serif",
            transition: "all 0.2s",
          }}
        >
          {saving ? "Confirming…" : "Confirm interview slot →"}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.78rem",
            marginTop: "1rem",
          }}
        >
          All times are in your local timezone.
        </p>
      </div>
    </main>
  );
}
