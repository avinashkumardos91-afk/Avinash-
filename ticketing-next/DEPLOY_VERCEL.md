# Deploying the 3D ticketing app to Vercel

GitHub Pages can't host this app (it needs a server + database). Vercel runs Next.js
natively and has a free tier with a global edge network — ~10 minutes.

There is **one required change**: Vercel's serverless filesystem can't run SQLite, so
you need a **hosted PostgreSQL** database (all have free tiers). Prisma makes the swap
trivial — the app code doesn't change.

---

## Step 1 — Create a free PostgreSQL database (your account)
Pick one (any works):
- **Neon** — https://neon.tech (simplest; generous free tier)
- **Supabase** — https://supabase.com
- **Vercel Postgres** — from the Vercel dashboard → Storage

Create a database and copy its **connection string** — it looks like:
```
postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

## Step 2 — Point Prisma at PostgreSQL
In [`prisma/schema.prisma`](prisma/schema.prisma), change the datasource provider:
```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```
Then, with your connection string in `.env.local` (or exported), create the tables and
seed once:
```bash
# in ticketing-next/, with DATABASE_URL set to your Postgres string
npx prisma db push
npx tsx prisma/seed.ts     # optional: example tickets
```

## Step 3 — Deploy on Vercel (your login)
1. Go to **https://vercel.com** → sign in with **GitHub** (this login is yours — I can't do it).
2. **Add New… → Project** → **Import** the `Avinash-` repo.
3. **Root Directory:** set to **`ticketing-next`** (important — the app is in a subfolder).
   Framework preset auto-detects **Next.js**.
4. **Environment Variables** → add:
   ```
   DATABASE_URL = postgresql://…   (your Step-1 string)
   ```
5. **Deploy.** You'll get a live `*.vercel.app` URL in ~1–2 minutes. Every push to
   `main` redeploys automatically.

> Build already runs `prisma generate && next build` (see package.json), so the Prisma
> client is generated during the Vercel build with no extra config.

## Why this is cheap to run globally
- The **3D renders on the client's GPU** (their browser) — no server GPU/rendering cost.
- Vercel serves the static shell from **edge locations worldwide**, so international
  users load fast.
- The only always-on cost is the database; free tiers cover a demo comfortably.

## CLI alternative
```bash
npm i -g vercel
cd ticketing-next
vercel            # first run: log in + link (interactive — your step)
vercel --prod
```
Set `DATABASE_URL` when prompted (or in the dashboard) and choose `ticketing-next` as the root.

---

### Note for local development
The committed code stays on **SQLite** so it runs locally with zero setup
(`npm run db:push && npm run db:seed && npm run dev`). Only switch the provider to
`postgresql` on the branch/commit you deploy to Vercel (Step 2). If you want local and
Vercel to match, run a local Postgres or point local `.env` at the same Neon database.
