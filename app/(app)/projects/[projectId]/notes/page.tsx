import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotesView } from "@/components/views/NotesView";

export default async function ProjectNotesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;

  const [notes, project] = await Promise.all([
    db.note.findMany({
      where: { authorId: session.user!.id, projectId },
      orderBy: { createdAt: "desc" },
    }),
    db.project.findUnique({
      where: { id: projectId },
      include: { members: { select: { userId: true } } },
    }),
  ]);

  if (!project) notFound();
  const isMember = project.members.some((m) => m.userId === session.user!.id);
  if (!isMember) redirect("/dashboard");

  const projectInfo = [{ id: project.id, name: project.name, colorId: "rose" }];

  return <NotesView notes={notes} projects={projectInfo} defaultProjectId={projectId} />;
}
