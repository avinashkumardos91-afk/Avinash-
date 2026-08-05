# Emercia Decor — Next.js storefront

A production-oriented rebuild of the Emercia Decor fragrance site using the stack you chose:

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for layout/typography, with a small amount of bespoke CSS for the ornate bits (the 3D bottle, card glare, search overlay)
- **Medusa** (open-source) as the commerce backend — wired through a resilient fetch client
- **react-three-fiber + three.js** installed and ready for a real `.glb` bottle later (the current hero keeps the pure-CSS 3D bottle you asked to keep)

The static single-file version still lives at [`../emercia-decor/index.html`](../emercia-decor/index.html).

## Run it

```bash
cd emercia-next
npm install
cp .env.example .env.local   # optional — see “Commerce” below
npm run dev                  # http://localhost:3000
```

Out of the box it renders with a **bundled sample catalogue** (`lib/products.ts`), so it works with no backend at all.

## Commerce (Medusa)

The storefront reads products from a Medusa v2 backend when configured, and falls back to the sample data otherwise.

1. Stand up a Medusa server — https://docs.medusajs.com (its own repo/host; Medusa is self-hosted).
2. In the Medusa admin, create a **publishable API key** and add products. Tag each product’s `metadata` with:
   - `category`: one of `her | him | unisex | deodorant | gift`
   - optional `tag` (corner badge) and `notes` (searchable note list)
3. Put the values in `.env.local`:

   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-host
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
   ```

The mapping lives in [`lib/medusa.ts`](lib/medusa.ts) — it’s plain `fetch`, so it isn’t tied to a specific Medusa SDK version. Add cart/checkout by extending that file against the Medusa Store API.

## Structure

```
emercia-next/
├─ app/
│  ├─ layout.tsx        fonts (next/font) + metadata
│  ├─ globals.css       Tailwind + bespoke CSS (bottle, cards, search)
│  └─ page.tsx          server component: fetches products, composes sections
├─ components/
│  ├─ Nav.tsx           sticky nav + search trigger (client)
│  ├─ Bottle3D.tsx      pointer-reactive CSS 3D bottle (client)
│  ├─ Fragrances.tsx    filters + tilt grid + search overlay (client)
│  ├─ EnquireForm.tsx   enquiry form → mailto (client)
│  └─ RevealObserver.tsx scroll-reveal (client)
└─ lib/
   ├─ products.ts       Fragrance type, sample catalogue, filters
   └─ medusa.ts         Medusa Store API fetch + fallback
```

## Going live

Next.js with server data fetching does **not** run on GitHub Pages. Deploy to **Vercel** (or Netlify): push this folder, import the repo, set the two env vars. The Medusa backend is hosted separately.

## The hero showcase — two techniques, auto-selected

`components/HeroBottle.tsx` picks the best available showcase:

1. **Cinematic scroll-scrub (Apple-style)** — the preferred, lag-free technique.
   A numbered image sequence is drawn to a `<canvas>` and scrubbed by scroll
   position (with a gentle idle auto-rotation). See the pipeline below.
2. **Live 3D fallback** — if no frames are present, it uses the real
   react-three-fiber bottle (`BottleCanvas.tsx`): studio-lit glass, amber juice,
   gold collar, **drag to rotate from every side**, auto-rotating.

### Producing the cinematic frames

I can build the player (done), but the **frames themselves are yours to
generate** — that needs AI-video or a camera, not code:

1. Generate a flawless 360° / exploded-view clip:
   - **Google Veo / Whisk** or **Midjourney** video, prompt e.g.
     *“Slow 360° orbital camera around a luxury amber-glass perfume bottle,
     gold cap, macro detail, seamless loop, clean black studio background,
     dramatic studio lighting, 60fps cinematic.”*
   - or shoot a real **turntable** (or use **Sirv / Webrotate 360**).
2. Extract every frame to stills (e.g. **EZGif → Video to Frames**), export
   **WEBP** (smaller) or JPG.
3. Drop them in `public/bottle/` as `frame_0001.webp … frame_0120.webp`.
4. Set `count` (and prefix/ext/pad) in `components/HeroBottle.tsx` to match.

That's it — the scrubber activates automatically and the 3D fallback stops.

### A hand-made 3D model instead

`three` / `@react-three/fiber` / `drei` are installed. To use a modelled bottle,
export a `.glb` (Blender/Spline) into `public/`, load it with drei's `useGLTF`
inside `BottleCanvas.tsx`, and keep OrbitControls — the layout is unchanged.

> **SaaS viewers** (Emersya, ThreeKit, Sirv) are embed-only: I can drop in their
> embed once you have an account and an asset URL, but I can't operate those
> platforms for you.

## Swap the placeholders

- **Photography:** each `.shot` block is a styled placeholder — drop an `<img>`/background in.
- **Contact:** replace `hello@emerciadecor.com` and the WhatsApp number (`wa.me/910000000000`) in `page.tsx` and `EnquireForm.tsx`.
