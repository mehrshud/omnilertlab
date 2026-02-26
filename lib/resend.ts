import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendOrderEmails(order: {
  projectType: string;
  projectName: string;
  description: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  linkedin?: string;
}) {
  if (!resend) {
    console.warn("Resend not configured — skipping email");
    return;
  }

  // Email to Mehrshad
  await resend.emails.send({
    from: "Omnilertlab <onboarding@resend.dev>",
    to: ["mehrshad@omnilertlab.dev"],
    subject: `🚀 New Commission: ${order.projectName}`,
    html: `
      <h2>New Project Commission</h2>
      <table>
        <tr><td><strong>Type:</strong></td><td>${order.projectType}</td></tr>
        <tr><td><strong>Project:</strong></td><td>${order.projectName}</td></tr>
        <tr><td><strong>Description:</strong></td><td>${order.description}</td></tr>
        <tr><td><strong>Budget:</strong></td><td>${order.budget}</td></tr>
        <tr><td><strong>Timeline:</strong></td><td>${order.timeline}</td></tr>
        <tr><td><strong>Client:</strong></td><td>${order.name} (${order.email})</td></tr>
        ${order.linkedin ? `<tr><td><strong>LinkedIn:</strong></td><td>${order.linkedin}</td></tr>` : ""}
      </table>
    `,
  });

  // Confirmation email to client
  await resend.emails.send({
    from: "Omnilertlab <onboarding@resend.dev>",
    to: [order.email],
    subject: "Your commission has been received — Omnilertlab",
    html: `
      <h2>Thanks for reaching out, ${order.name}! 🎉</h2>
      <p>I've received your project commission for <strong>${order.projectName}</strong>.</p>
      <p>I'll review the details and get back to you within <strong>2 hours</strong>.</p>
      <br/>
      <p>— Mehrshad Hamavandy<br/>Omnilertlab</p>
    `,
  });
}
