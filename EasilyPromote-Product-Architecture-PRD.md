# EasilyPromote — Product Architecture PRD

**Version:** 1.0
**Type:** Product Architecture & Systems Specification
**Status:** Draft for engineering, design & product
**Companion to:** EasilyPromote PRD v4.0 (Strategy + Product + Operations)

---

## How this document relates to the main PRD

The main PRD (v4.0) defines *what* EasilyPromote is, *why* it exists, and *what each screen must do*. This document defines *how the system underneath is organized* — the platforms, the shared services that power them, and how data flows between them. Use the main PRD for product intent and UX requirements; use this document for system boundaries, entities, and state machines.

---

## 1. High-Level Product Architecture

```
                        EasilyPromote Platform

                    ┌──────────────────────────┐
                    │     Marketing Website    │
                    └─────────────┬────────────┘
                                  │
                    Authentication Gateway
                                  │
     ┌────────────────────────────┼──────────────────────────┐
     │                            │                          │
     ▼                            ▼                          ▼
 Brand Platform             Creator Platform          Admin Platform
     │                            │                          │
     └───────────────API Gateway / BFF Layer────────────────┘
                              │
      ┌────────────────────────────────────────────────────────────┐
      │                  Core Marketplace Services                  │
      └────────────────────────────────────────────────────────────┘
                              │
 ┌──────────────────────────────────────────────────────────────────────┐
 │ Campaign │ Slot │ Rank │ Verification │ Escrow │ Wallet │ Analytics │
 │ Fraud │ AI │ Notification │ Media │ Search │ Audit │ Settings      │
 └──────────────────────────────────────────────────────────────────────┘
                              │
                  Shared Data & Infrastructure
                              │
     Mongo • express • Object Storage • Queue Workers • Analytics • Logs
```

Three user-facing products (Brand, Creator, Admin) sit on top of one shared marketplace core. No product owns its own copy of campaign, slot, or wallet logic — everything consequential runs through the shared services layer, so the three apps stay consistent by construction rather than by discipline.

---

## 2. System Architecture (Layered View)

```
Presentation Layer
├── Brand App
├── Creator App
└── Admin Console

        ↓

Business Layer
├── Marketplace   (campaigns, slots, discovery, ranking)
├── Financial      (escrow, wallets, payouts)
├── Trust          (verification, fraud, appeals, audit)
└── Growth         (notifications, analytics, AI)

        ↓

Infrastructure
├── Database (Mongo)
├── Queues (async jobs — verification, payouts, notifications)
├── Caching (express)
├── Storage (media, evidence)
├── Logging
└── Monitoring
```

**Design rule:** anything that touches money or reputation (escrow, wallet, rank, verification) lives in the Business Layer, never in a product-specific layer. This keeps the Brand, Creator, and Admin apps as *views* onto one source of truth rather than three separate implementations that can drift out of sync.

---

## 3. Platform Systems

The system is composed of **17 shared services** (A–Q below). Each is described by its purpose, its data, and — where it manages a lifecycle — its state machine.

### A. Identity System

**Purpose:** Authentication, authorization, and session trust for everyone on the platform.

**Modules:** Registration · Login · Password reset · MFA · Email verification · Phone verification · Session management · Device tracking · Role management

**Supported roles:**
- Business
- Creator
- Admin
- Finance Admin
- Support
- Super Admin

---

### B. User Profile System

Stores identity and profile data, separate from auth credentials.

**Business Profile**
| Field | Notes |
|---|---|
| Business ID | |
| Company Name | |
| CAC | Optional at MVP |
| Industry | |
| Logo | |
| Verification Status | Gates campaign launch |
| Wallet | Reference to Business Wallet |
| Team Members | Post-MVP (multi-seat) |

**Creator Profile**
| Field | Notes |
|---|---|
| Creator ID | |
| Username / Display Name | |
| Bio | |
| Country | |
| Social Accounts | Verified, re-verified on handle change |
| Rank | Derived, not editable |
| Creator Score | Derived, not editable |
| Wallet | Reference to Creator Wallet |
| Lifetime Earnings | |
| Completion Rate | |
| Joined Date | |

---

### C. Campaign Management System

The core engine businesses interact with.

**Responsibilities:** create, edit, pause, resume, cancel, fund, archive campaigns.

**Lifecycle**
```
Draft → Pending Funding → Funded → Published → Live → Completed → Closed → Archived
```

