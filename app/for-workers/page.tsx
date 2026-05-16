import Link from "next/link";

export default function ForWorkers() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        color: "#f0f4ff",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #0a0f1e;
          --navy-card: #161d30;
          --navy-border: rgba(99,130,255,0.12);
          --accent: #4f7cff;
          --accent-soft: rgba(79,124,255,0.12);
          --teal: #2dd4bf;
          --teal-soft: rgba(45,212,191,0.1);
          --gold: #f59e0b;
          --gold-soft: rgba(245,158,11,0.1);
          --text-primary: #f0f4ff;
          --text-secondary: rgba(176,196,255,0.7);
          --text-muted: rgba(176,196,255,0.4);
          --serif: 'Playfair Display', Georgia, serif;
          --sans: 'DM Sans', -apple-system, sans-serif;
        }
        a { text-decoration: none; color: inherit; }
        .nav-link { color: var(--text-secondary); font-size: 0.9rem; transition: color 0.2s; }
        .nav-link:hover { color: var(--text-primary); }
        .nav-link-active { color: var(--text-primary); font-weight: 500; }
        .btn-primary {
          background: var(--accent); color: #fff; padding: 0.75rem 1.75rem;
          border-radius: 8px; font-size: 0.95rem; font-weight: 500;
          border: none; cursor: pointer; transition: all 0.2s; display: inline-block;
        }
        .btn-primary:hover { background: #3d6aee; transform: translateY(-1px); }
        .btn-outline {
          background: transparent; color: var(--text-primary); padding: 0.75rem 1.75rem;
          border-radius: 8px; font-size: 0.95rem; font-weight: 500;
          border: 1px solid var(--navy-border); cursor: pointer; transition: all 0.2s; display: inline-block;
        }
        .btn-outline:hover { border-color: rgba(79,124,255,0.4); background: var(--accent-soft); }
        .card {
          background: var(--navy-card); border: 1px solid var(--navy-border);
          border-radius: 16px; padding: 2rem; transition: all 0.25s;
        }
        .card:hover { border-color: rgba(79,124,255,0.28); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
        .divider { height: 1px; background: linear-gradient(to right, transparent, var(--navy-border), transparent); }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .stat-line { width: 32px; height: 3px; border-radius: 2px; display: inline-block; vertical-align: middle; margin-right: 10px; }
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .hide-mobile { display: none !important; }
          .hero-btns { flex-direction: column; align-items: stretch !important; }
        }
      `}</style>

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
          background: "rgba(10,15,30,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--navy-border)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          Talentgate
        </Link>
        <div className="hide-mobile" style={{ display: "flex", gap: "2rem" }}>
          <Link href="/how-it-works" className="nav-link">
            How it works
          </Link>
          <Link href="/for-businesses" className="nav-link">
            For businesses
          </Link>
          <Link href="/for-workers" className="nav-link nav-link-active">
            For workers
          </Link>
          <Link href="/pricing" className="nav-link">
            Pricing
          </Link>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link
            href="/auth/login"
            className="btn-outline"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.88rem" }}
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="btn-primary"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.88rem" }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "7rem 2.5rem 5rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(45,212,191,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            background: "var(--teal-soft)",
            border: "1px solid rgba(45,212,191,0.2)",
            color: "var(--teal)",
            fontSize: "0.75rem",
            fontWeight: 500,
            padding: "0.3rem 0.9rem",
            borderRadius: "100px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            display: "inline-block",
            marginBottom: "1.5rem",
          }}
        >
          For workers
        </span>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}
        >
          You're more than
          <br />
          <span style={{ color: "var(--teal)" }}>your CV.</span>
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.7,
            maxWidth: 540,
            margin: "0 auto 2.5rem",
            fontWeight: 300,
          }}
        >
          Talentgate gives you a real shot at roles that match who you actually
          are — not just what fits on a page. Always free. No CV required.
        </p>
        <div
          className="hero-btns"
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/auth/signup?role=worker"
            className="btn-primary"
            style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
          >
            Create free account
          </Link>
          <Link
            href="/how-it-works"
            className="btn-outline"
            style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
          >
            See how it works
          </Link>
        </div>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── THE PROBLEM ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2.5rem 5rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <span className="stat-line" style={{ background: "var(--gold)" }} />
          <span
            style={{
              color: "var(--gold)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            The problem
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          The CV system is broken.
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: "3rem",
            fontWeight: 300,
          }}
        >
          Great candidates get filtered out before anyone has spoken to them —
          based on job titles, gaps, and degree names that say nothing about
          what they can actually do.
        </p>
        <div className="grid-3">
          {[
            {
              icon: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              ),
              title: "CVs reward formatting",
              desc: "The best CV writers aren't always the best workers. The format filters on presentation, not capability.",
            },
            {
              icon: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 9l6 6M15 9l-6 6" />
                </svg>
              ),
              title: "You never get the chance",
              desc: "Most applications are screened out before a human even reads them. You don't get to show what you're actually made of.",
            },
            {
              icon: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              ),
              title: "Experience locks you in",
              desc: "If you don't have the exact job titles they're looking for, you're out — even if you have every skill they need.",
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <div
                style={{
                  marginBottom: "1rem",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--gold-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "0.6rem",
                  color: "var(--text-primary)",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── THE SOLUTION ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2.5rem 5rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <span className="stat-line" style={{ background: "var(--teal)" }} />
          <span
            style={{
              color: "var(--teal)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            The Talentgate way
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          A fair shot, every time.
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: "3rem",
            fontWeight: 300,
          }}
        >
          Instead of screening CVs, Talentgate gives every applicant the same
          structured first-round interview — powered by Claude, Anthropic's AI.
          Your skills and how you think speak louder than your job history.
        </p>
        <div className="grid-2" style={{ marginBottom: "2.5rem" }}>
          {[
            {
              icon: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ),
              bg: "var(--teal-soft)",
              title: "An interview that actually listens",
              desc: "Claude conducts a structured conversation focused on how you think, communicate, and approach real problems. Not your job titles. Not your degree. You.",
            },
            {
              icon: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f7cff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ),
              bg: "var(--accent-soft)",
              title: "A profile built around real skills — not a CV",
              desc: "You don't need a CV to apply on Talentgate. Instead, you build a profile in your own words — your skills, your experience, what you're genuinely good at. A CV is still an option if you want to upload one, but it's never required. Businesses see who you are, not a formatted document.",
            },
            {
              icon: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ),
              bg: "var(--gold-soft)",
              title: "Only verified businesses",
              desc: "Every company on Talentgate has been verified against official registries. No fake listings, no ghost jobs. Every role you apply to is real.",
            },
            {
              icon: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
              bg: "rgba(192,132,252,0.1)",
              title: "You choose when to interview",
              desc: "Schedule your AI interview at a time that works for you. No coordinating with recruiters, no chasing emails. Pick a slot and show up.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="card"
              style={{
                display: "flex",
                gap: "1.25rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: f.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    fontWeight: 300,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/auth/signup?role=worker"
          className="btn-primary"
          style={{ fontSize: "0.95rem" }}
        >
          Create your free profile →
        </Link>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── ALWAYS FREE ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 2.5rem 5rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Free. Forever.
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            maxWidth: 440,
            margin: "0 auto 3rem",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Finding work should never cost money. Talentgate is completely free
          for workers — no subscriptions, no hidden fees, no catches.
        </p>
        <div
          className="grid-3"
          style={{ maxWidth: 860, margin: "0 auto 2.5rem" }}
        >
          {[
            {
              label: "Create your account",
              color: "var(--teal)",
              bg: "var(--teal-soft)",
              border: "rgba(45,212,191,0.15)",
            },
            {
              label: "Build your profile",
              color: "var(--accent)",
              bg: "var(--accent-soft)",
              border: "rgba(79,124,255,0.15)",
            },
            {
              label: "Apply to roles",
              color: "var(--gold)",
              bg: "var(--gold-soft)",
              border: "rgba(245,158,11,0.15)",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 16,
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: s.color,
                  marginBottom: "0.5rem",
                }}
              >
                $0
              </div>
              <div
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  fontWeight: 300,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto 5rem", padding: "0 2.5rem" }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(79,124,255,0.12) 100%)",
            border: "1px solid var(--navy-border)",
            borderRadius: 20,
            padding: "3.5rem 3rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Your next role is out there.
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              maxWidth: 480,
              margin: "0 auto 2rem",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Stop sending CVs into the void. Create your free profile and let
            your actual abilities speak for themselves.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/auth/signup?role=worker"
              className="btn-primary"
              style={{ fontSize: "0.95rem", padding: "0.85rem 1.75rem" }}
            >
              Create free account
            </Link>
            <Link
              href="/for-businesses"
              className="btn-outline"
              style={{ fontSize: "0.95rem", padding: "0.85rem 1.75rem" }}
            >
              For businesses
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid var(--navy-border)",
          padding: "2.5rem 2.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--serif)",
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            Talentgate
          </span>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link
              href="/for-businesses"
              style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
            >
              For businesses
            </Link>
            <Link
              href="/how-it-works"
              style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
            >
              Pricing
            </Link>
          </div>
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            © 2026 Talentgate
          </span>
        </div>
      </footer>
    </main>
  );
}
