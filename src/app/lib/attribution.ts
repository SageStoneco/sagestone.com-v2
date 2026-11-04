/* Remembers where a visitor came from (UTMs, ad click IDs, first landing page,
 * referrer) for the length of the browser session, so the contact form can
 * send it with the lead. First touch wins within a session. */

const KEY = "ss_attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "li_fat_id", "msclkid"] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | "landing_page" | "referrer", string>>;

export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const existing = sessionStorage.getItem(KEY);
    const qs = new URLSearchParams(window.location.search);
    const fromUrl: Attribution = {};
    for (const p of PARAMS) {
      const v = qs.get(p);
      if (v) fromUrl[p] = v.slice(0, 200);
    }
    // A new campaign click in the same session replaces the stored source.
    if (existing && !Object.keys(fromUrl).length) return;
    const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
    const data: Attribution = {
      ...fromUrl,
      landing_page: (window.location.pathname + window.location.search).slice(0, 300),
      ...(ref ? { referrer: ref.slice(0, 300) } : {}),
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage blocked: attribution is best-effort */
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}
