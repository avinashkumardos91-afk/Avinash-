import { SAMPLE_FRAGRANCES, type Fragrance, type Category } from "./products";

/*
  Fetch products from a Medusa v2 backend (Store API) and map them to the
  Fragrance shape the UI uses. Kept as a plain fetch (no SDK) so it is
  resilient to Medusa client-version churn.

  If the backend URL is not set, or the request fails, we fall back to the
  bundled SAMPLE_FRAGRANCES so the site always renders.

  To connect real products, set NEXT_PUBLIC_MEDUSA_BACKEND_URL (and a
  publishable key) in .env.local, then tag each Medusa product with a
  category in metadata: { category: "her" | "him" | "unisex" | "deodorant" | "gift" }.
*/

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

type MedusaPrice = { amount: number; currency_code: string };
type MedusaProduct = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  variants?: { prices?: MedusaPrice[]; calculated_price?: { calculated_amount?: number; currency_code?: string } }[];
};

function toCategory(value: unknown): Category {
  const v = String(value ?? "").toLowerCase();
  if (v === "her" || v === "him" || v === "unisex" || v === "deodorant" || v === "gift") return v;
  return "unisex";
}

function formatPrice(p?: MedusaProduct): string | undefined {
  const cp = p?.variants?.[0]?.calculated_price;
  if (cp?.calculated_amount != null) {
    const cur = (cp.currency_code || "usd").toUpperCase();
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(cp.calculated_amount / 100);
  }
  const raw = p?.variants?.[0]?.prices?.[0];
  if (raw) {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: raw.currency_code.toUpperCase() }).format(raw.amount / 100);
  }
  return undefined;
}

export async function getFragrances(): Promise<Fragrance[]> {
  if (!BACKEND) return SAMPLE_FRAGRANCES;
  try {
    const res = await fetch(`${BACKEND}/store/products?limit=12`, {
      headers: PUB_KEY ? { "x-publishable-api-key": PUB_KEY } : {},
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Medusa ${res.status}`);
    const data: { products?: MedusaProduct[] } = await res.json();
    const products = data.products ?? [];
    if (!products.length) return SAMPLE_FRAGRANCES;

    return products.map((p, i) => ({
      id: p.id,
      name: p.title,
      line: p.subtitle || "Eau de Parfum",
      category: toCategory(p.metadata?.category),
      tag: (p.metadata?.tag as string) || undefined,
      index: ROMAN[i] ?? String(i + 1),
      blurb: p.description || "",
      notes: (p.metadata?.notes as string) || p.description || "",
      price: formatPrice(p),
    }));
  } catch (err) {
    // Backend unreachable — fall back so the page still renders.
    if (process.env.NODE_ENV !== "production") console.warn("Medusa fetch failed, using sample data:", err);
    return SAMPLE_FRAGRANCES;
  }
}
