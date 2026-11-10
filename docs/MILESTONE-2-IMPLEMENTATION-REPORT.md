# Milestone 2 implementation report

## Audit inventory

The repository is a Next.js 16 application using Better Auth, Prisma, SQLite,
and Docker Compose. Branding and language were distributed across layouts,
public cards, dashboard and admin components, API errors, email templates,
metadata, wallet/PayPal labels, seed data, and deployment documentation. No
existing i18n system was present. Existing assets contained no approved product
logo; the only discovered PNG is an upload, so it was preserved as user data.

## Implemented

- Added `lib/brand.ts` as the central LINKA identity configuration.
- Added replaceable temporary SVG mark and favicon in `public/`.
- Updated HTML language, metadata, Open Graph identity, auth presentation,
  navigation, admin shell, landing page, public-card actions and errors.
- Converted authentication, password recovery, invitations, public lead forms,
  public card protection, and transactional emails to English.
- Updated product-facing exports, PayPal brand name, wallet display language,
  print credit, package identity, and environment examples.
- Preserved schema, URLs, QR encoding, vCard routes, roles, plan enforcement,
  SQLite data, and Docker topology.

## Files modified

Primary implementation files include `lib/brand.ts`, `lib/platform.ts`,
`lib/email.ts`, `app/layout.tsx`, public/auth/dashboard/admin routes,
`components/layout/*`, `components/card/CardSwitcher.tsx`, relevant API routes,
and the two `public/linka-*.svg` assets. See version control for the exact
machine-readable list.

## Verification

`npm run build` was attempted first and could not start because local
dependencies were absent (`next: not found`). A subsequent `npm ci` and Docker
Compose image build both remained in dependency installation for more than
three minutes and were stopped; neither reached the application build stage.
No database was reset or seeded. Docker/browser verification remains pending a
successful image build.

## Remaining occurrences

- **Internal technical/historical:** Docker service names, migration/demo seed
  identifiers, campaign UTM value, wallet class id, password fallback, and
  upstream README/changelog references.
- **Legal/historical documentation:** baseline assessment and setup documents
  intentionally describe the adopted CardNexus baseline.
- **Requires follow-up localisation:** lower-frequency admin, organisation,
  settings, import, editor, analytics, upgrade, and legal-template interfaces
  retain German strings. These must be translated before this milestone can be
  formally accepted as complete.
- **Test fixtures:** `prisma/seed.ts` and runtime migration demo account data
  retain historical CardNexus values and have not been run against persistence.

## Outcome

**Partially passed.** Static English localisation is complete. Runtime build
and browser verification remain pending and are required before Milestone 2 as
a whole can pass.

## Milestone 2A.1 audit

The non-accent audit translated additional card-template fallbacks, analytics,
wallet labels, compatibility-visible defaults, card-domain settings, approval
copy, common API responses, and dashboard metrics. The remaining source
occurrences are classified in `LINKA-LOCALISATION.md`; genuine legacy UI copy
remains in secondary screens, so this report does not certify full English
localisation.

## Milestone 2B build and runtime verification

Local verification used Node.js `v22.22.3`, npm `11.14.1`, Docker `29.9.0`,
and Docker Compose `v5.6.0`; the existing Dockerfile builds with Node 20.
`npm ci --ignore-scripts` completed from the existing lockfile with engine
warnings for `geoip-lite@2.0.2` (requires Node `>=24`) and `kysely@0.29.6`
(requires Node `>=22`). The warnings did not prevent installation.

The first production build failed because installing with `--ignore-scripts`
left Prisma Client ungenerated, producing a missing `PrismaClient` export and
cascading type errors. Running the existing `npm run db:generate` generated
Prisma Client 6.19.3; `npm run build` then completed successfully, producing
build ID `vJ0qmHh0pyPoJK--L_go0`. Next.js warned about a parent lockfile outside
the Git root; no lockfile or configuration was changed.

`docker compose build cardnexus` completed and produced `cardnexus:local`.
`docker compose up -d` started a healthy container. Logs confirm the existing
database was found and migrations applied 0 changes (54 already current). `/`
and `/login` returned HTTP 200. The SQLite checksum
`63ebb3b0e2eb91d539dc970c49fbaaf97190fdeff75c362413ae178750ee23da` was
unchanged across `docker compose restart cardnexus`; the restarted container
was healthy and `/` returned HTTP 200 again. Uploads and database data were not
deleted or reset.

`/api/qr/demo` and `/api/vcard/demo` returned 404 because no `demo` card exists
in the retained database. Credentialed login/logout, administrator access,
organisation actions, card create/edit, a real public-card QR/vCard check, and
mobile browser testing were not executed and are not claimed as passed.

