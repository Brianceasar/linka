import nodemailer from "nodemailer";

// ── Transport ──────────────────────────────────────────────────────────────
function createTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null; // Email disabled if not configured

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true", // true = TLS on port 465
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
      : undefined,
  });
}

const FROM = process.env.SMTP_FROM ?? "LINKA by CYREX Technologies <noreply@linka.local>";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "LINKA";

/**
 * HTML-escape user-supplied strings so they can't break out of attribute or
 * tag context in our email templates. Closes the XSS / HTML-injection vector
 * in invitation, welcome and similar templates.
 */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Base layout ────────────────────────────────────────────────────────────
function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo / brand -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:32px;height:32px;background:#0f172a;border-radius:8px;display:inline-block;text-align:center;line-height:32px;color:#fff;font-size:12px;font-weight:700;">${APP_NAME.slice(0, 2).toUpperCase()}</div>
                <span style="font-size:16px;font-weight:600;color:#0f172a;">${APP_NAME}</span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px 36px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 0 0;color:#9ca3af;font-size:12px;line-height:1.6;">
              &copy; ${new Date().getFullYear()} ${APP_NAME} by CYREX Technologies. All rights reserved.<br />
              This is an automated message. Please do not reply.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function btn(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;margin:24px 0;">${text}</a>`;
}

function h1(text: string) {
  return `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">${text}</h1>`;
}

function p(text: string) {
  return `<p style="margin:12px 0;font-size:15px;line-height:1.6;color:#374151;">${text}</p>`;
}

function muted(text: string) {
  return `<p style="margin:20px 0 0;font-size:12px;color:#9ca3af;line-height:1.5;">${text}</p>`;
}

// ── Send helper ────────────────────────────────────────────────────────────
async function send(to: string, subject: string, html: string) {
  const transport = createTransport();
  if (!transport) {
    console.warn(`[email] SMTP not configured — skipping email to ${to}: ${subject}`);
    return;
  }
  try {
    await transport.sendMail({ from: FROM, to, subject, html });
  } catch (err) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, err);
  }
}

// ── Invitation email ───────────────────────────────────────────────────────
export async function sendInvitationEmail({
  to, senderName, orgName, role, inviteUrl,
}: {
  to: string;
  senderName: string;
  orgName: string;
  role: string;
  inviteUrl: string;
}) {
  const roleLabel: Record<string, string> = {
    company_admin: "Administrator",
    team_leader:   "Team Leader",
    member:        "Member",
  };

  const html = layout(
    esc(`Invitation to ${orgName}`),
    `
    ${h1("You've been invited")}
    ${p(`<strong>${esc(senderName)}</strong> invited you to join <strong>${esc(orgName)}</strong> on ${esc(APP_NAME)} as <strong>${esc(roleLabel[role] ?? role)}</strong>.`)}
    ${p("Create your account and start sharing your digital identity.")}
    <div style="text-align:center;">
      ${btn("Accept invitation", esc(inviteUrl))}
    </div>
    ${muted(`This link is valid for 7 days. If you were not expecting this email, you can safely ignore it.<br/>Link: ${esc(inviteUrl)}`)}
    `
  );

  await send(to, `${senderName} invited you to ${orgName}`, html);
}

// ── Welcome email ──────────────────────────────────────────────────────────
export async function sendWelcomeEmail({
  to, name, dashboardUrl,
}: {
  to: string;
  name: string;
  dashboardUrl: string;
}) {
  const html = layout(
    esc(`Welcome to ${APP_NAME}`),
    `
    ${h1(`Hello ${esc(name.split(" ")[0])} 👋`)}
    ${p(`Your ${esc(APP_NAME)} account is ready.`)}
    ${p("Create your digital identity, add your contact details, and share it by link, QR code, or NFC tag.")}
    <div style="text-align:center;">
      ${btn("Open dashboard", esc(dashboardUrl))}
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;border-top:1px solid #f3f4f6;padding-top:20px;">
      <tr>
        <td style="font-size:13px;color:#6b7280;line-height:1.8;">
          <strong style="color:#0f172a;">Next steps:</strong><br/>
          &#10003; Design your card &rarr; choose a template and colour<br/>
          &#10003; Download your QR code or set up an NFC tag<br/>
          &#10003; Use analytics to understand card views
        </td>
      </tr>
    </table>
    ${muted("You are receiving this email because you just registered.")}
    `
  );

  await send(to, `Welcome to ${APP_NAME}!`, html);
}

