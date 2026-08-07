---
name: ticket-generator
description: >-
  Step 3 (final) of the Support-Triage pipeline. Read the original complaint and
  classification.json, then generate a structured internal engineering ticket saved
  to internal-ticket.json — the deliverable handed to the eng team. Use after
  complaint-classifier.
---

# Ticket Generator · Support Triage Step 3 of 3

**Single responsibility:** produce ONE structured engineering ticket. This is the
final, stakeholder-ready deliverable for the engineering team.

## Input
- The original complaint **and** `classification.json` from Step 1 — read both. The
  `category` and `severity` come straight from the classification so triage stays
  consistent.

## Output — write `internal-ticket.json`
Valid JSON with these fields:
```json
{
  "title": "<concise engineer-facing title>",
  "category": "<mirror classification.category>",
  "severity": "<mirror classification.severity>",
  "priority": "P0 | P1 | P2 | P3",
  "affected_area": "<from classification>",
  "customer_impact": "<one line: who is affected and how badly>",
  "description": "<what happened, in engineer terms>",
  "steps_to_reproduce": ["<step>", "..."],
  "suggested_owner_team": "<e.g. Editor, Billing, Platform, Infra>",
  "tags": ["<short>", "<tags>"],
  "source": "customer-support"
}
```

## Priority mapping (from severity)
`Critical → P0 · High → P1 · Normal → P2 · Low → P3`

## Rules
- Output **only** valid JSON to the file.
- `category` and `severity` **must equal** the classification's values (no drift).
- If reproduction steps aren't derivable from the complaint, use
  `["Not provided — needs follow-up with customer"]`.
- Finish by printing the saved path; this is the end of the pipeline.
