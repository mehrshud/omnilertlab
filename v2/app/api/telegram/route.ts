import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
const SECRET    = process.env.TELEGRAM_WEBHOOK_SECRET;

/**
 * POST /api/telegram
 *
 * Two callers:
 * 1. Visitor chat UI → forwards message to your Telegram
 * 2. Telegram webhook → receives your replies (when you respond via Telegram)
 *
 * Setup webhook:
 *   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
 *     -d "url=https://your-domain.com/api/telegram" \
 *     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  // ── Incoming webhook from Telegram (your reply) ───────────
  if (body?.update_id !== undefined && body?.message) {
    const incomingSecret = req.headers.get("x-telegram-bot-api-secret-token");
    if (SECRET && incomingSecret !== SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // TODO: For real-time delivery, push this to a Redis pub/sub channel
    // keyed by visitorId, then the frontend polls SSE endpoint.
    console.log("[Telegram webhook] Your reply:", body.message.text);
    return NextResponse.json({ ok: true });
  }

  // ── Visitor message → forward to your Telegram ────────────
  const { text, visitorId } = body as { text: string; visitorId?: string };
  if (!text?.trim()) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }
  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json({ error: "Telegram not configured on server" }, { status: 503 });
  }

  const formatted = [
    "💬 *OmnilertLab Visitor*",
    `_Session: ${visitorId ?? "anonymous"}_`,
    "",
    text,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: formatted,
      parse_mode: "Markdown",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[/api/telegram]", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
