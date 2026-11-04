/**
 * Renders the Delegation Playbook PDF:
 *   node scripts/lead-magnet/render.mjs
 * → public/downloads/sagestone-delegation-playbook.pdf
 *
 * Needs Playwright with Chromium (`npx playwright install chromium` locally if
 * it isn't already available) and network access for Google Fonts.
 */
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { taskGroups } from "./tasks.mjs";

// require() so a globally installed Playwright (NODE_PATH) also resolves.
const { chromium } = createRequire(import.meta.url)("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const outDir = path.join(root, "public/downloads");
const outFile = path.join(outDir, "sagestone-delegation-playbook.pdf");

const monogram = (await readFile(path.join(root, "public/sagestone-monogram.svg"), "utf8"))
  .replace(/<metadata>.*?<\/metadata>/s, "")
  .replace(/width="[^"]*" height="[^"]*"/, 'class="mono"');

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const box = '<span class="box" aria-hidden="true"></span>';

const page = (n, body, cls = "") => `
<section class="page ${cls}">
  ${body}
  ${n ? `<footer><span>SageStone · The Delegation Playbook</span><span>sagestoneinc.com</span><span>${n}</span></footer>` : ""}
</section>`;

let taskNo = 0;
const taskTable = (g) => `
  <div class="group">
    <h3>${esc(g.name)}</h3>
    <table class="tasks">
      <thead><tr><th class="c-box">Hand off?</th><th>Task</th><th class="c-hrs">Hrs / week</th></tr></thead>
      <tbody>
        ${g.tasks.map((t) => `<tr><td class="c-box">${box}</td><td><span class="n">${String(++taskNo).padStart(2, "0")}</span>${esc(t)}</td><td class="c-hrs"><span class="line"></span></td></tr>`).join("")}
      </tbody>
    </table>
  </div>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>The Delegation Playbook · SageStone</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  @page { size: Letter; margin: 0; }
  :root { --ivory:#F5F1E8; --cloud:#FAF8F4; --ink:#222622; --muted:#5E655C; --sage:#7E8A77; --sage-ink:#59634F; --gold:#B49A6C; --gold-ink:#7E6636; --pine:#171B18; --chalk:#EEE9E0; --rule:#DED8CB; }
  * { box-sizing: border-box; }
  html, body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font: 10.5pt/1.55 Inter, system-ui, sans-serif; color: var(--ink); }
  .page { width: 8.5in; height: 11in; padding: 0.75in 0.8in 0.9in; position: relative; overflow: hidden; background: var(--ivory); page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  h1, h2, h3 { font-family: Fraunces, Georgia, serif; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
  h2 { font-size: 26pt; line-height: 1.08; margin-top: 10pt; }
  h3 { font-size: 13.5pt; margin: 0 0 6pt; }
  p { margin: 0 0 9pt; max-width: 6.2in; }
  .eyebrow { font-size: 7.5pt; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-ink); font-weight: 600; display: flex; align-items: center; gap: 8pt; }
  .eyebrow::before { content: ""; width: 22pt; height: 1px; background: var(--gold); }
  .lede { font-size: 12pt; color: var(--muted); margin-top: 12pt; }
  footer { position: absolute; left: 0.8in; right: 0.8in; bottom: 0.45in; display: flex; justify-content: space-between; font-size: 7.5pt; color: var(--muted); border-top: 1px solid var(--rule); padding-top: 7pt; }
  .mono { height: 30pt; width: auto; color: var(--sage); }
  .brand { display: flex; align-items: center; gap: 9pt; font-family: Fraunces, serif; font-weight: 600; font-size: 16pt; }
  .brand b { color: var(--sage); font-weight: 600; }

  /* cover */
  .cover { background: var(--pine); color: var(--chalk); display: flex; flex-direction: column; }
  .cover .brand { color: var(--chalk); }
  .cover h1 { font-size: 50pt; line-height: 0.98; margin-top: auto; }
  .cover h1 em { font-style: normal; color: var(--sage); }
  .cover .lede { color: rgba(238,233,224,.72); font-size: 13pt; max-width: 5.2in; }
  .cover .inside { margin-top: 26pt; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14pt; border-top: 1px solid rgba(238,233,224,.18); padding-top: 16pt; margin-bottom: 0.4in; }
  .cover .inside b { display: block; font-family: Fraunces, serif; font-size: 22pt; color: var(--gold); font-weight: 600; }
  .cover .inside span { font-size: 9pt; color: rgba(238,233,224,.72); }
  .stones { position: absolute; right: -0.4in; top: 1.2in; width: 4in; opacity: .9; }

  /* steps */
  .steps { display: grid; gap: 12pt; margin-top: 20pt; }
  .step { display: grid; grid-template-columns: 34pt 1fr; gap: 12pt; padding: 13pt 15pt; background: var(--cloud); border: 1px solid var(--rule); border-radius: 10pt; }
  .step .num { font-family: Fraunces, serif; font-size: 22pt; color: var(--gold-ink); line-height: 1; }
  .step h3 { margin-bottom: 3pt; }
  .step p { margin: 0; color: var(--muted); }
  .keep { margin-top: 18pt; padding: 14pt 16pt; border-left: 3pt solid var(--sage); background: rgba(126,138,119,.1); border-radius: 0 10pt 10pt 0; }
  .keep ul { margin: 6pt 0 0; padding-left: 14pt; color: var(--muted); }

  /* task tables */
  .group { margin-top: 16pt; break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; }
  .tasks th { font-size: 7pt; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); font-weight: 600; text-align: left; padding: 0 6pt 4pt; border-bottom: 1px solid var(--ink); }
  .tasks td { padding: 4.6pt 6pt; border-bottom: 1px solid var(--rule); vertical-align: middle; font-size: 9.6pt; }
  .tasks .n { display: inline-block; width: 18pt; color: var(--gold-ink); font-variant-numeric: tabular-nums; font-size: 8pt; }
  .c-box { width: 52pt; } .c-hrs { width: 72pt; }
  .box { display: inline-block; width: 10pt; height: 10pt; border: 1.2px solid var(--sage-ink); border-radius: 2.5pt; vertical-align: middle; }
  .line { display: inline-block; width: 46pt; border-bottom: 1px solid var(--muted); height: 10pt; }

  /* worksheet */
  .ws th, .ws td { padding: 9pt 10pt; border-bottom: 1px solid var(--rule); text-align: left; }
  .ws th { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); border-bottom: 1px solid var(--ink); }
  .ws td.blank { width: 1.3in; } .ws td.blank span { display: block; border-bottom: 1px solid var(--muted); height: 14pt; }
  .ws tr.total td { font-family: Fraunces, serif; font-size: 13pt; font-weight: 600; border-bottom: 2px solid var(--ink); }
  .bands { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin-top: 18pt; }
  .band { padding: 13pt; border-radius: 10pt; background: var(--cloud); border: 1px solid var(--rule); }
  .band b { font-family: Fraunces, serif; font-size: 15pt; display: block; color: var(--sage-ink); }
  .band p { font-size: 9pt; color: var(--muted); margin: 5pt 0 0; }
  .note { font-size: 8.5pt; color: var(--muted); margin-top: 10pt; }

  /* checklist */
  .weeks { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt 18pt; margin-top: 16pt; }
  .week { padding: 13pt 15pt; background: var(--cloud); border: 1px solid var(--rule); border-radius: 10pt; }
  .week h3 { font-size: 12pt; }
  .week ul { list-style: none; margin: 4pt 0 0; padding: 0; display: grid; gap: 5pt; }
  .week li { display: grid; grid-template-columns: 14pt 1fr; gap: 6pt; font-size: 9.3pt; align-items: start; }
  .week li .box { margin-top: 2pt; }
  .week.wide { grid-column: span 2; }
  .week.wide ul { grid-template-columns: 1fr 1fr; column-gap: 18pt; }

  /* back cover */
  .back { background: var(--pine); color: var(--chalk); display: flex; flex-direction: column; justify-content: center; }
  .back h2 { font-size: 34pt; color: var(--chalk); max-width: 5.6in; }
  .back p { color: rgba(238,233,224,.75); font-size: 12pt; max-width: 5.2in; }
  .back .cta { align-self: flex-start; display: inline-block; margin-top: 14pt; padding: 11pt 22pt; border-radius: 99pt; background: var(--sage); color: var(--pine); font-weight: 600; text-decoration: none; font-size: 11pt; }
  .back .contact { margin-top: 30pt; display: grid; gap: 4pt; font-size: 10pt; color: rgba(238,233,224,.75); }
  .back .brand { position: absolute; top: 0.75in; left: 0.8in; color: var(--chalk); }
  .back footer, .cover footer { color: rgba(238,233,224,.6); border-color: rgba(238,233,224,.18); }
</style></head><body>

${page(0, `
  <div class="brand">${monogram}<span>Sage<b>Stone</b></span></div>
  <svg class="stones" viewBox="0 0 300 300" aria-hidden="true">
    <ellipse cx="150" cy="236" rx="96" ry="26" fill="#59634F"/><ellipse cx="146" cy="190" rx="74" ry="23" fill="#7E8A77"/>
    <ellipse cx="156" cy="149" rx="56" ry="20" fill="#D9C9A6"/><ellipse cx="148" cy="113" rx="40" ry="17" fill="#C9D0C1"/><ellipse cx="153" cy="82" rx="24" ry="13" fill="#B49A6C"/>
  </svg>
  <span class="eyebrow" style="margin-top:auto;color:#CDB68A">A practical guide for founders</span>
  <h1 style="margin-top:12pt">The <em>Delegation</em><br>Playbook</h1>
  <p class="lede">Find the work you should stop doing, see how many hours it adds up to, and hand it over properly in the first week.</p>
  <div class="inside">
    <div><b>50</b><span>tasks founders can hand off, by area</span></div>
    <div><b>1</b><span>hours worksheet to size the help you need</span></div>
    <div><b>4</b><span>weeks of onboarding, step by step</span></div>
  </div>
`, "cover")}

${page(2, `
  <span class="eyebrow">How to use this playbook</span>
  <h2>Three passes, about thirty minutes.</h2>
  <p class="lede">Most founders hold on to recurring, rules-based work far longer than they need to. This playbook helps you see it, size it and hand it over.</p>
  <div class="steps">
    <div class="step"><span class="num">1</span><div><h3>Tick what you'd hand off</h3><p>Go through the 50 tasks on the next three pages. Tick anything you do at least weekly that follows a pattern. Add your own in the margins.</p></div></div>
    <div class="step"><span class="num">2</span><div><h3>Estimate the hours</h3><p>Next to each ticked task, write a rough weekly time. Round up: small tasks and context-switching add more than you think.</p></div></div>
    <div class="step"><span class="num">3</span><div><h3>Total it on the worksheet</h3><p>Add up each area on page 6. The total tells you whether to start with a few hours of help, a part-time assistant, or a full-time teammate.</p></div></div>
    <div class="step"><span class="num">4</span><div><h3>Start with three</h3><p>Pick the three ticked tasks that drain the most time or energy, not the easiest ones. Write down how you do them today (a rough list or a screen recording is enough), then use the onboarding plan on page 7.</p></div></div>
  </div>
  <div class="keep">
    <h3>What should stay with you</h3>
    <ul>
      <li>Strategy, pricing and major financial decisions</li>
      <li>Key relationships with clients, partners and investors</li>
      <li>Hiring decisions and team leadership</li>
      <li>Judgment calls that don't follow a pattern yet. If you can't describe how you'd decide, it isn't ready to hand over.</li>
    </ul>
  </div>
`)}

${page(3, `
  <span class="eyebrow">The task list · 1 of 3</span>
  <h2>50 tasks you can hand off.</h2>
  ${taskGroups.slice(0, 2).map(taskTable).join("")}
`)}

${page(4, `
  <span class="eyebrow">The task list · 2 of 3</span>
  ${taskGroups.slice(2, 4).map(taskTable).join("")}
`)}

${page(5, `
  <span class="eyebrow">The task list · 3 of 3</span>
  ${taskGroups.slice(4).map(taskTable).join("")}
  <div class="group">
    <h3>Your own tasks</h3>
    <table class="tasks">
      <thead><tr><th class="c-box">Hand off?</th><th>Task</th><th class="c-hrs">Hrs / week</th></tr></thead>
      <tbody>
      ${[1, 2, 3, 4, 5, 6].map(() => `<tr><td class="c-box">${box}</td><td><span class="line" style="width:100%"></span></td><td class="c-hrs"><span class="line"></span></td></tr>`).join("")}
      </tbody>
    </table>
  </div>
`)}

${page(6, `
  <span class="eyebrow">Hours worksheet</span>
  <h2>How much help do you need?</h2>
  <p class="lede">Copy the ticked tasks and hours from each area, then add them up.</p>
  <table class="ws" style="margin-top:14pt">
    <thead><tr><th>Area</th><th>Tasks ticked</th><th>Hours per week</th></tr></thead>
    <tbody>
      ${[...taskGroups.map((g) => g.name), "Your own tasks"].map((n) => `<tr><td>${esc(n)}</td><td class="blank"><span></span></td><td class="blank"><span></span></td></tr>`).join("")}
      <tr class="total"><td>Total</td><td class="blank"><span></span></td><td class="blank"><span></span></td></tr>
    </tbody>
  </table>
  <h3 style="margin-top:22pt">What your total suggests</h3>
  <div class="bands">
    <div class="band"><b>Under 10 hrs</b><p>Document your top three tasks first. A few hours of focused help a week may be enough to start.</p></div>
    <div class="band"><b>10 to 25 hrs</b><p>A part-time dedicated assistant who owns those tasks end to end.</p></div>
    <div class="band"><b>25+ hrs</b><p>A full-time teammate, or two people across areas such as support and back office.</p></div>
  </div>
  <p class="note">A rough guide, not a rule. Your quote depends on the type of work and how much context it needs.</p>
`)}

${page(7, `
  <span class="eyebrow">Onboarding plan</span>
  <h2>The first four weeks with a new assistant.</h2>
  <div class="weeks">
    <div class="week wide"><h3>Before day one</h3><ul>
      <li>${box}<span>A starting list of 3–5 recurring tasks</span></li>
      <li>${box}<span>Delegated email and calendar access (no shared passwords)</span></li>
      <li>${box}<span>Access to your task tool, shared drives and the systems those tasks touch</span></li>
      <li>${box}<span>A password manager for any shared logins</span></li>
      <li>${box}<span>A rough write-up or screen recording of each starting task</span></li>
      <li>${box}<span>Where requests go, and how fast you expect replies</span></li>
    </ul></div>
    <div class="week"><h3>Week 1 · Context and shadowing</h3><ul>
      <li>${box}<span>Share the big picture: customers, priorities, what matters now</span></li>
      <li>${box}<span>Do each task once while they watch, then watch them do it</span></li>
      <li>${box}<span>Hold a 10–15 minute daily check-in</span></li>
    </ul></div>
    <div class="week"><h3>Week 2 · Supervised ownership</h3><ul>
      <li>${box}<span>They do the work end to end; you review before it goes out</span></li>
      <li>${box}<span>Give specific feedback: what to keep, what to change</span></li>
      <li>${box}<span>Update the documentation together when gaps appear</span></li>
    </ul></div>
    <div class="week"><h3>Weeks 3–4 · Independence</h3><ul>
      <li>${box}<span>Move from reviewing everything to spot-checking</span></li>
      <li>${box}<span>Cut check-ins to two or three a week</span></li>
      <li>${box}<span>Add one or two new responsibilities the same way</span></li>
    </ul></div>
    <div class="week"><h3>Every Friday · Four questions</h3><ul>
      <li>${box}<span>What went well this week?</span></li>
      <li>${box}<span>What needed rework, and why?</span></li>
      <li>${box}<span>What should we document or clarify?</span></li>
      <li>${box}<span>What's the next thing to hand over?</span></li>
    </ul></div>
  </div>
`)}

${page(8, `
  <div class="brand">${monogram}<span>Sage<b>Stone</b></span></div>
  <span class="eyebrow" style="color:#CDB68A">Your next step</span>
  <h2 style="margin-top:12pt">Bring your worksheet to a discovery call.</h2>
  <p class="lede" style="color:rgba(238,233,224,.75)">In 30 minutes we'll look at your total, recommend where to start, and match you with dedicated talent in the Philippines. Onboarding typically begins within 24–72 hours of the call.</p>
  <a class="cta" href="https://www.sagestoneinc.com/contact?utm_source=playbook&amp;utm_medium=pdf&amp;utm_campaign=delegation_playbook">Book a discovery call</a>
  <div class="contact">
    <span>sagestoneinc.com/contact</span>
    <span>hello@sagestoneinc.com · +1 (214) 945-2234</span>
  </div>
`, "back")}

</body></html>`;

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const p = await browser.newPage();
await p.setContent(html, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: outFile, format: "Letter", printBackground: true, preferCSSPageSize: true });
if (process.argv.includes("--png")) {
  await p.setViewportSize({ width: 816, height: 1056 });
  const pages = await p.$$(".page");
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(process.argv[process.argv.indexOf("--png") + 1], `page-${i + 1}.png`) });
}
await browser.close();
console.log(`Wrote ${path.relative(root, outFile)}`);
