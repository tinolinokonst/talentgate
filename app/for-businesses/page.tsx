import Link from "next/link";

export default function ForBusinesses() {
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
          <Link href="/for-businesses" className="nav-link nav-link-active">
            For businesses
          </Link>
          <Link href="/for-workers" className="nav-link">
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
              "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            background: "var(--gold-soft)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "var(--gold)",
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
          For businesses
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
          Hire people, not
          <br />
          <span style={{ color: "var(--accent)" }}>paper.</span>
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
          Talentgate replaces CV screening with AI-powered interviews — so you
          spend less time reading documents and more time meeting people worth
          hiring.
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
            href="/auth/signup?role=business"
            className="btn-primary"
            style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
          >
            Get started — $99
          </Link>
          <Link
            href="/pricing"
            className="btn-outline"
            style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
          >
            See pricing
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
          CVs don't tell you who to hire.
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
          Traditional hiring filters on job titles and degree names — not on
          whether someone can actually do the job. You end up interviewing the
          wrong people and missing the right ones.
        </p>
        <div className="grid-3">
          {[
            {
              icon: "📄",
              title: "CVs filter on formatting",
              desc: "A well-formatted CV tells you someone knows how to write a CV. It tells you almost nothing about whether they can do the job.",
            },
            {
              icon: "⏳",
              title: "Screening is slow and manual",
              desc: "Reading through applications one by one is time-consuming. Most businesses don't have that time — so great candidates get overlooked.",
            },
            {
              icon: "🎭",
              title: "Interviews reward performance",
              desc: "Traditional interviews favour people who are good at interviews — not necessarily people who are good at the job.",
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <div style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
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
          Every applicant, already interviewed.
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
          By the time a candidate reaches your dashboard, Claude has already
          conducted a structured first-round interview. You see the summary, the
          fit score, and the standout moments — before you spend a single minute
          of your time.
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
                  stroke="#4f7cff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ),
              bg: "var(--accent-soft)",
              title: "AI-powered first-round interviews",
              desc: "Claude — Anthropic's AI — interviews every applicant on how they think, communicate, and approach problems. Not their job history. You get a structured summary for every single candidate.",
            },
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
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              bg: "var(--teal-soft)",
              title: "Fit scores and candidate summaries",
              desc: "Each applicant gets a fit score, a recommendation, and a breakdown of traits, relevant experience, and standout moments. Decide who to progress in seconds, not hours.",
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
              bg: "var(--gold-soft)",
              title: "Real skill profiles, not CVs",
              desc: "Workers build profiles around what they're genuinely good at — not a list of previous job titles. You see the person, not the document.",
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              bg: "rgba(192,132,252,0.1)",
              title: "Verified company badge",
              desc: "Your business is verified against official registries. Workers trust verified employers — which means better, more serious applicants for your roles.",
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
          href="/auth/signup?role=business"
          className="btn-primary"
          style={{ fontSize: "0.95rem" }}
        >
          Start hiring today →
        </Link>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── PRICING SUMMARY ── */}
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
          Simple, transparent pricing.
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
          No subscription. No hidden fees. Pay once to get set up, then only
          when you're ready to hire.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          {[
            {
              amount: "$99",
              label: "One-time account setup",
              color: "var(--accent)",
              bg: "var(--accent-soft)",
              border: "rgba(79,124,255,0.2)",
            },
            {
              amount: "$49",
              label: "Per role posted",
              color: "var(--gold)",
              bg: "var(--gold-soft)",
              border: "rgba(245,158,11,0.2)",
            },
          ].map((p) => (
            <div
              key={p.label}
              style={{
                background: p.bg,
                border: `1px solid ${p.border}`,
                borderRadius: 16,
                padding: "2rem 3rem",
                minWidth: 200,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: p.color,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {p.amount}
              </div>
              <div
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  fontWeight: 300,
                }}
              >
                {p.label}
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/pricing"
          style={{ color: "var(--accent)", fontSize: "0.9rem" }}
        >
          See full pricing details →
        </Link>
      </section>

      {/* ── CTA ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto 5rem", padding: "0 2.5rem" }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(79,124,255,0.12) 0%, rgba(45,212,191,0.08) 100%)",
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
            Your next great hire is already out there.
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
            Stop filtering CVs. Start meeting people who can actually do the
            job.
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
              href="/auth/signup?role=business"
              className="btn-primary"
              style={{ fontSize: "0.95rem", padding: "0.85rem 1.75rem" }}
            >
              Get started — $99
            </Link>
            <Link
              href="/how-it-works"
              className="btn-outline"
              style={{ fontSize: "0.95rem", padding: "0.85rem 1.75rem" }}
            >
              See how it works
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
              href="/for-workers"
              style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
            >
              For workers
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
