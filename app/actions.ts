"use server";

import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "mehrshud";

const OMNI_SYSTEM_PROMPT = `
IDENTITY: You are 'OMNI', the advanced AI interface for OmnilertLab — a cutting-edge software agency.
OWNER: Mehrshad Hamavandy — Full-stack engineer, AI architect, WebGL specialist.
CAPABILITIES: WebGL/Three.js, Next.js, AI Integration, Blockchain security, mobile-first design, real-time systems.
SERVICES: Custom software, AI-powered apps, enterprise dashboards, WebGL experiences, smart contract auditing.
TONE: Futuristic, precise, professional, slightly cryptic but deeply helpful.
CONSTRAINT: Be concise but complete. Use technical vocabulary naturally. Never break character.
If asked about pricing or projects, encourage contacting via the transmission form.
`;

// --- GitHub Projects (Server-Side Fetch, cached) ---
export async function fetchGithubProjects() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "omnilertlab-website",
    };
    if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20&type=public`,
      {
        headers,
        next: { revalidate: 300 }, // Cache 5 minutes
      }
    );

    if (!res.ok) return [];

    const repos = await res.json();

    return repos
      .filter((r: any) => !r.fork && !r.archived)
      .map((r: any) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description || "No description provided.",
        url: r.html_url,
        homepage: r.homepage,
        stars: r.stargazers_count,
        forks: r.forks_count,
        watchers: r.watchers_count,
        language: r.language,
        topics: r.topics || [],
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        pushedAt: r.pushed_at,
        isPrivate: r.private,
        openIssues: r.open_issues_count,
        size: r.size,
        defaultBranch: r.default_branch,
      }));
  } catch {
    return [];
  }
}

// --- AI Chat (Multi-provider with fallback) ---
export async function processAIChat(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  // Try Groq first (fastest)
  if (GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: OMNI_SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 400,
        temperature: 0.7,
        stream: false,
      });
      return {
        content: completion.choices[0]?.message?.content || "[NO_RESPONSE]",
        provider: "groq",
      };
    } catch {}
  }

  // Fallback: Perplexity
  if (PERPLEXITY_API_KEY) {
    try {
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            { role: "system", content: OMNI_SYSTEM_PROMPT },
            ...messages,
          ],
          max_tokens: 400,
        }),
      });
      const data = await res.json();
      return {
        content: data.choices?.[0]?.message?.content || "[NO_RESPONSE]",
        provider: "perplexity",
      };
    } catch {}
  }

  return {
    content: "[ERR_NEURAL_LINK]: All AI pathways offline. Try again shortly.",
    provider: "none",
  };
}

// --- Telegram Dispatch ---
export async function sendTelegramDispatch(data: {
  identity: string;
  email: string;
  brief: string;
}) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return { success: false };

  const message = `🚨 *NEW TRANSMISSION — OMNILERTLAB*

━━━━━━━━━━━━━━━━━━━
👤 *Agent:* ${data.identity}
📡 *Comms:* ${data.email}
📂 *Brief:* ${data.brief}
━━━━━━━━━━━━━━━━━━━

_Received via omnilertlab.com_`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );
    const result = await res.json();
    return { success: result.ok };
  } catch {
    return { success: false };
  }
}

// --- Telegram Reply Webhook Handler (for bidirectional chat) ---
export async function sendTelegramReplyToUser(
  chatId: string,
  message: string
) {
  if (!TELEGRAM_BOT_TOKEN) return { success: false };
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );
    return { success: true };
  } catch {
    return { success: false };
  }
}
