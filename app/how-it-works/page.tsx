import Link from "next/link";

export default function HowItWorks() {
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
        .step-row { display: grid; grid-template-columns: 72px 1fr; gap: 2rem; padding: 2.5rem 0; border-top: 1px solid var(--navy-border); }
        .pill-tag {
          display: inline-block; font-size: 0.72rem; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 0.3rem 0.9rem; border-radius: 100px;
          font-weight: 500; margin-bottom: 2.5rem;
        }
        .divider { height: 1px; background: linear-gradient(to right, transparent, var(--navy-border), transparent); margin: 0 0 5rem; }
        .trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        @media (max-width: 768px) {
          .step-row { grid-template-columns: 48px 1fr; gap: 1.25rem; }
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
          .hide-mobile { display: none !important; }
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
          <Link href="/how-it-works" className="nav-link nav-link-active">
            How it works
          </Link>
          <Link href="/for-businesses" className="nav-link">
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
        }}
      >
        <span
          style={{
            background: "var(--accent-soft)",
            border: "1px solid rgba(79,124,255,0.2)",
            color: "#a5b8ff",
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
          How it works
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
          Two sides.
          <br />
          <span style={{ color: "var(--accent)" }}>One platform.</span>
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.7,
            maxWidth: 520,
            margin: "0 auto",
            fontWeight: 300,
          }}
        >
          Talentgate is built around trust and simplicity — for the businesses
          hiring and the people looking for work.
        </p>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── FOR BUSINESSES ── */}
      <section
        style={{ maxWidth: 860, margin: "0 auto", padding: "0 2.5rem 5rem" }}
      >
        <span
          className="pill-tag"
          style={{
            background: "var(--gold-soft)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "var(--gold)",
          }}
        >
          For businesses
        </span>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Start hiring in four steps.
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: 1.7,
            fontWeight: 300,
            marginBottom: "3rem",
            maxWidth: 500,
          }}
        >
          From account setup to your first verified applicant — the whole
          process is designed to be fast and straightforward.
        </p>

        <div>
          {[
            {
              step: "01",
              color: "var(--accent)",
              title: "Create your business account — $99",
              body: "Pay a one-time $99 fee to get your business set up on Talentgate. This covers your verified company profile and full access to the hiring dashboard.",
            },
            {
              step: "02",
              color: "var(--accent)",
              title: "Get your business verified",
              body: "We verify your company registration number against official business registries. Once approved, your listings carry a verified badge — so workers know you're a legitimate employer.",
            },
            {
              step: "03",
              color: "var(--accent)",
              title: "Post your roles — $49 each",
              body: "Describe the position in your own words. Tell workers what the role involves, what a typical day looks like, and what kind of person would thrive in it. The more genuine your listing, the better your applicants.",
            },
            {
              step: "04",
              color: "var(--accent)",
              title: "Review AI-interviewed applicants",
              body: "By the time a candidate reaches your dashboard, a first-round interview has already taken place between them and Claude. Once complete, you get a full summary, fit score, and standout moments — saving you time, money, and the pain of screening CVs.",
            },
          ].map((s) => (
            <div key={s.step} className="step-row">
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: s.color,
                  letterSpacing: "0.08em",
                  opacity: 0.5,
                  paddingTop: 5,
                }}
              >
                {s.step}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    marginBottom: "0.6rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.92rem",
                    lineHeight: 1.75,
                    fontWeight: 300,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <Link
            href="/auth/signup?role=business"
            className="btn-primary"
            style={{ fontSize: "0.95rem" }}
          >
            Start hiring — $99 to get started →
          </Link>
        </div>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── FOR WORKERS ── */}
      <section
        style={{ maxWidth: 860, margin: "0 auto", padding: "0 2.5rem 5rem" }}
      >
        <span
          className="pill-tag"
          style={{
            background: "var(--teal-soft)",
            border: "1px solid rgba(45,212,191,0.2)",
            color: "var(--teal)",
          }}
        >
          For workers
        </span>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Find work on your terms.
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: 1.7,
            fontWeight: 300,
            marginBottom: "3rem",
            maxWidth: 500,
          }}
        >
          Always free. No CV needed. Just you, your skills, and a fair shot at
          roles that match who you actually are.
        </p>

        <div>
          {[
            {
              step: "01",
              color: "var(--teal)",
              title: "Sign up for free",
              body: "Create your account at no cost. Talentgate is always free for people looking for work — no subscriptions, no fees, no catches.",
            },
            {
              step: "02",
              color: "var(--teal)",
              title: "Build your profile",
              body: "This isn't a CV. Tell us about your experience in your own words — the kinds of work you've done, what you've learned, and what you're genuinely good at. Businesses want to understand who you are, not read a formatted document.",
            },
            {
              step: "03",
              color: "var(--teal)",
              title: "Apply to verified roles",
              body: "Browse active listings from verified businesses. Every role on Talentgate is posted by a real, verified company. Apply directly — your profile speaks for you.",
            },
            {
              step: "04",
              color: "var(--teal)",
              title: "Complete your AI interview",
              body: "Once you apply, Claude — Anthropic's AI — conducts a structured first-round interview focused on how you think and communicate, not your job history. Schedule it at a time that suits you.",
            },
          ].map((s) => (
            <div key={s.step} className="step-row">
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: s.color,
                  letterSpacing: "0.08em",
                  opacity: 0.5,
                  paddingTop: 5,
                }}
              >
                {s.step}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    marginBottom: "0.6rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.92rem",
                    lineHeight: 1.75,
                    fontWeight: 300,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <Link
            href="/auth/signup?role=worker"
            className="btn-outline"
            style={{ fontSize: "0.95rem" }}
          >
            Create free account →
          </Link>
        </div>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── TRUST SECTION ── */}
      <section
        style={{
          maxWidth: 860,
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
          Trust is the foundation.
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            maxWidth: 480,
            margin: "0 auto 3rem",
            lineHeight: 1.7,
            fontWeight: 300,
            fontSize: "0.95rem",
          }}
        >
          Every account on Talentgate — business or worker — is verified before
          they can interact on the platform.
        </p>
        <div className="trust-grid">
          {[
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              ),
              label: "Company registry check",
              color: "var(--gold-soft)",
              border: "rgba(245,158,11,0.15)",
            },
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
              label: "Government ID verified",
              color: "var(--accent-soft)",
              border: "rgba(79,124,255,0.15)",
            },
            {
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--teal)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
              label: "Secure data handling",
              color: "var(--teal-soft)",
              border: "rgba(45,212,191,0.15)",
            },
            {
              icon: (
                <svg
                  width="20"
                  height="20"
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
              label: "Stripe Identity powered",
              color: "rgba(192,132,252,0.1)",
              border: "rgba(192,132,252,0.15)",
            },
          ].map((b) => (
            <div
              key={b.label}
              style={{
                background: b.color,
                border: `1px solid ${b.border}`,
                borderRadius: 16,
                padding: "2rem 1.25rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  marginBottom: "0.75rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {b.icon}
              </div>
              <div
                style={{
                  fontSize: "0.83rem",
                  color: "var(--text-secondary)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {b.label}
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
            The right opportunity is waiting.
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
            Whether you're looking for your next role or your next hire —
            Talentgate was built for you.
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
              I'm looking for work
            </Link>
            <Link
              href="/auth/signup?role=business"
              className="btn-outline"
              style={{ fontSize: "0.95rem", padding: "0.85rem 1.75rem" }}
            >
              I'm hiring
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
              href="/auth/login"
              style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
            >
              Sign up
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
