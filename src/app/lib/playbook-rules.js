/**
 * Delegation Playbook signup validation, shared by the website
 * (src/app/lib/playbook.ts) and the serverless function (api/playbook.js).
 */

export const PLAYBOOK_PDF = "/downloads/sagestone-delegation-playbook.pdf";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * @param {{ name?: unknown, email?: unknown }} form
 * @returns {Partial<Record<"name" | "email", string>>}
 */
export function validatePlaybook(form) {
  const errors = {};
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const name = str(form.name);
  const email = str(form.email);
  if (!name) errors.name = "Please enter your first name.";
  else if (name.length > 100) errors.name = "Please keep your name under 100 characters.";
  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = "Please enter a valid email address, like jane@company.com.";
  return errors;
}
