import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ShippedView } from "@/components/views/ShippedView";

export default async function ProjectShippedPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: { select: { id: true, title: true, type: true, status: true, dueDate: true } },
      members: { select: { userId: true } },
    },
  });

  if (!project) notFound();
  const isMember = project.members.some((m) => m.userId === session.user.id);
  if (!isMember) redirect("/dashboard");

  return <ShippedView projects={[project]} />;
}
