import type { Metadata } from "next";
import { getPlatformSettings } from "@/lib/platform";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BRAND } from "@/lib/brand";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPlatformSettings();

  return {
    title: {
      default: `${BRAND.name} | ${BRAND.tagline}`,
      template: `%s | ${BRAND.name}`,
    },
    description: BRAND.description,
    icons: s.faviconUrl
      ? {
          icon: s.faviconUrl,
          shortcut: s.faviconUrl,
          apple: s.faviconUrl,
        }
      : undefined,
    metadataBase: new URL(s.appUrl),
    openGraph: { siteName: BRAND.attribution, title: `${BRAND.name} | ${BRAND.tagline}`, description: BRAND.description },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getPlatformSettings();

  return (
    <html lang={BRAND.locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Dynamic favicon — overrides any static file */}
        {s.faviconUrl && (
          <>
            <link rel="icon" href={s.faviconUrl} />
            <link rel="shortcut icon" href={s.faviconUrl} />
            <link rel="apple-touch-icon" href={s.faviconUrl} />
          </>
        )}
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
