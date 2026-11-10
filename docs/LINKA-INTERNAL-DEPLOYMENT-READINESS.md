# LINKA internal deployment readiness

## Assessment status

**Not ready for CYREX-wide adoption without two small, security-relevant configuration changes.** LINKA already implements the core digital-identity workflow, but its SaaS-oriented entitlement and open-registration behaviour are unsuitable as the default for a company-owned installation.

This assessment preserves the database, authentication model, public URLs, QR/vCard implementation, branding, and existing synthetic card.

## Required operating model

CYREX should operate one active CYREX organisation. A controlled set of `super_admin` users manages the platform. `company_admin` users manage the CYREX organisation and members; `team_leader` users may invite members but may only assign the `member` role. Other users are `member` users with access only to their own cards and workspace.

Every authorised employee needs an individual account and one or more cards according to CYREX policy. Published cards remain public at `/c/[slug]`; unpublished cards, QR SVGs, and vCards are unavailable externally. Public visitors do not authenticate and cannot access administration.

## Capability assessment

| Capability | Status | Evidence |
| --- | --- | --- |
| Individual accounts and sessions | Runtime verified | Administrator sign-in/sign-out succeeded; unauthenticated dashboard redirected and cards API returned 401. Better Auth provides email/password and optional TOTP 2FA. |
| Roles and platform control | Source confirmed; admin routes runtime checked | Roles are `super_admin`, `company_admin`, `team_leader`, and `member`. APIs scope organisation actions and prevent team leaders granting elevated roles. |
| Organisation lifecycle | Runtime verified | A scoped synthetic organisation was created, listed by super-admin, and deleted without affecting retained data. |
| Team invitations and acceptance | Source confirmed, untested | The API creates expiring, email-bound tokens; acceptance binds the matching signed-in email to the organisation and assigned role. |
| Member card ownership/editing | Runtime verified for synthetic owner; source confirmed | Card reads and writes are filtered by session `userId`; patch input is validated. |
| Images, contact data, links and templates | Source confirmed, untested | Card schema/editor support avatar/upload fields, contact data, custom links, and appearance. |
| Publish/unpublish protection | Runtime verified | A private synthetic card returned 404 for profile, QR and vCard; restoration returned 200. |
| Public profile, QR and vCard | Runtime verified | Public profile and QR SVG returned 200; QR resolves to `/c/[slug]?source=qr`; vCard was valid. |
| Public/admin separation | Runtime verified | Public endpoints work without session; protected routes and APIs reject anonymous access. |
| LINKA/CYREX branding | Source confirmed and runtime observed | `lib/brand.ts`, assets, metadata, login, and public card render LINKA identity. |

## Gaps preventing team adoption

### Organisation plan is not member entitlement

`Organization.plan` exists, but card and feature checks use each user's `plan` through `effectivePlan()` and `getPlanFeatures()` in `lib/plans.ts`. Invitation acceptance sets only `organizationId` and `role`; every invited user retains the Free default. Free permits one card and three custom links, while Business permits unlimited cards/links and team features. A super admin can manually change individual plans through the user API, but that is an error-prone workaround, not an organisation entitlement model.

### Public registration is open

`/register` calls Better Auth `signUp.email` with or without an invitation token. Token acceptance occurs after account creation, allowing unmanaged public Free accounts. This conflicts with a CYREX-controlled internal installation.

### Member lifecycle requires runtime verification

Invitation constraints are source-confirmed, but SMTP delivery, registration, invitation acceptance, member login, card creation, and offboarding have not been exercised with a non-production synthetic member. This is a verification gap, not evidence that the capability is absent.

## Required implementation changes

1. Add a narrowly scoped internal deployment configuration, for example `DEPLOYMENT_MODE=internal` and a validated `INTERNAL_ORGANIZATION_ID`. In internal mode, resolve plan features server-side from the active member's active organisation. Do not trust client input, remove plan checks, or hardcode unlimited access.
2. Apply that entitlement resolution consistently to card limits, custom links, templates, uploads, team directory, bulk import, analytics, campaigns, leads, domains, and every server use of `getPlanFeatures`, `canUseFeature`, or `effectivePlan`. A transitional alternative is setting invited CYREX users to Business server-side; organisation-derived entitlement is safer for future revocation and policy changes.
3. Enforce invite-only registration in internal mode before a Better Auth account is created. Validate a pending, unexpired token and bind it to the registering email. Hiding the registration link alone is insufficient. Keep self-registration only behind an explicit future commercial mode.
4. Create the CYREX organisation once through the existing super-admin workflow, set approved branding and plan, and associate designated company administrators. Do not alter unrelated users, reset data, or grant all members admin roles.
5. Configure production `APP_URL`/`BETTER_AUTH_URL`, reverse-proxy forwarded headers, SMTP credentials, and `SMTP_FROM` as `LINKA by CYREX Technologies <...>` before invitations. The current Compose fallback still identifies CardNexus and must not be used for CYREX outbound email.

## Recommended internal configuration

- One active CYREX organisation with an explicit Business/internal entitlement.
- At least two named super administrators and a small set of company administrators.
- Invite-only onboarding; staff choose their own passwords from email-bound, seven-day invitations. Enable/require TOTP according to CYREX policy.
- Organisation-derived Business features for active members. Use existing ban/session invalidation and membership controls for offboarding; never silently publish cards.
- HTTPS reverse proxy forwarding `X-Forwarded-Proto` and `X-Forwarded-Host`; set the public hostname before issuing QR codes or invitations.
- Leave public `/c/[slug]`, QR, and vCard access enabled only for published cards; visitors need no account.

## Licensing and policy decisions

CYREX must confirm that the adopted upstream licence permits the intended internal use and decide whether commercial payment configuration remains disabled. This assessment does not remove or circumvent licence terms. CYREX must also set policy for card count, permitted branding/templates, publishing authority, and retention/offboarding of former employees' public profiles.

## Prioritised sequence

1. Confirm licence/internal-use position and nominate platform owners.
2. Implement and test server-enforced organisation entitlement.
3. Implement and test server-enforced invite-only registration.
4. Configure production URL, HTTPS proxy, SMTP, `SMTP_FROM`, branding, CYREX organisation, and admins.
5. Run a synthetic full lifecycle: invite, registration, acceptance, member login, card creation/edit/upload, publish/unpublish, public profile, QR, vCard, role denial, offboarding, and persistence.
6. Pilot with a small CYREX group before organisation-wide invitation.

## Exact readiness conclusion

LINKA has the foundation required for CYREX digital identities: individual card ownership, protected administration, public publishing, QR, and vCards. It is ready for team adoption only after organisation entitlements are applied consistently and registration is invite-only, followed by the listed lifecycle verification. No broad redesign, schema reset, authentication weakening, or public-URL change is required.
