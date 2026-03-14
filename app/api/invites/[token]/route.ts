import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { InviteStatus } from "@/lib/constants";

type Params = { params: Promise<{ token: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;

  const invite = await db.invite.findUnique({
    where: { token },
    include: { project: { select: { id: true, name: true, colorId: true } } },
  });

  if (!invite) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  if (invite.status !== InviteStatus.PENDING || invite.expiresAt < new Date())
    return NextResponse.json({ error: "Invite expired or already used" }, { status: 410 });

  return NextResponse.json({
    projectId: invite.projectId,
    projectName: invite.project.name,
    role: invite.role,
    expiresAt: invite.expiresAt,
  });
}

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { token } = await params;

  const invite = await db.invite.findUnique({ where: { token } });
  if (!invite) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  if (invite.status !== InviteStatus.PENDING || invite.expiresAt < new Date())
    return NextResponse.json({ error: "Invite expired or already used" }, { status: 410 });

  const userId = session.user.id;

  // Check if already a member
  const existing = await db.projectMember.findUnique({
    where: { projectId_userId: { projectId: invite.projectId, userId } },
  });

  if (!existing) {
    await db.projectMember.create({
      data: {
        projectId: invite.projectId,
        userId,
        role: invite.role,
      },
    });
  }

  await db.invite.update({
    where: { token },
    data: { status: InviteStatus.ACCEPTED },
  });

  return NextResponse.json({ projectId: invite.projectId });
}
