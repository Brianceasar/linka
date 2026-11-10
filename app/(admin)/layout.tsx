import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Building2, LayoutDashboard, Settings2, CreditCard, Activity } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/cards", label: "Cards", icon: CreditCard },
  { href: "/admin/access-log", label: "Access Log", icon: Activity },
  { href: "/admin/organizations", label: "Organisations", icon: Building2 },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as { role?: string } | undefined;

  if (!session || user?.role !== "super_admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BrandLogo compact />
            <span className="text-sm font-semibold">LINKA administration</span>
          </div>
          <nav className="flex items-center gap-1 flex-1">
            {adminNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-6 text-right">
        <span className="text-[10px] text-muted-foreground/40 select-none tabular-nums">
          v{process.env.NEXT_PUBLIC_APP_VERSION}
          {process.env.NEXT_PUBLIC_BUILD_TIME && (
            <> · {new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString("en", { dateStyle: "short", timeStyle: "short" })}</>
          )}
        </span>
      </footer>
    </div>
  );
}
