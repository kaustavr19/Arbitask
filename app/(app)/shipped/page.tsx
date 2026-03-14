import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ShippedView } from "@/components/views/ShippedView";

export default async function ShippedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const memberships = await db.projectMember.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        include: {
          tasks: { select: { id: true, title: true, type: true, status: true, dueDate: true } },
        },
      },
    },
  });

  const projects = memberships.map((m) => m.project);

  return <ShippedView projects={projects} />;
}
