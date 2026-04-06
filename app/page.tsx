import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.2rem 5%",
          background: 'var(--bg)',
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "var(--text)",
          }}
        >
          Talent<span style={{ color: "var(--accent)" }}>gate</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="#how"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Pricing
          </Link>
          <Link
            href="/auth/signup"
            style={{
              background: "var(--accent)",
              color: "#04080F",
              padding: "0.55rem 1.3rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Get Started
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
          padding: "8rem 5% 5rem",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,229,255,0.1) 0%, transparent 70%)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0,229,255,0.08)",
            border: "1px solid rgba(0,229,255,0.25)",
            color: "var(--accent)",
            padding: "0.4rem 1rem",
            borderRadius: "100px",
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: "1.8rem",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          Now live globally across all industries
        </div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            fontWeight: 800,
            maxWidth: 820,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          The verified gateway between{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00E5FF, #7B61FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            businesses & talent
          </span>
        </h1>
        <p
          style={{
            maxWidth: 560,
            color: "var(--muted)",
            fontSize: "1.1rem",
            fontWeight: 300,
            marginTop: "1.4rem",
          }}
        >
          Talentgate connects companies actively hiring with real, verified
          candidates — every business and every worker is identity-checked
          before they ever meet.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "2.4rem",
          }}
        >
          <Link
            href="/auth/signup?type=business"
            style={{
              background: "var(--accent)",
              color: "#04080F",
              padding: "0.9rem 2rem",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(0,229,255,0.25)",
            }}
          >
            Post a Role — $39/mo
          </Link>
          <Link
            href="/auth/signup?type=worker"
            style={{
              background: "transparent",
              color: "var(--text)",
              padding: "0.9rem 2rem",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              border: "1px solid var(--border)",
            }}
          >
            Find a Job — Free
          </Link>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "4rem",
          }}
        >
          {[
            { num: "100%", label: "Verified Identities" },
            { num: "$39", label: "Business flat fee/month" },
            { num: "Free", label: "For job seekers, always" },
            { num: "Global", label: "All industries, all roles" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--accent)",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                  marginTop: "0.2rem",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        style={{ padding: "6rem 5%", background: "var(--surface)" }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1rem",
            }}
          >
            How it works
          </div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Built for both sides of the table
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: "🏢",
              title: "Business signs up & pays",
              desc: "Create a business account and subscribe for $39/month.",
            },
            {
              icon: "🔍",
              title: "Business gets verified",
              desc: "We verify your company registration and business details.",
            },
            {
              icon: "📋",
              title: "Post your roles",
              desc: "List open positions with qualifications, salary and location.",
            },
            {
              icon: "✅",
              title: "Hire verified talent",
              desc: "Every applicant has passed identity checks — no fake profiles.",
            },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                background: "rgba(13,21,33,0.8)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "2rem",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
                {step.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "6rem 5%", textAlign: "center" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "1rem",
          }}
        >
          Pricing
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "3rem",
          }}
        >
          Simple, transparent pricing
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            maxWidth: 780,
            margin: "0 auto",
          }}
        >
          {/* Worker */}
          <div
            style={{
              background: "rgba(13,21,33,0.8)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "2.5rem",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--muted)",
                marginBottom: "0.6rem",
              }}
            >
              For Job Seekers
            </div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "3rem",
                fontWeight: 800,
              }}
            >
              Free
            </div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.88rem",
                margin: "1rem 0 1.5rem",
              }}
            >
              Finding your next opportunity shouldn't cost a thing.
            </p>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              {[
                "Verified identity badge",
                "Browse all live job listings",
                "Apply to unlimited roles",
                "Real-time application tracking",
              ].map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>
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
                textAlign: "center",
                padding: "0.85rem",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              Create Free Account
            </Link>
          </div>
          {/* Business */}
          <div
            style={{
              background:
                "linear-gradient(160deg, rgba(0,229,255,0.06) 0%, rgba(13,21,33,0.8) 60%)",
              border: "1px solid var(--accent)",
              borderRadius: 20,
              padding: "2.5rem",
              textAlign: "left",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "var(--accent)",
                color: "#04080F",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.25rem 0.7rem",
                borderRadius: 100,
              }}
            >
              FOR BUSINESSES
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--muted)",
                marginBottom: "0.6rem",
              }}
            >
              For Businesses
            </div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "3rem",
                fontWeight: 800,
              }}
            >
              <sup style={{ fontSize: "1.2rem", verticalAlign: "super" }}>
                $
              </sup>
              39
              <span
                style={{
                  fontSize: "1rem",
                  color: "var(--muted)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                /month
              </span>
            </div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.88rem",
                margin: "1rem 0 1.5rem",
              }}
            >
              Everything you need to find verified talent, fast.
            </p>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              {[
                "Business identity verification",
                "Post unlimited active roles",
                "Set required qualifications",
                "Access verified candidate profiles",
                "Cancel anytime",
              ].map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>
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
                textAlign: "center",
                padding: "0.85rem",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                background: "var(--accent)",
                color: "#04080F",
              }}
            >
              Start Hiring — $39/mo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          padding: "3rem 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
          }}
        >
          Talent<span style={{ color: "var(--accent)" }}>gate</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["About", "Privacy Policy", "Terms of Service", "Contact"].map(
            (l) => (
              <Link
                key={l}
                href="#"
                style={{
                  color: "var(--muted)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                }}
              >
                {l}
              </Link>
            )
          )}
        </div>
        <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
          © 2026 Talentgate. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
