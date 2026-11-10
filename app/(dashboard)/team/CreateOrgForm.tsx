"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Loader2 } from "lucide-react";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function CreateOrgForm() {
  const router = useRouter();
  const [name,  setName]  = useState("");
  const [slug,  setSlug]  = useState("");
  const [color, setColor] = useState("#0F172A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleName(v: string) {
    setName(v);
    setSlug(slugify(v));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug || slugify(name), primaryColor: color }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to create organisation");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      <div className="space-y-1.5">
        <Label>Organisation name</Label>
        <Input
          value={name}
          onChange={(e) => handleName(e.target.value)}
          placeholder="My Company"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>URL slug</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0">/team/</span>
          <Input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="meine-firma"
            className="font-mono"
          />
        </div>
        <p className="text-xs text-muted-foreground">Public URL for the team directory</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label>Accent colour</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Primary colour for your members' cards</p>
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-9 w-16 cursor-pointer rounded border border-border p-0.5"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
        {loading
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
          : <><Building2 className="h-4 w-4" /> Create organisation</>}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        You will automatically become the organisation administrator.
        You can then adjust design policies in <a href="/settings" className="underline hover:text-foreground">Settings</a>.
      </p>
    </form>
  );
}
