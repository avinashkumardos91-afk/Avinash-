#!/usr/bin/env python3
"""Validate a Support-Triage pipeline run: complaint-classifier -> reply-drafter -> ticket-generator.

Proves the chain held:
  1. classification.json is valid JSON with the required fields and allowed values.
  2. customer-reply.md exists, is substantive, and addresses the customer by name.
  3. internal-ticket.json is valid JSON whose category & severity MIRROR the
     classification, and whose priority correctly maps from severity.

Exit 0 on success, 1 on any failure.  Usage: python validate_pipeline.py [--dir output-examples]
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
CATEGORIES = {"Bug", "Billing", "Feature request", "How-to", "Outage", "Other"}
SEVERITIES = {"Critical", "High", "Normal", "Low"}
PRIORITY_OF = {"Critical": "P0", "High": "P1", "Normal": "P2", "Low": "P3"}
CLASSIFICATION_FIELDS = {"customer_name", "category", "severity", "sentiment", "summary", "affected_area", "signals"}


def load_json(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, OSError):
        pass

    ap = argparse.ArgumentParser(description="Validate a Support-Triage pipeline run.")
    ap.add_argument("--dir", default="output-examples", help="run folder relative to this script")
    out = (BASE / ap.parse_args().dir).resolve()
    print(f"Validating Support-Triage pipeline outputs in {out.name}/…\n")

    cls_p, reply_p, tkt_p = (out / n for n in ("classification.json", "customer-reply.md", "internal-ticket.json"))
    missing = [p.name for p in (cls_p, reply_p, tkt_p) if not p.exists()]
    if missing:
        print(f"  ✗ missing file(s): {', '.join(missing)}")
        return 1

    ok = True

    # 1. classification.json
    try:
        cls = load_json(cls_p)
    except json.JSONDecodeError as e:
        print(f"  ✗ classification.json is not valid JSON: {e}")
        return 1
    if set(cls) != CLASSIFICATION_FIELDS:
        print(f"  ✗ classification fields off: got {sorted(cls)}"); ok = False
    elif cls["category"] not in CATEGORIES or cls["severity"] not in SEVERITIES:
        print(f"  ✗ classification has invalid category/severity: {cls['category']} / {cls['severity']}"); ok = False
    else:
        print(f"  ✓ classification.json valid — {cls['category']} / {cls['severity']} / {cls['sentiment']}")

    # 2. customer-reply.md
    reply = reply_p.read_text(encoding="utf-8")
    name = str(cls.get("customer_name") or "").split()[0] if cls.get("customer_name") else ""
    if len(reply) < 200:
        print("  ✗ customer-reply.md looks too short"); ok = False
    elif name and name not in reply:
        print(f"  ✗ customer-reply.md doesn't address the customer by name ({name})"); ok = False
    else:
        print("  ✓ customer-reply.md present, substantive, and personalised")

    # 3. internal-ticket.json + chain integrity
    try:
        tkt = load_json(tkt_p)
    except json.JSONDecodeError as e:
        print(f"  ✗ internal-ticket.json is not valid JSON: {e}")
        return 1
    if tkt.get("category") == cls["category"] and tkt.get("severity") == cls["severity"]:
        print("  ✓ ticket category & severity mirror the classification — chain intact")
    else:
        print(f"  ✗ ticket drifted from classification: "
              f"{tkt.get('category')}/{tkt.get('severity')} vs {cls['category']}/{cls['severity']}"); ok = False
    if tkt.get("priority") == PRIORITY_OF.get(cls["severity"]):
        print(f"  ✓ ticket priority correct ({tkt.get('priority')} for {cls['severity']})")
    else:
        print(f"  ✗ ticket priority wrong: {tkt.get('priority')} (expected {PRIORITY_OF.get(cls['severity'])})"); ok = False

    print()
    print("PASS — pipeline outputs are consistent and chainable ✓" if ok else "FAIL — see issues above")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
