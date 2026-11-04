/**
 * POST /api/contact: the website's contact form endpoint (Vercel Function).
 *
 * Checks the submission with the same rules as the form, then sends two
 * emails through ZeptoMail:
 *   1. a notification to the team (reply-to: the person who submitted), and
 *   2. a fixed-text confirmation to the person who submitted.
 *
 * The ZeptoMail token stays on the server; it is never sent to the browser.
 * Configuration (Vercel → Settings → Environment Variables):
 *   ZEPTOMAIL_TOKEN     required. Send Mail token from the ZeptoMail Mail Agent.
 *   ZEPTOMAIL_API_URL   optional. Defaults to the US data centre; set it for
 *                       EU/IN/AU accounts, e.g. https://api.zeptomail.eu/v1.1/email
 *   CONTACT_FROM        optional. Defaults to noreply@sagestoneinc.com. Must be
 *                       on a domain verified in ZeptoMail.
 *   CONTACT_TO          optional. Defaults to hello@sagestoneinc.com.
 *   VITE_BOOKING_URL    optional. Scheduling link added to the confirmation email.
 *   CRM_WEBHOOK_URL     optional. Each lead is POSTed here as JSON (Zoho Flow,
 *                       Make, Zapier or a CRM's own webhook) to create a CRM lead.
 *   META_PIXEL_ID +
 *   META_CAPI_TOKEN     optional. Sends a server-side "Lead" event to Meta's
 *                       Conversions API, deduplicated with the browser pixel.
 *
 * See docs/contact-form-setup.md.
 */

import { createHash } from "node:crypto";
import { validateContact, COMPANY_MAX } from "../src/app/lib/contact-rules.js";
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
  if (origin && !ALLOWED_ORIGIN.test(origin)) {
    return json(403, { error: "forbidden" });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "too_large" });

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_json" });
  }
  if (!data || typeof data !== "object") return json(400, { error: "invalid_json" });

  // Honeypot: real people leave this hidden field empty. Report success so
  // bots don't retry, but send nothing.
  if (typeof data.website === "string" && data.website.trim()) {
    return json(200, { ok: true });
  }

  const fields = validateContact(data);
  if (Object.keys(fields).length) return json(400, { error: "invalid", fields });

  const token = process.env.ZEPTOMAIL_TOKEN?.trim();
  if (!token) {
    console.error("contact: ZEPTOMAIL_TOKEN is not set");
    return json(503, { error: "not_configured" });
  }

  const submission = {
    name: clean(data.name, 100),
    email: clean(data.email, 254),
    phone: clean(data.phone, 25),
    company: clean(data.company, COMPANY_MAX),
    service: clean(data.service, 80),
    hours: clean(data.hours, 40),
    timeline: clean(data.timeline, 40),
    message: clean(data.message, 2000),
    smsConsent: data.smsConsent === true,
    smsConsentAt: data.smsConsent === true ? clean(data.smsConsentAt, 40) : "",
    page: clean(data.page, 200),
    attribution: cleanAttribution(data.attribution),
    eventId: clean(data.eventId, 64),
    ip: clean((request.headers.get("x-forwarded-for") || "").split(",")[0], 64),
    userAgent: clean(request.headers.get("user-agent"), 300),
    receivedAt: new Date().toISOString(),
  };

  const mail = mailer(token);

  // The team notification is the one that matters: if it fails, the visitor
  // is told so they can email instead.
  try {
    await mail(notification(submission));
  } catch (err) {
    console.error("contact: notification failed", err);
    return json(502, { error: "send_failed" });
  }

  // The confirmation is a courtesy. The team already has the enquiry, so a
  // bounce here shouldn't turn the submission into a failure.
  try {
    await mail(confirmation(submission));
  } catch (err) {
    console.error("contact: confirmation failed", err);
  }

  // CRM and ad-platform hand-offs are best-effort: the team already has the
  // lead by email, so a failure here is logged, never shown to the visitor.
  await Promise.allSettled([sendToCrm(submission), sendMetaLead(submission)]).then((results) =>
    results.forEach((r) => r.status === "rejected" && console.error("contact: hand-off failed", r.reason))
  );

  return json(200, { ok: true });
}

async function sendToCrm(s) {
  await postToCrm({
    form: "contact",
    name: s.name,
    first_name: s.name.split(/\s+/)[0],
    last_name: s.name.split(/\s+/).slice(1).join(" "),
    email: s.email,
    phone: s.phone,
    company: s.company,
    service: s.service,
    hours: s.hours,
    timeline: s.timeline,
    message: s.message,
    sms_consent: s.smsConsent,
    sms_consent_at: s.smsConsentAt,
    lead_source: sourceLine(s.attribution),
    ...s.attribution,
    form_page: s.page,
    received_at: s.receivedAt,
  });
}

const sha256 = (v) => createHash("sha256").update(v).digest("hex");

async function sendMetaLead(s) {
  const pixel = process.env.META_PIXEL_ID?.trim();
  const token = process.env.META_CAPI_TOKEN?.trim();
  if (!pixel || !token) return;
  const phone = s.phone.replace(/\D/g, "");
  const user_data = {
    em: [sha256(s.email.toLowerCase())],
    ...(phone ? { ph: [sha256(phone)] } : {}),
    ...(s.ip ? { client_ip_address: s.ip } : {}),
    ...(s.userAgent ? { client_user_agent: s.userAgent } : {}),
    ...(s.attribution.fbclid ? { fbc: `fb.1.${Date.now()}.${s.attribution.fbclid}` } : {}),
  };
  const res = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(pixel)}/events?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          ...(s.eventId ? { event_id: s.eventId } : {}),
          action_source: "website",
          event_source_url: `${SITE}${s.page || "/contact"}`,
          user_data,
          custom_data: { content_name: s.service },
        },
      ],
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Meta CAPI ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

