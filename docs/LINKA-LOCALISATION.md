# LINKA localisation

LINKA is English-first. `app/layout.tsx` declares `lang="en"`; browser and
Open Graph metadata, public-card actions, authentication, and transactional
emails use professional English.

There was no translation framework in the adopted project. To avoid a risky
architectural rewrite during this rebrand, static interface strings remain
co-located with their React route/component and API responses remain co-located
with their endpoint. This is maintainable for the current English-only product.

## Translation locations

- `app/(auth)/**` — authentication and recovery
- `app/(dashboard)/**`, `app/(admin)/**`, `components/**` — signed-in UI
- `app/c/[slug]/**`, templates, and `app/not-found.tsx` — visitor experience
- `app/api/**` — user-visible endpoint errors
- `lib/email.ts` — transactional email
- `lib/plans.ts` and `prisma/seed.ts` — plan copy and test/demo data

## Adding another language

First move repeated UI text into typed locale dictionaries grouped by feature,
then select the dictionary from a locale resolver at the route boundary. Keep
user-generated data, card names, and organisation content untouched. Add a
language selector only after product and support owners have approved the
additional locale.

## Coverage and exceptions

The final rendered-UI pass covered the dashboard, card editor, signature,
campaigns, analytics, team, NFC, widget, settings and integrations, upgrade,
custom-domain, pricing, administrator, public-card, email, and API-error
surfaces. Static signed-in and public UI now uses English consistently.

The following German is intentionally retained and is not application UI:

- German input accepted by `lib/vcard.ts` for compatibility with existing stored
  gender values;
- German sample content and console text in `prisma/seed.ts` (test fixture);
- German comments and historical baseline/setup documentation.

Legal pages are English templates containing explicit placeholders. They must be
reviewed and completed with approved CYREX legal information before publication.

### Legal information CYREX must supply

Before either legal template is published, CYREX must provide the approved legal
entity name, registered and service addresses, applicable contact and privacy
contact details, responsible-content contact, jurisdiction-specific notice and
dispute-resolution wording, hosting/data-processing locations, cookie policy,
and approved retention/deletion policy. These values must not be inferred from
the codebase.

### Final rendered audit classification — 2026-11-11

- **Test/sample content:** German demo bio and seed-console messages in
  `prisma/seed.ts`.
- **Technical compatibility:** `männlich` accepted in `lib/vcard.ts` so
  existing stored values still produce valid vCards.
- **Internal comments/identifiers:** the public-card expiry comment and legacy
  webhook protocol identifiers; they are not rendered.
- **Historical documentation:** baseline and setup records under `docs/`.
- **User-facing residuals:** none found in the final source scan or in the
  screenshot-driven rendered route review.

### Completion register

Reviewed and complete: administration (cards, card detail, users, settings,
access log, organisations), settings and integrations, team and CSV import,
signature, card editor/templates, custom domains, analytics, campaigns, leads,
widget, NFC, upgrade, public cards, emails, and CSV exports.

The remaining German source text is limited to `prisma/seed.ts` test fixtures
and `lib/vcard.ts` compatibility handling for existing German gender values.
Neither is rendered as standard product UI.
# Rendered UI verification — 2026-11-11

The running Docker image was audited against the dashboard, card editor,
signature, campaigns, analytics, and widget screenshots. The remaining German
labels were direct component strings, generated signature/wallet content, and
the exact database default card name. They were translated at source; the lone
stored `Meine Karte` value was changed only because it exactly matched the
system default. No other stored profile data was modified.

The rebuilt container served authenticated dashboard, card, campaigns,
analytics, widget, and signature routes with HTTP 200. Rendered HTML confirmed
`lang="en-TZ"`, English card-editor labels, English campaign/analytics/widget
copy, and the generated signature label `Digital Business Card`. Historical
German changelog entries remain excluded from the live product UI.
