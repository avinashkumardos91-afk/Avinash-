# Deploying Emercia Decor (Next.js) to Vercel

This app uses server-side data fetching, so it **cannot** run on GitHub Pages.
Vercel is the natural host (it's made by the Next.js team). ~5 minutes.

## Prerequisites
- The repo is already on GitHub: `avinashkumardos91-afk/Avinash-`.
- The app lives in the **`emercia-next/`** subfolder (a monorepo-style layout).

## A. Deploy from the Vercel dashboard (easiest)

1. Go to **https://vercel.com** and sign in with **GitHub** (this login step is
   yours — I can't authenticate your account).
2. **Add New… → Project**, then **Import** the `Avinash-` repository.
3. **Configure Project:**
   - **Root Directory:** click *Edit* and set it to **`emercia-next`** ← important,
     since the app isn't at the repo root.
   - Framework Preset: **Next.js** (auto-detected).
   - Build Command / Output: leave defaults.
4. **Environment Variables** (optional — only for live Medusa products; the site
   runs on sample data without them):
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL   = https://your-medusa-host
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = pk_...
   ```
5. **Deploy.** You'll get a `*.vercel.app` URL in ~1 minute. Every push to
   `main` re-deploys automatically.

## B. Deploy from the CLI (alternative)

```bash
npm i -g vercel
cd emercia-next
vercel            # first run: log in + link the project (interactive — your step)
vercel --prod     # production deploy
```

When it asks for the root directory, accept `emercia-next` (run the command from
inside that folder as above).

## Custom domain (emerciadecor.com)

Vercel → your project → **Settings → Domains → Add**. Add the domain and point
your registrar's DNS at Vercel (an `A` record to `76.76.21.21`, or a `CNAME` to
`cname.vercel-dns.com`). Vercel issues the HTTPS certificate automatically.

## Notes
- The Medusa **backend** is hosted separately (Railway, Render, a VPS, or
  Medusa Cloud) — Vercel hosts only this storefront.
- Don't commit `.env.local`; set secrets in Vercel's dashboard instead.
