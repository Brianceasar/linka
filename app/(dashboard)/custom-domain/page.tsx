import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Server, CheckCircle } from "lucide-react";

export const metadata = { title: "Set up domain" };

export default async function CustomDomainPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "yourserver.com";
  const appHost = host;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link href="/card" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to card
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="h-6 w-6" />
          Set up a custom domain
        </h1>
        <p className="text-muted-foreground mt-1">
          Connect a custom domain to your digital business card.
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">1</div>
            <div className="space-y-3 flex-1">
              <h2 className="font-semibold">Buy or select a domain</h2>
              <p className="text-sm text-muted-foreground">
                Buy a domain from a provider of your choice (for example, Namecheap, IONOS, Hetzner, or Cloudflare), or use an existing subdomain.
              </p>
              <div className="bg-muted rounded-lg p-3 text-sm font-mono">
                Example: card.yourcompany.com
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">2</div>
            <div className="space-y-3 flex-1">
              <h2 className="font-semibold">Add a DNS record</h2>
              <p className="text-sm text-muted-foreground">
                In your domain provider's DNS management area, point a <strong>CNAME record</strong> to this platform's server:
              </p>
              <div className="bg-muted rounded-lg p-4 space-y-2 text-sm font-mono">
                <div className="grid grid-cols-3 gap-4 text-muted-foreground text-xs uppercase tracking-wide mb-2">
                  <span>Type</span><span>Name</span><span>Target</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span>CNAME</span>
                  <span>card</span>
                  <span className="break-all">{appHost}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                For a root domain (without a subdomain), use an <strong>A record</strong> pointing to the server IP address instead.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">3</div>
            <div className="space-y-3 flex-1">
              <h2 className="font-semibold">Configure the reverse proxy</h2>
              <p className="text-sm text-muted-foreground">
                To enable HTTPS, ensure your reverse proxy (for example, Caddy) accepts the domain and forwards it to the application.
              </p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Caddy (recommended — automatic HTTPS):</p>
                <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre">{`card.yourcompany.com {
    reverse_proxy cardnexus:3000
}`}</pre>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Nginx:</p>
                <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre">{`server {
    listen 80;
    server_name karte.meinefirma.de;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">4</div>
            <div className="space-y-3 flex-1">
              <h2 className="font-semibold">Add the domain in card settings</h2>
              <p className="text-sm text-muted-foreground">
                Enter your domain in the <strong>Design → Card domain</strong> tab of the card editor. Your QR codes, NFC links, and campaign URLs will then use this domain automatically.
              </p>
              <Link href="/card" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                <CheckCircle className="h-4 w-4" />
                Back to card
              </Link>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex gap-2">
          <Server className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Middleware routing</p>
            <p className="mt-0.5">LINKA recognises requests through your domain and resolves them to the right card when the reverse proxy sends the correct <code className="font-mono text-xs">Host</code> header.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
