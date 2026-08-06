import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/tickets/:id/activity — add a free-text note to the ticket's log.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const b = await req.json().catch(() => null);
  const text = (b?.text || "").trim();
  if (!text) return NextResponse.json({ error: "Empty note" }, { status: 400 });

  const t = await prisma.ticket.findUnique({ where: { id: params.id } });
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.ticket.update({
    where: { id: params.id },
    data: { activity: { create: [{ text: `Note: ${text}` }] } },
    include: { activity: { orderBy: { at: "desc" } } },
  });
  return NextResponse.json(updated);
}
