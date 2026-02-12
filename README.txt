# MEETX

**MEETX** is a global, AI‑native, enterprise‑grade meeting and matching ecosystem.

It is not a dating app, not a job board, and not a LinkedIn clone.

MEETX is a **Personal‑AI‑driven Human Connection Operating System** that intelligently connects the right people at the right time for the right purpose — across startups, enterprises, creators, investors, and professionals worldwide.

---

## Vision

> Build the world’s most trusted AI system for meaningful human connections.

MEETX focuses on **intent**, **capability**, and **timing** — not vanity profiles or endless scrolling.

---

## Core Principles

1. **Intent‑First**
   Users come with goals (hire, build, invest, collaborate), not just profiles.

2. **Personal AI by Default**
   Every user has a private Personal AI that assists, explains, and improves outcomes.

3. **Enterprise‑Grade Trust**
   Privacy, compliance, and control are first‑class features.

4. **Explainable Matching**
   MEETX always explains *why* a match exists.

5. **Global by Design**
   Location‑aware, timezone‑smart, culturally adaptable.

---

## What MEETX Is

* AI‑powered matching engine
* Smart meeting and collaboration platform
* Personal AI assistant for professional relationships
* Enterprise‑ready networking infrastructure

## What MEETX Is NOT

* A swipe‑based dating app
* A resume dumping ground
* An ad‑driven social network

---

## Repository Strategy (Split into Repos)

MEETX is organized as **three primary repositories**:

1. **meetx-frontend** (web app)
2. **meetx-backend** (NestJS API + core business logic)
3. **meetx-ai-services** (Personal AI + matching intelligence)

This separation enables:

* independent deployments and scaling
* stricter security boundaries (AI keys isolated)
* faster team collaboration (frontend/backend/ML teams)

> Optional: In early-stage MVP, you *can* run everything in a monorepo, then split later.

### Shared Contracts (Option A — Recommended)

Add a **4th repository** to keep types and API contracts consistent across all services:

4. **meetx-shared**

   * `@meetx/types` — shared TypeScript types (DTOs, enums)
   * `@meetx/validators` — shared Zod schemas
   * `@meetx/contracts` — versioned request/response contracts

**Rule:** Frontend never guesses shapes — it imports contracts from `meetx-shared`.

---

## Platform Architecture (High Level)

* **Frontend**: Next.js (App Router), TypeScript, Tailwind
* **Backend**: **NestJS** (Node.js + TypeScript), REST APIs, modular architecture
* **Database**: MongoDB Atlas
* **Cloud**: Google Cloud Platform (GCS, Cloud Run)
* **AI Layer**: Personal AI services + matching intelligence
* **Deployment**: Vercel (frontend) + Cloud Run (backend/AI)

---

## Core Ecosystem Modules

### 1. Identity Layer (Foundation)

Every user owns a **Personal AI Identity**.

Includes:

* Unified professional profile
* Skills, interests, goals, availability
* Private AI memory (opt‑in)
* Visibility controls

This identity is portable across all MEETX modules.

---

### 2. Match Engine (Core Intelligence)

The heart of MEETX.

**Matching Dimensions**:

* Skills & experience overlap
* Intent compatibility
* Role complementarity
* Location & timezone
* Availability windows
* Communication patterns
* Historical success signals

**Outputs**:

* Ranked candidate list
* Match confidence score
* Human‑readable explanation

---

### 3. Discovery & Feed

* AI‑curated recommendations
* Advanced filters (role, location, intent)
* Excludes already evaluated profiles
* No infinite scrolling — quality over quantity

---

### 4. Connections & Matching

* Like / pass logic (MVP)
* Mutual intent → match creation
* Match lifecycle tracking

---

### 5. Conversations

Messaging enhanced by AI:

* AI‑generated introductions
* Context‑aware reply suggestions
* Conversation summaries
* Action prompts (schedule, share docs)

---

### 6. Meetings (Key Differentiator)

MEETX goes beyond chat.

* Smart scheduling
* AI‑generated agendas
* Post‑meeting summaries
* Follow‑up tasks
* Relationship timeline memory

MEETX remembers meetings better than humans do.

---

### 7. Organizations & Enterprises

For companies, accelerators, universities.

* Private matching pools
* Internal + external discovery
* Role‑based visibility
* Org‑level analytics
* Policy & compliance controls

---

### 8. Global Network Layer

* City‑based hubs
* Global remote matching
* Timezone intelligence
* Cultural signals (future)

---

## Personal AI Capabilities

Each user’s Personal AI can:

* Improve profiles and bios
* Suggest high‑quality matches
* Explain match reasoning
* Draft outreach messages
* Summarize conversations
* Learn preferences (editable & resettable)

**Privacy First**:

* No selling data
* No scraping
* Full user control

---

## Data Model (Simplified)

### User

* id
* email / auth provider
* role
* createdAt

### Profile

* userId
* name, bio, headline
* skills[], interests[], goals[]
* location, availability

### Swipe

* fromUserId
* toUserId
* action

### Match

* userIds[]
* createdAt

### Message

* matchId
* senderId
* content

### AI Memory

* userId
* preferenceSummary
* learnedSignals

---

## Google Cloud Usage

* **Cloud Storage**: profile photos, documents
* **Signed Upload URLs** (secure direct uploads)
* **Cloud Run (optional)**: AI workloads
* **Cloud Tasks / PubSub (future)**: async processing

---

## Security & Compliance

* OAuth / credential‑based auth
* Role‑based access control
* Audit logs (enterprise)
* GDPR‑ready architecture
* Data isolation by org

---

## Monetization Strategy

* Free individual tier
* Pro users (advanced AI + visibility)
* Company subscriptions
* Accelerator / university licenses
* API & white‑label offerings

No ads. No spam. No data selling.

---

## MVP Build Plan (90‑Day Scope)

1. Auth & onboarding
2. Profile creation
3. Discovery feed
4. Swipe & matching
5. Chat system
6. GCS file uploads
7. Personal AI (bio + message assist)

---

## Long‑Term Vision

MEETX becomes:

* The default infrastructure for human connection
* An AI layer above professional relationships
* A global trust‑based meeting network

---

## Status

🚧 In active development

---

## License

Proprietary – MEETX Platform

---

**MEETX**
Where Personal AI meets human potential.
