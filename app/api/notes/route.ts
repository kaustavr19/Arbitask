import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projectId = req.nextUrl.searchParams.get("projectId");

  const notes = await db.note.findMany({
    where: {
      authorId: session.user.id,
      ...(projectId ? { projectId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, content, projectId } = body;

  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const note = await db.note.create({
    data: {
      title,
      content: content || "",
      projectId: projectId || null,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(note, { status: 201 });
}
