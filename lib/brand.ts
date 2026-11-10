/**
 * LINKA's single source of truth for product identity.  Keep visual and copy
 * defaults here; tenant-specific operational settings remain in PlatformSettings.
 */
export const BRAND = {
  name: "LINKA",
  company: "CYREX Technologies",
  attribution: "LINKA by CYREX Technologies",
  tagline: "Connect. Identify. Engage.",
  description: "A digital identity platform for sharing professional contact details.",
  locale: "en-TZ",
  assets: {
    mark: "/linka-mark.svg",
    favicon: "/linka-favicon.svg",
  },
  colors: {
    primary: "#F00123",
    primaryDark: "#B8001B",
    accent: "#F00123",
  },
} as const;