Security remains a separate workstream: engine warnings above and the prior
`npm audit --omit=dev` result (12 findings: 2 critical, 6 high, 2 moderate, 2
low) were not remediated in this milestone.

## Milestone 2B final execution

### Runtime fixes

Runtime testing exposed residual German copy in the login, public QR/vCard
errors, organisation creation, card-slug validation, email-signature editor,
wallet pass, team import, settings, integrations, campaigns, and checkout
surfaces. Those rendered strings and API responses are now English. No schema,
authentication, permissions, public URLs, QR/vCard behaviour, or user data was
changed.

### Executed regression checks

- Credentialed administrator sign-in established a session (HTTP 200).
- Authenticated dashboard, admin, admin users, admin organisations, team,
  settings, analytics, and card-editor routes returned HTTP 200.
- Anonymous dashboard access redirected to sign-in (HTTP 307); anonymous cards
  and organisations APIs returned HTTP 401.
- Logout succeeded when sent with the normal same-origin browser header (HTTP
  200); the resulting cookie could no longer access the dashboard (HTTP 307)
  or cards API (HTTP 401).
- The retained, explicitly synthetic baseline card was used without changing
  its identity: public profile, QR SVG, and vCard returned HTTP 200; the QR was
  valid SVG and the vCard contained BEGIN/END:VCARD markers. Setting that card
  private through the authenticated application API returned 200, and profile,
  QR, and vCard each returned 404. Restoring public visibility returned all
  endpoints to HTTP 200.
- A uniquely named synthetic organisation was created through the authenticated
  API (201), appeared in the super-administrator listing (200), and was deleted
  immediately (200). No existing organisation, user, role, password, card, or
  database record was deleted or reset.
- Headless Chrome inspected desktop and mobile login plus mobile public-card
  layouts. The inspected screens had no overflow, broken assets, or visible
  German UI; final-image login HTML confirms the label is `Email`.

### Final build and deployment state

After the runtime-copy corrections, local `npm run build` compiled and passed
TypeScript, producing build ID `fZ_nko6qcfHbTp4wr7TPV`; `git diff --check`
passed. The final `docker compose build cardnexus` completed, a fresh
`cardnexus:local` image was started with `docker compose up -d --force-recreate
cardnexus`, and the container reached `healthy`. `/login` returned HTTP 200.

The geoip-lite and kysely engine warnings remain non-blocking compatibility
risks: geoip-lite requests Node >=24 while local verification uses Node 22 and
the Docker image uses Node 20; kysely requests Node >=22 while Docker uses Node
20. Neither prevented the final production build, startup, authentication, or
tested runtime flows. No dependency or Node-version change was made.

### Remaining test limitations and status

**Milestone 2B status: PARTIAL.** Build, image, health, data-preservation,
authentication, super-administration, organisation lifecycle, card editing and
visibility, public profile, QR, vCard, logout protection, and the available
desktop/mobile browser screens passed. A distinct card-creation action could
not be safely rerun because the retained administrator is on the Free plan and
already owns its single permitted synthetic card; modifying the plan or
deleting that retained baseline card would violate the scope. Role-specific
denial for an authenticated non-administrator could not be run because no
credentials for the retained member account are available, and credentials or
roles were not changed. Headless browser coverage did not authenticate into
dashboard pages, so those screens were verified through authenticated HTTP
routes rather than interactive browser controls. These tests are not claimed
as passed.

## Final rendered UI English localisation — 2026-11-11

Screenshot evidence identified residual German and mixed-language UI that had
escaped earlier static passes. The actual sources were corrected across the
card editor and design controls, analytics, team directory, NFC instructions,
widget, settings/integrations, custom-domain guide, pricing and upgrade pages,
administrator users/settings/changelog, organisation settings, invitations,
campaign controls, and visible API error messages. Existing user-authored card
data was not overwritten.

The final source review found no genuine user-facing German. The remaining
German is limited to seed-console/sample content in `prisma/seed.ts` and
German gender-value compatibility in `lib/vcard.ts`; legacy webhook identifiers
remain source-level API compatibility values but are no longer shown in the UI.
The application continues to use LINKA branding, English (Tanzania) date
formatting where dates are formatted locally, and TZS presentation for pricing.

### Rendered verification

The production Docker image was rebuilt and the `cardnexus` service was
recreated successfully. It reached `healthy`; `/` and `/login` returned HTTP
200. A credentialed local administrator session then returned HTTP 200 for
`/card`, `/analytics`, `/team`, `/nfc`, `/widget`, `/settings`, `/upgrade`,
`/admin`, and `/admin/users`. Rendered responses for those routes were checked
against the German phrases identified in the supplied screenshots; none were
present. Existing credentials, database records, and uploads were not changed.
