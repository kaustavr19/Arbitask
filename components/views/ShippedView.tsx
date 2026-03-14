import { DISPLAY } from "@/lib/fonts";
import { TASK_TYPES, PROJECT_COLORS } from "@/lib/constants";
import { fmtDate } from "@/lib/helpers";
import { Badge, Empty } from "@/components/ui";

type Task = {
  id: string;
  title: string;
  type: string;
  status: string;
  dueDate: Date | null;
};

type Project = {
  id: string;
  name: string;
  colorId: string;
  tasks: Task[];
};

interface ShippedViewProps {
  projects: Project[];
}

export function ShippedView({ projects }: ShippedViewProps) {
  const shipped = projects
    .flatMap((p) =>
      p.tasks
        .filter((t) => t.status === "done")
        .map((t) => ({ ...t, pName: p.name, pColorId: p.colorId }))
    )
    .sort((a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime());

  const totalDone = shipped.length;
  const totalTasks = projects.reduce((s, p) => s + p.tasks.length, 0);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        {[
          { l: "Shipped", v: totalDone, i: "🚀", c: "var(--st-done)" },
          { l: "Total", v: totalTasks, i: "📋", c: "var(--st-planned)" },
          { l: "Projects", v: projects.length, i: "📂", c: "var(--accent)" },
          { l: "Done %", v: totalTasks ? Math.round((totalDone / totalTasks) * 100) + "%" : "0%", i: "📊", c: "var(--st-idea)" },
        ].map((s, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 13, background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.i}</div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: DISPLAY, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {!shipped.length ? (
        <Empty icon="🎯" title="Nothing shipped yet" sub="Complete tasks to see them here" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {shipped.map((task) => {
            const tt = TASK_TYPES.find((t) => t.id === task.type) || TASK_TYPES[5];
            const tpc = PROJECT_COLORS.find((c) => c.id === task.pColorId) || PROJECT_COLORS[0];
            return (
              <div
                key={task.id}
                style={{ padding: "12px 16px", borderRadius: 11, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, borderLeft: `3px solid ${tpc.hex}` }}
              >
                <div style={{ fontSize: 18 }}>✅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{task.title}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge color={tpc.hex} style={{ fontSize: 10 }}>{task.pName}</Badge>
                    <Badge color={tpc.hex} style={{ fontSize: 10 }}>{tt.icon} {tt.label}</Badge>
                  </div>
                </div>
                {task.dueDate && <span style={{ fontSize: 11, color: "var(--text3)" }}>{fmtDate(task.dueDate)}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
