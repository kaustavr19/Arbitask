import { STATUSES, TASK_TYPES, PROJECT_COLORS } from "../../constants";
import { stC } from "../../utils/theme";
import { fmtDate } from "../../utils/helpers";
import { Badge, Empty } from "../ui";

export function ListView({ project, onUpdateTask, onDeleteTask, onOpenTask }) {
  if (!project) return <Empty icon="📂" title="Select a project" sub="Pick a project from the sidebar" />;
  const pc = PROJECT_COLORS.find(c => c.id === project.colorId) || PROJECT_COLORS[0];
  const sorted = [...project.tasks].sort((a, b) => {
    const o = ["in_progress", "blocked", "planned", "idea", "done", "archived"];
    return o.indexOf(a.status) - o.indexOf(b.status);
  });
  if (!sorted.length) return <Empty icon="📝" title="No tasks yet" sub="Add tasks from Kanban view" />;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 120px 90px 90px 36px", gap: 10, padding: "6px 14px", fontSize: 10, fontWeight: 700, color: "var(--text3)", letterSpacing: .5, textTransform: "uppercase" }}>
        <span>Task</span><span>Type</span><span>Status</span><span>Start</span><span>Due</span><span></span>
      </div>
      {sorted.map(task => {
        const tt = TASK_TYPES.find(t => t.id === task.type) || TASK_TYPES[5];
        const sc = stC(task.status);
        return (
          <div
            key={task.id}
            onClick={() => onOpenTask(task.id)}
            style={{ display: "grid", gridTemplateColumns: "1fr 90px 120px 90px 90px 36px", gap: 10, alignItems: "center", padding: "11px 14px", borderRadius: 10, marginBottom: 3, background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `3px solid ${pc.hex}`, cursor: "pointer" }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              {task.title}
              {task.description && <span style={{ fontSize: 10, color: "var(--text3)" }}>📝</span>}
            </span>
            <Badge color={pc.hex} style={{ fontSize: 10 }}>{tt.icon} {tt.label}</Badge>
            <select
              value={task.status}
              onClick={e => e.stopPropagation()}
              onChange={e => onUpdateTask(project.id, task.id, { status: e.target.value })}
              style={{ padding: "4px 22px 4px 7px", fontSize: 11, borderRadius: 6, background: sc + "14", color: sc, border: `1px solid ${sc}28` }}
            >
              {STATUSES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
            </select>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(task.startDate) || "—"}</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(task.dueDate) || "—"}</span>
            <button onClick={e => { e.stopPropagation(); onDeleteTask(project.id, task.id); }} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 11, opacity: .4 }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}
