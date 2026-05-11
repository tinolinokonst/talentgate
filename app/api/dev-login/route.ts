import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ── Guard: only active when DEV_BYPASS_SECRET is set ────────
// Set DEV_BYPASS_SECRET in your .env.local (and Vercel env vars
// if you want it on staging). Never set it in production.
const SECRET = process.env.DEV_BYPASS_SECRET;

export async function POST(request: NextRequest) {
  // 1. Feature must be explicitly enabled
  if (!SECRET) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  // 2. Caller must know the secret
  const { email, secret } = await request.json();
  if (secret !== SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  // 3. Use the service role admin client — this bypasses rate limits entirely
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 4. Look up the user by email
  const {
    data: { users },
    error: listErr,
  } = await adminClient.auth.admin.listUsers();
  if (listErr) {
    return NextResponse.json({ error: listErr.message }, { status: 500 });
  }
  const user = users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 5. Generate a magic link (sign-in link) for the user via admin API
  const { data: linkData, error: linkErr } =
    await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
  if (linkErr || !linkData) {
    return NextResponse.json(
      { error: linkErr?.message ?? "Failed to generate link" },
      { status: 500 }
    );
  }

  // 6. Exchange the token from the link for a real session
  //    The link contains hashed_token and type in the URL fragment — we extract them
  const actionLink = linkData.properties?.action_link ?? "";
  const url = new URL(actionLink);
  const token_hash =
    url.searchParams.get("token_hash") ??
    linkData.properties?.hashed_token ??
    "";
  const type = "magiclink";

  // 7. Use a regular (anon) client to verify the OTP and get a session
  const cookieStore = await cookies();
  const anonClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {}
          });
        },
      },
    }
  );

  const { data: sessionData, error: sessionErr } =
    await anonClient.auth.verifyOtp({
      token_hash,
      type,
    });

  if (sessionErr || !sessionData.session) {
    return NextResponse.json(
      { error: sessionErr?.message ?? "Failed to create session" },
      { status: 500 }
    );
  }

  // 8. Determine redirect based on role
  const { data: profile } = await anonClient
    .from("profiles")
    .select("role")
    .eq("id", sessionData.user!.id)
    .single();

  const redirect =
    profile?.role === "business" ? "/business/dashboard" : "/worker/dashboard";

  // 9. Return success — the session cookies were set via the server client above
  return NextResponse.json({ ok: true, redirect });
}
