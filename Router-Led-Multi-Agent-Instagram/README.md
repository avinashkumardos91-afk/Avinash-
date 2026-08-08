# Router-Led Multi-Agent Instagram Content Studio

A single natural-language request — *"create a Reel idea about morning routines"* — goes in.
A fully packaged, ready-to-shoot **content brief** comes out, automatically logged to a
content calendar. The creator never names an agent or knows how many are working behind the
scenes. A **router agent** figures that out.

---

## The problem

A solo creator / small studio ships Instagram content constantly. Every post needs someone to:
research what's trending → write a hook + caption + hashtags → (for Reels) design a cover
frame → log it to a calendar so nothing is forgotten. Doing this by hand for every post is
slow and easy to drop.

This system turns **one plain-English request** into a finished brief by orchestrating a set
of narrow, specialised agents behind a single entry point.

---

## Architecture

```
Creator request ("create a <Reel|Carousel|Post> idea about <topic>")
        │
        ▼
┌─────────────────────────────┐
│   content-studio-router     │  ← orchestration only, NO domain tools (tools: Task)
└─────────────────────────────┘
        │  always
        ├─▶ trend-researcher        (native: WebSearch / WebFetch)
        ├─▶ hook-writer             (reasoning)
        │
        │  BRANCH on format ↓
        ├─▶ thumbnail-concepter     (reasoning)   ── ONLY if format == Reel/Post
        │   └─ (Carousel: SKIPPED; router builds a slide outline instead)
        │
        └─▶ content-calendar-logger (Zapier MCP: Google Sheets)  ← always, last
                │
                ▼
        ONE clean CONTENT BRIEF back to the creator
```

## The agents

| Agent | Role | Tools | Type |
|---|---|---|---|
| **content-studio-router** | Reads the request, decides the path, passes data agent→agent, returns one brief. Does none of the work itself. | `Task` (delegation only) | Orchestrator |
| **trend-researcher** | Finds what's currently working on IG for the topic; flags EVERGREEN vs TIME-SENSITIVE. | `WebSearch`, `WebFetch` | **Native tool** ✅ |
| **hook-writer** | 3–5 scroll-stopping hooks + caption + hashtags, using the trend brief. | `Read` | Reasoning |
| **thumbnail-concepter** | 2–3 concrete Reel cover-frame concepts. | `Read` | Reasoning (branch) |
| **content-calendar-logger** | Logs the finished brief as a row in Google Sheets. | `mcp__Zapier-MCP__google_sheets_create_spreadsheet_row` | **Zapier MCP** ✅ |

- **Native tool / connector requirement:** `trend-researcher` uses `WebSearch`/`WebFetch`.
- **Zapier MCP requirement:** `content-calendar-logger` uses the Zapier Google Sheets action.
- **Router holds no domain tools** — it only delegates via `Task`.

## The routing / branching logic

The router makes a **real decision based on the requested format** — different inputs take
genuinely different agent paths, not just different text:

- **Reel** (or single **Post**): run `trend-researcher → hook-writer → thumbnail-concepter → logger`.
  The final brief **includes a Cover frame** (the first frame drives the tap on a Reel).
- **Carousel**: run `trend-researcher → hook-writer → logger`, **skipping thumbnail-concepter**.
  Carousels lead with slide 1, not a cover frame, so the router builds a **slide outline** from
  the hooks instead. The final brief **has Slides, no Cover frame**.

> Secondary signal: if `trend-researcher` flags the topic **TIME-SENSITIVE**, the logger records
> **Priority: High** (an easy hook-in point for a future `team-alert` Slack agent). Evergreen
> topics are logged quietly as Normal.

## Sample end-to-end prompts

```
# Reel branch  → includes a cover frame
> Use content-studio-router: create a Reel idea about morning routines

# Carousel branch  → no cover frame, includes a slide outline
> Use content-studio-router: create a Carousel about budgeting tips for students
```

Both fully-worked runs are in [`output-examples/`](output-examples/):
- `reel-morning-routines/` — trend brief → hooks → **cover frames** → final brief → calendar row
- `carousel-budgeting-tips/` — trend brief → hooks → **slide outline (no thumbnail)** → final brief → calendar row

Notice the two final briefs differ structurally (Cover frame vs Slides) — that's the branch working.

## Running it

1. **Agents live in `.claude/agents/`.** Open this project in Claude Code so the five agents load.
2. **Connect Zapier MCP** (for `content-calendar-logger`) — one-time, done by you:
   - Add the Zapier MCP server, then in Zapier run
     `discover_zapier_actions` → `enable_zapier_action` (**Google Sheets → Create Spreadsheet Row**)
     → `inspect_zapier_actions` to confirm the exact tool name + parameters, and make the
     `tools:` line in `content-calendar-logger.md` match.
   - Columns expected: `Topic | Format | Hook | Status | Planned Date | Priority`.
   - Until connected, the logger reports the row it *would* write (nothing is lost) instead of failing silently.
3. **Invoke the router**, not the sub-agents, with a prompt like the samples above.

## Design notes

- Each sub-agent is **useful standalone** (you can run `hook-writer` alone on a topic), not just a step.
- The router **summarises** — the creator sees one brief, never the raw sub-agent dumps.
- Swapping the calendar (e.g. Notion or Airtable via Zapier) only changes one agent; the router is unaffected.