> Note: this is a more granular lifecycle than the main PRD's Ch.14 (Draft → Funded → Live → Paused → Completed → Cancelled → Closed). Reconcile before engineering starts — see **Open Question 1** below.

**Campaign Entity**
```
Campaign
├── ID
├── Business
├── Category
├── Title
├── Description
├── Brief
├── Cover
├── Target Views
├── Budget
├── Platform Fee
├── Creator Pool
├── Creator Rank Required
├── Start Date / End Date
├── Status
├── Escrow Status
├── Analytics
├── Created By / Created At
```

---

### D. Slot Management System

The heart of the marketplace — where a campaign becomes claimable work.

```
Campaign: 250,000 Views  →  50 Slots  →  5,000 Views Each
```

**Slot Entity**
```
Slot
├── Slot ID
├── Campaign ID
├── Creator ID
├── Rank Required
├── View Target
├── Reward
├── Status
├── Claimed At
├── Submission URL
├── Verification Result
├── Confidence Score
├── Completed At
```

**Slot States**
```
Available → Reserved → Claimed → Submitted → Verifying → Approved → Paid
                                                        └→ Rejected
```

---

### E. Creator Marketplace System (Discovery)

**Features:** Browse · Filters · Search · Recommendations · Bookmarks · Claim Slot · History · Suggested Campaigns

**Sorting:** Newest · Highest Reward · Highest Rank · Trending · Ending Soon

---

### F. Submission System

Collects and tracks creator work against a slot.

**Submission Entity**
```
Submission
├── Submission ID
├── Campaign
├── Slot
├── Creator
├── URL
├── Caption
├── Platform
├── Submitted At
├── Verification Status
├── Admin Notes
├── Evidence
├── History
```

**Submission States**
```
Draft → Submitted → Queued → Verifying → Approved
                                       └→ Rejected → Appealed
```

---

### G. Verification Engine

The platform's trust primitive — confirms that claimed views are real.

**Responsibilities:** validate views · detect fraud · calculate confidence · approve payouts

**Verification inputs:** Platform APIs · Engagement · Watch time · Duplicate detection · Historical trends · Creator reputation · Manual review

**Confidence levels**
| Score | Action |
|---|---|
| 95–100 | Auto-approve |
| 80–94 | Monitoring |
| Below 80 | Human review |

**Checks run:** duplicate videos · artificial spikes · engagement anomalies · missing metadata · screenshot mismatch · API inconsistencies

> Note: these thresholds are a numeric refinement of the main PRD's three-tier confidence model (Ch.16.2: High / Medium / Low). Map "95–100 / 80–94 / <80" onto "High / Medium / Low" explicitly during implementation so copy, admin UI, and engineering all use the same language — see **Open Question 2**.

---

### H. Creator Ranking Engine

Recalculates every creator's standing.

**Creator Score weights**
| Factor | Weight |
|---|---|
| Completion | 25% |
| Brand Ratings | 20% |
| Compliance | 20% |
| Accuracy | 15% |
| Consistency | 10% |
| Quality | 5% |
| Penalties | Variable (subtracted) |

**Rank levels**
| Rank | Band |
|---|---|
| Rank 1 | 1K–5K |
| Rank 2 | 5K–10K |
| Rank 3 | 10K–25K |
| Rank 4 | 25K–50K |
| Rank 5 | 50K–100K |
| Elite | 100K+ |

> Note: this adds a 6-tier system (through "Elite") and different view bands than the main PRD's Ch.17.3 5-tier table (e.g. Rank 3 there is 10K–20K, here it's 10K–25K). Needs a single reconciled table before this becomes the source of truth for both UI copy and the scoring service — see **Open Question 3**.

**Automatic jobs:** daily recalculation · promotion · demotion · leaderboard update

---

### I. Escrow System

The financial backbone — makes the "pay for results, not promises" model possible.

**Lifecycle**
```
Campaign Created → Payment Intent → Escrow Deposit → Funds Locked
   → Verification Passed → Funds Released → Creator Wallet
   → Monthly Batch → Bank Withdrawal
```

**Hard rules**
- Cannot edit a funded campaign.
- Cannot launch without funding.
- Cannot withdraw escrow directly.
- Cannot bypass verification to release funds.

---

### J. Wallet System

Two distinct wallet types, one shared ledger discipline.

**Business Wallet:** Campaign Funding · Refunds · Invoices
**Creator Wallet:** Available · Pending · Processing · Withdrawn · Lifetime Earnings

**Wallet Ledger:** every transaction recorded, append-only, no deletes.

---

