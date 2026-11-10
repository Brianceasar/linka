# LINKA branding

## Product identity

- Product: **LINKA**
- Attribution: **LINKA by CYREX Technologies**
- Tagline: **Connect. Identify. Engage.**

`lib/brand.ts` is the source of truth for this identity, default English locale,
descriptive metadata, visual assets, and colour tokens. Application settings
continue to hold operational values such as the public URL and support address;
they do not override the LINKA product identity.

## Assets

The current approved CYREX mark is centrally configured and replaceable:

- `public/linka-mark.webp` — sidebar, authentication, compact mark, and browser icon

This is the supplied CYREX logo mark on the approved LINKA red background. The
legacy SVG placeholders remain in the repository for history but are not used.
Replace both files (and update `BRAND.assets` if their names change) when an
approved CYREX asset pack is available. Do not alter public-card URLs while
changing assets.

## Visual tokens

`BRAND.colors` defines the LINKA primary teal (`#0F766E`), dark teal
(`#115E59`), and accent (`#14B8A6`). The existing Tailwind semantic tokens in
`app/globals.css` remain the UI system's source for components. New UI should
use semantic classes such as `bg-primary` rather than hard-coding brand values.

## Changing branding

Update `lib/brand.ts`, replace the configured mark asset, then review metadata in
`app/layout.tsx` and transactional email in `lib/email.ts`. Existing database
settings from older installations are normalised to the LINKA identity at read
time, so a database reset is neither needed nor appropriate.