// ── Lead notification email ────────────────────────────────────────────────
export async function sendLeadNotificationEmail({
  to, ownerName, leadName, leadEmail, leadPhone, leadMessage, cardName, dashboardUrl,
}: {
  to: string;
  ownerName: string;
  leadName: string;
  leadEmail?: string | null;
  leadPhone?: string | null;
  leadMessage?: string | null;
  cardName: string;
  dashboardUrl: string;
}) {
  const rows = [
    leadEmail ? `<tr><td style="color:#6b7280;padding:4px 0;width:80px;">Email</td><td style="padding:4px 0;"><a href="mailto:${esc(leadEmail)}" style="color:#0f172a;">${esc(leadEmail)}</a></td></tr>` : "",
    leadPhone ? `<tr><td style="color:#6b7280;padding:4px 0;">Phone</td><td style="padding:4px 0;">${esc(leadPhone)}</td></tr>` : "",
    leadMessage ? `<tr><td style="color:#6b7280;padding:4px 0;vertical-align:top;">Message</td><td style="padding:4px 0;">${esc(leadMessage)}</td></tr>` : "",
  ].filter(Boolean).join("");

  const html = layout(
    `New lead – ${cardName}`,
    `
    ${h1("New contact from your card")}
    ${p(`<strong>${esc(leadName)}</strong> shared their contact details through <strong>${esc(cardName)}</strong>.`)}
    <table style="margin:16px 0;font-size:14px;line-height:1.6;width:100%;">
      <tr><td style="color:#6b7280;padding:4px 0;width:80px;">Name</td><td style="padding:4px 0;font-weight:600;">${esc(leadName)}</td></tr>
      ${rows}
    </table>
    <div style="text-align:center;">
      ${btn("View leads", esc(dashboardUrl))}
    </div>
    ${muted("You are receiving this email because instant lead notifications are enabled. You can change this in Settings.")}
    `
  );

  await send(to, `New lead: ${leadName} (${cardName})`, html);
}

// ── Org frozen email ──────────────────────────────────────────────────────
export async function sendOrgFrozenEmail({
  to, adminName, orgName, upgradeUrl,
}: {
  to: string;
  adminName: string;
  orgName: string;
  upgradeUrl: string;
}) {
  const html = layout(
    esc(`Organisation frozen – ${orgName}`),
    `
    ${h1("Your organisation has been frozen")}
    ${p(`Hello ${esc(adminName.split(" ")[0])}, the <strong>Business plan</strong> for <strong>${esc(orgName)}</strong> has expired or been cancelled.`)}
    ${p(`Your organisation and member data are retained. Members can continue using ${APP_NAME} on their own Free accounts, without organisation features.`)}
    <table style="margin:16px 0;border-radius:8px;background:#fef3c7;padding:16px;width:100%;border-left:4px solid #f59e0b;">
      <tr><td style="font-size:14px;color:#92400e;line-height:1.6;">
        <strong>Unavailable while frozen:</strong><br/>
        &bull; Member management and invitations<br/>
        &bull; Organisation card design policies<br/>
        &bull; Bulk import<br/>
        &bull; Team directory<br/><br/>
        <strong>Retained:</strong><br/>
        &bull; All cards and contact details<br/>
        &bull; All analytics data<br/>
        &bull; Organisation membership assignments
      </td></tr>
    </table>
    ${p("Subscribe to Business again to reactivate the organisation immediately.")}
    <div style="text-align:center;">
      ${btn("View Business plan", esc(upgradeUrl))}
    </div>
    ${muted("You are receiving this email as an organisation administrator.")}
    `
  );
  await send(to, `Organisation frozen: ${orgName}`, html);
}

// ── Org restored email ─────────────────────────────────────────────────────
export async function sendOrgRestoredEmail({
  to, adminName, orgName, dashboardUrl,
}: {
  to: string;
  adminName: string;
  orgName: string;
  dashboardUrl: string;
}) {
  const html = layout(
    esc(`Organisation restored – ${orgName}`),
    `
    ${h1("Your organisation is active again")}
    ${p(`Hello ${esc(adminName.split(" ")[0])}, your Business plan is active again. <strong>${esc(orgName)}</strong> and all features are available immediately.`)}
    ${p("All members, cards, and settings have been retained.")}
    <div style="text-align:center;">
      ${btn("Open team area", esc(dashboardUrl))}
    </div>
    ${muted("You are receiving this email as an organisation administrator.")}
    `
  );
  await send(to, `Organisation restored: ${orgName}`, html);
}

// ── Email change notification ──────────────────────────────────────────────
export async function sendEmailChangeNotification({
  to, newEmail,
}: {
  to: string;
  newEmail: string;
}) {
  const html = layout(
    esc(`Email address changed – ${APP_NAME}`),
    `
    ${h1("Email address changed")}
    ${p(`The email address for your ${esc(APP_NAME)} account has just changed.`)}
    ${p(`New address: <strong>${esc(newEmail)}</strong>`)}
    ${p("If you did <strong>not</strong> make this change, contact us immediately and change your password.")}
    ${muted("You are receiving this security message at your previous address.")}
    `
  );
  await send(to, `Email address changed – ${APP_NAME}`, html);
}

// ── Password reset email ───────────────────────────────────────────────────
export async function sendPasswordResetEmail({
  to, url,
}: {
  to: string;
  url: string;
}) {
  const html = layout(
    esc(`Reset password – ${APP_NAME}`),
    `
    ${h1("Reset your password")}
    ${p(`You requested a password reset for your ${esc(APP_NAME)} account. Select the button below to set a new password.`)}
    <div style="text-align:center;">
      ${btn("Reset password", esc(url))}
    </div>
    ${muted(`This link is valid for one hour. If you did not make this request, you can safely ignore this email.<br/>Link: ${esc(url)}`)}
    `
  );
  await send(to, `Reset password – ${APP_NAME}`, html);
}
