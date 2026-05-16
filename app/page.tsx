"use client";

import Link from "next/link";

export default function Home() {
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
          --navy-mid: #111827;
          --navy-card: #161d30;
          --navy-border: rgba(99,130,255,0.12);
          --accent: #4f7cff;
          --accent-soft: rgba(79,124,255,0.15);
          --accent-mid: rgba(79,124,255,0.25);
          --teal: #2dd4bf;
          --teal-soft: rgba(45,212,191,0.12);
          --gold: #f59e0b;
          --gold-soft: rgba(245,158,11,0.12);
          --text-primary: #f0f4ff;
          --text-secondary: rgba(176,196,255,0.7);
          --text-muted: rgba(176,196,255,0.4);
          --serif: 'Playfair Display', Georgia, serif;
          --sans: 'DM Sans', -apple-system, sans-serif;
        }
        a { text-decoration: none; color: inherit; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
        .nav-link { color: var(--text-secondary); font-size: 0.9rem; font-weight: 400; transition: color 0.2s; letter-spacing: 0.01em; }
        .nav-link:hover { color: var(--text-primary); }
        .btn-primary {
          background: var(--accent);
          color: #fff;
          padding: 0.75rem 1.75rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-block;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: #3d6aee; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(79,124,255,0.3); }
        .btn-outline {
          background: transparent;
          color: var(--text-primary);
          padding: 0.75rem 1.75rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          border: 1px solid var(--navy-border);
          cursor: pointer;
          transition: all 0.2s;
          display: inline-block;
        }
        .btn-outline:hover { border-color: rgba(79,124,255,0.4); background: var(--accent-soft); }
        .card {
          background: var(--navy-card);
          border: 1px solid var(--navy-border);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.25s;
        }
        .card:hover { border-color: rgba(79,124,255,0.28); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
        .pill {
          background: var(--accent-soft);
          border: 1px solid rgba(79,124,255,0.2);
          color: #a5b8ff;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.3rem 0.9rem;
          border-radius: 100px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          display: inline-block;
        }
        .stat-line {
          width: 32px;
          height: 3px;
          border-radius: 2px;
          background: var(--accent);
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
        }
        .icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          flex-shrink: 0;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, var(--navy-border), transparent);
          margin: 5rem 0;
        }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .hero-btns { flex-direction: column; align-items: stretch !important; }
          .hide-mobile { display: none; }
          .cv-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
        .glow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 8px var(--teal);
          animation: shimmer 2s infinite;
          display: inline-block;
          margin-right: 8px;
          flex-shrink: 0;
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
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          Talentgate
        </span>
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
          <Link href="/pricing" className="nav-link">
            Pricing
          </Link>
          <a href="#pricing" className="nav-link">
            Pricing
          </a>
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
        {/* Background orb */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(79,124,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <h1
          className="fade-up fade-up-1"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          Where great work
          <br />
          <span style={{ color: "var(--accent)" }}>finds great people.</span>
        </h1>

        <p
          className="fade-up fade-up-2"
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 2.5rem",
            fontWeight: 300,
          }}
        >
          Talentgate connects ambitious talent with forward-thinking businesses
          — through a smarter, interview-first hiring process.
        </p>

        <div
          className="fade-up fade-up-3 hero-btns"
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
            Find your next role
          </Link>
          <Link
            href="/auth/signup?role=business"
            className="btn-outline"
            style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
          >
            Hire top talent
          </Link>
        </div>

        {/* Live stats bar */}
        <div
          className="fade-up fade-up-3"
          style={{
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            marginTop: "4rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Active roles", value: "200+" },
            { label: "Verified companies", value: "85+" },
            { label: "Countries", value: "12" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontFamily: "var(--serif)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: "0.2rem",
                  letterSpacing: "0.04em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── CV SECTION ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2.5rem 5rem" }}
      >
        <div
          className="cv-grid"
          style={{
            background: "var(--navy-card)",
            border: "1px solid var(--navy-border)",
            borderRadius: 20,
            padding: "3.5rem 3rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left — the problem */}
          <div>
            <span
              style={{
                color: "var(--gold)",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              The problem with CVs
            </span>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "1.25rem",
              }}
            >
              Your best qualities don't fit on a page.
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.75,
                fontWeight: 300,
                marginBottom: "1rem",
              }}
            >
              CVs reward formatting, not capability. They filter out great
              candidates before a single conversation has happened — based on
              job titles, degree names, and gaps that tell you nothing about
              what someone can actually do.
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Businesses miss out on real talent. Workers never get the chance
              to prove themselves. Everyone loses.
            </p>
          </div>

          {/* Right — the solution */}
          <div>
            <span
              style={{
                color: "var(--teal)",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              The Talentgate way
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {[
                {
                  title: "An interview that actually listens",
                  desc: "Claude — Anthropic's AI — conducts a structured first-round interview focused on how you think, communicate, and approach real problems. Not your job history.",
                },
                {
                  title: "A profile built around real skills",
                  desc: "Workers showcase what they're genuinely good at. Businesses see the person behind the application — not just a list of previous employers.",
                },
                {
                  title: "Fairer for workers, better for business",
                  desc: "When hiring is based on actual ability, the right people get hired. It's a better outcome for everyone at the table.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--teal)",
                      flexShrink: 0,
                      marginTop: "0.45rem",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR WORKERS ── */}
      <section
        id="for-workers"
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
            For workers
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
          Your career, your terms.
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: 500,
            lineHeight: 1.7,
            marginBottom: "3rem",
            fontWeight: 300,
          }}
        >
          Browse verified roles across industries, apply in one click, and
          schedule interviews on your schedule.
        </p>

        <div className="grid-3" style={{ marginBottom: "2.5rem" }}>
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
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              ),
              bg: "var(--accent-soft)",
              title: "Browse verified roles",
              desc: "Every listing comes from a verified business. No ghosting, no fake posts.",
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
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
              bg: "var(--teal-soft)",
              title: "Choose your interview slot",
              desc: "Pick a time that suits you. No back-and-forth, no chasing emails.",
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
              title: "Track every application",
              desc: "Your dashboard keeps every application, status, and next step in one place.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="icon-box" style={{ background: f.bg }}>
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

        <Link
          href="/auth/signup?role=worker"
          className="btn-primary"
          style={{ fontSize: "0.95rem" }}
        >
          Create your worker profile →
        </Link>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── FOR BUSINESSES ── */}
      <section
        id="for-businesses"
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
            For businesses
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
          Hire with confidence.
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            maxWidth: 500,
            lineHeight: 1.7,
            marginBottom: "3rem",
            fontWeight: 300,
          }}
        >
          Post roles, review candidates with AI-powered summaries, and manage
          your entire pipeline from one dashboard.
        </p>

        <div className="grid-2">
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
              bg: "var(--accent-soft)",
              title: "Smart applicant profiles",
              desc: "Each candidate comes with an AI-generated summary — skills, experience highlights, and a fit score — so you spend less time reading, more time deciding.",
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
              title: "Live pipeline tracking",
              desc: "See every applicant's stage in real time — from application through interview to decision. Full visibility, zero spreadsheets.",
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
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              ),
              bg: "var(--gold-soft)",
              title: "Post and manage roles",
              desc: "Create detailed job listings with salary ranges, work type, and qualifications. Go live in under five minutes.",
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
              desc: "Verified businesses attract more quality candidates. Our trust process is fast and straightforward.",
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
                className="icon-box"
                style={{ background: f.bg, marginBottom: 0 }}
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

        <div style={{ marginTop: "2.5rem" }}>
          <Link
            href="/auth/signup?role=business"
            className="btn-primary"
            style={{ fontSize: "0.95rem" }}
          >
            Start hiring today →
          </Link>
        </div>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2.5rem 5rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="pill" style={{ marginBottom: "1rem" }}>
            Simple by design
          </span>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginTop: "1rem",
            }}
          >
            How Talentgate works
          </h2>
        </div>

        <div className="grid-3">
          {[
            {
              num: "01",
              title: "Create your profile",
              desc: "Workers build a rich profile with skills and experience. Businesses set up their company page in minutes.",
              accent: "var(--accent)",
            },
            {
              num: "02",
              title: "Connect",
              desc: "Workers browse and apply to verified roles. Businesses review applicants with AI-powered insights.",
              accent: "var(--teal)",
            },
            {
              num: "03",
              title: "Meet",
              desc: "Schedule interviews at a time that works for everyone. The platform handles coordination automatically.",
              accent: "var(--gold)",
            },
          ].map((s) => (
            <div
              key={s.num}
              className="card"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <div
                style={{
                  fontSize: "3.5rem",
                  fontFamily: "var(--serif)",
                  fontWeight: 700,
                  color: s.accent,
                  opacity: 0.12,
                  position: "absolute",
                  top: "1rem",
                  right: "1.25rem",
                  lineHeight: 1,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: s.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Step {s.num}
              </div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  marginBottom: "0.6rem",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.88rem",
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ margin: "0 2.5rem 5rem" }} />

      {/* ── PRICING ── */}
      <section
        id="pricing"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2.5rem 5rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="pill" style={{ marginBottom: "1rem" }}>
            Pricing
          </span>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginTop: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            Simple, transparent pricing.
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            No subscriptions. No hidden fees. Pay once to get set up, then only
            when you're ready to hire.
          </p>
        </div>

        <div className="grid-2" style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Card 1 — Account */}
          <div
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "0.75rem",
                }}
              >
                Business account
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.35rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "3rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  $99
                </span>
                <span
                  style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
                >
                  one-time
                </span>
              </div>
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.65,
                fontWeight: 300,
              }}
            >
              Get your business set up on Talentgate. Includes your verified
              company profile and access to the hiring dashboard.
            </p>
            <div
              style={{
                borderTop: "1px solid var(--navy-border)",
                paddingTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[
                "Verified company badge",
                "Business dashboard access",
                "Applicant pipeline management",
                "AI-powered candidate summaries",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      fontWeight: 300,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/auth/signup?role=business"
              className="btn-outline"
              style={{
                marginTop: "auto",
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              Create business account
            </Link>
          </div>

          {/* Card 2 — Per role, featured */}
          <div
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              border: "1px solid rgba(79,124,255,0.4)",
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
              }}
            >
              Per role
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "0.75rem",
                }}
              >
                Role posting
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.35rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "3rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  $49
                </span>
                <span
                  style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
                >
                  per listing
                </span>
              </div>
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.65,
                fontWeight: 300,
              }}
            >
              Post a role and start receiving AI-interviewed candidates. Only
              pay when you're actively hiring.
            </p>
            <div
              style={{
                borderTop: "1px solid var(--navy-border)",
                paddingTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[
                "Unlimited applicants per role",
                "AI first-round interviews included",
                "Full candidate profiles & summaries",
                "Role live until filled or closed",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      fontWeight: 300,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/auth/signup?role=business"
              className="btn-primary"
              style={{
                marginTop: "auto",
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              Start hiring today →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
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
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              background:
                "radial-gradient(circle, rgba(79,124,255,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <span className="pill" style={{ marginBottom: "1.25rem" }}>
            Ready to get started?
          </span>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginTop: "1rem",
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
            <Link href="/auth/login" className="nav-link">
              Log in
            </Link>
            <Link href="/auth/signup" className="nav-link">
              Sign up
            </Link>
          </div>
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            © 2025 Talentgate
          </span>
        </div>
      </footer>
    </main>
  );
}
