import { useState, useMemo } from "react";
import { CSS } from "./styles/fonts";
import { ATMOSPHERES } from "./constants";
import { INIT_PROJECTS, INIT_NOTES } from "./data/initialData";
import { buildThemeVars } from "./utils/theme";
import { calcStats } from "./utils/gamification";
import { gid } from "./utils/helpers";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/views/DashboardView";
import { KanbanView } from "./components/views/KanbanView";
import { ListView } from "./components/views/ListView";
import { TimelineView } from "./components/views/TimelineView";
import { NotesView } from "./components/views/NotesView";
import { ShippedView } from "./components/views/ShippedView";
import { ProjectModal } from "./components/modals/ProjectModal";
import { TaskModal } from "./components/modals/TaskModal";
import { TaskDetailModal } from "./components/modals/TaskDetailModal";

export default function App() {
  const [projects, setProjects] = useState(INIT_PROJECTS);
  const [notes, setNotes] = useState(INIT_NOTES);
  const [apId, setApId] = useState(INIT_PROJECTS[0]?.id);
  const [view, setView] = useState("dashboard");
  const [showNP, setShowNP] = useState(false);
  const [showNT, setShowNT] = useState(false);
  const [nts, setNts] = useState("idea");
  const [mode, setMode] = useState("dark");
  const [atm, setAtm] = useState("ocean");
  const [detailTaskId, setDetailTaskId] = useState(null);

  const ap = projects.find(p => p.id === apId);
  const pcId = ap?.colorId || "rose";
  const tv = useMemo(() => buildThemeVars(mode, atm, pcId), [mode, atm, pcId]);
  const atmObj = ATMOSPHERES.find(a => a.id === atm) || ATMOSPHERES[0];
  const detailTask = ap ? ap.tasks.find(t => t.id === detailTaskId) : null;
  const stats = useMemo(() => calcStats(projects, notes), [projects, notes]);

  const uTask = (pid, tid, u) => setProjects(ps => ps.map(p => p.id === pid ? { ...p, tasks: p.tasks.map(t => t.id === tid ? { ...t, ...u } : t) } : p));
  const addTask = (pid, s) => { setNts(s); setShowNT(true); };
  const saveTask = task => setProjects(ps => ps.map(p => p.id === apId ? { ...p, tasks: [...p.tasks, task] } : p));
  const delTask = (pid, tid) => setProjects(ps => ps.map(p => p.id === pid ? { ...p, tasks: p.tasks.filter(t => t.id !== tid) } : p));
  const addProj = proj => { setProjects(ps => [...ps, proj]); setApId(proj.id); setView("kanban"); };
  const addNote = ({ title, content, projectId }) => setNotes(ns => [...ns, { id: gid(), title, content, projectId, createdAt: new Date().toISOString() }]);
  const uNote = (nid, u) => setNotes(ns => ns.map(n => n.id === nid ? { ...n, ...u } : n));
  const dNote = nid => setNotes(ns => ns.filter(n => n.id !== nid));

  const vt = { dashboard: "Dashboard", kanban: "Kanban Board", list: "List View", timeline: "Timeline", notes: "Notes", shipped: "What I Shipped" };
  const globalViews = ["dashboard", "notes", "shipped"];

  return (
    <>
      <style>{CSS}</style>
      <div className="root" style={tv}>
        <div className="bg" style={{ background: mode === "dark" ? atmObj.darkGrad : atmObj.lightGrad }} />
        <div className="cnt">
          <Sidebar
            projects={projects}
            activeProjectId={apId}
            onSelectProject={setApId}
            onNewProject={() => setShowNP(true)}
            activeView={view}
            onViewChange={setView}
            notesCount={notes.length}
            mode={mode}
            onToggleMode={() => setMode(m => m === "dark" ? "light" : "dark")}
            atmosphere={atm}
            onAtmosphere={setAtm}
            stats={stats}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
            <div style={{ padding: "16px 26px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", backdropFilter: "var(--backdrop-val)", flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -.3 }}>{globalViews.includes(view) ? vt[view] : ap?.name || "Select a project"}</h1>
                {ap && !globalViews.includes(view) && <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ap.description} · {vt[view]}</p>}
              </div>
              {!globalViews.includes(view) && ap && <button onClick={() => addTask(apId, "idea")} style={{ background: "var(--accent)", color: "#FFF", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>+ Add Task</button>}
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: 22, minHeight: 0 }}>
              {view === "dashboard" && <DashboardView stats={stats} projects={projects} />}
              {view === "kanban" && <KanbanView project={ap} onUpdateTask={uTask} onAddTask={addTask} onDeleteTask={delTask} onOpenTask={setDetailTaskId} />}
              {view === "list" && <ListView project={ap} onUpdateTask={uTask} onDeleteTask={delTask} onOpenTask={setDetailTaskId} />}
              {view === "timeline" && <TimelineView project={ap} />}
              {view === "notes" && <NotesView notes={notes} projects={projects} onAddNote={addNote} onUpdateNote={uNote} onDeleteNote={dNote} />}
              {view === "shipped" && <ShippedView projects={projects} />}
            </div>
          </div>
        </div>
        <ProjectModal open={showNP} onClose={() => setShowNP(false)} onSave={addProj} />
        <TaskModal open={showNT} onClose={() => setShowNT(false)} onSave={saveTask} initialStatus={nts} projectName={ap?.name} />
        <TaskDetailModal open={!!detailTaskId && !!detailTask} onClose={() => setDetailTaskId(null)} task={detailTask} project={ap} onUpdateTask={uTask} />
      </div>
    </>
  );
}
