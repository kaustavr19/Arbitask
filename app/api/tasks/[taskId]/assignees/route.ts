import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isMember, requireProjectMember } from "@/lib/auth-helpers";

type Params = { params: Promise<{ taskId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId } = await params;

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const member = await requireProjectMember(task.projectId, session.user.id);
  if (!isMember(member)) return member;

  const assignees = await db.taskAssignee.findMany({
    where: { taskId },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(assignees);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId } = await params;

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const member = await requireProjectMember(task.projectId, session.user.id);
  if (!isMember(member)) return member;

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Ensure user is a project member
  const targetMember = await db.projectMember.findUnique({
    where: { projectId_userId: { projectId: task.projectId, userId } },
  });
  if (!targetMember) return NextResponse.json({ error: "User is not a project member" }, { status: 400 });

  const assignee = await db.taskAssignee.upsert({
    where: { taskId_userId: { taskId, userId } },
    create: { taskId, userId },
    update: {},
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(assignee, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId } = await params;

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const member = await requireProjectMember(task.projectId, session.user.id);
  if (!isMember(member)) return member;

  const { userId } = await req.json();
  await db.taskAssignee.deleteMany({ where: { taskId, userId } });

  return NextResponse.json({ ok: true });
}
