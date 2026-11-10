# CYREX feature gap register

| ID | Requirement | Existing Capability | Classification | Gap | Recommended Action | Priority |
|---|---|---|---|---|---|---|
| GAP-01 | Corporate profile and QR | Public card, QR, vCard, links | CONFIGURATION | No corporate-card type | Govern a dedicated company account/card. | P1 |
| GAP-02 | Permanent staff profiles | Cards, contacts, uploads, public/private state, vCard | NATIVE | None for basic profile cards | Retain native lifecycle. | P1 |
| GAP-03 | Approved staff presentation | Organization policy and approval | CONFIGURATION | Business organization setup required | Configure templates, colors, footer and approval. | P1 |
| GAP-04 | Manager edits member card | Approval/design policy only | CUSTOMISATION | Company admin lacks general member-card edit route | Add scoped delegated editing workflow. | P1 |
| GAP-05 | Temporary representative identity | Separate card, expiry, unpublish | CONFIGURATION | No representative label or start date | Use expiring interim cards with manual controls. | P0 |
| GAP-06 | Event-specific authority | No event/assignment model | CUSTOMISATION | No scope, sponsor, event or authority limits | Add representation assignment data model. | P0 |
| GAP-07 | Auditable revocation | Unpublish/expiry; partial stdout audit | GAP | No authoritative history or verifier | Add revocation state, actor/reason/time and retained audit log. | P0 |
| GAP-08 | QR proof of authority | QR resolves public card | CUSTOMISATION | QR proves URL reachability only | Build signed/verified QR-status endpoint and UX. | P0 |
| GAP-09 | Reliable QR/campaign reporting | Client analytics and campaign counters | CUSTOMISATION | qr_scan can be client supplied; redirect misses UTM handoff | Correct tracking contract and classify as telemetry. | P1 |
| GAP-10 | CRM/CYREX OS synchronization | No connector | INTEGRATION | No system-of-record synchronization | Define IDs, ownership, direction and failure handling. | P1 |
| GAP-11 | SMTP invite/reset/lead delivery | SMTP support present | CONFIGURATION | Disabled locally | Configure provider and test delivery/monitoring. | P2 |
| GAP-12 | Wallet passes | Apple/Google implementation exists | CONFIGURATION | Credentials/issuer absent | Provision only if product decision requires it. | P3 |
| GAP-13 | Dependency remediation | 2 critical runtime audit findings | CUSTOMISATION | Vulnerable direct dependencies | Separate security remediation and regression work. | P0 |
| GAP-14 | Durable auditability | Selected stdout audit events | CUSTOMISATION | No comprehensive retained audit store | Send structured events to retained logging/datastore. | P1 |
