/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Tag Manager container, e.g. GTM-XXXXXXX. GA4, Google Ads, Meta Pixel and LinkedIn Insight load through it. */
  readonly VITE_GTM_ID?: string;
  /** Public scheduling link (e.g. https://cal.com/sagestone/discovery). Enables the booking step after the contact form. */
  readonly VITE_BOOKING_URL?: string;
  /** Tidio public key. Enables the chat widget. */
  readonly VITE_TIDIO_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
