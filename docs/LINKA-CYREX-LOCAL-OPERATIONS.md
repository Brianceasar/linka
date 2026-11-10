# LINKA CYREX local operations

## Current verified installation

- Compose service: `cardnexus`; image: `cardnexus:local`.
- Status: healthy; the root page and login return HTTP 200.
- `LINKA_INTERNAL_MODE=true` is active in the container.
- Administrator sign-in and `/admin` access were verified successfully.
- Existing SQLite database checksum at verification: `7830446cbda606e231f95f255a4a921923b29e84cbdbda87ba099ff717b00229`.
- Existing uploads are present and were not modified.
- Login and public UI use LINKA/CYREX branding and English labels.

## Access URLs

On the LINKA host, administrators use:

`http://localhost:3000`

The current trusted-LAN address is:

`http://192.168.100.56:3000`

Docker publishes port 3000 on all host interfaces, and the LAN URL returned HTTP 200 from this host. It is **not yet suitable for other-device sign-in**: the current `APP_URL` and `BETTER_AUTH_URL` are `http://localhost:3000`, so Better Auth correctly rejected a request with the LAN origin as `Invalid origin` (HTTP 403).

Before allowing team devices to sign in, choose a stable, trusted internal hostname or DHCP-reserved LAN address, then set both values in the host `.env`, for example:

```dotenv
APP_URL=http://linka.cyrex.internal:3000
BETTER_AUTH_URL=http://linka.cyrex.internal:3000
```

Use the same URL in every browser, restart LINKA, and confirm login from a second trusted device. Do not use a changing Wi-Fi address as a permanent URL. HTTPS should be added through an approved internal reverse proxy before use beyond a tightly trusted LAN.

No firewall or router change was made. The firewall state could not be inspected non-interactively because `sudo` requires the host administrator password. Do not open router ports or expose port 3000 publicly. If a host firewall is enabled, allow TCP 3000 only from the trusted CYREX subnet after confirming its range with the network administrator; do not use a world-open rule.

## Daily commands

Run from the repository root:

```bash
docker compose up -d          # start or reconcile LINKA
docker compose stop           # stop without removing containers or bind-mounted data
docker compose start          # start a previously stopped service
docker compose restart        # restart LINKA
docker compose ps             # expect cardnexus to be healthy
docker compose logs --tail=100 cardnexus
docker compose logs -f cardnexus
curl -f http://localhost:3000/ && echo healthy
```

Do not use `docker compose down -v`, delete `data/`, or delete `uploads/` during normal operations. The database and uploads are bind-mounted at `./data` and `./uploads`.

## Backup procedure

Create backups outside the Docker data directories. SQLite's `.backup` command creates a consistent online database snapshot, so it is safe while the service is running; it is preferable to copying `app.db` directly.

```bash
mkdir -p backups
stamp=$(date +%Y%m%d-%H%M%S)
sqlite3 data/app.db ".backup 'backups/linka-app-$stamp.db'"
tar -C . -czf "backups/linka-uploads-$stamp.tar.gz" uploads
sha256sum "backups/linka-app-$stamp.db" "backups/linka-uploads-$stamp.tar.gz" > "backups/linka-$stamp.sha256"
```

Store the database backup, uploads archive, and checksum together in encrypted CYREX-controlled storage. Test restoring a copy on a non-production machine before relying on a backup.

## Restore procedure

Restoration overwrites current data. Schedule maintenance, make a fresh backup first, and obtain approval before proceeding.

```bash
docker compose stop
cp backups/linka-app-YYYYMMDD-HHMMSS.db data/app.db
tar -xzf backups/linka-uploads-YYYYMMDD-HHMMSS.tar.gz -C .
sha256sum -c backups/linka-YYYYMMDD-HHMMSS.sha256
docker compose start
docker compose ps
curl -f http://localhost:3000/ && echo restored
```

The upload archive contains the `uploads/` directory. If restoring to an existing host, first move the current `uploads/` directory to an approved timestamped recovery location so files absent from the backup do not remain mixed into the restored set.

## Team onboarding

1. A `company_admin` creates an invitation from **Team**, choosing the recipient's email and a permitted role. Invitations are email-bound and expire after seven days.
2. In internal mode, uninvited registration is blocked. The employee opens the invitation URL, creates their individual account, and accepts the existing invitation.
3. A `super_admin` opens **Admin → Users**, selects the employee, assigns the required role and individual plan, then saves. Only a super administrator can assign `Free`, `Pro`, or `Business`.
4. The member signs in and opens **Card** to create and edit their card. They can add contact details, links, available profile imagery, and supported design fields.
5. The member publishes the card, copies its public `/c/[slug]` URL, downloads the QR SVG, and downloads the vCard. Unpublishing makes the public URL, QR, and vCard return 404.

Plan policy remains the existing application policy: Free allows one card and three custom links; Pro allows three cards; Business enables unlimited cards/links and the existing team, analytics, campaign, and import capabilities. CYREX super administrators assign these plans individually; there is no global entitlement bypass.

## Before regular team use

- Configure a real CYREX SMTP sender and `SMTP_FROM` as `LINKA by CYREX Technologies <approved-address>`; local testing showed SMTP is currently not configured.
- Set a stable internal `APP_URL`/`BETTER_AUTH_URL` and verify login from a second trusted device.
- Confirm internal firewall policy with CYREX IT before allowing LAN port 3000 access.
- Keep payment-provider credentials empty unless CYREX explicitly enables commercial billing.
