export const FONT_OPTIONS = [
  { value: "inter",   label: "Inter",   preview: "Aa", className: "font-sans" },
  { value: "serif",   label: "Serif",   preview: "Aa", className: "font-serif" },
  { value: "mono",    label: "Mono",    preview: "Aa", className: "font-mono" },
  { value: "display", label: "Display", preview: "Aa", className: "font-sans tracking-tight" },
];

export const LAYOUT_OPTIONS = [
  { value: "standard", label: "Standard", description: "Avatar left, name right" },
  { value: "centered", label: "Centered", description: "Avatar and name centred" },
  { value: "compact",  label: "Compact",  description: "Space-saving, smaller avatar" },
];

export const ROUNDED_OPTIONS = [
  { value: "default", label: "Abgerundet" },
  { value: "sharp",   label: "Eckig" },
  { value: "pill",    label: "Rund (Pill)" },
];

export const SHADOW_OPTIONS = [
  { value: "none", label: "Kein" },
  { value: "sm",   label: "Leicht" },
  { value: "md",   label: "Mittel" },
  { value: "lg",   label: "Stark" },
  { value: "xl",   label: "Sehr stark" },
];

export const SOCIAL_STYLE_OPTIONS = [
  { value: "icons",   label: "Icons",        description: "Farbige Symbol-Buttons" },
  { value: "outline", label: "Icons + Label", description: "Umrandete Pills mit Text" },
  { value: "minimal", label: "Minimal",       description: "Nur Textlinks" },
];

export const AVATAR_BORDER_OPTIONS = [
  { value: "none", label: "Kein" },
  { value: "ring", label: "Ring" },
  { value: "glow", label: "Glow" },
];

export const BG_OPTIONS = [
  { value: "white",    label: "White",   description: "Classic and clean" },
  { value: "tinted",   label: "Tinted",  description: "A hint of the primary colour" },
  { value: "gradient", label: "Verlauf", description: "Sanfter Farbverlauf" },
];
