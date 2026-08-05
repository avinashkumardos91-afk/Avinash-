import Nav from "@/components/Nav";
import HeroBottle from "@/components/HeroBottle";
import Fragrances from "@/components/Fragrances";
import EnquireForm from "@/components/EnquireForm";
import RevealObserver from "@/components/RevealObserver";
import { getFragrances } from "@/lib/medusa";

export default async function Home() {
  const fragrances = await getFragrances();

  return (
    <main id="top">
      <RevealObserver />
      <Nav />

      {/* ===================== HERO ===================== */}
      <header className="relative grid min-h-[100svh] items-center overflow-hidden pt-28 pb-16">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(56% 55% at 82% 26%, color-mix(in srgb, var(--amber) 36%, transparent), transparent 70%), radial-gradient(46% 48% at 10% 86%, color-mix(in srgb, var(--rose) 22%, transparent), transparent 72%), linear-gradient(180deg, var(--noir-2), var(--noir))",
          }}
        />
        <div className="relative z-[2] mx-auto grid w-[min(1180px,100%-3rem)] items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <div>
            <p className="eyebrow" style={{ animation: "rise 0.9s 0.05s both cubic-bezier(0.2,0.8,0.2,1)" }}>
              Perfume &amp; Deodorant &nbsp;·&nbsp; For Him &amp; Her
            </p>
            <h1
              className="mt-6 text-[clamp(3.2rem,9vw,7.4rem)] leading-[0.94] tracking-[-0.01em]"
              style={{ animation: "rise 1s 0.15s both cubic-bezier(0.2,0.8,0.2,1)" }}
            >
              Wear Your<br /><em className="italic text-goldBright">Signature</em>
            </h1>
            <p
              className="measure mt-7 max-w-[44ch] text-[1.06rem]"
              style={{ animation: "rise 1s 0.3s both cubic-bezier(0.2,0.8,0.2,1)" }}
            >
              A modern fragrance house — eau de parfum, body mists and deodorants built on rare
              notes and lasting wear. Scents that don&apos;t announce you, but stay with everyone
              who meets you.
            </p>
            <div className="mt-10 flex flex-wrap gap-4" style={{ animation: "rise 1s 0.42s both cubic-bezier(0.2,0.8,0.2,1)" }}>
              <a className="btn btn--solid" href="#collections">Discover the Fragrances</a>
              <a className="btn btn--ghost" href="#signature">Find Your Scent</a>
            </div>
          </div>
          <HeroBottle />
        </div>
      </header>

      {/* ===================== THE HOUSE ===================== */}
      <section id="house" className="py-[clamp(5rem,12vh,9rem)]" style={{ background: "linear-gradient(180deg, var(--noir), var(--noir-2))" }}>
        <div className="mx-auto grid w-[min(1180px,100%-3rem)] items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div className="reveal">
            <p className="eyebrow">The House</p>
            <hr className="rule" />
            <h2 className="lead-h2">Scent is the most <em>personal</em> luxury.</h2>
            <p className="measure mt-6">
              Emercia Decor was founded on a simple belief: a fragrance should feel made for one
              person. We blend in small batches, age our compositions, and hold every bottle to the
              same standard — rich at first breath, and honest hours later.
            </p>
            <p className="measure">For him, for her, and for those who wear whatever they please — our house is built around the notes, not the labels.</p>
            <div className="mt-10 grid grid-cols-2 gap-5">
              <div className="stat"><b>24</b><span>Fragrances</span></div>
              <div className="stat"><b>20%</b><span>Parfum Concentration</span></div>
              <div className="stat"><b>12h+</b><span>Lasting Wear</span></div>
              <div className="stat"><b>0%</b><span>Cruelty · Ever</span></div>
            </div>
          </div>
          <div className="reveal shot min-h-[440px]">
            <div className="shot__label"><small>The House</small><span className="serif">Emercia Signature</span></div>
          </div>
        </div>
      </section>

      {/* ===================== FRAGRANCES (client island) ===================== */}
      <Fragrances products={fragrances} />

      {/* ===================== SIGNATURE + NOTES ===================== */}
      <section id="signature" className="py-[clamp(5rem,12vh,9rem)]" style={{ background: "linear-gradient(180deg, var(--noir), var(--noir-2))" }}>
        <div className="mx-auto grid w-[min(1180px,100%-3rem)] items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div className="reveal shot min-h-[480px]">
            <div className="shot__label"><small>Maison Signature</small><span className="serif">Noir d&apos;Emercia</span></div>
          </div>
          <div className="reveal">
            <p className="eyebrow">The Signature</p>
            <hr className="rule" />
            <h2 className="lead-h2">Noir d&apos;Emercia — the <em>house</em> scent.</h2>
            <p className="measure mt-6">
              Our defining eau de parfum: an amber-oud composition that opens bright, warms through a
              floral heart, and settles into a base you&apos;ll still catch at midnight. Unisex by
              design, personal by wear.
            </p>
            <dl className="mt-7 grid gap-3.5">
              <div className="note-row"><dt>Top</dt><dd>Bergamot · Pink Pepper · Saffron</dd></div>
              <div className="note-row"><dt>Heart</dt><dd>Rose · Jasmine · Cedar</dd></div>
              <div className="note-row"><dt>Base</dt><dd>Amber · Oud · White Musk</dd></div>
            </dl>
            <a className="btn btn--ghost mt-7" href="#enquire">Request a Sample</a>
          </div>
        </div>
      </section>

      {/* ===================== EXPERIENCE ===================== */}
      <section id="services" className="py-[clamp(5rem,12vh,9rem)]">
        <div className="mx-auto w-[min(1180px,100%-3rem)]">
          <div className="reveal mb-12 max-w-[60ch]">
            <p className="eyebrow">The Experience</p>
            <hr className="rule" />
            <h2 className="lead-h2">Beyond the <em>bottle</em>.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="service reveal"><h3>Scent Consultation</h3><p>Tell us your world and we&apos;ll guide you to your signature — in person or through a curated discovery set posted to your door.</p></div>
            <div className="service reveal"><h3>Layering &amp; Wardrobe</h3><p>Learn to pair parfum, mist and deodorant so your scent lasts longer and becomes entirely your own.</p></div>
            <div className="service reveal"><h3>Corporate &amp; Gifting</h3><p>Personalised gift sets and bulk editions for weddings, celebrations and considered corporate gifting.</p></div>
          </div>
        </div>
      </section>

      {/* ===================== QUOTE ===================== */}
      <section className="py-[clamp(5rem,12vh,9rem)]" style={{ background: "linear-gradient(180deg, var(--noir), var(--noir-2))" }}>
        <div className="reveal mx-auto max-w-[40ch] text-center">
          <hr className="rule rule--center" />
          <blockquote className="blockquote">“Three people asked what I was wearing before lunch. It lasts, and it feels like mine.”</blockquote>
          <cite className="text-[0.74rem] uppercase not-italic tracking-luxe text-gold">— An Emercia Wearer</cite>
        </div>
      </section>

      {/* ===================== ENQUIRE ===================== */}
      <section id="enquire" className="py-[clamp(5rem,12vh,9rem)]">
        <div className="mx-auto grid w-[min(1180px,100%-3rem)] items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="reveal">
            <p className="eyebrow">Enquire</p>
            <hr className="rule" />
            <h2 className="lead-h2">Find your <em>signature</em>.</h2>
            <p className="measure mt-6">
              Tell us who it&apos;s for and what you love to wear, and we&apos;ll recommend a fragrance
              or send a discovery set. We reply personally within two working days.
            </p>
            <p className="measure mt-4">
              <a href="mailto:hello@emerciadecor.com" className="text-goldBright">hello@emerciadecor.com</a><br />
              <a href="https://wa.me/910000000000" className="text-goldBright">WhatsApp · +91 00000 00000</a>
            </p>
          </div>
          <EnquireForm />
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-line bg-noir2 pt-16 pb-10">
        <div className="mx-auto w-[min(1180px,100%-3rem)]">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="font-serif text-[1.7rem] uppercase tracking-[0.2em]">Emercia<b className="font-medium text-gold"> Decor</b></div>
              <p className="mt-4 max-w-[34ch] text-ivoryDim">A luxury perfume &amp; deodorant house for him and her. Rare notes, lasting wear, made to be yours.</p>
            </div>
            <div>
              <h4 className="mb-4 text-[0.7rem] font-medium uppercase tracking-luxe text-muted">Explore</h4>
              <ul className="space-y-2 text-ivoryDim">
                <li><a href="#house" className="hover:text-goldBright">The House</a></li>
                <li><a href="#collections" className="hover:text-goldBright">Fragrances</a></li>
                <li><a href="#signature" className="hover:text-goldBright">Signature</a></li>
                <li><a href="#services" className="hover:text-goldBright">The Experience</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-[0.7rem] font-medium uppercase tracking-luxe text-muted">Connect</h4>
              <ul className="space-y-2 text-ivoryDim">
                <li><a href="mailto:hello@emerciadecor.com" className="hover:text-goldBright">hello@emerciadecor.com</a></li>
                <li><a href="https://wa.me/910000000000" className="hover:text-goldBright">WhatsApp</a></li>
                <li><a href="#top" className="hover:text-goldBright">Instagram</a></li>
                <li><a href="#enquire" className="hover:text-goldBright">Find Your Scent</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-line-soft pt-6 text-[0.76rem] text-muted">
            <span>© 2026 Emercia Decor. All rights reserved.</span>
            <span>For him &amp; her · Crafted in small batches.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
