export interface ChangelogEntry {
  version: string;
  date: string;       // ISO date string
  changes: { type: "feature" | "fix"; text: string }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.0.0",
    date: "2026-05-10",
    changes: [
      { type: "feature", text: "vCard 4.0: exported business cards now use VERSION:4.0 with correct formatting and line folding (RFC 6350)" },
      { type: "feature", text: "New card fields: pronouns, gender (vCard GENDER), birthday (vCard BDAY), and fax" },
      { type: "feature", text: "Card editor: all new fields support appropriate input types (date, tel, select)" },
    ],
  },
  {
    version: "1.9.0",
    date: "2026-05-10",
    changes: [
      { type: "feature", text: "Dark mode: complete support for the dark interface" },
      { type: "feature", text: "Theme toggle in the header (sun/moon icon) — follows the system by default" },
      { type: "feature", text: "Theme preference is stored in the browser" },
      { type: "feature", text: "Dark mode across dashboard, admin, authentication, landing, cards, settings, and team directory" },
    ],
  },
  {
    version: "1.8.0",
    date: "2026-05-10",
    changes: [
      { type: "feature", text: "Suspend users: a super administrator can immediately disable an account" },
      { type: "feature", text: "Unlock users: remove a suspension with one click" },
      { type: "feature", text: "Delete users: permanent deletion with a confirmation dialog" },
      { type: "feature", text: "Suspended badge in the administrator user table" },
    ],
  },
  {
    version: "1.7.0",
    date: "2026-05-10",
    changes: [
      { type: "feature", text: "Organisation freeze: the organisation is frozen rather than deleted when Business is cancelled" },
      { type: "feature", text: "All member data and cards are retained and reactivate immediately on resubscription" },
      { type: "feature", text: "Frozen banner on the team page for administrators and members" },
      { type: "feature", text: "Email notification to organisation administrators when an organisation is frozen or reactivated" },
      { type: "feature", text: "Schema: isActive and frozenAt on Organisation" },
    ],
  },
  {
    version: "1.6.0",
    date: "2026-05-10",
    changes: [
      { type: "feature", text: "Edit an organisation's name, colour, and domain directly in the admin panel" },
      { type: "feature", text: "Delete organisation: members are automatically removed" },
      { type: "feature", text: "Assign an organisation administrator directly in the edit dialog" },
      { type: "feature", text: "Assign an organisation per user from the user-table dropdown" },
      { type: "feature", text: "Team analytics for organisation administrators: views, downloads, leads, and top cards" },
      { type: "fix",     text: "Lead capture is available only when the card owner has Pro or Business" },
      { type: "fix",     text: "Select controls in the administrator user table are always visible" },
    ],
  },
  {
    version: "1.5.0",
    date: "2026-05-09",
    changes: [
      { type: "feature", text: "Six email-signature styles: Standard, Compact, Rich, Modern, Minimal, and Dark" },
      { type: "feature", text: "Signature options: colour, photo, social links, card button, and footer" },
      { type: "feature", text: "Plain-text signature copy for email clients without HTML support" },
      { type: "feature", text: "Create an organisation (Business plan) with a slug and colour" },
      { type: "feature", text: "CSV import interface for members in the Team area" },
      { type: "feature", text: "Version and build time in the administrator area" },
      { type: "fix",     text: "Super administrators see all users in the administrator panel rather than Team" },
      { type: "fix",     text: "Business users without an organisation can use the Team page" },
    ],
  },
  {
    version: "1.4.0",
    date: "2026-05-08",
    changes: [
      { type: "feature", text: "GeoIP tracking: country and city in analytics" },
      { type: "feature", text: "Extended metrics: browser, operating system, referrer, and language" },
      { type: "feature", text: "Admin access log with card access records and filters" },
      { type: "feature", text: "Card limits enforced in the API and UI (Free: 1, Pro: 3, Business: ∞)" },
      { type: "feature", text: "Duplicate button hidden when the card limit is reached" },
      { type: "feature", text: "Editable slugs — old slugs redirect automatically (CardSlugAlias)" },
      { type: "feature", text: "Direct analytics link in the card editor and dashboard" },
      { type: "feature", text: "Dashboard overview shows all cards with 30-day views" },
      { type: "feature", text: "12 card templates (including Bold, Glass, and Retro)" },
      { type: "fix",     text: "Bot and crawler requests are no longer counted as views" },
      { type: "fix", text: "Fixed duplicate view events when sharing a card" },
      { type: "fix",     text: "Fixed geoip-lite ENOENT during builds through dynamic imports" },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-05-07",
    changes: [
      { type: "feature", text: "PayPal as a payment method" },
      { type: "feature", text: "Friendly campaign URLs (name and ID)" },
      { type: "feature", text: "Custom domains for cards" },
      { type: "feature", text: "Change email address in Settings" },
      { type: "fix",     text: "Plan features are now recognised correctly after assigning a plan" },
      { type: "fix",     text: "Campaign URLs now use the real domain instead of localhost" },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-05-06",
    changes: [
      { type: "feature", text: "Stripe payments: upgrade directly from the application" },
      { type: "feature", text: "Email delivery: invitation and welcome emails through SMTP" },
      { type: "feature", text: "Milestone notifications at 100, 500, and 1,000 views" },
      { type: "feature", text: "Real-time view counter in the dashboard" },
      { type: "feature", text: "Meeting booking link on the card" },
      { type: "feature", text: "Campaign and UTM tracking links" },
      { type: "feature", text: "NFC setup guide" },
      { type: "feature", text: "Lead-capture form on public cards" },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-05-01",
    changes: [
      { type: "feature", text: "9 card templates (Classic, Modern, Minimal, Dark, Bold, Glass, Retro, Neon, Corporate)" },
      { type: "feature", text: "Company directory and Team page" },
      { type: "feature", text: "Department permissions in organisation settings" },
      { type: "feature", text: "Bulk CSV import for teams (API)" },
      { type: "feature", text: "Email signature generator" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-04-15",
    changes: [
      { type: "feature", text: "Digital business card with QR code and vCard download" },
      { type: "feature", text: "Multi-tenant organisations with roles" },
      { type: "feature", text: "Analytics (views, devices, sources)" },
      { type: "feature", text: "Avatar and cover image upload" },
      { type: "feature", text: "Public/private card toggle" },
    ],
  },
];
