/**
 * Contact form validation, shared by the website (src/app/lib/contact.ts) and
 * the serverless function that sends the emails (api/contact.js), so both
 * enforce exactly the same rules. Plain JavaScript so Node can import it
 * directly without a build step.
 */

/** Fields in the order they appear on the page, so focus goes to the first error. */
export const FIELD_ORDER = ["name", "email", "phone", "service", "message"];

export const NAME_MAX = 100;
export const EMAIL_MAX = 254;
export const COMPANY_MAX = 120;
export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;

/** Qualifying questions. Optional, but only these answers are accepted. */
export const HOURS_OPTIONS = ["Part-time", "Full-time", "More than one person", "Not sure yet"];
export const TIMELINE_OPTIONS = ["This month", "In 1–3 months", "Just exploring"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Required: name, email, service, and a short message. Phone is optional, but
 * it has to look like a real number when given, and it's required when the
 * visitor opts in to texts (consent without a number can't be honoured).
 *
 * @param {{ name?: unknown, email?: unknown, phone?: unknown, service?: unknown, message?: unknown, smsConsent?: unknown }} form
 * @returns {Partial<Record<"name" | "email" | "phone" | "service" | "message", string>>}
 */
export function validateContact(form) {
  const errors = {};
  const str = (v) => (typeof v === "string" ? v : "");
  const name = str(form.name).trim();
  const email = str(form.email).trim();
  const phone = str(form.phone).trim();
  const phoneDigits = phone.replace(/\D/g, "");
  const message = str(form.message).trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length < 2) errors.name = "Please enter your full name.";
  else if (name.length > NAME_MAX) errors.name = `Please keep your name under ${NAME_MAX} characters.`;

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address, like jane@company.com.";
  }

  if (phone && (phoneDigits.length < 7 || phoneDigits.length > 15 || /[^\d\s()+.-]/.test(phone))) {
    errors.phone = "Please enter a valid phone number, including the area code.";
  } else if (form.smsConsent === true && !phoneDigits) {
    errors.phone = "Please enter a mobile number to receive text messages, or untick the SMS box.";
  }

  if (!str(form.service).trim()) {
    errors.service = "Please choose what you need help with. Pick “Not sure yet” if you’re undecided.";
  }

  if (!message) errors.message = "Please tell us a little about what you need.";
  else if (message.length < MESSAGE_MIN) errors.message = `Please add a bit more detail (at least ${MESSAGE_MIN} characters).`;
  else if (message.length > MESSAGE_MAX) errors.message = `Please keep your message under ${MESSAGE_MAX} characters.`;

  if (str(form.hours) && !HOURS_OPTIONS.includes(str(form.hours))) errors.service = "Please choose an option from the list.";
  if (str(form.timeline) && !TIMELINE_OPTIONS.includes(str(form.timeline))) errors.service = "Please choose an option from the list.";

  return errors;
}
