# LINKA CYREX operating model

## Decision

LINKA is a CYREX self-hosted deployment of the existing SaaS architecture. It retains individual Free, Pro, and Business plans, Better Auth, the existing roles, card ownership, organisation model, public routes, QR, vCard, and subscription implementation. CYREX does not use organisation-level plan inheritance or a global plan bypass.

## Account administration

- `super_admin` users manage platform users, roles, organisation assignments, plans, and account access through **Admin → Users**.
- `company_admin` users manage their organisation; `team_leader` users may invite only members; `member` users manage their own cards.
- To assign a plan, a super administrator opens **Admin → Users**, selects the intended account, assigns `Free`, `Pro`, or `Business`, and saves. The same operation is implemented by authenticated `PATCH /api/users` with `userId` and `plan`; only `super_admin` may set a plan.
- Business is the appropriate assignment for staff who need unlimited cards/links, all templates, team directory, bulk import, campaigns, advanced analytics, and related existing Business capabilities. Free permits one card and three custom links; Pro permits three cards; all details are defined in `lib/plans.ts`.

## Controlled registration and invitations

`LINKA_INTERNAL_MODE` now defaults to `true` in the CYREX Compose deployment and `.env.example`. In this mode, Better Auth's existing `/sign-up/email` route has a small server-side guard: a new account requires a pending, unexpired invitation token whose email matches the registering email. This preserves Better Auth, token expiry, matching, roles, and the existing invitation acceptance route; it does not create a second invitation system.

Operational workflow:

1. A company administrator creates an invitation in **Team** for the employee email and allowed role.
2. LINKA creates an email-bound invitation token with a seven-day expiry and sends the existing invitation email when SMTP is configured.
3. The employee follows the registration URL, chooses an individual password, and the existing acceptance endpoint assigns organisation and role.
4. A super administrator assigns the employee's required individual plan in **Admin → Users**.
5. The member signs in and creates/edits their own card under **Card**. They can publish/unpublish it, copy its public URL, download QR SVG and vCard, and share the published profile.
6. Visitors can open `/c/[slug]`, QR, and vCard without a login only while the card is published. Private cards return 404 from all three public endpoints.

For a future public SaaS deployment, set `LINKA_INTERNAL_MODE=false` explicitly and review commercial registration policy before enabling it.

## Runtime demonstration

The full workflow was executed using temporary synthetic records, then cleaned up:

- A super administrator created a synthetic organisation and assigned a synthetic user `company_admin` and `business` through the existing user API (HTTP 200).
- With internal mode enabled, an uninvited registration was rejected (HTTP 403), while an email-bound invitation was created (201), registered (200), and accepted (200).
- The super administrator assigned Business to the invited synthetic member (200).
- That member signed in, created a public card (201), edited contact/profile fields (200), and an unauthenticated visitor retrieved its profile, QR, and vCard successfully (200).
- The user-deletion path initially exposed a restrictive analytics foreign-key defect. It was fixed by deleting only the target user's card analytics and sent invitations inside the existing delete transaction before normal cascades. Retest deleted both synthetic users successfully (200); zero synthetic users remain.

## Tanzania adaptation assessment

### Already suitable

- Phone fields accept Tanzanian `+255` numbers; the verified synthetic card saved `+255700000000` without a country-specific validation failure.
- Addresses, names, links, contact fields, public profiles, QR, and vCards are generic free-form formats and do not need a Tanzania schema change.
- The user-facing interface is English, appropriate for the requested CYREX operating model.
- The responsive public profile and login were previously checked in desktop/mobile Chromium.

### Required operational changes

- Configure a real CYREX SMTP sender. Set `SMTP_FROM` to `LINKA by CYREX Technologies <approved-sender@cyrex...>`; do not use the legacy CardNexus fallback.
- Configure the production HTTPS hostname in `APP_URL` and `BETTER_AUTH_URL` and pass `X-Forwarded-Proto`/`X-Forwarded-Host` through the reverse proxy before invitations or QR distribution.

### Not currently justified

- No Tanzania-specific phone parser, address-region schema, or local-currency change is required for card management.
- TZS presentation is not currently required: pricing/subscription values are existing upstream SaaS configuration, and CYREX is manually assigning plans for its internal deployment. Revisit currency only if CYREX enables customer billing.
- No low-bandwidth redesign is justified from the present architecture; image-upload guidance and normal mobile testing should be part of pilot rollout.

## Upstream capabilities intentionally unchanged

Better Auth, TOTP, roles/permissions, plan enforcement, card ownership, organisation management, Stripe/PayPal integration, public URLs, QR generation, vCard generation, SQLite persistence, and upstream licence/attribution remain intact. No schema migration, dependency upgrade, reset, or public-route change was made.

## Deployment checklist

1. Confirm `LINKA_INTERNAL_MODE=true`, production URL, TLS proxy headers, SMTP credentials, and approved sender.
2. Retain at least two CYREX super administrators and assign company administrators conservatively.
3. Invite staff; super administrators assign individual plans after account creation.
4. Pilot card creation, publishing, QR/vCard, and offboarding with a small CYREX group.
5. Keep payment-provider credentials empty unless CYREX explicitly enables commercial billing.
