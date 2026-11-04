# Delegation Playbook: lead magnet and follow-up series

## How it works

1. A visitor enters their first name and email on `/delegation-playbook` or in the box at the end of any blog post. There's an optional, unticked checkbox for the five-email series.
2. `api/playbook.js` sends **one transactional email through ZeptoMail** with the download link, plus a notification to `hello@sagestoneinc.com`.
3. The same function POSTs the lead to `CRM_WEBHOOK_URL` with `lead_source: "Delegation Playbook"` and `marketing_opt_in: true/false`.
4. **Zoho Campaigns** sends the five follow-up emails below, **only** to leads with `marketing_opt_in = true`.

ZeptoMail only allows transactional email, so the follow-up series must not be sent through it. Sending marketing email through ZeptoMail can get the account suspended, and that would also stop the contact form emails.

The browser pushes `lead_magnet_signup` (with `marketing_opt_in`) and `lead_magnet_download` to the dataLayer for GTM. See `docs/growth-setup.md`.

## Files

| What | Where |
|---|---|
| PDF (served to visitors) | `public/downloads/sagestone-delegation-playbook.pdf` |
| PDF source: the 50 tasks | `scripts/lead-magnet/tasks.mjs` |
| PDF layout and copy | `scripts/lead-magnet/render.mjs` |
| Signup endpoint | `api/playbook.js` |
| Signup form | `src/app/components/growth/PlaybookSignup.tsx` |
| Landing page | `src/app/pages/DelegationPlaybook.tsx` |

To change the PDF, edit the two source files and re-render:

```bash
node scripts/lead-magnet/render.mjs
```

This needs Playwright with Chromium. If `playwright` isn't installed in the project, run it with `NODE_PATH="$(npm root -g)"` against a global install.

## Zoho setup

1. **Zoho CRM fields.** Map the webhook payload to a Lead:
   - `first_name` and `last_name`
   - `email`
   - `lead_source` → Lead Source. Add the picklist value "Delegation Playbook".
   - `marketing_opt_in` → a checkbox field, for example "Email Opt In"
   - `utm_source`, `utm_medium`, `utm_campaign`, if you keep custom fields for them
2. **Zoho Flow** (or Make). Use a webhook trigger, then "Create or update Lead" in Zoho CRM, matched on email. Put the webhook URL in Vercel as `CRM_WEBHOOK_URL`.
3. **Zoho Campaigns.** Create a mailing list called "Delegation Playbook". Sync it from Zoho CRM with the filter *Lead Source = Delegation Playbook AND Email Opt In = true*.
4. **Autoresponder.** In Zoho Campaigns, create a signup-based autoresponder on that list with the five emails below, on days 1, 3, 6, 9 and 13 after joining.
5. **Postal address.** U.S. law (CAN-SPAM) requires a valid physical postal address in every marketing email. Set it in Zoho Campaigns' sender details. A P.O. box or registered business address is fine.
6. **Sender.** Send from a person, for example Jesel at `hello@sagestoneinc.com`, on a domain with SPF and DKIM set up in Zoho Campaigns.

The copy uses `{{first_name}}`. Replace it with Zoho Campaigns' First Name merge tag (*Insert merge tag* in the editor) and set a fallback such as "there".

---

## The five emails

### Email 1 · Day 1 · Where to start

**Subject:** The three tasks to hand off first
**Preview:** Not the easiest ones. The ones that cost you most.

Hi {{first_name}},

Thanks for grabbing the Delegation Playbook. If you've ticked a few boxes already, you've probably found more than you expected.

Here's the question I get most: *where do I start?*

Not with the easiest tasks. Start with the three that cost you the most. Score each ticked task from 1 to 3 on two things:

- **Time:** how many hours it takes each week
- **Drain:** how much it pulls you out of focused work

Add the two scores. Your top three are where to start, as long as you can describe how you do them. If a task depends on judgment you can't put into steps yet, leave it for now.

Next time: the 20-minute way to write a task down so someone else can do it well.

Jesel
Founder, SageStone

---

### Email 2 · Day 3 · Write it down first

**Subject:** Write it down before you hand it over
**Preview:** A 20-minute method that doesn't involve writing a manual.

Hi {{first_name}},

Most handoffs go wrong for one reason: the process only exists in someone's head.

You don't need a manual. You need twenty minutes:

1. **Record yourself doing the task once.** Talk through what you're doing and why.
2. **Turn the recording into a short checklist.** Steps, links, logins needed.
3. **Write down what "done" looks like.** For example: "every inquiry answered within four business hours" or "CRM updated by Friday 3pm".
4. **Note the exceptions.** When should they stop and ask you?

That's a working SOP. It will be rough, and that's fine. It gets better every time someone uses it and asks a question.

If you'd like to read more first, here's our guide: https://www.sagestoneinc.com/blog/how-to-document-repetitive-processes

Jesel

---

### Email 3 · Day 6 · The first week

**Subject:** What a good first week looks like
**Preview:** Most handoffs are decided in the first five days.

Hi {{first_name}},

When delegation doesn't work out, it's usually decided in week one. Here's what makes the difference:

- **Access, set up properly.** Delegated email and calendar access, a password manager for shared logins, and only the systems the starting tasks need.
- **Context before tasks.** Ten minutes on who your customers are and what matters this quarter saves hours of guessing.
- **Do it once together.** You do the task while they watch, then they do it while you watch.
- **A short daily check-in.** Ten to fifteen minutes in week one. You'll cut it back by week three.

Page 7 of the playbook has the full four-week plan as a checklist. It's worth printing.

Jesel

---

### Email 4 · Day 9 · What kind of help

**Subject:** Assistant, executive assistant, or a small team?
**Preview:** Your worksheet total is the best clue.

Hi {{first_name}},

If you've filled in the hours worksheet, you have a number. Here's roughly what it suggests:

- **Under 10 hours a week:** document your top three tasks first. A few focused hours of help may be enough to start.
- **10 to 25 hours:** a part-time dedicated assistant who owns those tasks end to end.
- **25 hours or more:** a full-time teammate, or two people across areas like customer support and back office.

The type of work matters too. A virtual assistant typically owns defined, recurring work: inbox, scheduling, admin, follow-up. An executive assistant works more closely with one leader, with more discretion and context.

More on the difference: https://www.sagestoneinc.com/blog/virtual-assistant-vs-executive-assistant

Jesel

---

### Email 5 · Day 13 · An offer to help

**Subject:** Want a second pair of eyes on your worksheet?
**Preview:** A 30-minute call, no pressure.

Hi {{first_name}},

This is the last email in the series.

If you've got a list of tasks and an hours total, I'd be glad to look at it with you. On a 30-minute discovery call we'll:

- go through what you've ticked and what should stay with you
- recommend where to start and how many hours of help it really needs
- explain how we'd match you with dedicated talent in the Philippines, and how onboarding works

Most engagements begin onboarding within 24 to 72 hours of the call. If now isn't the right time, that's completely fine. Keep the playbook, and reply to this email whenever you're ready.

Book a call: https://www.sagestoneinc.com/contact?utm_source=zoho_campaigns&utm_medium=email&utm_campaign=delegation_series

Jesel
Founder, SageStone
