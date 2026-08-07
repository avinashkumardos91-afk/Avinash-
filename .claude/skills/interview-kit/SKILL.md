---
name: interview-kit
description: >-
  Step 2 of the Hiring-Kit pipeline. Read a job description (job-description.md) and
  produce a structured interview question set mapped to numbered competencies and
  interview stages, saved to interview-kit.md. Use after jd-writer, or when someone
  already has a JD and needs interview questions.
---

# Interview Kit · Hiring Kit Step 2 of 3

**Single responsibility:** turn ONE job description into a structured interview kit.
Do **not** rewrite the JD or build the scorecard (that's `scorecard-builder`).

## Input
- The `job-description.md` produced by Step 1 — **read it**. If it isn't present,
  ask for the JD (or the role) before proceeding.

## Output — write `interview-kit.md`
1. **Competencies** — derive **4–6** competencies from the JD's must-haves, and
   **number them C1…Cn** (e.g. C1 System design, C2 Ownership, C3 Communication).
   The numbering matters — the scorecard references it.
2. **Questions per competency** — for each Cn, list **2–3** interview questions plus
   one line: *"A strong answer shows …"*.
3. **Interview stages** — a 3–4 stage plan (e.g. Screen → Technical → System/
   Behavioural → Founder), noting which competencies (C1…Cn) each stage covers and a
   rough duration.
4. **Red flags** — 3–4 things to watch for in this specific role.

## Rules
- Questions must be answerable in a real interview and tied to the JD — no generic
  trivia.
- Keep competency names short; they become column labels downstream.
- Finish by printing the saved file path so `scorecard-builder` can read it.
