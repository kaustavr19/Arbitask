import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { KanbanView } from "@/components/views/KanbanView";

export default async function GlobalKanbanPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const memberships = await db.projectMember.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        include: {
          tasks: {
            include: {
              assignees: { include: { user: { select: { id: true, name: true, image: true } } } },
            },
            orderBy: { createdAt: "asc" },
          },
          members: { include: { user: { select: { id: true, name: true, image: true } } } },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  const projects = memberships.map((m) => m.project);

  return <KanbanView projects={projects} />;
}
