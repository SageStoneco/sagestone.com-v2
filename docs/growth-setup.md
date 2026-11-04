# Growth setup: tracking, booking, CRM and chat

Every integration below is **off until its environment variable is set**, so the
site never loads a tag or widget with a placeholder ID. Set variables in
Vercel → Project → Settings → Environment Variables, then redeploy (the `VITE_`
ones are read at build time).

| Variable | Where it's used | What it switches on |
|---|---|---|
| `VITE_GTM_ID` | Browser | Google Tag Manager (`GTM-XXXXXXX`). Configure GA4, Google Ads, Meta Pixel and LinkedIn Insight **inside GTM**. |
| `VITE_BOOKING_URL` | Browser + `api/contact.js` | Scheduler on `/contact/thank-you` and a "Choose a time" button in the confirmation email. Use the public Cal.com event link. |
| `VITE_TIDIO_KEY` | Browser | Tidio chat widget (public key from Tidio → Settings → Developer). |
| `CRM_WEBHOOK_URL` | `api/contact.js` | Each lead is POSTed as JSON to this URL. Point it at a Zoho Flow / Make / Zapier webhook that creates a Zoho CRM (or Bigin) Lead. |
| `META_PIXEL_ID` + `META_CAPI_TOKEN` | `api/contact.js` | Server-side Meta Conversions API `Lead` event, deduplicated with the browser pixel via `event_id`. |

## dataLayer events (for GTM triggers)

| Event | When | Useful parameters |
|---|---|---|
| `page_view` | Every route change (the site is a single-page app) | `page_path`, `page_title` |
| `generate_lead` | The contact form was accepted by the server | `event_id`, `service`, `hours`, `timeline` |
| `book_call_click` | "Choose a time" clicked on the thank-you page | `location` |
| `lead_magnet_signup` | Delegation Playbook form accepted | `lead_magnet`, `marketing_opt_in` |
| `lead_magnet_download` | "Download the PDF" clicked after signup | `lead_magnet` |

Suggested GTM setup:

1. **GA4 Configuration** tag on All Pages, with *Send page view* off; a GA4 event tag on the `page_view` custom event.
2. **GA4 event** `generate_lead` on the `generate_lead` custom event; mark it as a key event in GA4.
3. **Google Ads conversion** on `generate_lead` (enable enhanced conversions if wanted).
4. **Meta Pixel** base code on All Pages, and `fbq('track', 'Lead', {}, {eventID: {{DLV - event_id}}})` on `generate_lead`, so it deduplicates with the server event.
5. **LinkedIn Insight Tag** on All Pages, and a LinkedIn conversion on `generate_lead`.
6. Add a consent banner (for example GTM's Consent Mode template) before running ads to EU/UK visitors.

The thank-you page is a real URL, `/contact/thank-you`, so URL-based goals work too.

## Lead source on every inquiry

`src/app/lib/attribution.ts` stores UTMs, click IDs (`gclid`, `gbraid`, `wbraid`,
`fbclid`, `li_fat_id`, `msclkid`), the first landing page and the external referrer
for the browser session. The contact form sends them with the inquiry; they appear
in the notification email ("Source", "Landing page", "Campaign") and in the CRM
webhook payload (`lead_source`, `utm_*`, click IDs).

Use `generate_lead` (discovery-call requests) as the primary ad conversion, and `lead_magnet_signup` as a secondary one, so ad platforms don't optimize toward PDF downloads.

## Delegation Playbook

See `docs/delegation-playbook.md` for the lead magnet, the Zoho setup and the five follow-up emails.

## Paid landing pages

`/lp/hire-a-virtual-assistant` and `/lp/customer-support-outsourcing` are noindex,
have a logo-only header and an inline form. Edit or add pages in
`src/app/content/landing.ts`.

## Things only the business can fill in

- **Prices:** set `fromPrice` on each model in `src/app/content/pricing.ts`. Until then cards read "Quote after your discovery call".
- **Guarantee:** set `guarantee` in the same file to the exact agreed policy. Nothing shows while it's `null`.
- **Testimonials:** add real, approved quotes to `testimonials` in `src/app/content/site.ts`. The section is hidden while the list is empty.
- **Case studies:** add entries to `caseStudies` in the same file.
- **Team:** add people to `team` in `src/app/content/team.ts` (photos in `public/team/`). Leadership and talent sections appear once they have entries.
- **Business address:** replace "Remote-first · Global" in the footer once a public address is chosen.
