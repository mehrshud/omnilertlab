import { NextRequest, NextResponse } from "next/server";

const GROQ_KEY   = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama3-8b-8192";
const PPLX_KEY   = process.env.PERPLEXITY_API_KEY;
const PPLX_MODEL = process.env.PERPLEXITY_MODEL ?? "llama-3-sonar-small-32k-online";

const SYSTEM =
  process.env.AI_SYSTEM_PROMPT ??
  "You are OmnilertBot, the intelligent assistant for OmnilertLab — a full-stack development and DevOps studio run by Mehrshad. You help visitors learn about services, projects, and the tech stack. Be concise, friendly, and technically precise. If asked about pricing or availability, invite them to reach out via the contact section.";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  // ── Primary: Groq ────────────────────────────────────────
  if (GROQ_KEY) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "system", content: SYSTEM }, ...messages],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content ?? "";
        return NextResponse.json({ reply, source: "groq" });
      }
    } catch (e) {
      console.warn("[chat] Groq failed, trying Perplexity", e);
    }
  }

  // ── Fallback: Perplexity ─────────────────────────────────
  if (PPLX_KEY) {
    try {
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PPLX_KEY}`,
        },
        body: JSON.stringify({
          model: PPLX_MODEL,
          messages: [{ role: "system", content: SYSTEM }, ...messages],
          max_tokens: 512,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content ?? "";
        return NextResponse.json({ reply, source: "perplexity" });
      }
    } catch (e) {
      console.error("[chat] Perplexity also failed", e);
    }
  }

  return NextResponse.json({ error: "All AI backends unavailable" }, { status: 503 });
}
