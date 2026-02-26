import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { insertOrder } from "@/lib/supabase";
import { sendOrderEmails } from "@/lib/resend";

const orderSchema = z.object({
  projectType: z.enum(["website", "fullstack", "ai", "threejs", "other"]),
  projectName: z.string().min(2),
  description: z.string().min(10).max(300),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  linkedin: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = orderSchema.parse(body);

    // 1. Store in Supabase
    await insertOrder({
      project_type: data.projectType,
      project_name: data.projectName,
      description: data.description,
      budget: data.budget,
      timeline: data.timeline,
      client_name: data.name,
      client_email: data.email,
      client_linkedin: data.linkedin,
    });

    // 2. Send emails via Resend
    await sendOrderEmails(data);

    // 3. Send Telegram notification
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const message = `🚀 *NEW COMMISSION — OMNILERTLAB*

━━━━━━━━━━━━━━━━━━━
📋 *Type:* ${data.projectType}
📝 *Project:* ${data.projectName}
💬 *Brief:* ${data.description}
💰 *Budget:* ${data.budget}
⏱ *Timeline:* ${data.timeline}
━━━━━━━━━━━━━━━━━━━
👤 *Client:* ${data.name}
📧 *Email:* ${data.email}
${data.linkedin ? `🔗 *LinkedIn:* ${data.linkedin}` : ""}
━━━━━━━━━━━━━━━━━━━

_Received via omnilertlab.dev_`;

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
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: (error as any).errors },
        { status: 400 }
      );
    }
    console.error("Order submission error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
