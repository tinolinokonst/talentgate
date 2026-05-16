import Link from "next/link";

export default function Pricing() {
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
        .divider { height: 1px; background: linear-gradient(to right, transparent, var(--navy-border), transparent); }
        .feature-row { padding: 1.1rem 0; border-top: 1px solid var(--navy-border); display: flex; gap: 0.75rem; align-items: flex-start; }
        .faq-row { padding: 1.8rem 0; border-top: 1px solid var(--navy-border); }
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr; }
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
          <Link href="/how-it-works" className="nav-link">
            How it works
          </Link>
          <Link href="/for-businesses" className="nav-link">
            For businesses
          </Link>
          <Link href="/for-workers" className="nav-link">
            For workers
          </Link>
          <Link href="/pricing" className="nav-link nav-link-active">
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
          Pricing
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
          Simple. <span style={{ color: "var(--accent)" }}>Transparent.</span>
          <br />
          Fair.
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 auto",
            fontWeight: 300,
          }}
        >
          Straightforward pricing for businesses. Always free for workers. No
          hidden costs, no surprises.
        </p>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── PRICING CARDS ── */}
      <section
        style={{ maxWidth: 860, margin: "0 auto", padding: "0 2.5rem 5rem" }}
      >
        <div className="pricing-grid">
          {/* Worker card */}
          <div
            style={{
              background: "var(--navy-card)",
              border: "1px solid var(--navy-border)",
              borderRadius: 20,
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--teal)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 500,
                marginBottom: "1.5rem",
              }}
            >
              For workers
            </p>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontSize: "4rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "0.5rem",
                color: "var(--text-primary)",
              }}
            >
              Free
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "2rem",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Finding work should never cost money. Talentgate is free for job
              seekers — forever.
            </p>

            <div style={{ flex: 1, marginBottom: "2rem" }}>
              {[
                {
                  title: "Verified identity badge",
                  desc: "A quick ID check that builds trust with employers.",
                },
                {
                  title: "Full experience profile",
                  desc: "Tell your story in your own words — no CV needed.",
                },
                {
                  title: "Browse all active roles",
                  desc: "See every live listing from verified businesses.",
                },
                {
                  title: "Unlimited applications",
                  desc: "Apply to as many roles as you want, no limits.",
                },
                {
                  title: "AI first-round interview",
                  desc: "Claude conducts your interview — fair, structured, no bias.",
                },
                {
                  title: "Application tracking",
                  desc: "See the status of every role you've applied to.",
                },
              ].map((f) => (
                <div key={f.title} className="feature-row">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup?role=worker"
              className="btn-outline"
              style={{ textAlign: "center", fontSize: "0.9rem" }}
            >
              Create free account
            </Link>
          </div>

          {/* Business card */}
          <div
            style={{
              background: "var(--navy-card)",
              border: "1px solid rgba(79,124,255,0.4)",
              borderRadius: 20,
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-1px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--accent)",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "0.25rem 0.9rem",
                borderRadius: "0 0 8px 8px",
                whiteSpace: "nowrap",
              }}
            >
              For businesses
            </div>

            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--gold)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 500,
                marginBottom: "1.5rem",
                marginTop: "0.5rem",
              }}
            >
              Business account
            </p>

            {/* Pricing breakdown */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "2.8rem",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "var(--text-primary)",
                  }}
                >
                  $99
                </span>
                <span
                  style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                >
                  one-time setup
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    height: 1,
                    width: 20,
                    background: "var(--navy-border)",
                  }}
                />
                <span
                  style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
                >
                  then
                </span>
                <div
                  style={{
                    height: 1,
                    width: 20,
                    background: "var(--navy-border)",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "2.8rem",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "var(--text-primary)",
                  }}
                >
                  $25
                </span>
                <span
                  style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                >
                  /month platform access
                </span>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--gold-soft)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "var(--gold)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  padding: "0.25rem 0.75rem",
                  borderRadius: 100,
                  width: "fit-content",
                }}
              >
                + $49 per role posted
              </div>
            </div>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.88rem",
                marginBottom: "1.5rem",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              One-time setup to get verified and access the platform. Then
              $25/month to keep your account active, plus $49 each time you post
              a new role.
            </p>

            <div style={{ flex: 1, marginBottom: "2rem" }}>
              {[
                {
                  title: "Verified company badge",
                  desc: "Your company checked against official registries.",
                },
                {
                  title: "Full hiring dashboard",
                  desc: "Manage all your roles and applicants in one place.",
                },
                {
                  title: "Talent directory access",
                  desc: "Search and browse worker profiles by skill and location.",
                },
                {
                  title: "Role postings — $49 each",
                  desc: "Pay per role when you're ready to hire. No lock-in.",
                },
                {
                  title: "AI-interviewed candidates",
                  desc: "Every applicant completes a Claude-powered first-round interview.",
                },
                {
                  title: "AI candidate summaries",
                  desc: "Fit scores, traits, and standout moments for each applicant.",
                },
              ].map((f) => (
                <div key={f.title} className="feature-row">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup?role=business"
              className="btn-primary"
              style={{ textAlign: "center", fontSize: "0.9rem" }}
            >
              Get started — $99 →
            </Link>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginTop: "5rem" }}>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(1.6rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            Common questions
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              marginBottom: "2.5rem",
              fontWeight: 300,
            }}
          >
            Everything you need to know before signing up.
          </p>
          <div>
            {[
              {
                q: "Is it really free for workers?",
                a: "Yes, completely. Workers never pay anything to use Talentgate — not to sign up, not to apply, not ever.",
              },
              {
                q: "What does the $99 cover?",
                a: "It covers your one-time business account setup — including verification, dashboard access, and your company profile. After that you pay $25/month to keep your account active.",
              },
              {
                q: "What does the $25/month cover?",
                a: "The monthly fee keeps your business account active on the platform — giving you access to the hiring dashboard, talent directory, and all applicant data. You only pay $49 on top of that when you choose to post a new role.",
              },
              {
                q: "Can I cancel the monthly subscription?",
                a: "Yes, anytime. When you cancel, your account is paused at the end of the billing period. Your data is retained so you can reactivate whenever you're ready to hire again.",
              },
              {
                q: "How long does business verification take?",
                a: "Most businesses are verified within a few hours. We check your registration number against official company registries automatically.",
              },
              {
                q: "How does the AI interview work?",
                a: "When a worker applies to your role, they complete a structured first-round interview with Claude — Anthropic's AI. It focuses on how they think and communicate, not their job history. You receive a full summary and fit score for each candidate.",
              },
            ].map((faq) => (
              <div key={faq.q} className="faq-row">
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    marginBottom: "0.6rem",
                  }}
                >
                  {faq.q}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
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
            Ready to get started?
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
            Join Talentgate today — whether you're hiring or looking for work.
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
              href="/auth/signup?role=worker"
              className="btn-outline"
              style={{ fontSize: "0.95rem", padding: "0.85rem 1.75rem" }}
            >
              Find work — Free
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
              href="/how-it-works"
              style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
            >
              How it works
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
