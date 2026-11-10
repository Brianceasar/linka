"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Copy, Check } from "lucide-react";

interface InviteModalProps {
  onInvited?: () => void;
}

export function InviteModal({ onInvited }: InviteModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleInvite() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error");
      setInviteUrl(json.inviteUrl);
      onInvited?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setEmail("");
    setRole("member");
    setError("");
    setInviteUrl("");
    setCopied(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
        </DialogHeader>

        {!inviteUrl ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input
                type="email"
                placeholder="max@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_leader">Team Leader</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleInvite} disabled={!email || loading} className="w-full">
              {loading ? "Inviting…" : "Create invitation"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm font-medium text-foreground mb-1">Invitation created!</p>
              <p className="text-xs text-muted-foreground">Send the link to {email} (valid for 7 days)</p>
            </div>
            <div className="flex gap-2">
              <Input value={inviteUrl} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={copyUrl}>
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="outline" onClick={reset} className="w-full">
              Invite another user
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
