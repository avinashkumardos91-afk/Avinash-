"use client";

import { useState } from "react";

export default function EnquireForm() {
  const [note, setNote] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Emercia Decor enquiry — ${d.get("interest") || ""}`);
    const body = encodeURIComponent(
      `Name: ${d.get("name") || ""}\nCity: ${d.get("city") || ""}\nEmail: ${d.get("email") || ""}\n` +
        `Looking for: ${d.get("interest") || ""}\n\n${d.get("message") || ""}`
    );
    setNote("Opening your email app…");
    window.location.href = `mailto:hello@emerciadecor.com?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full rounded-sm border border-line-soft bg-panel px-4 py-3.5 text-[0.98rem] text-ivory outline-none transition-colors focus:border-gold";
  const label = "grid gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted";

  return (
    <form className="reveal grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Name<input className={field} type="text" name="name" required placeholder="Your name" /></label>
        <label className={label}>City<input className={field} type="text" name="city" placeholder="City" /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Email<input className={field} type="email" name="email" required placeholder="you@email.com" /></label>
        <label className={label}>
          Looking for
          <select className={field} name="interest" defaultValue="For Her">
            <option>For Her</option><option>For Him</option><option>Unisex</option>
            <option>Deodorants &amp; Mists</option><option>A Gift Set</option>
          </select>
        </label>
      </div>
      <label className={label}>
        What do you love to wear?
        <textarea className={`${field} min-h-20 resize-y`} name="message" placeholder="Scents or notes you already enjoy…" />
      </label>
      <button className="btn btn--solid justify-center" type="submit">Send Enquiry</button>
      <p className="m-0 min-h-[1.2rem] text-[0.8rem] text-muted">{note}</p>
    </form>
  );
}
