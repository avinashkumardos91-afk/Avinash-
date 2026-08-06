import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/tickets — all tickets, newest first, with activity (newest first).
export async function GET() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: { activity: { orderBy: { at: "desc" } } },
  });
  return NextResponse.json(tickets);
}

// POST /api/tickets — raise a ticket.
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !b.title?.trim() || !b.requester?.trim()) {
    return NextResponse.json({ error: "Title and requester are required." }, { status: 400 });
  }
  const count = await prisma.ticket.count();
  const ref = `TKT-${1042 + count}`;
  const ticket = await prisma.ticket.create({
    data: {
      ref,
      title: b.title.trim(),
      description: (b.description || "").trim(),
      requester: b.requester.trim(),
      category: b.category || "Other",
      priority: b.priority || "Normal",
      region: b.region || "Europe",
      language: b.language || "English",
      status: "Raised",
      activity: { create: [{ text: `Ticket raised by ${b.requester.trim()} (${b.region || "—"})` }] },
    },
    include: { activity: { orderBy: { at: "desc" } } },
  });
  return NextResponse.json(ticket, { status: 201 });
}
