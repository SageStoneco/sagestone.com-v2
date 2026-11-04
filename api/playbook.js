/**
 * POST /api/playbook: Delegation Playbook signups (Vercel Function).
 *
 * 1. Emails the playbook download link to the person (ZeptoMail: transactional,
 *    because they asked for it).
 * 2. Notifies the team.
 * 3. Sends the lead to CRM_WEBHOOK_URL with lead_source "Delegation Playbook"
 *    and whether they opted in to the follow-up email series.
 *
 * The five-email follow-up series is NOT sent from here: ZeptoMail is for
 * transactional email only. It runs in Zoho Campaigns for people with
 * marketing_opt_in = true (see docs/delegation-playbook.md).
 *
 * Uses the same environment variables as api/contact.js.
 */

import { validatePlaybook, PLAYBOOK_PDF } from "../src/app/lib/playbook-rules.js";
import {
  DEFAULT_TO,
  MAX_BODY_BYTES,
  ALLOWED_ORIGIN,
  SITE,
  C,
  cleanAttribution,
  sourceLine,
  mailer,
  from,
  bookingUrl,
  heading,
  button,
  layout,
  clean,
  escapeHtml,
  json,
  postToCrm,
} from "./_shared.js";

export async function POST(request) {
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGIN.test(origin)) return json(403, { error: "forbidden" });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "too_large" });

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_json" });
  }
  if (!data || typeof data !== "object") return json(400, { error: "invalid_json" });

  // Honeypot: report success to bots, send nothing.
  if (typeof data.website === "string" && data.website.trim()) return json(200, { ok: true });

  const fields = validatePlaybook(data);
  if (Object.keys(fields).length) return json(400, { error: "invalid", fields });

  const token = process.env.ZEPTOMAIL_TOKEN?.trim();
  if (!token) {
    console.error("playbook: ZEPTOMAIL_TOKEN is not set");
    return json(503, { error: "not_configured" });
  }

  const s = {
    name: clean(data.name, 100),
    email: clean(data.email, 254),
    company: clean(data.company, 120),
    optIn: data.marketingOptIn === true,
    page: clean(data.page, 200),
    attribution: cleanAttribution(data.attribution),
    receivedAt: new Date().toISOString(),
  };

  const mail = mailer(token);

  // The delivery email is the point of the signup: if it fails, say so.
  try {
    await mail(delivery(s));
  } catch (err) {
    console.error("playbook: delivery failed", err);
    return json(502, { error: "send_failed" });
  }

  const results = await Promise.allSettled([mail(notification(s)), sendToCrm(s)]);
  results.forEach((r) => r.status === "rejected" && console.error("playbook: hand-off failed", r.reason));

  return json(200, { ok: true });
}

function firstNameOf(name) {
  const first = name.split(/\s+/)[0].slice(0, 40);
  return /^[\p{L}'’-]+$/u.test(first) ? first : "there";
}

const pdfUrl = () => `${SITE}${PLAYBOOK_PDF}?utm_source=playbook&utm_medium=email&utm_campaign=delegation_playbook`;

/** Fixed text: never echoes what the visitor typed beyond a validated first name. */
function delivery(s) {
  const firstName = firstNameOf(s.name);
  const booking = bookingUrl();
  const contactUrl = `${SITE}/contact?utm_source=playbook&utm_medium=email&utm_campaign=delegation_playbook`;
  const text = [
    `Hi ${firstName},`,
    "",
    "Here's your copy of The Delegation Playbook:",
    pdfUrl(),
    "",
    "It takes about thirty minutes. Tick the tasks you'd hand off, estimate the hours,",
    "and total them on the worksheet. That number tells you what kind of help you need.",
    "",
    "If you'd like a second pair of eyes on your worksheet, book a discovery call:",
    booking || contactUrl,
    "",
    "Warm regards,",
    "The SageStone Team",
  ].join("\n");

  const p = (t) => `<p style="margin:0 0 16px">${t}</p>`;
  const html = layout({
    preheader: "Your copy of The Delegation Playbook: 50 tasks, an hours worksheet and a 4-week onboarding plan.",
    body:
      heading("Your Delegation Playbook") +
      `<div style="font-size:16px;line-height:1.65;color:${C.ink}">` +
      p(`Hi ${escapeHtml(firstName)},`) +
      p("Here's your copy of <strong>The Delegation Playbook</strong>: 50 tasks founders can hand off, an hours worksheet, and a four-week onboarding plan.") +
      `</div>` +
      `<div style="margin:8px 0 24px">${button(pdfUrl(), "Download the playbook (PDF)")}</div>` +
      `<div style="font-size:16px;line-height:1.65;color:${C.ink}">` +
      p("It takes about thirty minutes. Tick the tasks you'd hand off, estimate the hours, and total them on the worksheet. That number tells you what kind of help you need.") +
      p(`If you'd like a second pair of eyes on your worksheet, <a href="${escapeHtml(booking || contactUrl)}" style="color:${C.sageInk}">book a discovery call</a>.`) +
      `</div>` +
      `<p style="margin:8px 0 0;font-size:16px;line-height:1.6;color:${C.ink}">Warm regards,<br><strong>The SageStone Team</strong></p>`,
  });

  return {
    from: from("SageStone"),
    to: [{ email_address: { address: s.email, name: s.name } }],
    reply_to: [{ address: process.env.CONTACT_TO?.trim() || DEFAULT_TO, name: "SageStone" }],
    subject: "Your Delegation Playbook",
    textbody: text,
    htmlbody: html,
  };
}

function notification(s) {
  const to = process.env.CONTACT_TO?.trim() || DEFAULT_TO;
  const rows = [
    ["Name", s.name],
    ["Email", s.email],
    ["Company", s.company],
    ["Email series opt-in", s.optIn ? "Yes" : "No"],
    ["Source", sourceLine(s.attribution)],
    ["Signup page", s.page],
    ["Landing page", s.attribution.landing_page],
    ["Received", s.receivedAt],
  ];
  const text = ["New Delegation Playbook signup", "", ...rows.map(([k, v]) => `${`${k}:`.padEnd(21)} ${v || "—"}`)].join("\n");
  const html = layout({
    preheader: `${s.name} downloaded the Delegation Playbook.`,
    body:
      heading("New playbook signup") +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.5">` +
      rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:${C.muted};white-space:nowrap">${k}</td><td style="padding:6px 0;color:${C.ink}">${escapeHtml(v) || "—"}</td></tr>`
        )
        .join("") +
      `</table>`,
  });
  return {
    from: from("SageStone Website"),
    to: [{ email_address: { address: to, name: "SageStone" } }],
    reply_to: [{ address: s.email, name: s.name }],
    subject: `Playbook signup: ${s.name}`,
    textbody: text,
    htmlbody: html,
  };
}

function sendToCrm(s) {
  return postToCrm({
    form: "delegation_playbook",
    lead_source: "Delegation Playbook",
    name: s.name,
    first_name: s.name.split(/\s+/)[0],
    last_name: s.name.split(/\s+/).slice(1).join(" "),
    email: s.email,
    company: s.company,
    marketing_opt_in: s.optIn,
    marketing_opt_in_at: s.optIn ? s.receivedAt : "",
    traffic_source: sourceLine(s.attribution),
    ...s.attribution,
    form_page: s.page,
    received_at: s.receivedAt,
  });
}
