import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isMember, requireProjectAdmin } from "@/lib/auth-helpers";
import { Role } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { projectId, role } = body;

  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const member = await requireProjectAdmin(projectId, session.user.id);
  if (!isMember(member)) return member;

  // Expire in 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invite = await db.invite.create({
    data: {
      projectId,
      senderId: session.user.id,
      role: (role as Role) || Role.MEMBER,
      expiresAt,
    },
  });

  return NextResponse.json({ token: invite.token }, { status: 201 });
}
