# Ticketing System — Specification

**Ticketing System** is a support & ticketing platform. The concrete context for this build
is a **product support desk**: users and teammates report **queries, problems and
bugs** (a feature isn't working, the app crashes on upload, "how do I reset my key?",
a payment failed), and a support/engineering team works each one through a lifecycle
until it is resolved and closed. The system's job is to make sure nothing disappears,
and that at any moment anyone can answer:
**what is open, what is urgent, who owns it, and how long has it been sitting.**

Tickets are categorised as one of: **Bug**, **Feature request**, **Account / Access**,
**Billing**, **How-to / Query**, or **Other**.

---

## Task

Build a single-page web app, **Ticketing System**, with no backend, that lets two kinds of
people work the same set of tickets:

- **Requester** — reports a query, problem or bug quickly and can track the tickets
  they raised.
- **Agent** (support / engineering) — sees everything waiting, decides what to do
  next, takes ownership, and moves tickets through to resolution without losing track.

A **ticket** is one reported problem. It has a stable ID, a title and description,
the name of the requester, a **category**, a **priority**, an **owner** (the agent
handling it, or unassigned), timestamps, and a full **activity log**. It moves
through a fixed **lifecycle**:

`Raised → Picked up → In progress → Resolved → Closed`

(with **Reopen** allowed from Resolved/Closed back to In progress).

The app opens on a brand landing view (3D animated mark, in the visual style of the
Ticketing site) and drops into a **console** with a live dashboard and two modes
(Raise / Resolve).

---

## Acceptance Criteria

The build is accepted when **all** of the following are true and demonstrable.

### Raising
1. From **Raise** mode a requester can submit a ticket with: title (required),
   description, their name (required), category, and priority.
2. On submit the ticket is created with a **unique ID** (e.g. `TKT-1042`), status
   **Raised**, owner **Unassigned**, and a **created timestamp** of now.
3. Submitting with an empty title or requester name is blocked with an inline message
   (no ticket is created).
4. After submitting, the requester can see **their** tickets (filtered by their name)
   with current status and age.

### Lifecycle & ownership
5. An agent can **Pick up** a Raised ticket: this sets an **owner** and moves it to
   **Picked up**.
6. An agent can advance a ticket **Picked up → In progress → Resolved → Closed**, and
   **Reopen** a Resolved/Closed ticket back to **In progress**.
7. Status can also be changed by **dragging a ticket card** between board columns.
8. An agent can **reassign** the owner and **change the priority** of any ticket.
9. Illegal transitions are not offered (e.g. you cannot Close something still Raised
   without it passing through the flow; the UI only exposes valid next steps).

### Record / traceability
10. Every meaningful change — created, picked up, status change, reassigned, priority
    changed, note added — is appended to the ticket's **activity log** with a
    **timestamp**, newest first.
11. An agent can add a free-text **note** to a ticket; it appears in the activity log.

### The four questions (dashboard)
12. A dashboard, always visible in the console, shows live counts:
    **Open** (not Closed), **Urgent** (open + priority Urgent), **Unassigned**
    (open + no owner), and the **age of the oldest open ticket**.
13. Each ticket card and detail view shows **how long it has been open** (its age),
    in human terms (e.g. "3d 4h", "2w").

### Finding things
14. Tickets can be **searched** by text (matches ID, title, description, requester,
    owner).
15. Tickets can be **filtered** by status, priority, category, and owner, and filters
    combine with search.
16. The resolver view groups tickets by status as a **board** (one column per
    lifecycle stage) with per-column counts.

### Persistence
17. All tickets and their activity **persist across a page refresh** (localStorage).
18. On first ever load the app **seeds** a few example tickets so the board is not
    empty; thereafter it uses saved data.

---

## Constraints

- **HTML, CSS and JavaScript only.** No framework, no build step, no bundler.
- **Persistence via `localStorage`.** No backend, no server, no database.
- **No authentication.** "Who am I" (the acting agent) is a plain name field, not a login.
- Single self-contained `index.html` (fonts and the optional 3D library may load from
  a CDN; the app must still function if the 3D fails to load — it degrades gracefully).
- Must run by opening the file in a browser (or via GitHub Pages) with no install.
- Accessible basics: keyboard-focusable controls, sufficient contrast, respects
  `prefers-reduced-motion`.

---

## Out of scope (deliberately)

- Real user accounts / permissions, email or notifications, file attachments,
  multi-device sync, SLAs beyond the age indicator, and reporting/export. These are
  noted so the boundary is explicit, not because they were forgotten.
