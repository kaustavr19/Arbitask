import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TimelineView } from "@/components/views/TimelineView";

export default async function TimelinePage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        include: {
          assignees: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
        },
      },
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  if (!project) notFound();

  const isMember = project.members.some((m) => m.userId === session.user!.id);
  if (!isMember) redirect("/dashboard");

  return <TimelineView project={project} />;
}
