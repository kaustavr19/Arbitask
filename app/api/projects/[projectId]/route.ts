import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isMember, requireProjectAdmin } from "@/lib/auth-helpers";
import { Role } from "@/lib/constants";

type Params = { params: Promise<{ projectId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;

  const member = await requireProjectAdmin(projectId, session.user.id);
  if (!isMember(member)) return member;

  const body = await req.json();
  const project = await db.project.update({
    where: { id: projectId },
    data: {
      name: body.name,
      description: body.description,
      colorId: body.colorId,
    },
  });

  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;

  // Only owner can delete
  const member = await db.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });
  if (!member || member.role !== Role.OWNER)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.project.delete({ where: { id: projectId } });
  return NextResponse.json({ ok: true });
}
