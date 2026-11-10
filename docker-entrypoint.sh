#!/bin/sh
set -e

# This script runs as root so it can fix bind-mount ownership,
# then drops privileges to the nextjs user before starting Node.

log() { printf '[cardnexus] %s %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$*"; }

# Ensure data dirs exist and belong to the app user (handles bind mounts
# created by root on the host, and named volumes with wrong ownership).
mkdir -p /app/data /app/public/uploads
chown nextjs:nodejs /app/data /app/public/uploads

export DATABASE_URL="${DATABASE_URL:-file:/app/data/app.db}"
DB_FILE="${DATABASE_URL#file:}"

if [ ! -f "$DB_FILE" ]; then
  log "First run — copying pre-initialised database..."
  cp /app/prisma/base.db "$DB_FILE"
  chown nextjs:nodejs "$DB_FILE"

  if [ -z "${INITIAL_ADMIN_EMAIL:-}" ] || [ -z "${INITIAL_ADMIN_PASSWORD:-}" ]; then
    log "INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD are required on first run"
    exit 1
  fi

  log "Seeding initial administrator..."
  su-exec nextjs node -e "
const { PrismaClient } = require('/app/node_modules/@prisma/client');
const { hashPassword } = require('/app/node_modules/@better-auth/utils/dist/password.node.cjs');
const { randomUUID } = require('crypto');
async function seed() {
  const db = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
  const now = new Date();
  try {
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
    const adminId = randomUUID();
    const adminHash = await hashPassword(adminPassword);
    await db.user.create({ data: { id: adminId, name: 'Administrator', email: adminEmail,
      emailVerified: true, createdAt: now, updatedAt: now, role: 'super_admin' } });
    await db.account.create({ data: { id: randomUUID(), userId: adminId, accountId: adminEmail,
      providerId: 'credential', password: adminHash, createdAt: now, updatedAt: now } });
    console.log('[cardnexus] ' + now.toISOString() + ' Initial administrator seeded: ' + adminEmail);
  } finally { await db.\$disconnect(); }
}
seed().catch(e => { console.error('[cardnexus] ' + new Date().toISOString() + ' Seed error: ' + e.message); process.exit(1); });
"
else
  log "Existing database found — skipping init"
fi

log "Applying database migrations..."
su-exec nextjs node /app/prisma/migrate-runtime.js

log "Starting application..."
exec su-exec nextjs "$@"
