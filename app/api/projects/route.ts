import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@/lib/constants";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const memberships = await db.projectMember.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        include: {
          tasks: { include: { assignees: { include: { user: { select: { id: true, name: true, image: true } } } } } },
          members: { include: { user: { select: { id: true, name: true, image: true } } } },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  return NextResponse.json(memberships.map((m) => m.project));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, colorId, status, priority, lead, startDate, targetDate } = body;

  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const project = await db.project.create({
    data: {
      name,
      description: description || null,
      colorId: colorId || "rose",
      status: status || "backlog",
      priority: priority || "no_priority",
      lead: lead || null,
      startDate: startDate ? new Date(startDate) : null,
      targetDate: targetDate ? new Date(targetDate) : null,
      ownerId: session.user.id,
      members: {
        create: { userId: session.user.id, role: Role.OWNER },
      },
    },
    include: {
      tasks: true,
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
    },
  });

  return NextResponse.json(project, { status: 201 });
}
