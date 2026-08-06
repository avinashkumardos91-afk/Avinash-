# CLAUDE.md — project guardrails

Context for Claude Code when working in this repo. Read before making changes.

## What this is
A production ticketing system: **Next.js 14 (App Router, TypeScript) + Prisma + Tailwind CSS**,
with **3D animations** (react-three-fiber). Persists tickets in a relational database
(SQLite by default for zero-setup; PostgreSQL in production via a one-line Prisma switch).

## Domain model (see prisma/schema.prisma)
- **Ticket**: `ref` (TKT-####), title, description, requester, category, priority, status,
  owner, region, language, timestamps, and a relation to Activity.
- **Activity**: an append-only log line per ticket (created, status change, note…).
- **Lifecycle**: `Raised → Picked up → In progress → Resolved → Closed` (Reopen → In progress).

## Conventions
- Data access goes through `lib/prisma.ts` (a single PrismaClient instance).
- Mutations happen via route handlers under `app/api/tickets/**`; the client refetches.
- Shared constants/types live in `lib/types.ts`; formatting helpers in `lib/format.ts`.
- Styling is Tailwind utilities + a few component classes in `app/globals.css`.
- Keep it type-safe: no `any` in new code; derive types from Prisma where possible.

## Commands
- `npm run dev` — start the dev server.
- `npm run db:push` — apply the schema to the database.
- `npm run db:seed` — seed example tickets.
- `npm run db:reset` — wipe + reseed (destructive).
- `npm run build` — generate Prisma client + production build.

## Guardrails
- Do not invent fields not in the schema; add a migration/`db push` if the model changes.
- Preserve the lifecycle order and only expose valid transitions in the UI.
- The 3D scene must degrade gracefully (no WebGL → app still fully works).
