/* ---------- Team ----------
 * People shown on /team, below the founder. Add real team members only, with
 * their agreement, and a photo in public/team/ (WebP, about 800×1000).
 *
 *   {
 *     name: "First Last",
 *     role: "Executive Assistant",
 *     group: "talent",            // "leadership" or "talent"
 *     photo: "/team/first-last.webp",
 *     bio: "Two or three sentences in plain language.",
 *     skills: ["Google Workspace", "HubSpot", "Calendar management"],
 *     years: 6,                   // optional: years of relevant experience
 *     linkedin: "https://www.linkedin.com/in/...", // optional
 *   },
 *
 * Talent who prefer not to be named can be listed by first name only.
 */

export type TeamMember = {
  name: string;
  role: string;
  group: "leadership" | "talent";
  photo?: string;
  bio: string;
  skills?: string[];
  years?: number;
  linkedin?: string;
};

export const team: TeamMember[] = [];
