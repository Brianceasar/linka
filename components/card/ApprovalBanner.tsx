"use client";

import { Clock, XCircle } from "lucide-react";

interface Props {
  status: string;
  note?: string | null;
}

export function ApprovalBanner({ status, note }: Props) {
  if (status === "pending") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Clock className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Card awaiting approval</p>
          <p className="text-amber-700 mt-0.5">
            Your latest change is being reviewed by an administrator. The previously approved card remains visible until approval.
          </p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Change declined</p>
          {note && <p className="text-red-700 mt-0.5">{note}</p>}
          <p className="text-red-600 mt-1 text-xs">Review your card and save it again.</p>
        </div>
      </div>
    );
  }

  return null;
}
