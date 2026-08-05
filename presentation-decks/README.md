# Presentation Decks

Browser-based slide decks built with plain HTML, CSS and vanilla JavaScript.
Every deck is a **single self-contained `.html` file** — no build step, no
dependencies, no internet needed except for the web fonts. Double-click and
present.

```
presentation-decks/
├─ open-deck.bat            double-click to pick and open a deck
├─ template/
│   └─ deck-template.html   blank deck — copy this to start a new one
├─ digital-marketing/
│   ├─ digital-marketing-deck.html      v1 · base deck
│   ├─ digital-marketing-deck-v2.html   v2 · with the three features
│   └─ README.md                        write-up of the enhancements
└─ multi-platform/
    ├─ riwaazbox-multi-platform-deck.html   Riwaazbox across four platforms
    └─ README.md                            what's in the deck
```

## Every deck has three built-in features

| Feature | What it does | Shortcut |
| --- | --- | --- |
| **Dark / light theme** | Switches the whole deck between colour modes for readability in any room. Remembered between sessions; follows your OS setting until you choose. | <kbd>T</kbd> |
| **Search** | Indexes every slide's heading and body text. Jump straight to a slide; the matched term is highlighted on the slide itself. | <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd> |
| **Progress indicator** | Progress bar, one clickable dot per slide, and a `current / total` counter. | — |

### Presenting

| Key | Action |
| --- | --- |
| <kbd>→</kbd> / <kbd>Space</kbd> / <kbd>PageDown</kbd> | Next slide |
| <kbd>←</kbd> / <kbd>PageUp</kbd> | Previous slide |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last slide |
| <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd> | Search |
| <kbd>T</kbd> | Toggle theme |
| <kbd>Esc</kbd> | Close search / clear highlights |
| <kbd>F11</kbd> | Fullscreen (browser) |

Swipe left/right works on touch screens.

---

## Starting a new deck

1. **Copy the template.**

   ```
   copy template\deck-template.html my-topic\my-topic-deck.html
   ```

2. **Edit the three `EDIT ME` spots** near the top of the file — the `<title>`,
   the badge letters, and the deck name in the top bar.

3. **Replace the demo slides.** Each slide is one block:

   ```html
   <section class="slide" data-topic="Category">
     <p class="eyebrow">01 · Section name</p>
     <h2>Slide heading</h2>
     <p class="lede">An opening sentence.</p>
     <!-- ...layout blocks... -->
   </section>
   ```

   `data-topic` is the category label shown in search results.

4. **That's it.** Add or delete as many slides as you like — the slide count,
   progress bar, dots and search index are all built from whatever slides exist
   when the page loads. Nothing in the JavaScript needs touching.

### Layout blocks available

The template ships with five demo slides showing the common layouts, plus a
**SNIPPET LIBRARY** comment near the bottom of the file with copy-paste markup
for each of these:

- `grid grid--2` / `grid grid--3` — card grids (add `card--accent` to highlight one)
- `card__num` — numbered badge cards
- `stats` / `stats--3` — big-number blocks
- `list` — bullet list (`list--warn` for amber bullets)
- `steps` — auto-numbered steps
- `funnel` — tapering bars, width set per row with `style="--w: 70%"`
- `note` — callout / aside
- `chips` — pill tags
- `grad` — gradient-filled words inside a heading

### Rebranding

Change `--accent` and `--accent-2` in the two theme blocks at the top of the
file (one set for dark, one for light). Everything — the progress bar, badges,
dots, gradients, highlights — follows from those two colours.

### Exporting to PDF

Browser print (<kbd>Ctrl</kbd>+<kbd>P</kbd>) captures the current slide only, since
the deck shows one slide at a time. For a PDF handout, step through and print
each slide, or screenshot in whichever theme suits the medium — light usually
prints better.

---

## Decks

| Deck | Slides | Notes |
| --- | --- | --- |
| [Digital Marketing Basics](digital-marketing/) | 15 | Channels, funnel, metrics and strategy. Kept in two versions so the v1 → v2 diff shows exactly what the three features added. |
| [Riwaazbox Multi-Platform Playbook](multi-platform/) | 16 | Instagram, YouTube/Shorts, LinkedIn and WhatsApp/Web — one job per platform, one production cycle feeding all four. Gold-and-rose palette. |
