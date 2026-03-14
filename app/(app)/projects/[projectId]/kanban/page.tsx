import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { KanbanView } from "@/components/views/KanbanView";

export default async function KanbanPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;
  const sp = await searchParams;

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        include: {
          assignees: { include: { user: { select: { id: true, name: true, image: true } } } },
        },
        orderBy: { createdAt: "asc" },
      },
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
    },
  });

  if (!project) notFound();

  // Verify user is a member
  const isMember = project.members.some((m) => m.userId === session.user.id);
  if (!isMember) redirect("/dashboard");

  return <KanbanView project={project} initialAddStatus={sp.new ? "idea" : undefined} />;
}
