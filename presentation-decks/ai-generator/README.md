# AI Deck Generator

`ai-deck-generator.html` — a self-contained deck whose **first slide takes a
topic**, calls the Gemini API on submit, and writes the rest of the slides from
the reply. Built on the same engine as [`../template/deck-template.html`](../template/deck-template.html),
so it keeps the theme toggle (<kbd>T</kbd>), search (<kbd>/</kbd>) and progress bar.

## Using it

1. Open the page over **https** — the GitHub Pages link, or a local web server.
   Browsers block API calls from a `file://` path, so a double-clicked local file
   will not be able to reach Gemini.
2. On slide 1, open **API settings** and paste a Gemini API key
   (free from `aistudio.google.com/apikey`).
3. Type a topic and press **Generate deck**.
4. Gemini returns a structured deck; the placeholder and any earlier generated
   slides are replaced, and the progress bar, dots and search index rebuild
   around the new slides.

## Model

Defaults to **`gemini-3.6-flash`** (`DEFAULT_MODEL` in the script, and the
editable *Model* field under API settings). If that name ever returns a 404,
switch the field to a current flash model such as `gemini-2.5-flash` — the value
is remembered in the browser.

## About the API key

The key is **never written into the file**. It is stored only in the browser's
`localStorage` (`deck-gemini-key`) and sent directly from your browser to Google.
Nothing is committed to this repository. Because the call is client-side, treat
this as a personal tool — anyone you hand the page to uses their own key.

## How the content maps to slides

Gemini is asked for JSON matching a fixed schema. Each slide has a `kind` that
selects a layout from the template's CSS:

| `kind` | Renders as |
| --- | --- |
| `title` | headline + lede + chips |
| `cards` | a 2–3 card grid |
| `stats` | 3–4 big-number blocks |
| `steps` | an auto-numbered ordered list |
| `list`  | a bullet list |
| `close` | 3 accent takeaway cards |

Model output is inserted as text (via `textContent`), never as raw HTML.
