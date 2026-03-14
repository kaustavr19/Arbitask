import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TimelineView } from "@/components/views/TimelineView";

export default async function GlobalTimelinePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const memberships = await db.projectMember.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        include: {
          tasks: {
            select: {
              id: true,
              title: true,
              status: true,
              startDate: true,
              dueDate: true,
              projectId: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  const projects = memberships.map((m) => m.project);

  return <TimelineView projects={projects} />;
}
