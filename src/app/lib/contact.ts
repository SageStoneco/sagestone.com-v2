/**
 * Contact form submission.
 *
 * Posts to the site's own serverless function (api/contact.js), which checks
 * the submission again and sends two emails through ZeptoMail: a notification
 * to hello@sagestoneinc.com and a confirmation to the person who submitted.
 * See docs/contact-form-setup.md.
 */

import { validateContact as validate } from "./contact-rules.js";
import { readAttribution, type Attribution } from "./attribution";

export { FIELD_ORDER, MESSAGE_MAX, MESSAGE_MIN, HOURS_OPTIONS, TIMELINE_OPTIONS } from "./contact-rules.js";

export type ContactForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  /** Optional qualifying answers. */
  hours: string;
  timeline: string;
  message: string;
  /** Optional. Never required to submit — consent cannot be a condition of contact. */
  smsConsent: boolean;
  /** Honeypot: hidden from real users, so anything here means a bot. */
  website: string;
};

export type ContactPayload = ContactForm & {
  smsConsentSource: string | null;
  smsConsentAt: string | null;
  page: string;
  attribution: Attribution;
  /** Shared by the browser lead event and Meta Conversions API, so Meta counts the lead once. */
  eventId: string;
};

export type ContactErrors = Partial<Record<"name" | "email" | "phone" | "service" | "message", string>>;

/** Same rules as the server (src/app/lib/contact-rules.js). */
export function validateContact(form: ContactForm): ContactErrors {
  return validate(form);
}

export function buildPayload(form: ContactForm): ContactPayload {
  return {
    ...form,
    // Carrier review requires a record of how and when SMS consent was captured.
    smsConsentSource: form.smsConsent ? "web form" : null,
    smsConsentAt: form.smsConsent ? new Date().toISOString() : null,
    page: typeof window === "undefined" ? "" : window.location.pathname,
    attribution: readAttribution(),
    eventId: newEventId(),
  };
}

function newEventId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/** The server has no ZeptoMail credentials configured. */
export class ContactConfigError extends Error {}

/** The server rejected or couldn't send the submission. */
export class ContactSendError extends Error {
  constructor(
    message: string,
    /** Field errors from the server's validation, when that's why it failed. */
    readonly fields: ContactErrors = {}
  ) {
    super(message);
  }
}

/**
 * Deliberately NOT retried on failure: a retry after an ambiguous result
 * (for example a timeout after ZeptoMail accepted the email) would send
 * duplicate notifications. Failures are shown to the visitor instead, with
 * hello@sagestoneinc.com as the fallback.
 */
export async function submitContact(form: ContactForm): Promise<{ eventId: string }> {
  const payload = buildPayload(form);
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) return { eventId: payload.eventId };

  const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: ContactErrors };
  if (data.error === "not_configured") {
    throw new ContactConfigError("The contact form's email service isn't configured.");
  }
  throw new ContactSendError(data.error ?? `HTTP ${res.status}`, data.fields);
}
