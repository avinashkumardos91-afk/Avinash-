# Multi-Skill Agent Pipeline — Job Description → Hiring Kit

A pipeline of **three chainable Claude Skills** that takes an HR team from
*"we need to hire someone"* to a complete, ready-to-use hiring kit — a job
description, an interview question set, and a fill-in candidate scorecard —
with each skill's output feeding the next.

> Assignment 3: a multi-skill pipeline for a real operational problem, built with
> Claude Skills only (`.claude/skills/`).

## The problem
Hiring at an early-stage company is slow and inconsistent because every step is
redone by hand: someone writes a JD, someone else invents interview questions on
the fly, and panels score candidates on gut feel with no shared rubric. The result
is biased, unrepeatable hiring and a poor candidate experience. This pipeline turns
a one-line role brief into a **consistent, structured hiring kit** in one pass — and
because each artifact is derived from the previous one, the interview and scorecard
actually match the JD.

## The three skills (each does exactly one thing)

| Step | Skill (`.claude/skills/…`) | Single responsibility | Reads | Writes |
|------|----------------------------|-----------------------|-------|--------|
| 1 | **`jd-writer`** | Role brief → a structured **Job Description** | the role brief | `job-description.md` |
| 2 | **`interview-kit`** | JD → **interview questions** mapped to numbered competencies (C1…Cn) + a stage plan | `job-description.md` | `interview-kit.md` |
| 3 | **`scorecard-builder`** | JD + kit → a **candidate scorecard template as CSV** | `interview-kit.md` (+ JD) | `scorecard.csv` |

- **Single responsibility:** the JD writer never invents questions; the interview
  skill never rewrites the JD; the scorecard skill never adds competencies of its own.
- **Chainable:** Step 2 reads the file Step 1 wrote; Step 3 reads the file Step 2 wrote.
- **Structured file output (requirement #4):** Step 3 emits **`scorecard.csv`** — a
  valid CSV a hiring panel opens in Sheets/Excel and fills in during interviews.

## Order of execution
```
role brief ──▶ jd-writer ──▶ job-description.md
                                   │
                                   ▼
                            interview-kit ──▶ interview-kit.md
                                                    │
                                                    ▼
                                         scorecard-builder ──▶ scorecard.csv
```

## One combined prompt (triggers the whole pipeline)
> **"Use my `jd-writer` skill to write a JD for a Founding Backend Engineer at a
> seed-stage fintech (remote, India), then pass it to `interview-kit` to build the
> interview questions, then pass both to `scorecard-builder` to generate the candidate
> scorecard CSV."**

Each skill asks for anything it needs (e.g. `jd-writer` asks for the role/seniority if
you didn't give it) and prints the file path it wrote, so the next skill can pick it up.

## What's in this folder
```
Multi-Skill-Agent-Pipeline/
├─ README.md                    ← this file
├─ validate_pipeline.py         ← quality gate: proves the chain held (Python 3.8+)
└─ output-examples/             ← one full end-to-end run
   ├─ job-description.md         (Step 1 output)
   ├─ interview-kit.md           (Step 2 output)
   └─ scorecard.csv              (Step 3 output — the structured deliverable)
```
The skills themselves live in `../.claude/skills/{jd-writer,interview-kit,scorecard-builder}/SKILL.md`.

## Verify the run
`validate_pipeline.py` is the pipeline's quality gate — it checks all three files
exist, the interview kit defines ≥ 3 numbered competencies, the CSV is valid with the
right header, and the **scorecard's competencies mirror the interview kit exactly**
(proving the chain didn't drift):

```bash
cd Multi-Skill-Agent-Pipeline
python validate_pipeline.py
# → PASS — pipeline outputs are consistent and chainable ✓
```

## Reuse it for any role
Run the combined prompt with a different role brief — *"…a Growth Marketing Lead at a
D2C brand…"* — and you get a fresh JD, interview kit, and scorecard for that role, all
consistent with each other.
