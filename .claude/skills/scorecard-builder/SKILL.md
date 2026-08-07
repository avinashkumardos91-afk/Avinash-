---
name: scorecard-builder
description: >-
  Step 3 (final) of the Hiring-Kit pipeline. Read the job description and interview
  kit, then produce a candidate scorecard TEMPLATE as a CSV (scorecard.csv) that an
  interview panel can fill in. Use after interview-kit.
---

# Scorecard Builder · Hiring Kit Step 3 of 3

**Single responsibility:** produce ONE structured scorecard CSV from the JD +
interview kit. This is the final, stakeholder-ready deliverable.

## Input
- `job-description.md` (Step 1) and `interview-kit.md` (Step 2) — **read both**. The
  competencies (C1…Cn) and their "strong answer shows…" lines come straight from the
  interview kit so the scorecard stays consistent.

## Output — write `scorecard.csv`
A valid CSV with this header, then **one row per competency** (C1…Cn):

```
Competency,What "strong" looks like,Interview stage,Score (1-4),Evidence / notes
```

- Fill `Competency`, `What "strong" looks like`, and `Interview stage` from the
  interview kit. Leave `Score (1-4)` and `Evidence / notes` **blank** for the panel.
- Then append two summary rows:
  - `Overall recommendation (Strong No / No / Yes / Strong Yes),,,,`
  - `Would you want to work with them? (Y/N),,,,`
- Also print a short **markdown preview table** so the user can eyeball it.

## Rules
- CSV must be valid — wrap any field containing a comma in double quotes.
- Score scale **1–4** (1 = poor, 4 = excellent).
- Do not invent new competencies — mirror the interview kit's C1…Cn exactly.
- Finish by printing the saved file path; this is the end of the pipeline.
