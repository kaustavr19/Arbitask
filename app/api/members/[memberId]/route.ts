import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isMember, requireProjectAdmin } from "@/lib/auth-helpers";
import { Role } from "@/lib/constants";

type Params = { params: Promise<{ memberId: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { memberId } = await params;

  const target = await db.projectMember.findUnique({ where: { id: memberId } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Can't remove owner
  if (target.role === Role.OWNER)
    return NextResponse.json({ error: "Cannot remove project owner" }, { status: 400 });

  // Allow self-removal OR admin removal
  if (target.userId !== session.user.id) {
    const adminCheck = await requireProjectAdmin(target.projectId, session.user.id);
    if (!isMember(adminCheck)) return adminCheck;
  }

  await db.projectMember.delete({ where: { id: memberId } });
  return NextResponse.json({ ok: true });
}
