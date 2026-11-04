/* Google Tag Manager + a typed dataLayer.
 *
 * Only GTM is loaded from the site. GA4, the Google Ads conversion tag, Meta
 * Pixel and the LinkedIn Insight Tag are configured inside the GTM container,
 * triggered by the events pushed here:
 *   page_view      on every route change (SPA navigation)
 *   generate_lead  when the contact form is accepted by the server
 *   book_call_click when a visitor opens the scheduler
 */

import { GTM_ID } from "./env";

type DataLayerEvent = { event: string } & Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[] | unknown[];
  }
}

let loaded = false;

export function loadTagManager() {
  if (loaded || !GTM_ID || typeof window === "undefined") return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(s);
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
