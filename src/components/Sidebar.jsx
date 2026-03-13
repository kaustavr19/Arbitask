import { BODY, DISPLAY } from "../styles/fonts";
import { PROJECT_COLORS, ATMOSPHERES } from "../constants";
import { Btn } from "./ui";

export function Sidebar({ projects, activeProjectId, onSelectProject, onNewProject, activeView, onViewChange, notesCount, mode, onToggleMode, atmosphere, onAtmosphere, stats }) {
  const views = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "kanban", icon: "▦", label: "Kanban" },
    { id: "list", icon: "☰", label: "List" },
    { id: "timeline", icon: "◫", label: "Timeline" },
    { id: "notes", icon: "✎", label: "Notes" },
    { id: "shipped", icon: "🚀", label: "Shipped" },
  ];

  const sbtn = (active) => ({
    display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px",
    borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
    fontFamily: BODY, marginBottom: 1, transition: "all .15s",
    background: active ? "var(--accent-soft)" : "transparent",
    color: active ? "var(--accent-text)" : "var(--text2)",
    textAlign: "left",
  });

  return (
    <div style={{ width: 252, minWidth: 252, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100%", backdropFilter: "var(--backdrop-val)" }}>
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,var(--accent),var(--st-planned),var(--st-done))", backgroundSize: "200% 200%", animation: "shimmer 4s ease infinite", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#FFF", fontWeight: 800 }}>⚡</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -.5, fontFamily: DISPLAY }}>IdeaForge</div>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 500 }}>idea → shipped</div>
            </div>
          </div>
          <button onClick={onToggleMode} style={{ background: "var(--surface3)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {ATMOSPHERES.map(a => (
            <button key={a.id} onClick={() => onAtmosphere(a.id)} style={{ flex: 1, padding: "5px 0", borderRadius: 7, border: atmosphere === a.id ? "1px solid var(--accent)" : "1px solid var(--border)", background: atmosphere === a.id ? "var(--accent-soft)" : "var(--surface2)", color: atmosphere === a.id ? "var(--accent-text)" : "var(--text3)", cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: BODY, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, transition: "all .2s" }}>
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      </div>

      {stats && (
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => onViewChange("dashboard")}>
          <span style={{ fontSize: 20 }}>{stats.currentLevel.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, fontFamily: DISPLAY, color: stats.currentLevel.color }}>Lv.{stats.currentLevel.level} {stats.currentLevel.title}</div>
            <div style={{ width: "100%", height: 4, borderRadius: 2, background: "var(--surface3)", marginTop: 3 }}>
              <div style={{ width: `${stats.levelProgress * 100}%`, height: "100%", borderRadius: 2, background: stats.currentLevel.color, transition: "width .5s ease" }} />
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)" }}>{stats.xp} XP</span>
        </div>
      )}

      <div style={{ padding: "12px 10px 4px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "var(--text3)", padding: "0 8px 6px", textTransform: "uppercase" }}>Views</div>
        {views.map(v => (
          <button key={v.id} onClick={() => onViewChange(v.id)} style={sbtn(activeView === v.id)}>
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{v.icon}</span>
            {v.label}
            {v.id === "notes" && notesCount > 0 && (
              <span style={{ marginLeft: "auto", fontSize: 10, background: "var(--accent-soft)", color: "var(--accent-text)", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>{notesCount}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: "8px 10px", flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px 6px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase" }}>Projects</div>
          <button onClick={onNewProject} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 17 }}>+</button>
        </div>
        {projects.map(p => {
          const pc = PROJECT_COLORS.find(c => c.id === p.colorId) || PROJECT_COLORS[0];
          const isA = activeProjectId === p.id && !["notes", "shipped", "dashboard"].includes(activeView);
          return (
            <button key={p.id} onClick={() => { onSelectProject(p.id); if (["notes", "shipped", "dashboard"].includes(activeView)) onViewChange("kanban"); }} style={sbtn(isA)}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: pc.hex, flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{p.name}</span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{p.tasks.length}</span>
            </button>
          );
        })}
      </div>

      <div style={{ padding: 10, borderTop: "1px solid var(--border)" }}>
        <button onClick={onNewProject} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px dashed var(--border2)", background: "var(--glass)", color: "var(--text3)", cursor: "pointer", fontSize: 13, fontFamily: BODY, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
          💡 New idea...
        </button>
      </div>
    </div>
  );
}
