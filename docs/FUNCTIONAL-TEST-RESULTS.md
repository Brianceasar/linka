# Functional test results

| Test ID | Functional Area | Test Description | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|---|---|
| FT-01 | Deployment | Check service health and root | Healthy / HTTP 200 | Healthy; HTTP 200 | PASS | Compose healthcheck, curl |
| FT-02 | Authentication | Sign in local administrator | Session created | HTTP 200 | PASS | Auth endpoint |
| FT-03 | Roles | Check persisted/session role and admin page | Admin access | `super_admin`; admin HTTP 200 | PASS | Prisma query, authenticated request |
| FT-04 | Account flows | Review login/register/reset/profile/2FA | Available handlers | Routes and Better Auth integration found | PARTIAL | Code-reviewed; no account mutation/email test |
| FT-05 | Card creation | Create synthetic local card | Card created | HTTP 201 | PASS | Card POST |
| FT-06 | Card editing | Update safe test fields | Data accepted | HTTP 200 | PASS | Card PATCH |
| FT-07 | Card limit | Create second Free card | Rejected at limit | HTTP 403 | PASS | Card POST |
| FT-08 | Visibility | Private then restore public | 404 then 200 | 404 then 200 | PASS | Anonymous route checks |
| FT-09 | Public profile | Visit without session | Accessible | HTTP 200 | PASS | Anonymous curl |
| FT-10 | vCard | Download public vCard | vCard output | HTTP 200, vCard 4.0 | PASS | Endpoint body |
| FT-11 | QR | Request public QR SVG | SVG output | HTTP 200 | PASS | QR endpoint |
| FT-12 | QR semantics | Verify destination/revocation | Stable URL and private unavailable | Source verified; private endpoint behavior reviewed | PARTIAL | Code-reviewed; no scanner decode |
| FT-13 | Lead capture | Post Free-plan lead | Feature denied | HTTP 403 | PASS | Lead POST |
| FT-14 | Campaigns | Create Free-plan campaign | Feature denied | HTTP 403 | PASS | Campaign POST |
| FT-15 | Analytics | Send browser-like qr_scan | Behavior established | HTTP 200; record persisted | PASS | API request + Prisma count |
| FT-16 | Organization/team | Assess organization and invite controls | Scoped behavior | Implemented; no org created | PARTIAL | Code-reviewed |
| FT-17 | Wallet | Request unconfigured wallet endpoints | Config error | Apple/Google HTTP 503 | PASS | Endpoint requests |
| FT-18 | Persistence | Restart / database integrity | State survives | Existing DB found; integrity ok | PASS | Milestone 1 verification |
| FT-19 | Dashboard anomaly | Trace map labels | Find source if present | No strings/model; dashboard says “Karte” | PASS | Repository search |
| FT-20 | Dependency audit | Audit production dependencies | Identify runtime risk | 12 findings; 2 critical | PASS | `npm audit --omit=dev` |
