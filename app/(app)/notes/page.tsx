import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotesView } from "@/components/views/NotesView";

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [notes, memberships] = await Promise.all([
    db.note.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    db.projectMember.findMany({
      where: { userId: session.user.id },
      include: { project: { select: { id: true, name: true, colorId: true } } },
    }),
  ]);

  const projects = memberships.map((m) => m.project);

  return <NotesView notes={notes} projects={projects} />;
}
