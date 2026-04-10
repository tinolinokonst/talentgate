import Link from "next/link";

export default function Pricing() {
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
        .tg-logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          font-style: normal;
          letter-spacing: 0.01em;
          text-decoration: none;
          background: linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0.55) 100%);
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
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 500,
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
          padding: "10rem 2rem 6rem",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.35)",
            marginBottom: "1.5rem",
          }}
        >
          Pricing
        </p>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 600,
            margin: "0 auto 1.5rem",
          }}
        >
          Simple.
          <br />
          Transparent.
          <br />
          Fair.
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "1.1rem",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          One flat fee for businesses. Always free for workers. No hidden costs,
          no surprises.
        </p>
      </section>

      {/* PRICING CARDS */}
      <section
        style={{ padding: "7rem 2rem", maxWidth: 860, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Worker */}
          <div
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "3rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                marginBottom: "1.5rem",
              }}
            >
              For workers
            </div>
            <div
              style={{
                fontSize: "4rem",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}
            >
              Free
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.9rem",
                marginBottom: "2.5rem",
                lineHeight: 1.6,
              }}
            >
              Finding work should never cost money. Talentgate is free for job
              seekers — forever.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                marginBottom: "2.5rem",
              }}
            >
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
                  title: "Application tracking",
                  desc: "See the status of every role you've applied to.",
                },
              ].map((f, i) => (
                <div
                  key={f.title}
                  style={{
                    padding: "1.2rem 0",
                    borderTop:
                      i === 0
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.75rem",
                        paddingTop: 3,
                      }}
                    >
                      ✓
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 500,
                          marginBottom: "0.2rem",
                        }}
                      >
                        {f.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "rgba(255,255,255,0.35)",
                          lineHeight: 1.5,
                        }}
                      >
                        {f.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup?type=worker"
              style={{
                display: "block",
                textAlign: "center" as const,
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "0.9rem",
                borderRadius: "980px",
                fontWeight: 500,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Create free account
            </Link>
          </div>

          {/* Business */}
          <div
            style={{
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 20,
              padding: "3rem",
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
                letterSpacing: "0.05em",
              }}
            >
              BUSINESS
            </div>

            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                marginBottom: "1.5rem",
              }}
            >
              For businesses
            </div>
            <div style={{ lineHeight: 1, marginBottom: "0.5rem" }}>
              <span
                style={{
                  fontSize: "4rem",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                $39
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 300,
                }}
              >
                /month
              </span>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.9rem",
                marginBottom: "2.5rem",
                lineHeight: 1.6,
              }}
            >
              One flat monthly fee. Post unlimited roles and access every
              verified worker profile on the platform.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                marginBottom: "2.5rem",
              }}
            >
              {[
                {
                  title: "Business verification",
                  desc: "Your company is checked against official registries.",
                },
                {
                  title: "Unlimited role postings",
                  desc: "Post as many active listings as you need.",
                },
                {
                  title: "Full worker profiles",
                  desc: "See every applicant's experience story and skills.",
                },
                {
                  title: "Qualification filters",
                  desc: "Set specific requirements for each role you post.",
                },
                {
                  title: "Applicant dashboard",
                  desc: "Manage all applications in one place.",
                },
                {
                  title: "Cancel anytime",
                  desc: "No contracts, no lock-in. Cancel whenever you want.",
                },
              ].map((f, i) => (
                <div
                  key={f.title}
                  style={{
                    padding: "1.2rem 0",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.75rem",
                        paddingTop: 3,
                      }}
                    >
                      ✓
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 500,
                          marginBottom: "0.2rem",
                        }}
                      >
                        {f.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "rgba(255,255,255,0.35)",
                          lineHeight: 1.5,
                        }}
                      >
                        {f.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup?type=business"
              style={{
                display: "block",
                textAlign: "center" as const,
                background: "#fff",
                color: "#000",
                padding: "0.9rem",
                borderRadius: "980px",
                fontWeight: 500,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Start hiring
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: "6rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "2.5rem",
            }}
          >
            Common questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              {
                q: "Can I cancel my business subscription at any time?",
                a: "Yes — cancel whenever you want with no penalty. Your account stays active until the end of your billing period.",
              },
              {
                q: "How long does business verification take?",
                a: "Most businesses are verified within a few hours. We check your registration number against official company registries automatically.",
              },
              {
                q: "Is it really free for workers?",
                a: "Yes, completely. Workers never pay anything to use Talentgate — not to sign up, not to apply, not ever.",
              },
              {
                q: "What happens to my listings if I cancel?",
                a: "Your listings are paused when your subscription ends. If you resubscribe, they can be reactivated immediately.",
              },
              {
                q: "How many roles can I post?",
                a: "Unlimited. The $39/month fee covers as many active listings as you need.",
              },
            ].map((faq, i) => (
              <div
                key={faq.q}
                style={{
                  padding: "1.8rem 0",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginBottom: "0.6rem",
                  }}
                >
                  {faq.q}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        style={{
          padding: "6rem 2rem",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#0a0a0a",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}
        >
          Ready to get started?
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            marginBottom: "2.5rem",
            fontSize: "0.95rem",
          }}
        >
          Join Talentgate today — whether you're hiring or looking.
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
            href="/auth/signup?type=business"
            style={{
              background: "#fff",
              color: "#000",
              padding: "0.85rem 2rem",
              borderRadius: "980px",
              fontWeight: 500,
              fontSize: "0.9rem",
              textDecoration: "none",
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
              padding: "0.85rem 2rem",
              borderRadius: "980px",
              fontWeight: 500,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Find work — Free
          </Link>
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
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontSize: "0.8rem",
              }}
            >
              {l}
            </Link>
          ))}
        </div>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
          © 2026 Talentgate
        </span>
      </footer>
    </main>
  );
}
