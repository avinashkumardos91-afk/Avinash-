#!/usr/bin/env python3
"""Validate that the Hiring-Kit pipeline outputs are consistent and well-formed.

The three skills chain jd-writer -> interview-kit -> scorecard-builder. This gate
proves the chain held: the scorecard's competencies must mirror the interview kit's
C1..Cn exactly, and every file must be present and well-formed.

Checks
  1. job-description.md exists and is non-trivial.
  2. interview-kit.md defines >= 3 numbered competencies (C1..Cn).
  3. scorecard.csv is valid CSV, has the expected header, and its competency rows
     mirror the interview kit's C1..Cn exactly (no missing, no extra, same order).

Exit code 0 on success, 1 on any failure.

Usage: python validate_pipeline.py
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
COMPETENCY_HEADING = re.compile(r"^###\s+(C\d+)\s*·", re.MULTILINE)  # "### C1 · Name"
COMPETENCY_CODE = re.compile(r"^(C\d+)\b")
EXPECTED_HEADER = [
    "Competency",
    'What "strong" looks like',
    "Interview stage",
    "Score (1-4)",
    "Evidence / notes",
]


def kit_competencies(kit: Path) -> list[str]:
    """Ordered competency codes (C1, C2, …) declared in the interview kit."""
    return COMPETENCY_HEADING.findall(kit.read_text(encoding="utf-8"))


def scorecard_rows(card: Path) -> list[list[str]]:
    with card.open(encoding="utf-8", newline="") as f:
        return list(csv.reader(f))


def scorecard_competencies(rows: list[list[str]]) -> list[str]:
    codes: list[str] = []
    for row in rows[1:]:  # skip header
        if row and (m := COMPETENCY_CODE.match(row[0].strip())):
            codes.append(m.group(1))
    return codes


def main() -> int:
    # Ensure ✓/✗ render on any console (Windows defaults to cp1252).
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, OSError):
        pass

    ap = argparse.ArgumentParser(description="Validate a Hiring-Kit pipeline run.")
    ap.add_argument("--dir", default="output-examples",
                    help="run folder (relative to this script) holding the three outputs")
    out = (BASE / ap.parse_args().dir).resolve()

    print(f"Validating Hiring-Kit pipeline outputs in {out.name}/…\n")
    jd, kit, card = (out / n for n in ("job-description.md", "interview-kit.md", "scorecard.csv"))

    missing = [p.name for p in (jd, kit, card) if not p.exists()]
    if missing:
        print(f"  ✗ missing file(s): {', '.join(missing)}")
        return 1

    ok = True

    if len(jd.read_text(encoding="utf-8")) < 400:
        print("  ✗ job-description.md looks too short"); ok = False
    else:
        print("  ✓ job-description.md present and substantive")

    kit_codes = kit_competencies(kit)
    if len(kit_codes) < 3:
        print(f"  ✗ interview-kit.md defines only {len(kit_codes)} competencies (need >= 3)"); ok = False
    else:
        print(f"  ✓ interview-kit.md defines {len(kit_codes)} competencies: {', '.join(kit_codes)}")

    try:
        rows = scorecard_rows(card)
    except csv.Error as e:
        print(f"  ✗ scorecard.csv is not valid CSV: {e}")
        return 1

    header = rows[0] if rows else []
    if header == EXPECTED_HEADER:
        print("  ✓ scorecard.csv header is correct")
    else:
        print(f"  ✗ scorecard header mismatch\n      expected: {EXPECTED_HEADER}\n      got:      {header}"); ok = False

    card_codes = scorecard_competencies(rows)
    if kit_codes and card_codes == kit_codes:
        print(f"  ✓ scorecard competencies mirror the interview kit ({len(card_codes)} rows) — chain intact")
    else:
        print(f"  ✗ competency mismatch — kit={kit_codes} scorecard={card_codes}"); ok = False

    print()
    print("PASS — pipeline outputs are consistent and chainable ✓" if ok else "FAIL — see issues above")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
