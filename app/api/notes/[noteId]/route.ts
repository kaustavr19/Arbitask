import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ noteId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { noteId } = await params;

  const note = await db.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const updated = await db.note.update({
    where: { id: noteId },
    data: {
      title: body.title,
      content: body.content,
      projectId: body.projectId !== undefined ? body.projectId : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { noteId } = await params;

  const note = await db.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.note.delete({ where: { id: noteId } });
  return NextResponse.json({ ok: true });
}
