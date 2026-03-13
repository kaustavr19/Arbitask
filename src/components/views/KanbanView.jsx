import { useState } from "react";
import { DISPLAY, BODY } from "../../styles/fonts";
import { STATUSES, TASK_TYPES, PROJECT_COLORS } from "../../constants";
import { stC } from "../../utils/theme";
import { fmtDate } from "../../utils/helpers";
import { Badge, Empty } from "../ui";

export function KanbanView({ project, onUpdateTask, onAddTask, onDeleteTask, onOpenTask }) {
  const [drag, setDrag] = useState(null);
  if (!project) return <Empty icon="📂" title="Select a project" sub="Pick a project from the sidebar" />;
  const pc = PROJECT_COLORS.find(c => c.id === project.colorId) || PROJECT_COLORS[0];

  return (
    <div style={{ display: "flex", gap: 14, overflowX: "auto", height: "100%", minHeight: 0 }}>
      {STATUSES.filter(s => s.id !== "archived").map(status => {
        const tasks = project.tasks.filter(t => t.status === status.id);
        const sc = stC(status.id);
        return (
          <div
            key={status.id}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = "var(--glass)"; }}
            onDragLeave={e => { e.currentTarget.style.background = "transparent"; }}
            onDrop={e => { e.currentTarget.style.background = "transparent"; if (drag) { onUpdateTask(project.id, drag, { status: status.id }); setDrag(null); } }}
            style={{ flex: "1 0 220px", maxWidth: 300, display: "flex", flexDirection: "column", borderRadius: 14, transition: "background .2s" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 4px 12px" }}>
              <span style={{ fontSize: 15 }}>{status.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: DISPLAY }}>{status.label}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: sc, background: sc + "18", padding: "2px 7px", borderRadius: 10 }}>{tasks.length}</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, overflowY: "auto" }}>
              {tasks.map(task => {
                const tt = TASK_TYPES.find(t => t.id === task.type) || TASK_TYPES[5];
                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDrag(task.id)}
                    onDragEnd={() => setDrag(null)}
                    onClick={() => onOpenTask(task.id)}
                    style={{ padding: 13, borderRadius: 11, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", transition: "all .2s", opacity: drag === task.id ? .4 : 1, borderLeft: `3px solid ${pc.hex}` }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px var(--shadow)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, flex: 1 }}>{task.title}</span>
                      <button onClick={e => { e.stopPropagation(); onDeleteTask(project.id, task.id); }} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 11, opacity: .4, padding: "2px" }}>✕</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                      <Badge color={pc.hex} style={{ fontSize: 10 }}>{tt.icon} {tt.label}</Badge>
                      {task.dueDate && <span style={{ fontSize: 10, color: "var(--text3)" }}>📅 {fmtDate(task.dueDate)}</span>}
                      {task.description && <span style={{ fontSize: 10, color: "var(--text3)" }}>📝</span>}
                    </div>
                  </div>
                );
              })}
              <button onClick={() => onAddTask(project.id, status.id)} style={{ padding: 9, borderRadius: 9, border: "1px dashed var(--border2)", background: "transparent", color: "var(--text3)", cursor: "pointer", fontSize: 12, fontFamily: BODY, fontWeight: 500 }}>
                + Add task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