### K. Payout Engine

Runs on the monthly batch cycle defined in the main PRD (Ch.18.3 — first 3 days of the month).

**Flow**
```
Verification → Eligible → Batch Created → Finance Review → Bank API → Completed
```

**Failure states:** Bank Failure · Name Mismatch · Frozen Account · Compliance Hold

---

### L. Analytics System

| Dashboard | Shows |
|---|---|
| Business | Views, campaign progress, spend, CPV, completion, top creators |
| Creator | Rank, growth, views, income, performance |
| Admin | Marketplace health, escrow, fraud, payouts, disputes |

---

### M. Notification System

**Channels:** In-app · Email · SMS · Push · WhatsApp *(future)*

**Events:** Campaign Live · Slot Claimed · Submission Approved · Rank Increased · Payout Sent · Appeal Resolved

---

### N. Fraud Detection System

**Signals:** Duplicate content · View farms · Rapid spikes · Fake engagement · Device fingerprinting · Repeated violations

**Risk levels:** Low → Medium → High → Critical

**Actions available:** Warn · Hold · Review · Suspend · Ban

---

### O. Appeals System

```
Rejected Submission → Creator Appeals → Admin Review → Decision → Closed
```

Every action logged (ties into System P).

---

### P. Audit Logging System

Tracks every critical action platform-wide. Nothing is ever deleted.

**Fields:** Actor · Action · Previous State · New State · Reason · Timestamp · IP Address · Device · Metadata

---

### Q. AI Service Layer *(future)*

| For | Capabilities |
|---|---|
| Business | Campaign generation, budget suggestions, brief writing, audience recommendations |
| Creator | Content ideas, compliance checking, performance predictions |
| Admin | Fraud detection, risk surfacing, duplicate detection, appeal summaries |

**Guardrail (unchanged from main PRD Ch.20):** all AI outputs are advisory. Humans approve payouts, bans, and appeals — no exceptions.

---

## 4. Cross-System Relationships

The full lifecycle of a naira, end to end:

```
Identity
   ↓
Profiles
   ↓
Campaigns
   ↓
Slots
   ↓
Claims
   ↓
Submissions
   ↓
Verification
   ↓
Creator Score
   ↓
Escrow Release
   ↓
Wallet
   ↓
Monthly Payout
```

Every arrow in this chain is a system boundary — and a place where an event should fire for analytics, notifications, and audit logging (Principle 6 below).

---

## 5. Core Platform Principles

1. **Results over effort** — every payment maps to a verified outcome.
2. **Trust by default** — escrow, verification, and auditability underpin every transaction.
3. **Merit-based opportunity** — Creator Rank determines access, never follower count.
4. **Marketplace automation** — systems allocate work and enforce rules with minimal manual intervention.
5. **Financial integrity** — immutable ledgers, controlled fund flows, mandatory reconciliation.
6. **Observable by design** — every significant action emits an event for analytics, notifications, and audit.
7. **Scalable architecture** — shared services are built to extend into streaming campaigns, affiliate marketing, UGC licensing, agencies, enterprise/white-label, and AI-driven optimization without new primitives.

---

## 6. Open Questions to Reconcile with the Main PRD

This architecture document was written independently of PRD v4.0 and introduces a few numeric and naming differences worth resolving in one place before engineering starts:

1. **Campaign lifecycle** — this doc's 8-state lifecycle (Draft → Pending Funding → Funded → Published → Live → Completed → Closed → Archived) vs. the main PRD's 7-state lifecycle (Ch.14). Decide whether "Pending Funding," "Published," and "Archived" are real additional states or implementation detail folded into existing ones.
2. **Verification confidence scale** — numeric 95–100 / 80–94 / <80 (this doc) vs. named High / Medium / Low tiers (main PRD Ch.16.2). Pick one system of record and map the other onto it.
3. **Rank bands and tier count** — 6 tiers including "Elite" and slightly different view bands here vs. 5 tiers in the main PRD (Ch.17.3). This affects UI copy, onboarding messaging, and the scoring service directly — needs a single authoritative table.
4. **Slot example economics** — this doc's example (250,000 views → 50 slots → 5,000 views each) vs. the main PRD's example (250,000 views → 18–24 creators). Confirm whether slot sizing is uniform (this doc) or rank-distributed (main PRD).

---

## Glossary reference

For shared terminology (Campaign, Slot, Submission, Creator Score, Rank, Escrow, Payout Window, Commendation), see Chapter 33 of the main PRD v4.0.
