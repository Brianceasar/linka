"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Lock, Download, Trash2, Loader2 } from "lucide-react";

export function AccountActions() {
  return (
    <>
      <PasswordCard />
      <DataExportCard />
      <DeleteAccountCard />
    </>
  );
}

/* ─── Password change ─────────────────────────────────────────────────── */

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const res = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });

    if (res.error) {
      toast.error("Password could not be changed", {
        description: "Your current password is incorrect or the new password is too weak.",
      });
    } else {
      toast.success("Password changed", {
        description: "Andere Sessions wurden abgemeldet.",
      });
      setCurrent("");
      setNext("");
    }
    setBusy(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <CardTitle className="text-base">Change password</CardTitle>
            <CardDescription>
              Set a new password. Other active sessions will be signed out.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3 max-w-sm">
          <div className="space-y-1.5">
            <Label htmlFor="current-pw">Current password</Label>
            <Input
              id="current-pw"
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-pw">New password</Label>
            <Input
              id="new-pw"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" disabled={busy || !current || next.length < 8}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Change password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* ─── Data export (DSGVO Art. 15/20) ──────────────────────────────────── */

function DataExportCard() {
  const [busy, setBusy] = useState(false);

  async function downloadExport() {
    setBusy(true);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) throw new Error("Export fehlgeschlagen");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `linka-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Export gestartet");
    } catch {
      toast.error("Export fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Download className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <CardTitle className="text-base">Export data</CardTitle>
            <CardDescription>
              Download your personal data as JSON.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" onClick={downloadExport} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download data as JSON
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── Delete account (DSGVO Art. 17) ──────────────────────────────────── */

function DeleteAccountCard() {
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const REQUIRED = "DELETE";

  async function performDelete() {
    setBusy(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error("Deletion failed", { description: data.error });
      setBusy(false);
      return;
    }
    // Force a hard reload — session is now invalid
    window.location.href = "/";
  }

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <CardTitle className="text-base text-destructive">Delete account</CardTitle>
            <CardDescription>
              Permanently removes your account and all associated data
              (cards, leads, webhooks, API keys).
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Permanently delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action <strong>cannot be undone</strong>. All
                your cards, leads, analytics, webhooks, and API keys
                will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">
                Type <code className="px-1 py-0.5 rounded bg-muted text-xs">{REQUIRED}</code> to confirm
              </Label>
              <Input
                id="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="off"
                autoFocus
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirm("")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={busy || confirm !== REQUIRED}
                onClick={(e) => { e.preventDefault(); void performDelete(); }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                Delete permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
