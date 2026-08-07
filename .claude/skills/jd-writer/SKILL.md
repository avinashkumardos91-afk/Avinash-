---
name: jd-writer
description: >-
  Step 1 of the Hiring-Kit pipeline. Turn a role brief (role title + optional
  company/stage, seniority, location) into a complete, structured Job Description
  saved to job-description.md. Use when someone says "we need to hire X" or asks
  for a JD. If the role title or seniority is unclear, ask for it first.
---

# JD Writer · Hiring Kit Step 1 of 3

**Single responsibility:** produce ONE job description from a role brief. Do **not**
write interview questions or a scorecard — those are the next two skills.

## Input
- **Required:** the role title.
- **Optional:** company/stage (e.g. seed-stage fintech), seniority, location/remote,
  and the one thing this hire must nail.
- If the role title or seniority is missing, **ask for it** before writing.

## Output — write `job-description.md`
Save to the project's output folder (e.g. `hiring-kit-pipeline/output-examples/`),
with these sections in order:
1. `# <Role> — <Company / stage>, <location>`
2. **About the role** — 2–3 sentences on why it exists and its impact.
3. **What you'll do** — 5–7 responsibilities, each starting with an action verb.
4. **Must-have** — 5–7 concrete requirements (skills, years, domain).
5. **Nice-to-have** — 3–4.
6. **Level & scope** — seniority, who they work with, and what success looks like in
   their first 6 months.
7. **How we hire** — one line pointing to the interview process (leave the actual
   questions to the `interview-kit` skill).

## Rules
- Concrete and role-specific — no generic buzzword filler.
- Keep it to roughly one page.
- Finish by printing the saved file path so the next skill (`interview-kit`) can read it.
