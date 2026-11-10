"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { Save, Check, Globe, Type, Image, Palette, X, Plus } from "lucide-react";
import type { PlatformSettings } from "@/lib/platform";

function parseAllowedDomains(val: string | null): string[] {
  try { return val ? JSON.parse(val) : []; } catch { return []; }
}

export function AdminSettingsClient({ settings: initial }: { settings: PlatformSettings }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [domains, setDomains] = useState<string[]>(() => parseAllowedDomains(initial.allowedDomains));
  const [newDomain, setNewDomain] = useState("");

  function update<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  function addDomain() {
    const d = newDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!d || domains.includes(d)) return;
    setDomains([...domains, d]);
    setNewDomain("");
  }

  async function save() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload = { ...s, allowedDomains: domains.length > 0 ? JSON.stringify(domains) : null };
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(typeof json.error === "string" ? json.error : "Unable to save settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Platform settings</h1>
        <p className="text-muted-foreground mt-1">
          Name, URL, Favicon und Branding der gesamten Anwendung
        </p>
      </div>

      {/* App Identity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Anwendungsname</CardTitle>
          </div>
          <CardDescription>
            Shown as the product name in the browser tab, sidebar, emails, and throughout the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="appName">Name</Label>
            <Input
              id="appName"
              value={s.appName}
              onChange={(e) => update("appName", e.target.value)}
              placeholder="LINKA"
              maxLength={64}
            />
            <p className="text-xs text-muted-foreground">
              Browser tab preview: <span className="font-mono">{s.appName} – Digital Business Cards</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* App URL */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Anwendungs-URL</CardTitle>
          </div>
          <CardDescription>
            Base application URL. Used in QR codes, vCards, and invitation links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="appUrl">URL</Label>
            <Input
              id="appUrl"
              value={s.appUrl}
              onChange={(e) => update("appUrl", e.target.value)}
              placeholder="https://meinedomain.de"
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Example card URL: <span className="font-mono">{s.appUrl.replace(/\/$/, "")}/c/jordan-lee</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Favicon & Logo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Favicon & Logo</CardTitle>
          </div>
          <CardDescription>
            The favicon appears in the browser tab. The logo appears in the sidebar instead of initials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Favicon</Label>
            <p className="text-xs text-muted-foreground">
              Recommended: square, at least 32×32 px (PNG, ICO, SVG).
            </p>
            <div className="flex items-start gap-4">
              <ImageUpload
                value={s.faviconUrl}
                onChange={(url) => update("faviconUrl", url)}
                label="Upload favicon"
                shape="square"
              />
              {s.faviconUrl && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Preview</p>
                    <div className="flex items-center gap-2">
                      <img src={s.faviconUrl} alt="Favicon" className="h-4 w-4 object-cover" />
                      <span className="font-mono">{s.appName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sidebar logo</Label>
            <p className="text-xs text-muted-foreground">
              Replaces the letter initials in the sidebar. Recommended: square, 64×64 px.
            </p>
            <ImageUpload
              value={s.logoUrl}
              onChange={(url) => update("logoUrl", url)}
              label="Upload logo"
              shape="square"
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Other settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="supportEmail">Support email</Label>
            <Input
              id="supportEmail"
              value={s.supportEmail ?? ""}
              onChange={(e) => update("supportEmail", e.target.value || null)}
              placeholder="support@yourdomain.com"
              type="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="footerText">Footer text</Label>
            <Input
              id="footerText"
              value={s.footerText ?? ""}
              onChange={(e) => update("footerText", e.target.value || null)}
              placeholder="© 2025 Your company. All rights reserved."
              maxLength={200}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Domains */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Custom Domains</CardTitle>
          </div>
          <CardDescription>
            Users and organisations can select these domains for their cards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <span key={d} className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full text-sm">
                {d}
                <button type="button" onClick={() => setDomains(domains.filter((x) => x !== d))}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {domains.length === 0 && (
              <p className="text-sm text-muted-foreground">No domains have been added yet.</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDomain()}
              placeholder="card.yourcompany.com"
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={addDomain}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive border border-destructive/20">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saved ? (
            <><Check className="h-4 w-4" /> Saved</>
          ) : (
            <><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save settings"}</>
          )}
        </Button>
        {saved && (
          <p className="text-sm text-muted-foreground">
            Changes are active — reload the browser tab to check them
          </p>
        )}
      </div>
    </div>
  );
}
