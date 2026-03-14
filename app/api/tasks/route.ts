import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isMember, requireProjectMember } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { projectId, title, type, status, startDate, dueDate, description } = body;

  if (!projectId || !title) return NextResponse.json({ error: "projectId and title required" }, { status: 400 });

  const member = await requireProjectMember(projectId, session.user.id);
  if (!isMember(member)) return member;

  const task = await db.task.create({
    data: {
      projectId,
      title,
      type: type || "dev",
      status: status || "idea",
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      description: description || null,
    },
    include: {
      assignees: { include: { user: { select: { id: true, name: true, image: true } } } },
    },
  });

  return NextResponse.json(task, { status: 201 });
}
