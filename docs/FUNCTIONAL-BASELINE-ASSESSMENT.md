# Functional baseline assessment

## Executive summary

CardNexus is a working digital-business-card platform: public cards, vCards,
QR SVGs, cards, Better Auth accounts, roles, organizations, analytics, and
integrations are present. It is **suitable with targeted customisation** for
CYREX. It is not an authority-management system: a profile/card is not a
verifiable authorization to represent an organization.

Assessment date: 2026-11-10. “Tested” means exercised on the local Docker
deployment; “code-reviewed” means implementation inspected without changing
account/organization state. A synthetic card was created for safe local route
tests; no existing administrator role, user, or organization was changed.

## Application overview

- Next.js, Better Auth, Prisma and persistent SQLite in one Compose container.
- Public URL: `http://localhost:3000/c/<slug>`.
- Main persisted objects: users/accounts/sessions, organizations, cards,
  invitations, leads, campaigns, analytics, webhooks, API keys and settings.
- The interface is primarily German.

## Functional findings

### Authentication and permissions

The local administrator is correctly configured. The database role and the
authenticated Better Auth session both returned `super_admin`; `/admin`
returned HTTP 200. “Member” is not an indication of this account's actual
permission in the current deployment.

Roles are `super_admin`, `company_admin`, `team_leader`, and `member`.
Middleware blocks non-super-admin `/admin` requests. Server routes additionally
scope organization/user actions: company admins are scoped to their organization;
team leaders may invite members only. Login, sign-out, registration,
forgot/reset-password, profile edits, account export/deletion and TOTP/2FA
routes exist. Email-changing, password-reset and registration flows were not
state-tested because SMTP is disabled and the seeded account was preserved.

Invitation records contain a seven-day expiry. Acceptance validates that the
authenticated email matches the invited email. SMTP is necessary to deliver the
email, although the API returns a generated invite URL.

### Card lifecycle

**Tested:** a synthetic card created with HTTP 201; its update returned 200;
making it private made its anonymous public page return 404; restoring public
returned 200. A second card attempt under the Free plan returned 403.

Supported fields include profile, title/company/department/bio, image URLs,
contact methods, six social networks, custom links, style/template options,
booking URL, card domain, expiry, password protection, directory visibility,
and approval state. API creation has no mandatory personal-contact field; the
card name defaults to “Meine Karte.” Multiple cards are schema/UI-supported but
limits are Free 1, Pro 3, Business unlimited. The API cannot delete a user's
last card.

Uploads require authentication and accept JPEG/PNG/WebP/GIF only, maximum 5 MB,
with randomized filenames and a 20-file per-user limit. The UI also accepts a
remote image URL.

### Public profile, vCard, QR and NFC

Anonymous public page, vCard and QR endpoint tests each returned HTTP 200. The
vCard response contained vCard 4.0 content. Visitors do not need an account for
public, unexpired, non-password-protected cards. The public page offers contact
save, QR, sharing, WhatsApp/email share, optional booking, wallet action and
template-rendered contacts/links.

QR responses are SVG and source review shows they encode
`<request-origin>/c/<slug>?source=qr`. Editing card data leaves this destination
stable. Unpublishing makes the QR endpoint unavailable; expiry is enforced by
the destination page. Changing a slug creates a public-card alias redirect, but
the old QR-image endpoint does not resolve aliases. QR image content was not
scanner-decoded, so destination verification is code-reviewed.

NFC is a setup guide that instructs users to write the public URL to a
third-party tag; it is not tag provisioning or validation.

### Organizations, leads, campaigns and analytics

Organizations support settings, members, invitations, branding/design policies,
department policies, card approval, directories and CSV import. Business access
is required for team-directory functionality. Super admins manage all
organizations; an eligible non-super-admin creates an organization and becomes
its company admin. Company admins can approve/policy-control member cards but
do not have a general member-card edit API; card PATCH verifies owner `userId`.

Lead capture creates a `Lead` only after public-form submission, not after a
contact-action click. It is Pro/Business gated, rate-limited, and can send
SMTP/webhook notifications. The Free-plan lead test returned 403. Lead listing
and CSV export are implemented.

