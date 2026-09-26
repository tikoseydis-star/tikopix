import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Sends the contact form to Tiko's inbox through Resend (https://resend.com).
 * Needs RESEND_API_KEY + CONTACT_TO_EMAIL. Without them it answers 503 and the
 * form tells the visitor to email directly, so nothing is ever silently lost.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", field: parsed.error.issues[0]?.message }, { status: 422 });
  }
  const d = parsed.data;
  if (d.company) return NextResponse.json({ ok: true }); // bot, pretend success

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const html = `
    <h2>Nouvelle demande via tikopix</h2>
    <p><b>Nom :</b> ${esc(d.name)}<br/><b>Courriel :</b> ${esc(d.email)}<br/>
    <b>Type :</b> ${esc(d.type || "—")}<br/><b>Date souhaitée :</b> ${esc(d.date || "—")}</p>
    <p style="white-space:pre-wrap">${esc(d.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "TikoPix <onboarding@resend.dev>",
      to: [to],
      reply_to: d.email,
      subject: `Nouveau projet : ${d.name}${d.type ? ` (${d.type})` : ""}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
