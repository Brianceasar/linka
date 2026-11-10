"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyPassword, makeCardUnlockToken } from "@/lib/password-hash";

function unlockCookieName(slug: string): string {
  return `card_unlocked_${slug}`;
}

export async function unlockCard(
  slug: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const card = await db.card.findUnique({
    where: { slug },
    select: { passwordHash: true, isPublic: true, expiresAt: true },
  });
  if (!card || !card.isPublic) return { ok: false, error: "Card not found" };
  if (card.expiresAt && card.expiresAt < new Date()) return { ok: false, error: "Card expired" };
  if (!card.passwordHash) return { ok: true };

  if (!verifyPassword(password, card.passwordHash)) {
    return { ok: false, error: "Incorrect password" };
  }

  // Store an HMAC-signed token, not the raw hash — prevents forging the cookie
  // by knowing the hash alone (e.g. from a DB dump or log leak).
  const token = makeCardUnlockToken(slug, card.passwordHash);
  (await cookies()).set(unlockCookieName(slug), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return { ok: true };
}
