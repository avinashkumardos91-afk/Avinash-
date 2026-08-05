# Digital Marketing Basics — Interactive Slide Deck

A 15-slide presentation deck on digital marketing fundamentals, built with plain
HTML, CSS and vanilla JavaScript. No frameworks, no build step — open the file
in a browser and present.

## Files

| File | What it is |
| --- | --- |
| `digital-marketing-deck.html` | **v1 — base deck.** Slides plus basic Prev/Next navigation. |
| `digital-marketing-deck-v2.html` | **v2 — enhanced deck.** Same content, plus the three usability features below. |

The v2 file was created from v1 with:

```bash
cp digital-marketing-deck.html digital-marketing-deck-v2.html
```

so the two can be diffed side by side to show exactly what the enhancements added.

## The three enhancements

After building and actually presenting with v1, three usability gaps stood out.
Each was fixed with a self-contained JavaScript feature.

### 1. Dark / light theme toggle

**Problem:** the deck was dark-only. In a bright room or on a projector with
washed-out contrast, the light-on-dark text was hard to read.

**Solution:** a button in the top bar that switches between dark and light modes.

- Every colour in the stylesheet is a CSS custom property, so flipping the
  `data-theme` attribute on `<html>` repaints the whole deck at once.
- The choice is saved to `localStorage`, so it survives a reload.
- On first visit the deck follows the operating system's colour preference, and
  keeps following it until the user makes an explicit choice.
- A small script in `<head>` applies the saved theme *before* first paint, so the
  page never flashes the wrong colours on reload.
- The sun/moon icon cross-fades, and `aria-label` / `aria-pressed` stay in sync
  for screen readers.

Shortcut: <kbd>T</kbd>

### 2. Search functionality

**Problem:** during Q&A, jumping back to "the slide about ROAS" meant arrowing
through the deck one slide at a time while everyone watched.

**Solution:** a search overlay that indexes the whole deck.

- On load, every slide is indexed by heading, topic and body text. Text nodes are
  walked and joined with spaces so words from neighbouring elements don't get
  glued together.
- Results are ranked: a heading match beats a topic match, which beats body text;
  ties break by slide order.
- Each result shows the slide number, topic, heading, and a snippet of text
  around the match with the matched term highlighted.
- Choosing a result jumps to that slide **and** highlights every occurrence of the
  term on the slide itself, scrolling the first one into view. The highlight is
  removed as soon as you navigate away.
- Full keyboard control: <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to go,
  <kbd>Esc</kbd> to close.

Shortcut: <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd>

### 3. Progress indicator

**Problem:** there was no way to tell how far into the deck you were — for the
presenter or the audience.

**Solution:** three linked pieces of progress feedback.

- A gradient **progress bar** pinned to the top of the screen, filling from
  `(current + 1) / total`.
- One **dot marker** per slide. The current dot stretches into a pill; slides
  already visited are tinted; every dot is clickable as a shortcut to that slide.
- A **`current / total` counter** next to the navigation buttons, in an
  `aria-live` region so screen readers announce each change.
- The wrapper carries `role="progressbar"` with `aria-valuenow` kept up to date.

## Controls

| Key | Action |
| --- | --- |
| <kbd>→</kbd> / <kbd>Space</kbd> / <kbd>PageDown</kbd> | Next slide |
| <kbd>←</kbd> / <kbd>PageUp</kbd> | Previous slide |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last slide |
| <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd> | Open search |
| <kbd>T</kbd> | Toggle theme |
| <kbd>Esc</kbd> | Close search / clear highlights |

Touch screens support swipe left and right.

## Deck contents

1. Title
2. What is Digital Marketing?
3. Why It Matters Today
4. The Six Core Channels
5. Search Engine Optimisation
6. Content Marketing
7. Social Media Marketing
8. Email Marketing
9. Paid Advertising (PPC)
10. The Marketing Funnel
11. Metrics That Actually Matter
12. The Starter Toolkit
13. Building a Strategy in 6 Steps
14. Five Common Mistakes
15. Key Takeaways
