import { useState, useEffect } from "react";
import { BODY } from "../../styles/fonts";
import { TASK_TYPES, STATUSES } from "../../constants";
import { gid } from "../../utils/helpers";
import { Btn, Label, Modal } from "../ui";

export function TaskModal({ open, onClose, onSave, initialStatus = "idea", projectName = "" }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("dev");
  const [status, setStatus] = useState(initialStatus);
  const [sd, setSd] = useState("");
  const [dd, setDd] = useState("");

  useEffect(() => { setStatus(initialStatus); }, [initialStatus]);

  return (
    <Modal open={open} onClose={onClose} title={`Add task${projectName ? ` → ${projectName}` : ""}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <Label>Task title</Label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" autoFocus />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <Label>Type</Label>
            <select value={type} onChange={e => setType(e.target.value)}>
              {TASK_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><Label>Start</Label><input type="date" value={sd} onChange={e => setSd(e.target.value)} /></div>
          <div><Label>Due</Label><input type="date" value={dd} onChange={e => setDd(e.target.value)} /></div>
        </div>
        <Btn
          onClick={() => {
            if (title.trim()) {
              onSave({ id: gid(), title, type, status, startDate: sd, dueDate: dd, description: "", notes: "" });
              setTitle(""); setType("dev"); setSd(""); setDd(""); onClose();
            }
          }}
          disabled={!title.trim()}
          size="lg"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Add Task
        </Btn>
      </div>
    </Modal>
  );
}