function notification(s) {
  const to = process.env.CONTACT_TO?.trim() || DEFAULT_TO;
  const consent = s.smsConsent ? `YES, via web form${s.smsConsentAt ? ` at ${s.smsConsentAt}` : ""}` : "no";
  const rows = [
    ["Name", s.name],
    ["Email", s.email],
    ["Phone", s.phone],
    ["Company", s.company],
    ["Service", s.service],
    ["Hours", s.hours],
    ["Timeline", s.timeline],
    ["Source", sourceLine(s.attribution)],
    ["SMS consent", consent],
    ["Page", s.page],
    ["Landing page", s.attribution.landing_page],
    ["Campaign", [s.attribution.utm_campaign, s.attribution.utm_term, s.attribution.utm_content].filter(Boolean).join(" · ")],
    ["Received", s.receivedAt],
    ["User agent", s.userAgent],
  ];

  const text = [
    "New contact form submission from sagestoneinc.com",
    "",
    ...rows.slice(0, 8).map(([k, v]) => `${`${k}:`.padEnd(10)} ${v || "—"}`),
    "",
    "Message:",
    s.message,
    "",
    "---",
    ...rows.slice(8).map(([k, v]) => `${`${k}:`.padEnd(12)} ${v || "—"}`),
  ].join("\n");

  const detailRow = ([k, v]) =>
    `<tr><td style="padding:6px 16px 6px 0;color:${C.muted};vertical-align:top;white-space:nowrap">${k}</td>` +
    `<td style="padding:6px 0;color:${C.ink}">${escapeHtml(v) || "—"}</td></tr>`;

  const html = layout({
    preheader: `${s.name} (${s.email}) sent an enquiry about ${s.service}.`,
    body:
      heading("New website enquiry") +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.5;margin:0 0 20px">` +
      rows.slice(0, 8).map(detailRow).join("") +
      `</table>` +
      `<p style="margin:0 0 6px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted}">Message</p>` +
      `<div style="margin:0 0 24px;padding:16px 18px;background:${C.ivory};border-left:3px solid ${C.sage};border-radius:4px;white-space:pre-wrap;font-size:15px;line-height:1.6;color:${C.ink}">${escapeHtml(s.message)}</div>` +
      button(`mailto:${s.email}`, `Reply to ${s.name.split(/\s+/)[0]}`) +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;font-size:12px;line-height:1.5;border-top:1px solid ${C.rule};width:100%">` +
      `<tr><td style="height:12px"></td></tr>` +
      rows.slice(8).map(detailRow).join("") +
      `</table>`,
  });

  return {
    from: from("SageStone Website"),
    to: [{ email_address: { address: to, name: "SageStone" } }],
    reply_to: [{ address: s.email, name: s.name }],
    subject: `New enquiry: ${s.name}`,
    textbody: text,
    htmlbody: html,
  };
}

/**
 * Deliberately fixed text: it never repeats what the person typed, so the form
 * can't be used to send arbitrary content to someone else's inbox.
 */
function confirmation(s) {
  let firstName = s.name.split(/\s+/)[0].slice(0, 40);
  // Names only: anything that looks like a link or address becomes "there".
  if (!/^[\p{L}'’-]+$/u.test(firstName)) firstName = "there";
  const to = process.env.CONTACT_TO?.trim() || DEFAULT_TO;
  const booking = bookingUrl();

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for reaching out to SageStone. We have received your inquiry, and",
    "one of our team members will reach out as soon as we can, usually within",
    "one business day.",
    "",
    ...(booking ? ["Want to skip the back-and-forth? Pick a time for your discovery call here:", booking, ""] : []),
    "If you need to add anything in the meantime, just reply to this email.",
    "",
    "Warm regards,",
    "The SageStone Team",
    "https://www.sagestoneinc.com",
  ].join("\n");

  const p = (t) => `<p style="margin:0 0 16px">${t}</p>`;
  const html = layout({
    preheader: "Thanks for reaching out. One of our team members will be in touch soon.",
    body:
      heading("We’ve received your inquiry") +
      `<div style="font-size:16px;line-height:1.65;color:${C.ink}">` +
      p(`Hi ${escapeHtml(firstName)},`) +
      p("Thank you for reaching out to SageStone. We have received your inquiry, and one of our team members will reach out as soon as we can, usually within one business day.") +
      (booking ? p("Want to skip the back-and-forth? Pick a time for your discovery call now.") : "") +
      p("If you need to add anything in the meantime, just reply to this email.") +
      `</div>` +
      `<div style="margin:8px 0 28px">${booking ? button(booking, "Choose a time") : button(`${SITE}/how-it-works`, "See how we work")}</div>` +
      `<p style="margin:0;font-size:16px;line-height:1.6;color:${C.ink}">Warm regards,<br><strong>The SageStone Team</strong></p>`,
  });

  return {
    from: from("SageStone"),
    to: [{ email_address: { address: s.email, name: s.name } }],
    reply_to: [{ address: to, name: "SageStone" }],
    subject: "We received your inquiry - SageStone",
    textbody: text,
    htmlbody: html,
  };
}

