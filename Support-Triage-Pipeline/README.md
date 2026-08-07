# Support-Triage Pipeline — Complaint → Reply → Engineering Ticket

A pipeline of **three chainable Claude Skills** that takes one messy customer complaint
and turns it into (1) a structured classification, (2) a professional customer reply, and
(3) a ready-to-file engineering ticket — each step feeding the next.

> Assignment 3: a multi-skill pipeline for a real operational problem, built with Claude
> Skills only (`.claude/skills/`).

## The problem
Early-stage startups get support complaints as messy free-text over email and chat.
Someone has to read each one, judge how bad it is, write a calm reply, **and** log a
clean ticket for engineering — every time, by hand. It's slow, inconsistent, and things
slip: an angry paying customer gets a templated reply, or a data-loss bug gets filed as
"normal." This pipeline standardises that triage: one complaint in, three consistent
artifacts out, with the engineering ticket derived from the same classification the
customer reply used — so severity never drifts between what the customer is told and
what engineering sees.

## The three skills (each does exactly one thing)

| Step | Skill (`.claude/skills/…`) | Single responsibility | Reads | Writes |
|------|----------------------------|-----------------------|-------|--------|
| 1 | **`complaint-classifier`** | Complaint → structured **classification** (category, severity, sentiment) | the raw complaint | `classification.json` |
| 2 | **`reply-drafter`** | Classification + complaint → a **customer reply** matched to severity/sentiment | `classification.json` | `customer-reply.md` |
| 3 | **`ticket-generator`** | Classification + complaint → a **structured engineering ticket** | `classification.json` | `internal-ticket.json` |

- **Single responsibility:** the classifier never writes a reply; the reply skill never
  files a ticket; the ticket skill never re-classifies.
- **Chainable:** Steps 2 and 3 both consume the JSON Step 1 produced.
- **Structured file output (requirement #4):** two of the three outputs are **JSON** —
  `classification.json` and the hand-to-engineering **`internal-ticket.json`**.

## Order of execution
```
raw complaint ──▶ complaint-classifier ──▶ classification.json
                                              │
                        ┌─────────────────────┴─────────────────────┐
                        ▼                                           ▼
                  reply-drafter ──▶ customer-reply.md      ticket-generator ──▶ internal-ticket.json
```

## One combined prompt (triggers the whole pipeline)
> **"Use my `complaint-classifier` skill on this complaint: *'App crashed and wiped my
> draft — 2 hours of work gone, second time this month, I'm on Pro and about to cancel.
> — Rahul'*, then pass the classification to `reply-drafter` to write the customer reply,
> then to `ticket-generator` to create the internal engineering ticket."**

## What's in this folder
```
Support-Triage-Pipeline/
├─ README.md
├─ validate_pipeline.py         ← quality gate (Python 3.8+)
└─ output-examples/             ← one full end-to-end run
   ├─ complaint.md               (the input)
   ├─ classification.json        (Step 1 output — structured)
   ├─ customer-reply.md          (Step 2 output)
   └─ internal-ticket.json       (Step 3 output — structured deliverable)
```
The skills live in `../.claude/skills/{complaint-classifier,reply-drafter,ticket-generator}/SKILL.md`.

## Verify the run
`validate_pipeline.py` checks all three outputs exist and are well-formed, and — the key
chain test — that the **engineering ticket's category & severity mirror the classifier's**
and its **priority maps correctly** (Critical→P0, High→P1, Normal→P2, Low→P3):

```bash
cd Support-Triage-Pipeline
python validate_pipeline.py
# → PASS — pipeline outputs are consistent and chainable ✓
```

## Reuse it for any complaint
Run the combined prompt with any complaint text and you get a fresh classification,
reply, and engineering ticket — all consistent with each other.
