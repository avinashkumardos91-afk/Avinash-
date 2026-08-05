export type Category = "her" | "him" | "unisex" | "deodorant" | "gift";

export type Fragrance = {
  id: string;
  name: string;
  line: string; // small eyebrow, e.g. "Eau de Parfum"
  category: Category;
  tag?: string; // corner badge, e.g. "For Her"
  index: string; // roman numeral
  blurb: string;
  notes: string; // searchable note list
  price?: string; // display price, filled from Medusa when available
  image?: string; // product photo; falls back to the styled placeholder if missing
};

/* Bundled sample catalogue — used when no Medusa backend is configured.
   Mirrors the static site so the design is identical out of the box. */
export const SAMPLE_FRAGRANCES: Fragrance[] = [
  { id: "rose-noir", name: "Rose Noir", line: "Eau de Parfum", category: "her", tag: "For Her", index: "I",
    blurb: "Bulgarian rose, pink pepper and warm amber — soft, modern and unmistakably feminine.",
    notes: "Bulgarian rose, pink pepper, amber", image: "/products/rose-noir.webp" },
  { id: "oud-imperial", name: "Oud Impérial", line: "Eau de Parfum", category: "him", tag: "For Him", index: "II",
    blurb: "Smoked oud, leather and cedar — confident, deep and made to be remembered.",
    notes: "Smoked oud, leather, cedar", image: "/products/oud-imperial.webp" },
  { id: "blanc-musk", name: "Blanc Musk", line: "Eau de Parfum", category: "unisex", tag: "Unisex", index: "III",
    blurb: "Clean white musk, bergamot and vetiver — the everyday signature that suits anyone.",
    notes: "White musk, bergamot, vetiver", image: "/products/blanc-musk.webp" },
  { id: "deodorants", name: "Deodorants", line: "Daily · Him & Her", category: "deodorant", index: "IV",
    blurb: "All-day protection carrying the same house notes — alcohol-free, gentle, long-lasting.",
    notes: "All-day, alcohol-free, house notes", image: "/products/deodorants.webp" },
  { id: "body-mists", name: "Body Mists", line: "Layering", category: "deodorant", index: "V",
    blurb: "Lighter veils of your favourite scents — to refresh, layer and carry anywhere.",
    notes: "Light veils, layering, refresh", image: "/products/body-mists.webp" },
  { id: "sets-editions", name: "Sets & Editions", line: "Discovery & Gifting", category: "gift", tag: "Gift", index: "VI",
    blurb: "Miniature discovery sets and gift-ready editions, beautifully boxed for every occasion.",
    notes: "Discovery set, gifting, boxed", image: "/products/sets-editions.webp" },
];

export const FILTERS: { label: string; value: "all" | Category }[] = [
  { label: "All", value: "all" },
  { label: "For Her", value: "her" },
  { label: "For Him", value: "him" },
  { label: "Unisex", value: "unisex" },
  { label: "Deodorants & Mists", value: "deodorant" },
  { label: "Gifting", value: "gift" },
];
