import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isMember, requireProjectMember } from "@/lib/auth-helpers";

type Params = { params: Promise<{ taskId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId } = await params;

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const member = await requireProjectMember(task.projectId, session.user.id);
  if (!isMember(member)) return member;

  const body = await req.json();
  const updated = await db.task.update({
    where: { id: taskId },
    data: {
      title: body.title,
      type: body.type,
      status: body.status,
      startDate: body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : undefined,
      dueDate: body.dueDate !== undefined ? (body.dueDate ? new Date(body.dueDate) : null) : undefined,
      description: body.description !== undefined ? body.description : undefined,
    },
    include: {
      assignees: { include: { user: { select: { id: true, name: true, image: true } } } },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId } = await params;

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const member = await requireProjectMember(task.projectId, session.user.id);
  if (!isMember(member)) return member;

  await db.task.delete({ where: { id: taskId } });
  return NextResponse.json({ ok: true });
}
