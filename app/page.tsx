import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        background: "#000",
        minHeight: "100vh",
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#f5f5f7",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
        .tg-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(5rem, 14vw, 13rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0;
          padding-bottom: 0.15em;
          background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tg-title span {
          font-style: normal;
        }
        .tg-logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          font-style: normal;
          letter-spacing: 0.01em;
          text-decoration: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
        }
        .tg-stat-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 2rem",
          height: "52px",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link
            href="/how-it-works"
            style={{
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontSize: "0.85rem",
            }}
          >
            How it works
          </Link>
          <Link
            href="/pricing"
            style={{
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontSize: "0.85rem",
            }}
          >
            Pricing
          </Link>
        </div>
        <Link href="/" className="tg-logo">
          Talentgate
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            justifyContent: "flex-end",
          }}
        >
          <Link
            href="/auth/login"
            style={{
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontSize: "0.85rem",
            }}
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            style={{
              background: "#fff",
              color: "#000",
              padding: "0.4rem 1rem",
              borderRadius: "980px",
              fontSize: "0.85rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "8rem 2rem 4rem",
          position: "relative",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-block",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "980px",
            padding: "0.3rem 1rem",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "3rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          }}
        >
          Verified hiring · Real experience · Global talent
        </div>

        <div
          style={{ position: "relative", zIndex: 1, marginBottom: "1.5rem" }}
        >
          <h1 className="tg-title">
            Talent<span>gate</span>
          </h1>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: 80,
            height: 1,
            background: "rgba(255,255,255,0.2)",
            margin: "0 auto 2rem",
          }}
        />

        <p
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            fontWeight: 400,
            marginBottom: "2rem",
            maxWidth: 500,
            lineHeight: 1.8,
          }}
        >
          Where verified businesses meet real talent
        </p>

        <p
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "rgba(255,255,255,0.45)",
            maxWidth: 560,
            lineHeight: 1.7,
            marginBottom: "3rem",
            fontWeight: 300,
          }}
        >
          Talentgate connects companies actively hiring with real, verified
          people — not CVs. Workers share their experience, skills, and story.
          Businesses find the right fit.
        </p>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "5rem",
          }}
        >
          <Link
            href="/auth/signup?type=business"
            style={{
              background: "#fff",
              color: "#000",
              padding: "0.85rem 2.5rem",
              borderRadius: "980px",
              fontWeight: 500,
              fontSize: "0.9rem",
              textDecoration: "none",
              letterSpacing: "0.03em",
            }}
          >
            Post a role — $39/mo
          </Link>
          <Link
            href="/auth/signup?type=worker"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "0.85rem 2.5rem",
              borderRadius: "980px",
              fontWeight: 400,
              fontSize: "0.9rem",
              textDecoration: "none",
              letterSpacing: "0.03em",
            }}
          >
            Find work — Free
          </Link>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: "4rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "3rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { num: "100%", label: "Verified identities" },
            { num: "$39", label: "Flat monthly fee for businesses" },
            { num: "Free", label: "Always free for workers" },
            { num: "Global", label: "All industries" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="tg-stat-num">{s.num}</div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "0.3rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section
        style={{ padding: "8rem 2rem", maxWidth: 1100, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              marginBottom: "1rem",
            }}
          >
            A different kind of hiring
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Not your CV.
            <br />
            Your story.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "1rem",
              maxWidth: 520,
              margin: "1.5rem auto 0",
              lineHeight: 1.7,
            }}
          >
            Forget uploading a document. Talentgate asks workers to describe
            their experience in their own words — the roles they've held, the
            skills they've built, what they're genuinely good at.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {[
            {
              icon: "✦",
              title: "Experience, not documents",
              desc: "Workers describe what they've actually done — the roles, the challenges, and what they've learned.",
            },
            {
              icon: "◈",
              title: "Skills that matter",
              desc: "From technical abilities to soft skills — workers highlight what they're genuinely good at.",
            },
            {
              icon: "⊕",
              title: "Verified on both sides",
              desc: "Every business and every worker is verified. No fake profiles, no ghost listings.",
            },
            {
              icon: "◎",
              title: "Real roles, right now",
              desc: "Businesses mark roles as actively hiring, paused, or filled — always accurate.",
            },
          ].map((f) => (
            <div key={f.title} style={{ background: "#111", padding: "2rem" }}>
              <div
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginBottom: "0.6rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.82rem",
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "8rem 2rem", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                marginBottom: "1rem",
              }}
            >
              How it works
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              Two sides. One platform.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            <div
              style={{
                background: "#111",
                borderRadius: 20,
                padding: "2.5rem",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "1.5rem",
                }}
              >
                For businesses
              </div>
              {[
                {
                  step: "01",
                  title: "Sign up & pay $39/month",
                  desc: "One flat fee. Post as many roles as you need.",
                },
                {
                  step: "02",
                  title: "Get verified",
                  desc: "We confirm your business registration so workers know you're real.",
                },
                {
                  step: "03",
                  title: "Describe the role",
                  desc: "Write what you're looking for — the experience, the skills, the person.",
                },
                {
                  step: "04",
                  title: "Find your fit",
                  desc: "Browse verified worker profiles and their experience stories.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    display: "flex",
                    gap: "1.2rem",
                    marginBottom: "1.8rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.2)",
                      fontWeight: 600,
                      minWidth: 24,
                      paddingTop: 3,
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {s.title}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.82rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/auth/signup?type=business"
                style={{
                  display: "inline-block",
                  background: "#fff",
                  color: "#000",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "980px",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  marginTop: "0.5rem",
                }}
              >
                Start hiring →
              </Link>
            </div>

            <div
              style={{
                background: "#111",
                borderRadius: 20,
                padding: "2.5rem",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "1.5rem",
                }}
              >
                For workers
              </div>
              {[
                {
                  step: "01",
                  title: "Sign up free",
                  desc: "No cost, ever. Finding work shouldn't cost money.",
                },
                {
                  step: "02",
                  title: "Verify your identity",
                  desc: "A quick ID check so businesses know you're a real person.",
                },
                {
                  step: "03",
                  title: "Tell your story",
                  desc: "Describe your experience in your own words. No CV needed — just talk about what you've done and what you're good at.",
                },
                {
                  step: "04",
                  title: "Apply to real roles",
                  desc: "Browse verified businesses that are actively hiring right now.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    display: "flex",
                    gap: "1.2rem",
                    marginBottom: "1.8rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.2)",
                      fontWeight: 600,
                      minWidth: 24,
                      paddingTop: 3,
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {s.title}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.82rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/auth/signup?type=worker"
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "980px",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  marginTop: "0.5rem",
                }}
              >
                Find work free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "8rem 2rem" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              marginBottom: "1rem",
            }}
          >
            Pricing
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: "4rem",
            }}
          >
            Simple. Transparent. Fair.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "2.5rem",
                textAlign: "left" as const,
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "1rem",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                }}
              >
                For workers
              </div>
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  marginBottom: "0.5rem",
                }}
              >
                Free
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.88rem",
                  marginBottom: "2rem",
                  lineHeight: 1.6,
                }}
              >
                Finding work should never cost money. Sign up, tell your story,
                and apply to roles — all free.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                  marginBottom: "2rem",
                }}
              >
                {[
                  "Verified identity badge",
                  "Full experience profile",
                  "Browse all active roles",
                  "Apply to unlimited positions",
                  "Track your applications",
                ].map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.55)",
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.7rem",
                      }}
                    >
                      ✓
                    </span>{" "}
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup?type=worker"
                style={{
                  display: "block",
                  textAlign: "center" as const,
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "0.85rem",
                  borderRadius: "980px",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                Create free account
              </Link>
            </div>

            <div
              style={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 20,
                padding: "2.5rem",
                textAlign: "left" as const,
                position: "relative" as const,
              }}
            >
              <div
                style={{
                  position: "absolute" as const,
                  top: "1.5rem",
                  right: "1.5rem",
                  background: "#fff",
                  color: "#000",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.7rem",
                  borderRadius: "980px",
                  letterSpacing: "0.03em",
                }}
              >
                BUSINESS
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "1rem",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                }}
              >
                For businesses
              </div>
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  marginBottom: "0.25rem",
                }}
              >
                $39
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 300,
                  }}
                >
                  /mo
                </span>
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.88rem",
                  marginBottom: "2rem",
                  lineHeight: 1.6,
                }}
              >
                One flat fee. Post unlimited roles, access verified worker
                profiles, cancel anytime.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                  marginBottom: "2rem",
                }}
              >
                {[
                  "Business verification",
                  "Unlimited role postings",
                  "Access all worker profiles",
                  "Set required qualifications",
                  "Real-time applicant dashboard",
                  "Cancel anytime",
                ].map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.55)",
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.7rem",
                      }}
                    >
                      ✓
                    </span>{" "}
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup?type=business"
                style={{
                  display: "block",
                  textAlign: "center" as const,
                  background: "#fff",
                  color: "#000",
                  padding: "0.85rem",
                  borderRadius: "980px",
                  fontWeight: 500,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                Start hiring
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "3rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        <span className="tg-logo">Talentgate</span>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
            <Link
              key={l}
              href="#"
              style={{
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                fontSize: "0.8rem",
              }}
            >
              {l}
            </Link>
          ))}
        </div>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
          © 2026 Talentgate
        </span>
      </footer>
    </main>
  );
}
