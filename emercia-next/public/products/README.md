# Product photography

Drop product images here and they appear automatically (the site falls back to
the styled gradient placeholders until a file exists). Recommended: **WEBP**,
square-ish, ~1200×1400, on a clean dark background to match the house look.

## Expected filenames

Fragrance cards (see `lib/products.ts` → `image`):

```
rose-noir.webp
oud-imperial.webp
blanc-musk.webp
deodorants.webp
body-mists.webp
sets-editions.webp
```

Editorial frames (see `app/page.tsx`):

```
house.webp        # The House section
signature.webp    # Noir d'Emercia signature section
```

To change a filename, edit the matching `image:` value in `lib/products.ts`
(cards) or the `src` on the `<Shot>` in `app/page.tsx` (editorial frames).

## Generating imagery with AI

Use a studio-realism prompt, e.g.:

```
[Product, e.g. Rose Noir eau de parfum] centered on a pure black minimal
background, dramatic studio lighting, 8k, photorealistic, ray-traced
reflections, cinematic product photography --ar 4:5
```
