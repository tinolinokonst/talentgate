import Link from "next/link";

export default function HowItWorks() {
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
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 500,
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
          How it works
        </p>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 700,
            margin: "0 auto 1.5rem",
          }}
        >
          Two sides.
          <br />
          One platform.
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "1.1rem",
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Talentgate is built around trust and simplicity — for the businesses
          hiring and the people looking for work.
        </p>
      </section>

      {/* FOR BUSINESSES */}
      <section
        style={{ padding: "7rem 2rem", maxWidth: 860, margin: "0 auto" }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "0.3rem 0.8rem",
            borderRadius: "980px",
            marginBottom: "3rem",
          }}
        >
          For businesses
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            {
              step: "01",
              title: "Sign up and pay $39/month",
              body: "Create your business account and subscribe for one flat monthly fee. No hidden costs, no per-listing charges. Cancel anytime.",
            },
            {
              step: "02",
              title: "Get your business verified",
              body: "We verify your company registration number against official business registries. Once approved, your listings carry a verified badge — so workers know you're a legitimate employer.",
            },
            {
              step: "03",
              title: "Post your roles",
              body: "Describe the position in your own words. Tell workers what the role involves, what a typical day looks like, what kind of person would thrive in it, and what experience or qualities you're looking for. Be specific — the more genuine your listing, the better your applicants.",
            },
            {
              step: "04",
              title: "Browse verified applicants",
              body: "Every worker on Talentgate has verified their identity and built an experience profile — not a CV. You'll see their background, their skills, and most importantly, what they've said about themselves in their own words.",
            },
          ].map((s, i) => (
            <div
              key={s.step}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: "2rem",
                padding: "3rem 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.05em",
                  paddingTop: 6,
                }}
              >
                {s.step}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    maxWidth: 560,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem" }}>
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
            Start hiring — $39/mo
          </Link>
        </div>
      </section>

      {/* DIVIDER */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          maxWidth: 860,
          margin: "0 auto",
        }}
      />

      {/* FOR WORKERS */}
      <section
        style={{ padding: "7rem 2rem", maxWidth: 860, margin: "0 auto" }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "0.3rem 0.8rem",
            borderRadius: "980px",
            marginBottom: "3rem",
          }}
        >
          For workers
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            {
              step: "01",
              title: "Sign up for free",
              body: "Create your account at no cost. Talentgate is always free for people looking for work — no subscriptions, no fees, no catches.",
            },
            {
              step: "02",
              title: "Verify your identity",
              body: "Upload a government-issued ID, birth certificate, or national identity card. This takes less than 2 minutes and keeps the platform trustworthy for everyone. Your documents are handled securely and never stored as raw images.",
            },
            {
              step: "03",
              title: "Build your experience profile",
              body: "This isn't a CV. We ask you to describe your experience in your own words — the kinds of work you've done, the environments you've been part of, what you've learned, and what you're genuinely good at. Businesses want to understand who you are, not read a formatted document.",
            },
            {
              step: "04",
              title: "Apply to real, verified roles",
              body: "Browse active listings from verified businesses. Every role on Talentgate is posted by a real, verified company. Apply directly — your experience profile speaks for you.",
            },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: "2rem",
                padding: "3rem 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.05em",
                  paddingTop: 6,
                }}
              >
                {s.step}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    maxWidth: 560,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem" }}>
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
            Create free account
          </Link>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section
        style={{
          padding: "6rem 2rem",
          background: "#0a0a0a",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
            }}
          >
            Trust is the foundation
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              maxWidth: 500,
              margin: "0 auto 3rem",
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            Every account on Talentgate — business or worker — is verified
            before they can interact on the platform.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {[
              { icon: "🏛️", label: "Company registry check" },
              { icon: "🪪", label: "Government ID verified" },
              { icon: "🔐", label: "Secure data handling" },
              { icon: "🛡️", label: "Stripe Identity powered" },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  background: "#111",
                  padding: "2rem",
                  textAlign: "center" as const,
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
                  {b.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
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
