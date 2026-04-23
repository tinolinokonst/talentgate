import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

// ── Summary prompt ───────────────────────────────────────────
//
// Takes the full transcript and produces a structured JSON object
// the business dashboard will render. This is a separate API call
// made after the interview ends so it doesn't block the chat UX.

function buildSummaryPrompt(
  transcript: { role: string; content: string }[]
): string {
  const formatted = transcript
    .map(
      (m) =>
        `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`
    )
    .join("\n\n");

  return `You are an expert talent analyst. You have just observed a first-round screening interview. Your job is to produce a concise, fair, and useful summary for the hiring company.

Read the transcript carefully, then output ONLY a valid JSON object — no preamble, no explanation, no markdown fences. The JSON must exactly match this shape:

{
  "communication_style": "A 1–2 sentence description of how the candidate communicates",
  "confidence_level": "high" | "medium" | "low",
  "relevant_experience": "A 2–3 sentence summary of how well their background matches the role",
  "standout_moments": ["up to 3 specific things they said or showed that were impressive"],
  "areas_of_concern": ["up to 3 honest observations about gaps, vagueness, or weak signals — leave as empty array if none"],
  "traits": ["up to 5 single words or short phrases describing their character, e.g. 'self-motivated', 'team-oriented', 'methodical'"],
  "recommendation": "strong_yes" | "yes" | "maybe" | "no",
  "recommendation_reason": "A single sentence explaining the recommendation"
}

Be fair and specific. Base everything only on what was actually said. Do not invent details. If the candidate was vague on something, note it in areas_of_concern rather than assuming the best.

TRANSCRIPT:
${formatted}`;
}

// ── Route handler ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId, transcript } = body;

    if (!applicationId || !transcript) {
      return NextResponse.json(
        { error: "applicationId and transcript required" },
        { status: 400 }
      );
    }

    const summaryPrompt = buildSummaryPrompt(transcript);

    // ── Call Anthropic for structured summary ──────────
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1200,
        messages: [
          {
            role: "user",
            content: summaryPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic summary error:", errText);
      return NextResponse.json(
        { error: "Summary generation failed" },
        { status: 502 }
      );
    }

    const aiData = await response.json();
    const rawText: string = aiData.content?.[0]?.text ?? "";

    // ── Parse JSON safely ──────────────────────────────
    let summary: Record<string, unknown> | null = null;
    try {
      // Strip any accidental markdown fences
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      summary = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse AI summary JSON:", rawText);
      // Store raw text as fallback so we don't lose the data
      summary = { raw: rawText, parse_error: true };
    }

    // ── Save to DB ─────────────────────────────────────
    const supabase = await createClient();

    const { error: updateErr } = await supabase
      .from("interviews")
      .update({
        ai_summary: summary,
        transcript,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("application_id", applicationId);

    if (updateErr) {
      console.error("Failed to save summary:", updateErr);
      return NextResponse.json(
        { error: "Failed to save summary" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, summary });
  } catch (err) {
    console.error("Interview complete route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
