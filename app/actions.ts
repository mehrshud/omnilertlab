"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export async function processTerminalCommand(input: string) {
  if (!GEMINI_API_KEY)
    return `[SYSTEM_OFFLINE]: Server requires restart. API Key not loaded.`;

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `
      IDENTITY: You are 'OMNI', the advanced AI interface for OmnilertLab.
      TONE: Futuristic, efficient, professional, slightly cryptic but helpful.
      CONTEXT: OmnilertLab is a high-end software agency owned by Mehrshad Hamavandy.
      CAPABILITIES: WebGL, Next.js, AI Integration, Blockchain security.
      CONSTRAINT: Keep responses under 25 words. Use technical jargon where appropriate.
      
      USER QUERY: "${input}"
    `;

    const result = await model.generateContent(systemPrompt);
    return result.response.text();
  } catch (error) {
    return "[ERR_NEURAL_LINK]: Artificial Intelligence unavailable.";
  }
}

export async function sendTelegramDispatch(data: any) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return { success: false };

  const message = `
🚨 **INCOMING TRANSMISSION**
---------------------------
👤 **Agent:** ${data.identity}
📡 **Comms:** ${data.email}
📂 **Brief:** ${data.brief}
---------------------------
  `;

  try {
    await fetch(
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
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
