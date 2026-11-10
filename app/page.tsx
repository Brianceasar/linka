import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Smartphone, Nfc, QrCode, Users, BarChart2,
  ArrowRight, Check, Zap, Mail, FileText,
  Shield, Megaphone, CalendarDays, Download,
} from "lucide-react";
import { PLANS } from "@/lib/plans";
import { FaqSection } from "./FaqSection";
import { BRAND } from "@/lib/brand";

const features = [
  { icon: Nfc, title: "NFC ready", desc: "Share contact details with a simple tap." },
  { icon: QrCode, title: "QR code", desc: "A QR code that is generated automatically and always current." },
  { icon: Smartphone, title: "Mobile first", desc: "A fast visitor experience with no app download required." },
  { icon: Users, title: "Team management", desc: "Manage teams, roles, departments, and design from one place." },
  { icon: BarChart2, title: "Analytics", desc: "Understand views, scans, and downloads." },
  { icon: Megaphone, title: "Campaign tracking", desc: "Create UTM links for events and campaigns." },
  { icon: Mail, title: "Email signature", desc: "A professional signature for common email clients." },
  { icon: CalendarDays, title: "Meeting booking", desc: "Link visitors directly to your preferred booking service." },
  { icon: Download, title: "Print export", desc: "Export a card for printing or PDF workflows." },
  { icon: FileText, title: "Lead capture", desc: "Let visitors share their contact details directly from a card." },
  { icon: Shield, title: "Privacy", desc: "Privacy-aware digital identity tools for your organisation." },
  { icon: Zap, title: "White label", desc: "Use your own domain and branding when your plan supports it." },
];

const steps = [
  { n: 1, title: "Create an account", desc: "Register and start with your digital identity." },
  { n: 2, title: "Design your card", desc: "Choose a template, add your details, and set the look." },
  { n: 3, title: "Share and connect", desc: "Use a link, QR code, or NFC tag to share." },
];

const planList = [PLANS.free, PLANS.pro, PLANS.business];

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["1 digital card", "QR code and vCard download", "Lead capture", "4 templates", `Up to ${PLANS.free.features.maxCustomLinks} custom links`, `Analytics (${PLANS.free.features.analyticsRetention} days)`],
  pro: ["All templates", "White label", "Custom domain", "PDF and print export", "Campaign tracking", "Booking link", "Milestone notifications", `Analytics (${PLANS.pro.features.analyticsRetention} days)`],
  business: ["Everything in Pro", "Team and department management", "Bulk CSV import", "Organisation template", "Team directory", `Analytics (${PLANS.business.features.analyticsRetention} days)`],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                <span className="text-xs font-bold text-white">L</span>
              </div>
              <span className="font-semibold tracking-[0.12em]">{BRAND.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#features" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Features</a>
              <a href="#how" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Pricing</a>
              <a href="#faq"      className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors hidden sm:block">
                Sign in
              </Link>
              <Button asChild size="sm">
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          {BRAND.attribution}
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
          Your identity.
          <br />
          <span className="text-gray-400">Shared in seconds.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
          Create a digital identity, share it by NFC, QR code, or link, and keep track of engagement with analytics, lead capture, and team management.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/c/demo">View live demo</Link>
          </Button>
        </div>

        {/* Mock card */}
        <div className="mt-20 relative max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="h-1.5 bg-gray-900" />
            <div className="p-8">
              <div className="flex items-start gap-4 mb-5">
                <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg shrink-0">MH</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Max Hoffmann</h3>
                  <p className="text-sm font-medium text-gray-500">Head of Product</p>
                  <p className="text-sm text-gray-400">TechCorp GmbH</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                {["+49 170 1234567", "max@techcorp.de", "techcorp.de"].map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                    </div>
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how" className="bg-gray-50 dark:bg-gray-950 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How it works</h2>
            <p className="text-gray-500 dark:text-gray-400">Three steps to a shareable digital identity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">{n}</div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Everything you need</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">From a personal card to an organisation-wide identity platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-gray-50 dark:bg-gray-950 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Simple pricing</h2>
            <p className="text-gray-500 dark:text-gray-400">Clear plans with flexible billing.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {planList.map((plan) => {
              const featured = plan.id === "pro";
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-8 border-2 flex flex-col ${
                    featured ? "border-gray-900 bg-gray-900 text-white" : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  {featured && (
                    <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full self-start mb-3">
                      Recommended
                    </span>
                  )}
                  <p className={`text-sm font-medium mb-1 ${featured ? "opacity-60" : "text-gray-500"}`}>{plan.description}</p>
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">TZS {plan.monthlyPrice}</span>
                    <span className={`text-sm ${featured ? "opacity-60" : "text-gray-400"}`}>/month</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {(PLAN_FEATURES[plan.id] ?? []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className={`h-4 w-4 shrink-0 mt-0.5 ${featured ? "text-white" : "text-emerald-500"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={featured ? "secondary" : "default"} className="w-full">
                    <Link href="/register">{plan.id === "free" ? "Get started free" : `Try ${plan.name}`}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
            All plans include the features listed above. Configure deployment and data handling to meet your organisation's requirements.
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Frequently asked questions</h2>
          </div>
          <FaqSection />
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to connect?</h2>
          <p className="text-gray-400 mb-8">Create your LINKA account and start sharing.</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">
              Create an account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-900">
                  <span className="text-[10px] font-bold text-white">L</span>
                </div>
                <span className="font-semibold tracking-[0.12em] text-gray-900 dark:text-gray-100">LINKA</span>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
                {BRAND.tagline} A digital identity platform by CYREX Technologies.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">Product</p>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <li><a href="#features"  className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Pricing</a></li>
                <li><Link href="/c/demo" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Demo</Link></li>
                <li><Link href="/login" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">Legal</p>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <li><Link href="/impressum" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Legal notice</Link></li>
                <li><Link href="/datenschutz" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400 dark:text-gray-500">
            <p>&copy; {new Date().getFullYear()} LINKA by CYREX Technologies. All rights reserved.</p>
            <p>{BRAND.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
