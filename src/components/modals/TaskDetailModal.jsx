import { useState, useEffect, useRef } from "react";
import { DISPLAY, BODY, MONO } from "../../styles/fonts";
import { TASK_TYPES, STATUSES, PROJECT_COLORS } from "../../constants";
import { renderMd } from "../../utils/markdown";
import { Btn, Label, Modal } from "../ui";
import { FormattingToolbar } from "../FormattingToolbar";

export function TaskDetailModal({ open, onClose, task, project, onUpdateTask }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("dev");
  const [status, setStatus] = useState("idea");
  const [sd, setSd] = useState("");
  const [dd, setDd] = useState("");
  const [tab, setTab] = useState("write");
  const taRef = useRef(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || ""); setDesc(task.description || ""); setType(task.type || "dev");
      setStatus(task.status || "idea"); setSd(task.startDate || ""); setDd(task.dueDate || "");
      setTab("write");
    }
  }, [task]);

  if (!open || !task || !project) return null;
  const pc = PROJECT_COLORS.find(c => c.id === project.colorId) || PROJECT_COLORS[0];

  return (
    <Modal open={open} onClose={onClose} title="Task Details" wide>
      <div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ fontSize: 22, fontWeight: 800, fontFamily: DISPLAY, background: "transparent", border: "none", borderRadius: 0, padding: "0 0 12px 0", borderBottom: `2px solid ${pc.hex}`, marginBottom: 20, width: "100%" }}
          placeholder="Task title..."
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div>
            <Label>Type</Label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ fontSize: 13 }}>
              {TASK_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ fontSize: 13 }}>
              {STATUSES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
            </select>
          </div>
          <div><Label>Start</Label><input type="date" value={sd} onChange={e => setSd(e.target.value)} style={{ fontSize: 13 }} /></div>
          <div><Label>Due</Label><input type="date" value={dd} onChange={e => setDd(e.target.value)} style={{ fontSize: 13 }} /></div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <Label>Description</Label>
            <div style={{ display: "flex", gap: 2, background: "var(--surface2)", borderRadius: 8, padding: 2 }}>
              {["write", "preview"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: BODY, background: tab === t ? "var(--accent-soft)" : "transparent", color: tab === t ? "var(--accent-text)" : "var(--text3)" }}>
                  {t === "write" ? "Write" : "Preview"}
                </button>
              ))}
            </div>
          </div>
          {tab === "write" ? (
            <div>
              <FormattingToolbar textareaRef={taRef} value={desc} onChange={setDesc} />
              <textarea ref={taRef} value={desc} onChange={e => setDesc(e.target.value)} rows={10} style={{ borderRadius: "0 0 10px 10px", borderTop: "1px solid var(--border2)" }} placeholder="Add a description..." />
            </div>
          ) : (
            <div style={{ minHeight: 200, padding: 16, borderRadius: 10, border: "1px solid var(--border2)", background: "var(--surface2)", fontSize: 14, lineHeight: 1.8, color: "var(--text2)" }}>
              {desc ? <div dangerouslySetInnerHTML={{ __html: renderMd(desc) }} /> : <span style={{ color: "var(--text3)", fontStyle: "italic" }}>Nothing here yet...</span>}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => { onUpdateTask(project.id, task.id, { title, description: desc, type, status, startDate: sd, dueDate: dd }); onClose(); }}>
            Save Changes
          </Btn>
        </div>
      </div>
    </Modal>
  );
}
