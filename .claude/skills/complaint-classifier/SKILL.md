---
name: complaint-classifier
description: >-
  Step 1 of the Support-Triage pipeline. Read one raw customer complaint (email/chat
  text) and classify it into a structured JSON: category, severity, sentiment, a
  one-line summary and the affected area. Saves classification.json. Use when a raw
  complaint comes in. If no complaint text is given, ask for it first.
---

# Complaint Classifier · Support Triage Step 1 of 3

**Single responsibility:** classify ONE complaint. Do **not** draft a customer reply
or an engineering ticket — those are the next two skills.

## Input
- **Required:** the raw complaint text (paste of an email/chat message).
- If no complaint is provided, **ask for it** before classifying.

## Output — write `classification.json`
Valid JSON with exactly these fields:
```json
{
  "customer_name": "<name if present, else null>",
  "category": "Bug | Billing | Feature request | How-to | Outage | Other",
  "severity": "Critical | High | Normal | Low",
  "sentiment": "Angry | Frustrated | Neutral | Happy",
  "summary": "<one tight sentence, no fluff>",
  "affected_area": "<product area, e.g. Editor, Billing, Export, Auth>",
  "signals": ["<short cues that set the severity, e.g. 'data loss', 'paying customer', 'repeat issue'>"]
}
```

## Severity guide (be consistent — the ticket reuses this)
- **Critical:** outage, security, data loss affecting many / no workaround.
- **High:** broken core feature, data loss for one user, angry paying customer, repeat.
- **Normal:** a bug with a workaround, a standard request.
- **Low:** cosmetic, how-to, nice-to-have.

## Rules
- Output **only** valid JSON to the file (no prose around it).
- Never invent facts not in the complaint; use `null` when unknown.
- Finish by printing the saved path so `reply-drafter` and `ticket-generator` can read it.
