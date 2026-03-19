import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PROJECT_STATUSES, PROJECT_PRIORITIES, PROJECT_ICONS } from "@/lib/constants";

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500, minWidth: 80, flexShrink: 0, paddingTop: 1 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{children}</div>
    </div>
  );
}

export default async function OverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
      tasks: { select: { id: true, status: true } },
    },
  });

  if (!project) notFound();

  const isMember = project.members.some((m) => m.userId === session.user!.id);
  if (!isMember) redirect("/dashboard");

  const icon = PROJECT_ICONS.find((i) => i.id === project.colorId)?.emoji ?? "📦";
  const statusInfo = PROJECT_STATUSES.find((s) => s.id === (project.status || "backlog")) ?? PROJECT_STATUSES[0];
  const priorityInfo = PROJECT_PRIORITIES.find((p) => p.id === (project.priority || "no_priority")) ?? PROJECT_PRIORITIES[0];

  const doneTasks = project.tasks.filter((t) => t.status === "done").length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? doneTasks / totalTasks : 0;

  const fmt = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", maxWidth: 1100 }}>
      {/* ── Main content ─────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Project header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 28 }}>
          <div
            style={{ width: 60, height: 60, borderRadius: 14, background: "var(--surface2)", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}
          >
            {icon}
          </div>
          <div style={{ paddingTop: 2 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: "var(--text)", marginBottom: 6 }}>
              {project.name}
            </h1>
            {project.description && (
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, maxWidth: 600 }}>{project.description}</p>
            )}
          </div>
        </div>

        {/* Progress card */}
        {totalTasks > 0 && (
          <div
            style={{ marginBottom: 20, padding: "18px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Progress</span>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>{doneTasks} of {totalTasks} tasks done</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "var(--surface3)" }}>
              <div
                style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 3, background: "var(--accent)", transition: "width .6s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {[
                { label: "Done", count: doneTasks, color: "#22C55E" },
                { label: "In progress", count: project.tasks.filter((t) => t.status === "in_progress").length, color: "var(--accent)" },
                { label: "Remaining", count: totalTasks - doneTasks - project.tasks.filter((t) => t.status === "in_progress").length, color: "var(--text3)" },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>{count} {label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description / brief */}
        <div
          style={{ padding: "20px 22px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.8, color: "var(--text3)", textTransform: "uppercase", marginBottom: 14 }}>
            Brief
          </div>
          {project.description ? (
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7 }}>{project.description}</p>
          ) : (
            <p style={{ fontSize: 14, color: "var(--text3)", fontStyle: "italic" }}>
              Write a project brief, goals, or collect ideas here. Edit the project to add a description.
            </p>
          )}
        </div>
      </div>

      {/* ── Properties panel ─────────────────────── */}
      <div style={{ width: 256, flexShrink: 0 }}>
        <div
          style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--text3)", textTransform: "uppercase", marginBottom: 18 }}>
            Properties
          </div>

          <PropRow label="Status">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusInfo.color, flexShrink: 0, display: "inline-block" }} />
              {statusInfo.label}
            </div>
          </PropRow>

          <PropRow label="Priority">
            {priorityInfo.icon} {priorityInfo.label}
          </PropRow>

          {fmt(project.startDate) && (
            <PropRow label="Start">{fmt(project.startDate)}</PropRow>
          )}
          {fmt(project.targetDate) && (
            <PropRow label="Target">{fmt(project.targetDate)}</PropRow>
          )}

          <PropRow label="Members">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {project.members.map((m) => (
                <div
                  key={m.id}
                  title={`${m.user.name || "?"} (${m.role})`}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  {m.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.user.image} alt={m.user.name || ""} style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--accent-text)" }}>
                      {m.user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PropRow>

          <PropRow label="Created">
            {fmt(project.createdAt)}
          </PropRow>
        </div>
      </div>
    </div>
  );
}
