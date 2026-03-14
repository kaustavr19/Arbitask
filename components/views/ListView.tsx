"use client";

import { useRouter } from "next/navigation";
import { STATUSES, TASK_TYPES, PROJECT_COLORS } from "@/lib/constants";
import { stC } from "@/lib/theme";
import { fmtDate } from "@/lib/helpers";
import { Badge, Empty } from "@/components/ui";
import { useState } from "react";
import { TaskDetailModal } from "@/components/modals/TaskDetailModal";

type TaskUser = { id: string; name: string | null; image: string | null };
type Member = { id: string; userId: string; role: string; user: TaskUser };
type Task = {
  id: string;
  title: string;
  type: string;
  status: string;
  startDate: Date | null;
  dueDate: Date | null;
  description: string | null;
  createdAt: Date;
  projectId: string;
  assignees: Array<{ user: TaskUser }>;
};
type Project = {
  id: string;
  name: string;
  colorId: string;
  tasks: Task[];
  members: Member[];
};

interface ListViewProps {
  project?: Project;
  projects?: Project[];
}

export function ListView({ project, projects }: ListViewProps) {
  const router = useRouter();
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [filterProjectId, setFilterProjectId] = useState<string>("");

  const isGlobal = !!projects;
  const allProjects = projects || (project ? [project] : []);
  const filteredProjects = filterProjectId
    ? allProjects.filter((p) => p.id === filterProjectId)
    : allProjects;

  const allTasksWithProject = filteredProjects.flatMap((p) =>
    p.tasks.map((t) => ({ ...t, _project: p }))
  );

  const STATUS_ORDER = ["in_progress", "blocked", "planned", "idea", "done", "archived"];
  const sorted = [...allTasksWithProject].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
  );

  const detailEntry = sorted.find((t) => t.id === detailTaskId);
  const detailTask = detailEntry
    ? (({ _project: _p, ...rest }) => rest as Task)(detailEntry)
    : null;
  const detailProject = detailEntry?._project || null;

  function getProjectColor(projectId: string) {
    const p = allProjects.find((p) => p.id === projectId);
    return PROJECT_COLORS.find((c) => c.id === (p?.colorId || "rose")) || PROJECT_COLORS[0];
  }

  async function updateTask(taskId: string, updates: Record<string, unknown>) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    router.refresh();
  }

  async function deleteTask(taskId: string) {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleAssigneeChange(taskId: string, userId: string, selected: boolean) {
    if (selected) {
      await fetch(`/api/tasks/${taskId}/assignees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } else {
      await fetch(`/api/tasks/${taskId}/assignees`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    }
    router.refresh();
  }

  if (!sorted.length) return <Empty icon="📝" title="No tasks yet" sub="Add tasks from Kanban view" />;

  const gridCols = isGlobal
    ? "1fr 110px 90px 120px 90px 90px 36px"
    : "1fr 90px 120px 90px 90px 36px";

  return (
    <>
      {isGlobal && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>Filter by project</span>
          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            style={{ fontSize: 12, padding: "5px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--text)", width: "auto", maxWidth: 200 }}
          >
            <option value="">All projects</option>
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "6px 14px", fontSize: 10, fontWeight: 700, color: "var(--text3)", letterSpacing: 0.5, textTransform: "uppercase" }}>
          <span>Task</span>
          {isGlobal && <span>Project</span>}
          <span>Type</span><span>Status</span><span>Start</span><span>Due</span><span />
        </div>
        {sorted.map((task) => {
          const tt = TASK_TYPES.find((t) => t.id === task.type) || TASK_TYPES[5];
          const sc = stC(task.status);
          const pc = getProjectColor(task.projectId);
          return (
            <div
              key={task.id}
              onClick={() => setDetailTaskId(task.id)}
              style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "center", padding: "11px 14px", borderRadius: 10, marginBottom: 3, background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `3px solid ${pc.hex}`, cursor: "pointer" }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, color: "var(--text)" }}>
                {task.title}
                {task.description && <span style={{ fontSize: 10, color: "var(--text3)" }}>📝</span>}
              </span>
              {isGlobal && (
                <span style={{ fontSize: 10, color: pc.hex, background: pc.hex + "18", padding: "2px 7px", borderRadius: 6, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {task._project.name}
                </span>
              )}
              <Badge color={pc.hex} style={{ fontSize: 10 }}>{tt.icon} {tt.label}</Badge>
              <select
                value={task.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateTask(task.id, { status: e.target.value })}
                style={{ padding: "4px 22px 4px 7px", fontSize: 11, borderRadius: 6, background: sc + "14", color: sc, border: `1px solid ${sc}28` }}
              >
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
              </select>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(task.startDate) || "—"}</span>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(task.dueDate) || "—"}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 11, opacity: 0.4 }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {detailProject && (
        <TaskDetailModal
          open={!!detailTaskId}
          onClose={() => setDetailTaskId(null)}
          task={detailTask}
          project={detailProject}
          onUpdateTask={updateTask}
          onAssigneeChange={handleAssigneeChange}
        />
      )}
    </>
  );
}
