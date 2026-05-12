# LeadFlow CRM

A lightweight CRM built for managing **leads** and **discussion notes** with a modern SaaS-style dashboard. This repository is intended as a focused assessment/demo: **Next.js 15**, **Prisma**, **SQLite**, **React Query**, **Zod**, and **credentials-based authentication**.

**Public repo:** Push this project to GitHub as a **public** repository for submission.

---

## Table of contents

1. [What’s included](#whats-included)
2. [Tech stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Quick start (local)](#quick-start-local)
5. [Environment variables](#environment-variables)
6. [Database: migrations & seed](#database-migrations--seed)
7. [Running the app](#running-the-app)
8. [Verifying the “happy path”](#verifying-the-happy-path)
9. [API routes](#api-routes)
10. [Project structure](#project-structure)
11. [Deployment notes](#deployment-notes)
12. [Submission checklist](#submission-checklist)
13. [Troubleshooting](#troubleshooting)

---

## What’s included

- **Dashboard** — stats cards, searchable lead list, status filters, follow-ups sidebar, add-lead modal, lead detail modal (discussions + status).
- **Authentication** — email/password **signup** and **login** via [NextAuth](https://next-auth.js.org/) (credentials provider); JWT sessions; protected app routes via middleware.
- **Backend** — App Router API routes (`/api/leads`, `/api/leads/[id]`, `/api/discussions`, `/api/auth/*`) with Zod validation and consistent JSON responses.
- **Persistence** — Prisma ORM + SQLite (`Lead`, `Discussion`, `User`).
- **UI** — Tailwind CSS v4, shadcn/ui-style components, responsive layout.

---

## Tech stack

| Layer | Technology |
|-------|-------------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui (Radix primitives) |
| Data fetching | TanStack React Query |
| Validation | Zod |
| Database | SQLite via Prisma 7 |
| Runtime DB driver | `better-sqlite3` + `@prisma/adapter-better-sqlite3` |
| Auth | NextAuth v4 (credentials) |
| Dates | date-fns |
| Icons | Lucide React |

---

## Prerequisites

Install on your machine:

- **Node.js** 18+ (LTS recommended)
- **npm** (bundled with Node)

Check versions:

```bash
node -v
npm -v
```

---

## Quick start (local)

All commands assume you are in the **`leadflow`** folder (repository root if you cloned only this app):

```bash
cd leadflow
```

### 1. Install dependencies

```bash
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Environment file

Copy the example env file:

**macOS / Linux:**

```bash
cp .env.example .env
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

Edit `.env` — at minimum:

- Set `DATABASE_URL` (default `file:./prisma/dev.db` is fine).
- Set `NEXTAUTH_URL` to match where you run the app (e.g. `http://localhost:3000`).
- Set `NEXTAUTH_SECRET` to a long random string (see [.env.example](.env.example) for generation one-liner).

### 3. Create database tables

```bash
npx prisma migrate dev -n init_leadflow
```

Use a new migration name (e.g. `add_user_table`) if you already applied migrations and only need newer schema changes—Prisma will detect drift.

### 4. Seed sample data (optional)

```bash
npm run db:seed
```

### 5. Start development server

```bash
npm run dev
```

Open **http://localhost:3000** — unauthenticated users are redirected to **/login**.

---

## Environment variables

| Variable | Required | Description |
|---------|----------|-------------|
| `DATABASE_URL` | **Yes** | SQLite connection string, e.g. `file:./prisma/dev.db` |
| `NEXTAUTH_URL` | **Yes** (prod) | Public origin of your app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | **Yes** (prod) | Secret for signing sessions; generate as in `.env.example` |
| `NEXT_PUBLIC_APP_URL` | No | Optional site URL for metadata / future features |

Authoritative template: **[`.env.example`](.env.example)** — keep it updated when you add new env vars.

**Security:** Never commit `.env`. Only `.env.example` belongs in Git.

---

## Database: migrations & seed

### Migrations

```bash
npx prisma migrate dev
```

Creates `prisma/migrations/*` SQL and applies to the SQLite file pointed to by `DATABASE_URL`.

### Open Prisma Studio (GUI)

```bash
npx prisma studio
```

Browse `Lead`, `Discussion`, and `User` tables.

### Seed

Configured in `prisma.config.ts` (`migrations.seed`) and `package.json`:

```bash
npm run db:seed
```

Seeds realistic leads + discussions.

### Reset database (destructive)

```bash
npx prisma migrate reset
```

Drops SQLite data (per Prisma docs), reapplies migrations, and runs seed if configured.

---

## Running the app

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build (run `build` first) |
| `npm run lint` | ESLint |

Production smoke test:

```bash
npm run build
npm run start
```

---

## Verifying the “happy path”

Use this flow for **screenshots or a screen recording**:

1. **Signup** — Open `/signup`, create an account (password ≥ 8 characters).
2. **Dashboard** — After signup you should reach `/` with leads loaded (seed if needed).
3. **Search / filters** — Use header search and status filter chips.
4. **Status change**
   - Open a lead card’s **⋯ / status menu**, or open the **lead modal** and use **Status**.
   - Move a lead between stages (e.g. `NEGOTIATION` → `WON`).
5. **Add lead** — Header **Add Lead**, save → new row appears.
6. **Discussion** — Click a lead → modal → **Log discussion** (optional follow-up datetime) → lead follow-up updates.
7. **Profile** — Click avatar → **Sign out** → lands on `/login`.

Optional API checks (PowerShell):

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/leads" -Method Get
```

(Register/login first via browser so cookies/session match your expectations; CRM API routes may be reachable without UI session depending on middleware config.)

---

## API routes

Base URL (local): `http://localhost:3000`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create user (JSON body; hashed password) |
| * | `/api/auth/[...nextauth]` | NextAuth (session, callbacks) |
| GET | `/api/leads` | List leads (`?status=`, `?search=`), includes latest discussion + counts |
| POST | `/api/leads` | Create lead (defaults status `NEW`) |
| PATCH | `/api/leads/[id]` | Update `status` and/or `followUpAt` |
| POST | `/api/discussions` | Add discussion; syncs lead `followUpAt` |

Response shape:

```json
{
  "success": true,
  "data": { }
}
```

Errors:

```json
{
  "success": false,
  "message": "Human-readable message"
}
```

---

## Project structure (abbreviated)

```text
leadflow/
├── prisma/
│   ├── schema.prisma          # Lead, Discussion, User
│   └── migrations/
├── prisma.config.ts           # Prisma CLI config + seed command
├── src/
│   ├── app/
│   │   ├── (app)/             # Protected dashboard routes
│   │   ├── (auth)/             # Login / signup pages
│   │   └── api/                # REST route handlers
│   ├── components/
│   │   ├── dashboard/         # CRM UI
│   │   ├── layout/             # Sidebar shell
│   │   ├── providers/          # React Query + Session provider
│   │   └── ui/                 # shadcn primitives
│   ├── lib/
│   │   ├── api/               # Typed fetch helpers
│   │   ├── db/prisma.ts       # Prisma client singleton (+ SQLite adapter)
│   │   ├── query/             # Query keys & hooks
│   │   └── dashboard/         # Status labels, formatting, stats
│   ├── server/
│   │   ├── auth/options.ts    # NextAuth configuration
│   │   └── api/               # Shared API errors, validation
│   └── types/                 # Shared TS types for API payloads
├── middleware.ts              # Protects routes; allows /login, /signup, /api/auth
├── .env.example               # Env template for reviewers
└── README.md                   # This file
```

---

## Deployment notes

- **SQLite** is stored as **a single file**. Serverless hosts often have **ephemeral filesystems**: data does not persist across deploys unless you attach **durable volume** storage or migrate to Postgres/MySQL/Turso.
- For a **production** deployment, always set **`NEXTAUTH_SECRET`** and **`NEXTAUTH_URL`** to your deployed origin.
- Run migrations in CI or post-deploy:

  ```bash
  npx prisma migrate deploy
  ```

- **`better-sqlite3`** may require a platform-specific build step on Linux build images; Next config already lists native packages where applicable—verify on your hosting provider.

---

## Submission checklist

Per typical assessment instructions:

| Deliverable | Status |
|-------------|--------|
| **Public GitHub repo** | Push this repo; resolve `git pull`/`rebase` if remote has commits |
| **`.env.example`** | Present with all documented variables ([.env.example](.env.example)) |
| **`README`** | This document — setup, env, DB, scripts, verification |
| **Video or screenshots** | Record the [happy path](#verifying-the-happy-path); attach in PR/issue/email as required |

---

## Troubleshooting

### `git push` rejected (remote has different commits)

```bash
git pull origin main --rebase
git push -u origin main
```

Inspect remote first if unsure:

```bash
git fetch origin
git log HEAD..origin/main --oneline
```

### Login / signup appears broken

- Ensure **`SessionProvider`** wraps the app (already wired via `AppProviders`).
- Confirm `.env` has **`NEXTAUTH_URL`** and **`NEXTAUTH_SECRET`**.
- Restart `npm run dev` after editing `.env`.
- Confirm **`User`** table exists: run `npx prisma migrate dev` and check Studio.

### Prisma migrate option errors

Some flags differ by Prisma version. If `--skip-seed` is unrecognized, omit it and run `npm run db:seed` manually.

### `DATABASE_URL`

Use a consistent path. Prefer `file:./prisma/dev.db` relative to **`leadflow/`** so the SQLite file stays next to migrations.

---

## License & attribution

Assessment / portfolio project — adjust license as needed.

Built with **LeadFlow CRM** codebase in this repo.
