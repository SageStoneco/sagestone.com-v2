/* Delegation Playbook signup: posts to api/playbook.js, which emails the PDF
 * through ZeptoMail and sends the lead to the CRM webhook. */

import { validatePlaybook as validate, PLAYBOOK_PDF } from "./playbook-rules.js";
import { readAttribution } from "./attribution";

export { PLAYBOOK_PDF };

export type PlaybookForm = {
  name: string;
  email: string;
  /** Optional, unticked by default: the five-email follow-up series in Zoho Campaigns. */
  marketingOptIn: boolean;
  /** Honeypot. */
  website: string;
};

export type PlaybookErrors = Partial<Record<"name" | "email", string>>;

export const validatePlaybook = (form: PlaybookForm): PlaybookErrors => validate(form);

export class PlaybookError extends Error {
  constructor(
    readonly code: string,
    readonly fields: PlaybookErrors = {}
  ) {
    super(code);
  }
}

export async function submitPlaybook(form: PlaybookForm): Promise<void> {
  const res = await fetch("/api/playbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      page: typeof window === "undefined" ? "" : window.location.pathname,
      attribution: readAttribution(),
    }),
  });
  if (res.ok) return;
  const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: PlaybookErrors };
  throw new PlaybookError(data.error ?? `HTTP ${res.status}`, data.fields);
}
