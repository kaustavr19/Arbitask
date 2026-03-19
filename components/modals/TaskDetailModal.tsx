"use client";

import { useState, useEffect, useRef } from "react";
import { TASK_TYPES, STATUSES } from "@/lib/constants";
import { renderMd } from "@/lib/markdown";
import { Btn, AssigneeSelector } from "@/components/ui";
import { FormattingToolbar } from "@/components/FormattingToolbar";

type TaskUser = { id: string; name: string | null; image: string | null };
type TaskAssignee = { user: TaskUser };
type Member = { id: string; userId: string; role: string; user: TaskUser };

interface Task {
  id: string;
  title: string;
  type: string;
  status: string;
  startDate: Date | null;
  dueDate: Date | null;
  description: string | null;
  assignees: TaskAssignee[];
}

interface Project {
  id: string;
  colorId: string;
  members: Member[];
}

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  project: Project | null;
  onUpdateTask: (taskId: string, updates: Record<string, unknown>) => Promise<void>;
  onAssigneeChange: (taskId: string, userId: string, selected: boolean) => Promise<void>;
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500, minWidth: 72, paddingTop: 1, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

export function TaskDetailModal({ open, onClose, task, project, onUpdateTask, onAssigneeChange }: TaskDetailModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("dev");
  const [status, setStatus] = useState("idea");
  const [sd, setSd] = useState("");
  const [dd, setDd] = useState("");
  const [tab, setTab] = useState("write");
  const [saving, setSaving] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDesc(task.description || "");
      setType(task.type || "dev");
      setStatus(task.status || "idea");
      setSd(task.startDate ? new Date(task.startDate).toISOString().split("T")[0] : "");
      setDd(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
      setTab("write");
    }
  }, [task]);

  if (!open || !task || !project) return null;

  const assignedUserIds = task.assignees.map((a) => a.user.id);
  const taskType = TASK_TYPES.find((t) => t.id === type);

  const propSelect: React.CSSProperties = {
    fontSize: 13,
    background: "transparent",
    border: "none",
    padding: 0,
    color: "var(--text)",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="fi"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--surface-modal)", border: "1px solid var(--border-modal)", borderRadius: 14, width: 880, maxWidth: "97vw", height: "82vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 48px var(--shadow-lg)", overflow: "hidden" }}
      >
        {/* ── Top bar ───────────────────────────────── */}
        <div style={{ padding: "13px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--surface)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, border: "1px solid var(--border2)", background: "var(--surface2)", color: "var(--text3)" }}
            >
              {taskType?.icon} {taskType?.label || "Task"}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "var(--surface2)", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 13, padding: "5px 9px", borderRadius: 6, fontWeight: 500, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* ── Two-column body ───────────────────────── */}
        <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
          {/* Left: title + description */}
          <div style={{ flex: 1, minWidth: 0, padding: "24px 28px", overflowY: "auto", borderRight: "1px solid var(--border)" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: 21, fontWeight: 700, letterSpacing: -0.4, background: "transparent", border: "none", borderRadius: 0, padding: "0 0 14px 0", width: "100%", color: "var(--text)", borderBottom: "1px solid var(--border2)", marginBottom: 22 }}
              placeholder="Task title..."
            />

            {/* Description header with write/preview toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.8 }}>Description</span>
              <div style={{ display: "flex", gap: 2, background: "var(--surface2)", borderRadius: 8, padding: 2 }}>
                {(["write", "preview"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: tab === t ? "var(--accent-soft)" : "transparent", color: tab === t ? "var(--accent-text)" : "var(--text3)" }}
                  >
                    {t === "write" ? "Write" : "Preview"}
                  </button>
                ))}
              </div>
            </div>

            {tab === "write" ? (
              <div>
                <FormattingToolbar textareaRef={taRef} value={desc} onChange={setDesc} />
                <textarea
                  ref={taRef}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={14}
                  style={{ borderRadius: "0 0 10px 10px", borderTop: "1px solid var(--border2)" }}
                  placeholder="Add a description, acceptance criteria, or notes..."
                />
              </div>
            ) : (
              <div
                style={{ minHeight: 240, padding: 16, borderRadius: 10, border: "1px solid var(--border2)", background: "var(--surface2)", fontSize: 14, lineHeight: 1.8, color: "var(--text2)" }}
              >
                {desc ? (
                  <div dangerouslySetInnerHTML={{ __html: renderMd(desc) }} />
                ) : (
                  <span style={{ color: "var(--text3)", fontStyle: "italic" }}>Nothing here yet...</span>
                )}
              </div>
            )}
          </div>

          {/* Right: properties panel */}
          <div style={{ width: 252, flexShrink: 0, padding: "20px 18px", overflowY: "auto", background: "var(--surface2)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--text3)", textTransform: "uppercase", marginBottom: 18 }}>
              Properties
            </div>

            <PropRow label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={propSelect}>
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
              </select>
            </PropRow>

            <PropRow label="Type">
              <select value={type} onChange={(e) => setType(e.target.value)} style={propSelect}>
                {TASK_TYPES.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
            </PropRow>

            {project.members.length > 0 && (
              <PropRow label="Assignees">
                <AssigneeSelector
                  members={project.members}
                  selectedUserIds={assignedUserIds}
                  onChange={(userId, selected) => onAssigneeChange(task.id, userId, selected)}
                />
              </PropRow>
            )}

            <PropRow label="Start date">
              <input
                type="date"
                value={sd}
                onChange={(e) => setSd(e.target.value)}
                style={{ ...propSelect, fontSize: 12 }}
              />
            </PropRow>

            <PropRow label="Due date">
              <input
                type="date"
                value={dd}
                onChange={(e) => setDd(e.target.value)}
                style={{ ...propSelect, fontSize: 12 }}
              />
            </PropRow>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────── */}
        <div style={{ padding: "13px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 8, background: "var(--surface)", flexShrink: 0 }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn
            onClick={async () => {
              if (saving) return;
              setSaving(true);
              await onUpdateTask(task.id, { title, description: desc, type, status, startDate: sd || null, dueDate: dd || null });
              setSaving(false);
              onClose();
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
