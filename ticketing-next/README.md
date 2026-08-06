# Ticketing System — 3D (Next.js + Prisma + Tailwind + three.js)

A production-oriented ticketing system where the queue is a **3D pipeline**: tickets
float as priority-coloured 3D cards across five lifecycle lanes
(`Raised → Picked up → In progress → Resolved → Closed`). Drag to orbit, scroll to
zoom, click a card to open it. Full lifecycle, activity log, dashboard, filters and
international-client support (region + timezone + language).

> This is the **framework** build. The assignment version (vanilla HTML/CSS/JS, no
> build step) lives in [`../ticketing/`](../ticketing/).

## Stack
- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS**
- **Prisma** ORM with a relational database
- **three.js / react-three-fiber / drei** for the 3D pipeline; **framer-motion** for UI transitions
- Route handlers under `app/api/tickets/**` for create / update / note

## Database — SQLite now, PostgreSQL in one line
It ships on **SQLite** (a local file) so it runs with zero setup. To use **PostgreSQL**
(as in the recommended production stack), change only two lines in
`prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

set `DATABASE_URL` in `.env` to your Postgres connection string
(e.g. from Neon / Supabase / Railway — all have free tiers), then run `npm run db:push`.
No application code changes — Prisma abstracts the database.

## Run it

```bash
cd ticketing-next
npm install
npm run db:push     # create the schema in the database
npm run db:seed     # add example tickets
npm run dev         # http://localhost:3000
```

## Deploy (affordable global hosting)
Push to **Vercel** (free tier, global edge). Set `DATABASE_URL` to a hosted Postgres,
switch the Prisma provider as above, and `vercel --prod`. The 3D runs entirely in the
client's browser (their GPU), so there are **no server rendering / GPU costs** — cheap
to serve worldwide.

## Structure
```
ticketing-next/
├─ prisma/schema.prisma      Ticket + Activity models, lifecycle
├─ prisma/seed.ts            example tickets
├─ lib/                      prisma client, types/constants, formatters
├─ app/api/tickets/**        REST route handlers (create/update/note)
├─ app/page.tsx              client shell: dashboard, filters, modal, raise
├─ components/TicketCanvas   the 3D pipeline (R3F + OrbitControls + Grid)
└─ components/TicketCard3D   one floating 3D ticket (priority colour, hover float/tilt)
```

## The 3D pipeline
- Five lanes, one per lifecycle stage, with live per-lane counts.
- Each card is a `RoundedBox` with a canvas-texture face (ref, title, status, owner,
  region, age) and a priority-coloured emissive glow (Urgent red → Low grey).
- Hover floats the card and tilts it toward the cursor (`useFrame` lerp — 60fps, no
  extra animation lib needed on the 3D side).
- Filters/search **dim** non-matching cards so the matches light up in place.
- Degrades gracefully: no WebGL → the data layer, API and dashboard still work.
