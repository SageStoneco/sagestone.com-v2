/* Public, build-time configuration (Vercel → Settings → Environment Variables).
 * Every integration is off until its variable is set, so the site never loads
 * a tag or widget with a placeholder ID. See docs/growth-setup.md. */

const read = (v: string | undefined) => (typeof v === "string" && v.trim() ? v.trim() : "");

export const GTM_ID = /^GTM-[A-Z0-9]+$/.test(read(import.meta.env.VITE_GTM_ID)) ? read(import.meta.env.VITE_GTM_ID) : "";
export const BOOKING_URL = /^https:\/\//.test(read(import.meta.env.VITE_BOOKING_URL)) ? read(import.meta.env.VITE_BOOKING_URL) : "";
export const TIDIO_KEY = /^[a-z0-9]+$/i.test(read(import.meta.env.VITE_TIDIO_KEY)) ? read(import.meta.env.VITE_TIDIO_KEY) : "";
