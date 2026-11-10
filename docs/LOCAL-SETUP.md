# Local setup

## Prerequisites

- Docker Engine with Docker Compose v2
- Port 3000 available on the host
- OpenSSL (only needed when manually generating replacement secrets)

This deployment uses the repository's Compose stack: one Next.js container and
SQLite. SQLite is stored in `./data/app.db`; uploads are stored in
`./uploads`. Both directories are bind mounts and are intentionally ignored by
Git.

## Configure the environment

Copy the template and set unique values:

```bash
cp .env.example .env
openssl rand -base64 48
openssl rand -base64 32
```

Put the first generated value in `BETTER_AUTH_SECRET` and the second in
`INITIAL_ADMIN_PASSWORD`. Choose an administrator email for
`INITIAL_ADMIN_EMAIL`. The locally prepared `.env` is ignored by Git; never
commit it or paste its contents into tickets, logs, or documentation.

Required values:

| Variable | Purpose |
| --- | --- |
| `APP_URL` | Public local base URL; use `http://localhost:3000`. |
| `BETTER_AUTH_URL` | Better Auth base URL; use the same local URL. |
| `BETTER_AUTH_SECRET` | Random secret used to sign authentication data. |
| `INITIAL_ADMIN_EMAIL` | Email for the first super administrator. |
| `INITIAL_ADMIN_PASSWORD` | Unique first-run administrator password. |

The Compose deployment fixes `DATABASE_URL` to
`file:/app/data/app.db`, so it must not be overridden in `.env`. The
initial-admin values are only consumed when no database exists; they do not
change an existing account.

Leave Stripe, PayPal, SMTP, Apple Wallet, and Google Wallet variables blank for
the basic local deployment. They are optional and disabled by default.

## Start and stop

```bash
docker compose up --build -d
docker compose ps
```

Open [http://localhost:3000](http://localhost:3000), and verify the auth page at
[http://localhost:3000/login](http://localhost:3000/login). Sign in with the
administrator email and password saved only in your local `.env`.

To stop without deleting persistent data:

```bash
docker compose stop
```

To restart the service:

```bash
docker compose restart cardnexus
```

To remove the container and network while retaining the bind-mounted database
and uploads:

```bash
docker compose down
```

## Logs, database setup, and verification

View logs:

```bash
docker compose logs -f cardnexus
```

The image creates its base SQLite schema during the image build. At every
container startup it runs the idempotent runtime migration script. To rerun
that script manually:

```bash
docker compose exec cardnexus node /app/prisma/migrate-runtime.js
```

Verify the running service and persistence:

```bash
docker compose ps
curl -I http://localhost:3000/
curl -I http://localhost:3000/login
docker compose restart cardnexus
docker compose logs --tail=80 cardnexus
```

After restart, logs should report an existing database and the application
should remain healthy. The data file is `data/app.db`; do not delete it unless
you intentionally want a completely fresh local installation.

## Common errors

| Symptom | Resolution |
| --- | --- |
| Port 3000 is already allocated | Stop the conflicting process or change the Compose host port and set both URL variables to the new port. |
| Compose reports a missing auth/admin variable | Create `.env` from `.env.example` and set every required variable. |
| Container exits on first run | Inspect `docker compose logs cardnexus`; verify the first-run administrator variables are non-empty. |
| Authentication redirects to the wrong host | Ensure `APP_URL` and `BETTER_AUTH_URL` exactly match the browser URL, including port. |
| Database appears empty after a restart | Check that `data/app.db` exists and do not use `docker compose down -v` or delete `data/`. |
