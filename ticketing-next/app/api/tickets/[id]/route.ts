import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATUSES, PRIORITIES } from "@/lib/types";

export const dynamic = "force-dynamic";

// PATCH /api/tickets/:id — change status, owner and/or priority; each logs an activity line.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const t = await prisma.ticket.findUnique({ where: { id: params.id } });
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  const logs: string[] = [];

  if (typeof b.status === "string" && b.status !== t.status) {
    if (!STATUSES.includes(b.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    data.status = b.status;
    // Picking up assigns the acting agent if a name is supplied and none is set.
    if (b.status === "Picked up" && !t.owner && b.owner) { data.owner = b.owner; logs.push(`Picked up by ${b.owner}`); }
    else logs.push(b.status === "In progress" && (t.status === "Resolved" || t.status === "Closed") ? "Reopened" : `Status → ${b.status}`);
  }
  if (b.owner !== undefined && b.owner !== t.owner && !(data.owner)) {
    data.owner = b.owner || null;
    logs.push(b.owner ? `Reassigned to ${b.owner}` : "Unassigned");
  }
  if (typeof b.priority === "string" && b.priority !== t.priority) {
    if (!PRIORITIES.includes(b.priority)) return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    data.priority = b.priority;
    logs.push(`Priority → ${b.priority}`);
  }

  if (Object.keys(data).length === 0) {
    const cur = await prisma.ticket.findUnique({ where: { id: params.id }, include: { activity: { orderBy: { at: "desc" } } } });
    return NextResponse.json(cur);
  }

  const updated = await prisma.ticket.update({
    where: { id: params.id },
    data: { ...data, activity: { create: logs.map((text) => ({ text })) } },
    include: { activity: { orderBy: { at: "desc" } } },
  });
  return NextResponse.json(updated);
}