Campaign creation is Pro/Business-gated; the Free-plan test returned 403.
Campaign redirects increment a Campaign view count. The redirect supplies
`src` and `cid`, whereas public-card tracking reads `utm_*`; it does not
automatically provide UTM campaign attribution.

Analytics records views, vCard downloads, client-reported qr scans, link clicks
and wallet saves plus source, UTM, device, browser, OS, language, referrer and
best-effort GeoIP. A browser-like anonymous request successfully persisted a
`qr_scan` record. QR scans are therefore telemetry, not proof that a physical
QR code was scanned.

### Settings and integrations

Working locally: cards, public profiles, QR/vCard, basic analytics, signatures,
widget code, NFC instructions, and administration. External configuration is
required for SMTP, Stripe, PayPal, Apple Wallet, Google Wallet, custom
domains/TLS and real NFC tags. Unconfigured Apple and Google wallet endpoints
each returned 503. Without Stripe, upgrades fall back to sales contact; a
self-hosted super admin can manually assign plans.

## Subscription restrictions

| Feature | Free | Pro | Business | Verified enforcement |
| --- | --- | --- | --- | --- |
| Cards | 1 | 3 | unlimited | Card POST; Free second-card test 403 |
| Templates / custom links | 4 / 3 | all / unlimited | all / unlimited | policy/editor code |
| Lead capture | no | yes | yes | Lead POST; Free test 403 |
| Campaigns | no | yes | yes | Campaign POST; Free test 403 |
| Custom domain, booking, print | no | yes | yes | policy/UI; DNS/TLS external |
| Team directory, import, org template | no | no | yes | policy/page routes |

## Dashboard anomaly

Repository-wide literal searches found no “No map available” or “Create map”
strings. The current dashboard route renders “Keine Karte vorhanden,” “Erstelle
jetzt deine digitale Visitenkarte in wenigen Minuten,” and “Karte erstellen.”
No map model or dashboard map component exists.

Finding: it is not a current CardNexus feature, translation, or known object in
this checkout. It is most plausibly a stale browser asset, another local
application, or another build. Do not change text yet; reproduce with browser
network/build evidence before treating it as an upstream UI defect.

## Security and technical observations

- Better Auth, trusted origins, auth rate limiting, public/private/expiry/
  password checks, Zod validation and scoped organization mutations are present.
- Public API strips password hashes and owner email. QR checks public state but
  does not independently check expiry.
- Audit records are JSON stdout entries for selected privileged events, not a
  durable comprehensive audit trail.
- SQLite persistence was verified in Milestone 1.
- `npm audit --omit=dev` found 12 runtime findings: 2 critical, 6 high,
  2 moderate and 2 low. Direct critical packages are `better-auth` and
  `next`; direct high packages include `node-forge`, `prisma`, and
  `zod`; `nodemailer` is direct moderate. No upgrades were made.

## CYREX operational fit

| Requirement | Classification | Finding |
| --- | --- | --- |
| Corporate company card, QR, contacts and links | CONFIGURATION | Native card/public-link features; use a governed dedicated corporate card. |
| Permanent member profile and vCard | NATIVE | Cards, contacts, photos, public/private state, QR and vCards exist. |
| Approved organization design | CONFIGURATION | Business organization policy and approval partly support it. |
| Organization manager edits member card | CUSTOMISATION | Approval/policy exists; general company-admin editing does not. |
| Temporary representative card | CONFIGURATION | Separate card plus expiry/unpublish can be used as an interim measure. |
| Start/end authorization, event linkage and status | CUSTOMISATION | Only `expiresAt`; no start, event, scope or representative type. |
| Verifiable/revocable authority | GAP | Profile visibility is not an auditable authorization lifecycle. |
| CRM/CYREX OS synchronization | INTEGRATION | No connector or system-of-record model exists. |

CardNexus distinguishes user/card visibility from organizational authority. That
is the core CYREX gap.

## Recommendation for Milestone 2

Retain native cards, templates, public pages, vCards, QR, uploads, basic
analytics, roles and organization settings. Configure a corporate card,
organization policy and eventual SMTP/domain choices.

Custom work should first model representation assignments: type, sponsor/event,
start/end, approval, visible authority statement, revocation, audit history and
QR verification response. Decide CRM ownership/synchronization before building
that workflow. Remediate dependency vulnerabilities and analytics semantics in
a separately scoped security workstream.
