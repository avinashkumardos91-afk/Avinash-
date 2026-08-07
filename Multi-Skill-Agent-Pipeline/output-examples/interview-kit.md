# Interview Kit — Founding Backend Engineer (Seed-stage Fintech)

Derived from `job-description.md`. Competencies are numbered **C1…C6**; the scorecard
mirrors this numbering.

## Competencies & questions

### C1 · Backend & API design
- Walk me through an API you designed that others built on. How did you handle
  versioning and backward compatibility?
- How do you make an endpoint **idempotent**, and when does it actually matter?
- *A strong answer shows:* clean contracts, awareness of retries/idempotency, empathy
  for the callers of their API.

### C2 · Data modelling & correctness
- Design the schema for a **double-entry ledger**. How do you guarantee balances never
  drift?
- Where would you use a transaction, an outbox, or exactly-once processing — and why?
- *A strong answer shows:* correctness-first instinct, understands consistency vs.
  availability trade-offs, thinks about auditability.

### C3 · Payments / domain depth
- A payment webhook arrives twice, out of order, hours late. What does your system do?
- How do you reconcile your ledger against a provider's settlement report?
- *A strong answer shows:* real exposure to money movement, respects failure modes,
  designs for reconciliation from day one.

### C4 · Production ownership & reliability
- Tell me about a production incident you owned end to end. What was the blast radius
  and what changed afterward?
- What do you instrument and alert on for a money-movement path?
- *A strong answer shows:* has carried a pager, blameless post-incident thinking,
  proactive about alerting and runbooks.

### C5 · Communication & collaboration
- Explain idempotency to a non-technical founder in under a minute.
- Describe a time you disagreed with a teammate on architecture. How did it resolve?
- *A strong answer shows:* clarity for non-engineers, disagrees well, seeks the best
  answer over being right.

### C6 · Founding / 0→1 mindset
- You have two weeks and must choose: ship the ledger, or the first payment rail. How
  do you decide?
- What would you deliberately *not* build in the first three months, and why?
- *A strong answer shows:* pragmatic prioritisation, comfort with ambiguity, bias to
  ship without cutting correctness corners.

## Interview stages
1. **Recruiter screen** (30 min) — motivation, logistics, C6 sanity check.
2. **Technical exercise** (90 min, practical) — covers **C1, C2**.
3. **System design + behavioural** (60 min) — covers **C3, C4, C5**.
4. **Founder conversation** (45 min) — covers **C5, C6** and mutual fit.

## Red flags
- Treats correctness/reconciliation as an afterthought ("we'll add it later").
- Has never owned anything in production / no on-call experience.
- Can't explain a technical trade-off without jargon.
- Wants to over-build (microservices on day one) for a pre-PMF product.
