import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */

const TASK_TYPES = [
  { id: "design", label: "Design", icon: "◆" },
  { id: "dev", label: "Dev", icon: "⚡" },
  { id: "research", label: "Research", icon: "◎" },
  { id: "content", label: "Content", icon: "✦" },
  { id: "marketing", label: "Marketing", icon: "▲" },
  { id: "other", label: "Other", icon: "●" },
];

const STATUSES = [
  { id: "idea", label: "Idea", emoji: "💡" },
  { id: "planned", label: "Planned", emoji: "📋" },
  { id: "in_progress", label: "In Progress", emoji: "🔥" },
  { id: "blocked", label: "Blocked", emoji: "🚧" },
  { id: "done", label: "Done", emoji: "✅" },
  { id: "archived", label: "Archived", emoji: "📦" },
];

const PROJECT_COLORS = [
  { id: "rose", hex: "#F43F5E", lightText: "#9F1239" },
  { id: "violet", hex: "#8B5CF6", lightText: "#5B21B6" },
  { id: "cyan", hex: "#06B6D4", lightText: "#155E75" },
  { id: "emerald", hex: "#10B981", lightText: "#065F46" },
  { id: "amber", hex: "#F59E0B", lightText: "#92400E" },
  { id: "blue", hex: "#3B82F6", lightText: "#1E40AF" },
  { id: "pink", hex: "#EC4899", lightText: "#9D174D" },
  { id: "teal", hex: "#14B8A6", lightText: "#115E59" },
];

const ATMOSPHERES = [
  { id: "ocean", label: "Ocean", icon: "🌊", darkGrad: "radial-gradient(ellipse at 20% 80%,#0A2E4D 0%,#0C1929 40%,#080F18 100%)", lightGrad: "radial-gradient(ellipse at 20% 80%,#D4EAF7 0%,#E8F1F8 40%,#F0F6FA 100%)" },
  { id: "aurora", label: "Aurora", icon: "🌌", darkGrad: "radial-gradient(ellipse at 70% 20%,#1A0A2E 0%,#0D1117 50%,#080B10 100%),radial-gradient(ellipse at 20% 80%,#0A2E2A 0%,transparent 60%)", lightGrad: "radial-gradient(ellipse at 70% 20%,#F0E6FF 0%,#F5F0FA 50%,#F8F6FB 100%),radial-gradient(ellipse at 20% 80%,#E6FAF8 0%,transparent 60%)" },
  { id: "minimal", label: "Minimal", icon: "◻️", darkGrad: "linear-gradient(180deg,#111113 0%,#0D0D0F 100%)", lightGrad: "linear-gradient(180deg,#FAFAFA 0%,#F5F5F5 100%)" },
];

const SLASH_COMMANDS = [
  { id: "h1", label: "Heading 1", desc: "Large heading", icon: "H1", insert: "# " },
  { id: "h2", label: "Heading 2", desc: "Medium heading", icon: "H2", insert: "## " },
  { id: "h3", label: "Heading 3", desc: "Small heading", icon: "H3", insert: "### " },
  { id: "bullet", label: "Bullet List", desc: "Unordered list item", icon: "•", insert: "- " },
  { id: "number", label: "Numbered List", desc: "Ordered list item", icon: "1.", insert: "1. " },
  { id: "todo", label: "To-do", desc: "Checkbox item", icon: "☐", insert: "- [ ] " },
  { id: "quote", label: "Quote", desc: "Block quote", icon: "❝", insert: "> " },
  { id: "code", label: "Code Block", desc: "Code snippet", icon: "</>", insert: "```\n\n```" },
  { id: "divider", label: "Divider", desc: "Horizontal rule", icon: "—", insert: "\n---\n" },
  { id: "bold", label: "Bold", desc: "Bold text", icon: "B", insert: "**text**" },
  { id: "italic", label: "Italic", desc: "Italic text", icon: "I", insert: "*text*" },
  { id: "callout", label: "Callout", desc: "Highlighted note", icon: "💡", insert: "> 💡 " },
];

const TOOLBAR_ITEMS = [
  { id: "bold", label: "B", title: "Bold", insert: "**", wrap: true },
  { id: "italic", label: "I", title: "Italic", insert: "*", wrap: true },
  { id: "h1", label: "H1", title: "Heading 1", insert: "# ", wrap: false },
  { id: "h2", label: "H2", title: "Heading 2", insert: "## ", wrap: false },
  { id: "bullet", label: "•", title: "Bullet list", insert: "- ", wrap: false },
  { id: "number", label: "1.", title: "Numbered list", insert: "1. ", wrap: false },
  { id: "todo", label: "☐", title: "To-do", insert: "- [ ] ", wrap: false },
  { id: "quote", label: "❝", title: "Quote", insert: "> ", wrap: false },
  { id: "code", label: "</>", title: "Code", insert: "`", wrap: true },
  { id: "hr", label: "—", title: "Divider", insert: "\n---\n", wrap: false },
];

/* ═══════════════════════════════════════════════
   GAMIFICATION SYSTEM
   ═══════════════════════════════════════════════ */

const LEVELS = [
  { level: 1, title: "Dreamer", emoji: "💭", minXP: 0, color: "#94A3B8" },
  { level: 2, title: "Tinkerer", emoji: "🔧", minXP: 100, color: "#60A5FA" },
  { level: 3, title: "Builder", emoji: "🏗️", minXP: 250, color: "#34D399" },
  { level: 4, title: "Maker", emoji: "⚡", minXP: 500, color: "#FBBF24" },
  { level: 5, title: "Shipper", emoji: "🚀", minXP: 800, color: "#F97316" },
  { level: 6, title: "Machine", emoji: "🤖", minXP: 1200, color: "#EC4899" },
  { level: 7, title: "Legend", emoji: "👑", minXP: 1800, color: "#A78BFA" },
  { level: 8, title: "Mythic", emoji: "🔱", minXP: 2500, color: "#F43F5E" },
];

const ACHIEVEMENTS = [
  { id: "first_blood", title: "First Blood", desc: "Complete your first task", emoji: "⚔️", check: (s) => s.done >= 1 },
  { id: "hat_trick", title: "Hat Trick", desc: "Complete 3 tasks in one project", emoji: "🎩", check: (s) => s.maxDoneInProject >= 3 },
  { id: "note_taker", title: "Note Taker", desc: "Write 3 or more notes", emoji: "📝", check: (s) => s.notes >= 3 },
  { id: "idea_machine", title: "Idea Machine", desc: "Create 3+ projects", emoji: "💡", check: (s) => s.projects >= 3 },
  { id: "prolific", title: "Prolific", desc: "Create 10+ tasks total", emoji: "📋", check: (s) => s.totalTasks >= 10 },
  { id: "speed_demon", title: "Speed Demon", desc: "Complete 5 tasks", emoji: "⚡", check: (s) => s.done >= 5 },
  { id: "centurion", title: "Centurion", desc: "Earn 100+ XP", emoji: "🏛️", check: (s) => s.xp >= 100 },
  { id: "half_k", title: "Half K", desc: "Earn 500+ XP", emoji: "🔥", check: (s) => s.xp >= 500 },
  { id: "grand", title: "Grand Master", desc: "Earn 1000+ XP", emoji: "👑", check: (s) => s.xp >= 1000 },
  { id: "multi_thread", title: "Multi-threader", desc: "Have tasks in 3+ projects", emoji: "🧵", check: (s) => s.projectsWithTasks >= 3 },
  { id: "planner", title: "Planner", desc: "Have 5+ planned tasks", emoji: "🗓️", check: (s) => s.planned >= 5 },
  { id: "on_fire", title: "On Fire", desc: "Have 3+ tasks in progress", emoji: "🔥", check: (s) => s.inProgress >= 3 },
  { id: "clean_slate", title: "Clean Slate", desc: "Complete all tasks in a project", emoji: "✨", check: (s) => s.hasCleanProject },
  { id: "ten_down", title: "Ten Down", desc: "Complete 10 tasks", emoji: "🏆", check: (s) => s.done >= 10 },
  { id: "wordsmith", title: "Wordsmith", desc: "Write 5+ notes", emoji: "✍️", check: (s) => s.notes >= 5 },
];

function calcStats(projects, notes) {
  const totalTasks = projects.reduce((s, p) => s + p.tasks.length, 0);
  const done = projects.reduce((s, p) => s + p.tasks.filter(t => t.status === "done").length, 0);
  const inProgress = projects.reduce((s, p) => s + p.tasks.filter(t => t.status === "in_progress").length, 0);
  const blocked = projects.reduce((s, p) => s + p.tasks.filter(t => t.status === "blocked").length, 0);
  const planned = projects.reduce((s, p) => s + p.tasks.filter(t => t.status === "planned").length, 0);
  const ideas = projects.reduce((s, p) => s + p.tasks.filter(t => t.status === "idea").length, 0);
  const projectsWithTasks = projects.filter(p => p.tasks.length > 0).length;
  const maxDoneInProject = Math.max(0, ...projects.map(p => p.tasks.filter(t => t.status === "done").length));
  const hasCleanProject = projects.some(p => p.tasks.length > 0 && p.tasks.every(t => t.status === "done"));
  const withDesc = projects.reduce((s, p) => s + p.tasks.filter(t => t.description).length, 0);

  // XP calculation
  const xp = (done * 50) + (inProgress * 15) + (totalTasks * 10) + (notes.length * 10) + (projects.length * 20) + (withDesc * 5);

  // Level
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) { currentLevel = LEVELS[i]; nextLevel = LEVELS[i + 1] || null; break; }
  }
  const xpInLevel = xp - currentLevel.minXP;
  const xpNeeded = nextLevel ? nextLevel.minXP - currentLevel.minXP : 0;
  const levelProgress = nextLevel ? Math.min(xpInLevel / xpNeeded, 1) : 1;

  return { totalTasks, done, inProgress, blocked, planned, ideas, projects: projects.length, notes: notes.length, projectsWithTasks, maxDoneInProject, hasCleanProject, xp, currentLevel, nextLevel, xpInLevel, xpNeeded, levelProgress, completionRate: totalTasks ? Math.round((done / totalTasks) * 100) : 0 };
}

const gid = () => Math.random().toString(36).substr(2, 9);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

const INIT_PROJECTS = [
  {
    id: "p1", name: "AI Recipe Generator", description: "An app that generates recipes from your pantry",
    colorId: "rose", createdAt: "2025-01-15T00:00:00.000Z",
    tasks: [
      { id: "t1", title: "Design wireframes", type: "design", status: "done", startDate: "2025-01-20", dueDate: "2025-01-25", description: "", notes: "" },
      { id: "t2", title: "Build API integration", type: "dev", status: "in_progress", startDate: "2025-01-26", dueDate: "2025-02-05", description: "Need to integrate with OpenAI API for recipe generation.\n\n- Setup API keys\n- Build prompt templates\n- Handle rate limiting", notes: "" },
      { id: "t3", title: "Write onboarding copy", type: "content", status: "planned", startDate: "2025-02-06", dueDate: "2025-02-10", description: "", notes: "" },
      { id: "t4", title: "User testing round 1", type: "research", status: "idea", startDate: "", dueDate: "", description: "", notes: "" },
    ],
  },
  {
    id: "p2", name: "Portfolio Redesign", description: "Complete overhaul of my personal site",
    colorId: "blue", createdAt: "2025-02-01T00:00:00.000Z",
    tasks: [
      { id: "t5", title: "Mood board & references", type: "research", status: "done", startDate: "2025-02-01", dueDate: "2025-02-03", description: "", notes: "" },
      { id: "t6", title: "New logo concepts", type: "design", status: "blocked", startDate: "2025-02-04", dueDate: "2025-02-10", description: "**Blocked**: waiting on brand color decision.\n\n> Need to finalize between Option A and Option B", notes: "" },
      { id: "t7", title: "Setup Next.js project", type: "dev", status: "idea", startDate: "", dueDate: "", description: "", notes: "" },
    ],
  },
];

const INIT_NOTES = [
  { id: "n1", title: "Voice-controlled todo app", content: "What if you could just **speak** your tasks?\n\n- Natural language parsing\n- Auto-assign to projects\n- Set deadlines from speech", projectId: null, createdAt: "2025-02-20T00:00:00.000Z" },
  { id: "n2", title: "API rate limiting notes", content: "# Rate Limiting\n\nImplement:\n1. Token bucket algorithm\n2. Per-user limits\n3. Graceful degradation", projectId: null, createdAt: "2025-03-01T00:00:00.000Z" },
];

/* ═══════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════ */

function buildThemeVars(mode, atmId, pcId) {
  const pc = PROJECT_COLORS.find(c => c.id === pcId) || PROJECT_COLORS[0];
  const dk = mode === "dark";
  return {
    "--surface": dk ? "rgba(22,22,26,0.88)" : "rgba(255,255,255,0.88)",
    "--surface2": dk ? "rgba(30,30,36,0.92)" : "rgba(240,240,244,0.92)",
    "--surface3": dk ? "rgba(42,42,50,0.92)" : "rgba(228,228,235,0.92)",
    "--surface-modal": dk ? "#252530" : "#fcfcfe",
    "--glass": dk ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    "--border": dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    "--border2": dk ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    "--border-modal": dk ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.13)",
    "--text": dk ? "#EDEDEF" : "#1A1A1E",
    "--text2": dk ? "#94949E" : "#6B6B76",
    "--text3": dk ? "#5A5A66" : "#9A9AA6",
    "--accent": pc.hex,
    "--accent-soft": pc.hex + (dk ? "18" : "14"),
    "--accent-glow": pc.hex + "22",
    "--accent-text": dk ? pc.hex : pc.lightText,
    "--shadow": dk ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)",
    "--backdrop-val": dk ? "blur(16px) saturate(1.4)" : "blur(16px) saturate(1.2)",
    "--st-idea": "#EAB308", "--st-planned": "#6366F1", "--st-in_progress": "#F97316",
    "--st-blocked": "#EF4444", "--st-done": "#22C55E", "--st-archived": "#71717A",
  };
}
const stC = id => `var(--st-${id})`;

/* ═══════════════════════════════════════════════
   MARKDOWN
   ═══════════════════════════════════════════════ */

function renderMd(text) {
  if (!text) return "";
  let h = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:14px 0 6px;color:var(--text)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:17px;font-weight:700;margin:14px 0 6px;color:var(--text)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:20px;font-weight:700;margin:16px 0 8px;color:var(--text)">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:var(--surface3);padding:2px 6px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border2);margin:16px 0"/>')
    .replace(/^>\s?(.+)$/gm, '<blockquote style="border-left:3px solid var(--accent);padding:4px 12px;margin:8px 0;color:var(--text2);font-style:italic">$1</blockquote>')
    .replace(/^- \[x\] (.+)$/gm, '<div style="margin:4px 0;text-decoration:line-through;opacity:0.5">☑ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div style="margin:4px 0">☐ $1</div>')
    .replace(/^- (.+)$/gm, '{{UL}}$1{{/UL}}')
    .replace(/^(\d+)\. (.+)$/gm, '{{OL}}$2{{/OL}}');
  h = h.replace(/({{UL}}.*?{{\/UL}}\n?)+/g, m => {
    const items = m.replace(/{{UL}}(.*?){{\/UL}}\n?/g, '<li style="margin:4px 0">$1</li>');
    return `<ul style="list-style-type:disc;padding-left:24px;margin:8px 0">${items}</ul>`;
  });
  h = h.replace(/({{OL}}.*?{{\/OL}}\n?)+/g, m => {
    const items = m.replace(/{{OL}}(.*?){{\/OL}}\n?/g, '<li style="margin:4px 0">$1</li>');
    return `<ol style="list-style-type:decimal;padding-left:24px;margin:8px 0">${items}</ol>`;
  });
  h = h.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");
  return h;
}

/* ═══════════════════════════════════════════════
   CSS — Bricolage Grotesque + Manrope
   ═══════════════════════════════════════════════ */

const DISPLAY = `'Bricolage Grotesque',serif`;
const BODY = `'Manrope',sans-serif`;
const MONO = `'JetBrains Mono',monospace`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--surface3);border-radius:3px}
.root{font-family:${BODY};color:var(--text);height:100vh;display:flex;overflow:hidden;position:relative}
.bg{position:fixed;inset:0;z-index:0;transition:background .6s ease}
.cnt{position:relative;z-index:1;display:flex;width:100%;height:100%}
input,textarea,select{font-family:${BODY};background:var(--surface2);border:1px solid var(--border2);color:var(--text);border-radius:10px;padding:10px 14px;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
input:focus,textarea:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
textarea{resize:vertical;min-height:80px;font-family:${MONO};font-size:13px;line-height:1.6}
select{cursor:pointer;appearance:none;padding-right:32px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394949E' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
.fi{animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 20px var(--accent-glow)}50%{box-shadow:0 0 40px var(--accent-glow),0 0 60px var(--accent-glow)}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.sm{position:absolute;z-index:100;background:var(--surface-modal);border:1px solid var(--border-modal);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.3);width:260px;max-height:300px;overflow-y:auto;padding:6px}
.si{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;border:none;width:100%;background:transparent;color:var(--text);font-family:${BODY};font-size:13px;text-align:left;transition:background .1s}
.si:hover,.si.ac{background:var(--accent-soft)}
.sic{width:28px;height:28px;border-radius:6px;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--text2);flex-shrink:0}
`;

/* ═══════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════ */

function Btn({ children, onClick, variant = "primary", size = "md", style = {}, disabled }) {
  const b = { fontFamily: BODY, fontWeight: 600, border: "none", cursor: disabled ? "not-allowed" : "pointer", borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s", opacity: disabled ? .4 : 1, fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13, padding: size === "sm" ? "6px 12px" : size === "lg" ? "14px 28px" : "10px 18px" };
  const v = {
    primary: { background: "var(--accent)", color: "#FFF", boxShadow: disabled ? "none" : "0 2px 8px var(--accent-glow)" },
    secondary: { background: "var(--surface3)", color: "var(--text)", border: "1px solid var(--border2)" },
    ghost: { background: "transparent", color: "var(--text2)" },
    danger: { background: "#EF444420", color: "#EF4444", border: "1px solid #EF444444" },
  };
  return <button style={{ ...b, ...v[variant], ...style }} onClick={disabled ? undefined : onClick} onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)" }} onMouseLeave={e => { e.currentTarget.style.transform = "none" }}>{children}</button>;
}

function Badge({ children, color, style = {} }) {
  const c = color || "var(--accent)";
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: .2, background: c + "18", color: c, border: `1px solid ${c}28`, fontFamily: BODY, ...style }}>{children}</span>;
}

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div className="fi" onClick={e => e.stopPropagation()} style={{ background: "var(--surface-modal)", border: "2px solid var(--border-modal)", borderRadius: 18, padding: 28, width: wide ? 680 : 480, maxWidth: "94vw", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px var(--border-modal)" }}>
        {title && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: DISPLAY }}>{title}</h2>
          <button onClick={onClose} style={{ background: "var(--surface3)", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, padding: "6px 10px", borderRadius: 8, fontWeight: 600 }}>✕</button>
        </div>}
        {children}
      </div>
    </div>
  );
}

function Empty({ icon, title, sub, action }) {
  return <div style={{ textAlign: "center", padding: "60px 20px" }}>
    <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
    <h3 style={{ fontSize: 17, fontWeight: 600, fontFamily: DISPLAY, marginBottom: 6 }}>{title}</h3>
    <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 18 }}>{sub}</p>{action}
  </div>;
}

function Label({ children }) { return <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 5, display: "block" }}>{children}</label>; }

/* ═══════════════════════════════════════════════
   FORMATTING TOOLBAR
   ═══════════════════════════════════════════════ */

function FormattingToolbar({ textareaRef, value, onChange }) {
  const handleInsert = (item) => {
    const ta = textareaRef.current; if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd, selected = value.substring(start, end);
    let newText, pos;
    if (item.wrap && selected) { newText = value.substring(0, start) + item.insert + selected + item.insert + value.substring(end); pos = end + item.insert.length * 2; }
    else if (item.wrap) { newText = value.substring(0, start) + item.insert + "text" + item.insert + value.substring(end); pos = start + item.insert.length; }
    else { newText = value.substring(0, start) + item.insert + value.substring(end); pos = start + item.insert.length; }
    onChange(newText);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(pos, item.wrap && !selected ? pos + 4 : pos); }, 10);
  };
  return (
    <div style={{ display: "flex", gap: 2, padding: "6px 8px", background: "var(--surface2)", borderRadius: "10px 10px 0 0", border: "1px solid var(--border2)", borderBottom: "none", flexWrap: "wrap" }}>
      {TOOLBAR_ITEMS.map(item => (
        <button key={item.id} onClick={() => handleInsert(item)} title={item.title} style={{ background: "transparent", border: "none", color: "var(--text2)", cursor: "pointer", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: item.id === "code" ? MONO : BODY, transition: "all .15s", minWidth: 28, textAlign: "center", fontStyle: item.id === "italic" ? "italic" : "normal" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent-text)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)" }}
        >{item.label}</button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TASK DETAIL MODAL
   ═══════════════════════════════════════════════ */

function TaskDetailModal({ open, onClose, task, project, onUpdateTask }) {
  const [title, setTitle] = useState(""); const [desc, setDesc] = useState(""); const [type, setType] = useState("dev");
  const [status, setStatus] = useState("idea"); const [sd, setSd] = useState(""); const [dd, setDd] = useState("");
  const [tab, setTab] = useState("write"); const taRef = useRef(null);
  useEffect(() => { if (task) { setTitle(task.title || ""); setDesc(task.description || ""); setType(task.type || "dev"); setStatus(task.status || "idea"); setSd(task.startDate || ""); setDd(task.dueDate || ""); setTab("write"); } }, [task]);
  if (!open || !task || !project) return null;
  const pc = PROJECT_COLORS.find(c => c.id === project.colorId) || PROJECT_COLORS[0];
  return (
    <Modal open={open} onClose={onClose} title="Task Details" wide>
      <div>
        <input value={title} onChange={e => setTitle(e.target.value)} style={{ fontSize: 22, fontWeight: 800, fontFamily: DISPLAY, background: "transparent", border: "none", borderRadius: 0, padding: "0 0 12px 0", borderBottom: `2px solid ${pc.hex}`, marginBottom: 20, width: "100%" }} placeholder="Task title..." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div><Label>Type</Label><select value={type} onChange={e => setType(e.target.value)} style={{ fontSize: 13 }}>{TASK_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}</select></div>
          <div><Label>Status</Label><select value={status} onChange={e => setStatus(e.target.value)} style={{ fontSize: 13 }}>{STATUSES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}</select></div>
          <div><Label>Start</Label><input type="date" value={sd} onChange={e => setSd(e.target.value)} style={{ fontSize: 13 }} /></div>
          <div><Label>Due</Label><input type="date" value={dd} onChange={e => setDd(e.target.value)} style={{ fontSize: 13 }} /></div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <Label>Description</Label>
            <div style={{ display: "flex", gap: 2, background: "var(--surface2)", borderRadius: 8, padding: 2 }}>
              {["write", "preview"].map(t => (<button key={t} onClick={() => setTab(t)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: BODY, background: tab === t ? "var(--accent-soft)" : "transparent", color: tab === t ? "var(--accent-text)" : "var(--text3)" }}>{t === "write" ? "Write" : "Preview"}</button>))}
            </div>
          </div>
          {tab === "write" ? (<div><FormattingToolbar textareaRef={taRef} value={desc} onChange={setDesc} /><textarea ref={taRef} value={desc} onChange={e => setDesc(e.target.value)} rows={10} style={{ borderRadius: "0 0 10px 10px", borderTop: "1px solid var(--border2)" }} placeholder="Add a description..." /></div>
          ) : (<div style={{ minHeight: 200, padding: 16, borderRadius: 10, border: "1px solid var(--border2)", background: "var(--surface2)", fontSize: 14, lineHeight: 1.8, color: "var(--text2)" }}>{desc ? <div dangerouslySetInnerHTML={{ __html: renderMd(desc) }} /> : <span style={{ color: "var(--text3)", fontStyle: "italic" }}>Nothing here yet...</span>}</div>)}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => { onUpdateTask(project.id, task.id, { title, description: desc, type, status, startDate: sd, dueDate: dd }); onClose(); }}>Save Changes</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════
   SLASH MENU
   ═══════════════════════════════════════════════ */

function SlashMenu({ position, filter, onSelect, onClose }) {
  const [ai, setAi] = useState(0);
  const filtered = SLASH_COMMANDS.filter(c => c.label.toLowerCase().includes(filter.toLowerCase()) || c.desc.toLowerCase().includes(filter.toLowerCase()));
  const ref = useRef(null);
  useEffect(() => { setAi(0) }, [filter]);
  useEffect(() => { const h = e => { if (e.key === "Escape") { e.preventDefault(); onClose() } else if (e.key === "ArrowDown") { e.preventDefault(); setAi(i => Math.min(i + 1, filtered.length - 1)) } else if (e.key === "ArrowUp") { e.preventDefault(); setAi(i => Math.max(i - 1, 0)) } else if (e.key === "Enter" && filtered[ai]) { e.preventDefault(); onSelect(filtered[ai]) } }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [filtered, ai, onSelect, onClose]);
  if (!filtered.length) return null;
  return (<div className="sm" ref={ref} style={{ left: position.x, top: position.y }}>{filtered.map((cmd, i) => (<button key={cmd.id} className={`si ${i === ai ? "ac" : ""}`} onMouseEnter={() => setAi(i)} onClick={() => onSelect(cmd)}><span className="sic">{cmd.icon}</span><div><div style={{ fontWeight: 600, fontSize: 13 }}>{cmd.label}</div><div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{cmd.desc}</div></div></button>))}</div>);
}

/* ═══════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════ */

function Sidebar({ projects, activeProjectId, onSelectProject, onNewProject, activeView, onViewChange, notesCount, mode, onToggleMode, atmosphere, onAtmosphere, stats }) {
  const views = [{ id: "dashboard", icon: "◈", label: "Dashboard" }, { id: "kanban", icon: "▦", label: "Kanban" }, { id: "list", icon: "☰", label: "List" }, { id: "timeline", icon: "◫", label: "Timeline" }, { id: "notes", icon: "✎", label: "Notes" }, { id: "shipped", icon: "🚀", label: "Shipped" }];
  const sbtn = (active) => ({ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: BODY, marginBottom: 1, transition: "all .15s", background: active ? "var(--accent-soft)" : "transparent", color: active ? "var(--accent-text)" : "var(--text2)", textAlign: "left" });
  return (
    <div style={{ width: 252, minWidth: 252, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100%", backdropFilter: "var(--backdrop-val)" }}>
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,var(--accent),var(--st-planned),var(--st-done))", backgroundSize: "200% 200%", animation: "shimmer 4s ease infinite", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#FFF", fontWeight: 800 }}>⚡</div>
            <div><div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -.5, fontFamily: DISPLAY }}>IdeaForge</div><div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 500 }}>idea → shipped</div></div>
          </div>
          <button onClick={onToggleMode} style={{ background: "var(--surface3)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>{mode === "dark" ? "☀️" : "🌙"}</button>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {ATMOSPHERES.map(a => (<button key={a.id} onClick={() => onAtmosphere(a.id)} style={{ flex: 1, padding: "5px 0", borderRadius: 7, border: atmosphere === a.id ? "1px solid var(--accent)" : "1px solid var(--border)", background: atmosphere === a.id ? "var(--accent-soft)" : "var(--surface2)", color: atmosphere === a.id ? "var(--accent-text)" : "var(--text3)", cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: BODY, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, transition: "all .2s" }}>{a.icon} {a.label}</button>))}
        </div>
      </div>
      {/* Level mini-badge */}
      {stats && <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => onViewChange("dashboard")}>
        <span style={{ fontSize: 20 }}>{stats.currentLevel.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, fontFamily: DISPLAY, color: stats.currentLevel.color }}>Lv.{stats.currentLevel.level} {stats.currentLevel.title}</div>
          <div style={{ width: "100%", height: 4, borderRadius: 2, background: "var(--surface3)", marginTop: 3 }}>
            <div style={{ width: `${stats.levelProgress * 100}%`, height: "100%", borderRadius: 2, background: stats.currentLevel.color, transition: "width .5s ease" }} />
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)" }}>{stats.xp} XP</span>
      </div>}
      <div style={{ padding: "12px 10px 4px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "var(--text3)", padding: "0 8px 6px", textTransform: "uppercase" }}>Views</div>
        {views.map(v => (<button key={v.id} onClick={() => onViewChange(v.id)} style={sbtn(activeView === v.id)}><span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{v.icon}</span>{v.label}{v.id === "notes" && notesCount > 0 && <span style={{ marginLeft: "auto", fontSize: 10, background: "var(--accent-soft)", color: "var(--accent-text)", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>{notesCount}</span>}</button>))}
      </div>
      <div style={{ padding: "8px 10px", flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px 6px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase" }}>Projects</div>
          <button onClick={onNewProject} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 17 }}>+</button>
        </div>
        {projects.map(p => {
          const pc = PROJECT_COLORS.find(c => c.id === p.colorId) || PROJECT_COLORS[0];
          const isA = activeProjectId === p.id && !["notes", "shipped", "dashboard"].includes(activeView);
          return (<button key={p.id} onClick={() => { onSelectProject(p.id); if (["notes", "shipped", "dashboard"].includes(activeView)) onViewChange("kanban") }} style={sbtn(isA)}><span style={{ width: 9, height: 9, borderRadius: 3, background: pc.hex, flexShrink: 0 }} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{p.name}</span><span style={{ fontSize: 11, color: "var(--text3)" }}>{p.tasks.length}</span></button>);
        })}
      </div>
      <div style={{ padding: 10, borderTop: "1px solid var(--border)" }}>
        <button onClick={onNewProject} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px dashed var(--border2)", background: "var(--glass)", color: "var(--text3)", cursor: "pointer", fontSize: 13, fontFamily: BODY, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>💡 New idea...</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD — Full game energy
   ═══════════════════════════════════════════════ */

function DashboardView({ stats, projects }) {
  const earned = ACHIEVEMENTS.filter(a => a.check(stats));
  const locked = ACHIEVEMENTS.filter(a => !a.check(stats));

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* HERO CARD */}
      <div className="fi" style={{
        position: "relative", overflow: "hidden", borderRadius: 20, padding: "32px 36px",
        background: `linear-gradient(135deg, ${stats.currentLevel.color}22, ${stats.currentLevel.color}08)`,
        border: `2px solid ${stats.currentLevel.color}33`, marginBottom: 24,
      }}>
        {/* Decorative bg circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: stats.currentLevel.color + "0A" }} />
        <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: stats.currentLevel.color + "06" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 24 }}>
          {/* Level emblem */}
          <div style={{
            width: 100, height: 100, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg, ${stats.currentLevel.color}44, ${stats.currentLevel.color}22)`,
            border: `3px solid ${stats.currentLevel.color}66`, fontSize: 48,
            animation: "pulseGlow 3s ease-in-out infinite",
          }}>
            {stats.currentLevel.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: stats.currentLevel.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Level {stats.currentLevel.level}</div>
            <div style={{ fontSize: 36, fontWeight: 800, fontFamily: DISPLAY, letterSpacing: -1, marginBottom: 6, color: "var(--text)" }}>{stats.currentLevel.title}</div>
            {/* XP Bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "var(--surface3)", overflow: "hidden" }}>
                <div style={{
                  width: `${stats.levelProgress * 100}%`, height: "100%", borderRadius: 6,
                  background: `linear-gradient(90deg, ${stats.currentLevel.color}, ${stats.currentLevel.color}AA)`,
                  transition: "width .8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: `0 0 12px ${stats.currentLevel.color}66`,
                }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: DISPLAY, color: stats.currentLevel.color, minWidth: 60, textAlign: "right" }}>
                {stats.xp} XP
              </span>
            </div>
            {stats.nextLevel && <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>
              {stats.xpNeeded - stats.xpInLevel} XP to <span style={{ fontWeight: 700, color: stats.nextLevel.color }}>{stats.nextLevel.emoji} {stats.nextLevel.title}</span>
            </div>}
          </div>
        </div>
      </div>

      {/* PRODUCTIVITY STATS */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: DISPLAY, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>📊</span> Productivity Stats
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[
            { l: "Completed", v: stats.done, i: "✅", c: "var(--st-done)" },
            { l: "In Progress", v: stats.inProgress, i: "🔥", c: "var(--st-in_progress)" },
            { l: "Blocked", v: stats.blocked, i: "🚧", c: "var(--st-blocked)" },
            { l: "Completion", v: stats.completionRate + "%", i: "📈", c: "var(--accent)" },
            { l: "Total Tasks", v: stats.totalTasks, i: "📋", c: "var(--st-planned)" },
          ].map((s, i) => (
            <div key={i} className="fi" style={{
              padding: "18px 14px", borderRadius: 14, background: "var(--surface)",
              border: "1px solid var(--border)", textAlign: "center",
              animationDelay: `${i * 0.08}s`, animationFillMode: "both",
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.i}</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: DISPLAY, color: s.c, letterSpacing: -1 }}>{s.v}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: .5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: DISPLAY, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🏆</span> Achievements
        </h2>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>{earned.length} of {ACHIEVEMENTS.length} unlocked</p>

        {/* Earned */}
        {earned.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
          {earned.map((a, i) => (
            <div key={a.id} className="fi" style={{
              padding: "16px 14px", borderRadius: 14,
              background: "linear-gradient(135deg, var(--accent-soft), transparent)",
              border: "1px solid var(--accent-glow)",
              animationDelay: `${i * 0.06}s`, animationFillMode: "both",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--accent-soft)", fontSize: 22, border: "2px solid var(--accent-glow)",
                boxShadow: "0 4px 12px var(--accent-glow)",
              }}>{a.emoji}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: DISPLAY, color: "var(--text)" }}>{a.title}</div>
                <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>}

        {/* Locked */}
        {locked.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {locked.map(a => (
            <div key={a.id} style={{
              padding: "16px 14px", borderRadius: 14, background: "var(--surface)",
              border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, opacity: .45,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--surface3)", fontSize: 22, filter: "grayscale(1)",
              }}>{a.emoji}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: DISPLAY, color: "var(--text3)" }}>{a.title}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>}
      </div>

      {/* XP BREAKDOWN */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, fontFamily: DISPLAY, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚡</span> XP Breakdown
        </h2>
        <div style={{ borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
          {[
            { label: "Tasks completed", count: stats.done, xpEach: 50, emoji: "✅" },
            { label: "Tasks in progress", count: stats.inProgress, xpEach: 15, emoji: "🔥" },
            { label: "Tasks created", count: stats.totalTasks, xpEach: 10, emoji: "📋" },
            { label: "Notes written", count: stats.notes, xpEach: 10, emoji: "📝" },
            { label: "Projects created", count: stats.projects, xpEach: 20, emoji: "📂" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", padding: "12px 18px",
              borderBottom: i < 4 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontSize: 16, marginRight: 12 }}>{row.emoji}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontSize: 12, color: "var(--text3)", marginRight: 16 }}>{row.count} × {row.xpEach} XP</span>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: DISPLAY, color: "var(--accent)", minWidth: 55, textAlign: "right" }}>{row.count * row.xpEach} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   KANBAN
   ═══════════════════════════════════════════════ */

function KanbanView({ project, onUpdateTask, onAddTask, onDeleteTask, onOpenTask }) {
  const [drag, setDrag] = useState(null);
  if (!project) return <Empty icon="📂" title="Select a project" sub="Pick a project from the sidebar" />;
  const pc = PROJECT_COLORS.find(c => c.id === project.colorId) || PROJECT_COLORS[0];
  return (
    <div style={{ display: "flex", gap: 14, overflowX: "auto", height: "100%", minHeight: 0 }}>
      {STATUSES.filter(s => s.id !== "archived").map(status => {
        const tasks = project.tasks.filter(t => t.status === status.id); const sc = stC(status.id);
        return (
          <div key={status.id} onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = "var(--glass)" }} onDragLeave={e => { e.currentTarget.style.background = "transparent" }} onDrop={e => { e.currentTarget.style.background = "transparent"; if (drag) { onUpdateTask(project.id, drag, { status: status.id }); setDrag(null) } }} style={{ flex: "1 0 220px", maxWidth: 300, display: "flex", flexDirection: "column", borderRadius: 14, transition: "background .2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 4px 12px" }}>
              <span style={{ fontSize: 15 }}>{status.emoji}</span><span style={{ fontSize: 12, fontWeight: 700, fontFamily: DISPLAY }}>{status.label}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: sc, background: sc + "18", padding: "2px 7px", borderRadius: 10 }}>{tasks.length}</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, overflowY: "auto" }}>
              {tasks.map(task => {
                const tt = TASK_TYPES.find(t => t.id === task.type) || TASK_TYPES[5];
                return (
                  <div key={task.id} draggable onDragStart={() => setDrag(task.id)} onDragEnd={() => setDrag(null)} onClick={() => onOpenTask(task.id)} style={{ padding: 13, borderRadius: 11, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", transition: "all .2s", opacity: drag === task.id ? .4 : 1, borderLeft: `3px solid ${pc.hex}` }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px var(--shadow)" }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, flex: 1 }}>{task.title}</span>
                      <button onClick={e => { e.stopPropagation(); onDeleteTask(project.id, task.id) }} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 11, opacity: .4, padding: "2px" }}>✕</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                      <Badge color={pc.hex} style={{ fontSize: 10 }}>{tt.icon} {tt.label}</Badge>
                      {task.dueDate && <span style={{ fontSize: 10, color: "var(--text3)" }}>📅 {fmtDate(task.dueDate)}</span>}
                      {task.description && <span style={{ fontSize: 10, color: "var(--text3)" }}>📝</span>}
                    </div>
                  </div>
                );
              })}
              <button onClick={() => onAddTask(project.id, status.id)} style={{ padding: 9, borderRadius: 9, border: "1px dashed var(--border2)", background: "transparent", color: "var(--text3)", cursor: "pointer", fontSize: 12, fontFamily: BODY, fontWeight: 500 }}>+ Add task</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LIST
   ═══════════════════════════════════════════════ */

function ListView({ project, onUpdateTask, onDeleteTask, onOpenTask }) {
  if (!project) return <Empty icon="📂" title="Select a project" sub="Pick a project from the sidebar" />;
  const pc = PROJECT_COLORS.find(c => c.id === project.colorId) || PROJECT_COLORS[0];
  const sorted = [...project.tasks].sort((a, b) => { const o = ["in_progress", "blocked", "planned", "idea", "done", "archived"]; return o.indexOf(a.status) - o.indexOf(b.status) });
  if (!sorted.length) return <Empty icon="📝" title="No tasks yet" sub="Add tasks from Kanban view" />;
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 120px 90px 90px 36px", gap: 10, padding: "6px 14px", fontSize: 10, fontWeight: 700, color: "var(--text3)", letterSpacing: .5, textTransform: "uppercase" }}><span>Task</span><span>Type</span><span>Status</span><span>Start</span><span>Due</span><span></span></div>
      {sorted.map(task => {
        const tt = TASK_TYPES.find(t => t.id === task.type) || TASK_TYPES[5]; const sc = stC(task.status);
        return (
          <div key={task.id} onClick={() => onOpenTask(task.id)} style={{ display: "grid", gridTemplateColumns: "1fr 90px 120px 90px 90px 36px", gap: 10, alignItems: "center", padding: "11px 14px", borderRadius: 10, marginBottom: 3, background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `3px solid ${pc.hex}`, cursor: "pointer" }}>
            <span style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>{task.title}{task.description && <span style={{ fontSize: 10, color: "var(--text3)" }}>📝</span>}</span>
            <Badge color={pc.hex} style={{ fontSize: 10 }}>{tt.icon} {tt.label}</Badge>
            <select value={task.status} onClick={e => e.stopPropagation()} onChange={e => onUpdateTask(project.id, task.id, { status: e.target.value })} style={{ padding: "4px 22px 4px 7px", fontSize: 11, borderRadius: 6, background: sc + "14", color: sc, border: `1px solid ${sc}28` }}>{STATUSES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}</select>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(task.startDate) || "—"}</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(task.dueDate) || "—"}</span>
            <button onClick={e => { e.stopPropagation(); onDeleteTask(project.id, task.id) }} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 11, opacity: .4 }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TIMELINE
   ═══════════════════════════════════════════════ */

function TimelineView({ project }) {
  const containerRef = useRef(null); const [cw, setCw] = useState(800);
  useEffect(() => { if (containerRef.current) { const ro = new ResizeObserver(entries => { for (const e of entries) setCw(e.contentRect.width) }); ro.observe(containerRef.current); setCw(containerRef.current.offsetWidth); return () => ro.disconnect(); } }, []);
  if (!project) return <Empty icon="📂" title="Select a project" sub="Pick a project from the sidebar" />;
  const pc = PROJECT_COLORS.find(c => c.id === project.colorId) || PROJECT_COLORS[0];
  const wd = project.tasks.filter(t => t.startDate && t.dueDate);
  if (!wd.length) return <div ref={containerRef}><Empty icon="📅" title="No timeline data" sub="Add start and due dates to tasks" /></div>;
  const allD = wd.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)]);
  const minD = new Date(Math.min(...allD)), maxD = new Date(Math.max(...allD));
  const td = Math.max((maxD - minD) / 864e5, 1), labelW = 200, barArea = Math.max(cw - labelW - 40, 200), px = Math.max(barArea / td, 8), totalW = labelW + td * px + 40;
  const months = []; const cur = new Date(minD.getFullYear(), minD.getMonth(), 1); while (cur <= maxD) { months.push(new Date(cur)); cur.setMonth(cur.getMonth() + 1) }
  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", overflowX: "auto", overflowY: "auto" }}>
      <div style={{ position: "relative", height: 28, minWidth: totalW }}>{months.map((m, i) => { const off = Math.max(0, (m - minD) / 864e5); return <div key={i} style={{ position: "absolute", left: labelW + off * px, fontSize: 10, fontWeight: 700, color: "var(--text3)", letterSpacing: .5, textTransform: "uppercase", borderLeft: "1px solid var(--border)", paddingLeft: 8, height: "100%", display: "flex", alignItems: "center", fontFamily: BODY }}>{m.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div> })}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4, minWidth: totalW }}>
        {wd.map(task => {
          const start = (new Date(task.startDate) - minD) / 864e5, dur = Math.max((new Date(task.dueDate) - new Date(task.startDate)) / 864e5, 1), st = STATUSES.find(s => s.id === task.status);
          return (<div key={task.id} style={{ display: "flex", alignItems: "center", height: 38 }}>
            <div style={{ width: labelW, flexShrink: 0, paddingRight: 12, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
            <div style={{ position: "relative", flex: 1 }}><div style={{ position: "absolute", left: start * px, width: Math.max(dur * px, 28), height: 30, borderRadius: 8, background: `linear-gradient(135deg,${pc.hex}BB,${pc.hex}66)`, border: `1px solid ${pc.hex}88`, display: "flex", alignItems: "center", gap: 5, paddingLeft: 8, fontSize: 11, fontWeight: 600, color: "#FFF" }}><span>{st.emoji}</span>{dur * px > 100 && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fmtDate(task.startDate)} → {fmtDate(task.dueDate)}</span>}</div></div>
          </div>);
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NOTES
   ═══════════════════════════════════════════════ */

function NotesView({ notes, projects, onAddNote, onUpdateNote, onDeleteNote }) {
  const [an, setAn] = useState(null); const [editing, setEditing] = useState(false);
  const [ec, setEc] = useState(""); const [et, setEt] = useState("");
  const [showNew, setShowNew] = useState(false); const [nt, setNt] = useState(""); const [nc, setNc] = useState(""); const [np, setNp] = useState("");
  const [slashOpen, setSO] = useState(false); const [sf, setSF] = useState(""); const [sp, setSP] = useState({ x: 0, y: 0 }); const [ss, setSS] = useState(-1); const [st2, setST] = useState(null);
  const editRef = useRef(null); const newRef = useRef(null); const note = notes.find(n => n.id === an);
  const handleTA = (e, target) => { const val = e.target.value, pos = e.target.selectionStart; (target === "edit" ? setEc : setNc)(val); const ls = val.lastIndexOf("\n", pos - 1) + 1; const lt = val.substring(ls, pos); const si = lt.lastIndexOf("/"); if (si !== -1 && (si === 0 || lt[si - 1] === " " || lt[si - 1] === "\n")) { const f = lt.substring(si + 1); if (f.length <= 20 && !/\s/.test(f)) { const r = e.target.getBoundingClientRect(); setSO(true); setSF(f); setSS(ls + si); setST(target); setSP({ x: 16, y: Math.min(r.height - 80, Math.max(0, (pos / val.length) * r.height)) }); return; } } if (slashOpen) setSO(false); };
  const handleSlashSelect = (cmd) => { const content = st2 === "edit" ? ec : nc; const setter = st2 === "edit" ? setEc : setNc; const ref2 = st2 === "edit" ? editRef : newRef; const before = content.substring(0, ss); const cp = ref2.current ? ref2.current.selectionStart : content.length; const after = content.substring(cp); setter(before + cmd.insert + after); setSO(false); setSF(""); setTimeout(() => { if (ref2.current) { const np2 = before.length + cmd.insert.length; ref2.current.focus(); ref2.current.setSelectionRange(np2, np2) } }, 10); };
  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      <div style={{ width: 270, minWidth: 270, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>{notes.length} notes</span><Btn size="sm" onClick={() => setShowNew(true)}>+ New</Btn></div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 6px" }}>
          {notes.map(n => { const proj = projects.find(p => p.id === n.projectId); const npc = proj ? (PROJECT_COLORS.find(c => c.id === proj.colorId) || PROJECT_COLORS[0]) : null;
            return (<button key={n.id} onClick={() => { setAn(n.id); setEditing(false) }} style={{ display: "block", width: "100%", textAlign: "left", padding: 10, borderRadius: 9, border: "none", cursor: "pointer", marginBottom: 3, fontFamily: BODY, background: an === n.id ? "var(--accent-soft)" : "transparent", color: an === n.id ? "var(--accent-text)" : "var(--text2)" }}><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div><div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ fontSize: 10, color: "var(--text3)" }}>{fmtDate(n.createdAt)}</span>{npc && <Badge color={npc.hex} style={{ fontSize: 9, padding: "1px 6px" }}>{proj.name}</Badge>}</div></button>);
          })}
        </div>
      </div>
      <div style={{ flex: 1, padding: "0 26px", overflowY: "auto" }}>
        {!note ? <Empty icon="✎" title="Select a note" sub="Pick a note or create a new one" action={<Btn onClick={() => setShowNew(true)}>Create note</Btn>} />
        : editing ? (
          <div className="fi" style={{ position: "relative" }}>
            <input value={et} onChange={e => setEt(e.target.value)} style={{ fontSize: 20, fontWeight: 700, fontFamily: DISPLAY, background: "transparent", border: "none", borderBottom: "2px solid var(--accent)", borderRadius: 0, padding: "8px 0", marginBottom: 14 }} />
            <div style={{ position: "relative" }}><textarea ref={editRef} value={ec} onChange={e => handleTA(e, "edit")} rows={16} placeholder="Write in markdown... Type / for commands" />{slashOpen && st2 === "edit" && <SlashMenu position={sp} filter={sf} onSelect={handleSlashSelect} onClose={() => setSO(false)} />}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}><Btn onClick={() => { if (note) { onUpdateNote(note.id, { title: et, content: ec }); setEditing(false) } }}>Save</Btn><Btn variant="ghost" onClick={() => { setEditing(false); setSO(false) }}>Cancel</Btn></div>
          </div>
        ) : (
          <div className="fi">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div><h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: DISPLAY, marginBottom: 4 }}>{note.title}</h1><span style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(note.createdAt)}</span></div>
              <div style={{ display: "flex", gap: 6 }}><Btn size="sm" variant="secondary" onClick={() => { setEt(note.title); setEc(note.content); setEditing(true) }}>Edit</Btn><Btn size="sm" variant="danger" onClick={() => { onDeleteNote(note.id); setAn(null) }}>Delete</Btn></div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text2)" }} dangerouslySetInnerHTML={{ __html: renderMd(note.content) }} />
          </div>
        )}
      </div>
      <Modal open={showNew} onClose={() => { setShowNew(false); setSO(false) }} title="New Note">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><Label>Title</Label><input value={nt} onChange={e => setNt(e.target.value)} placeholder="Note title..." /></div>
          <div><Label>Link to project</Label><select value={np} onChange={e => setNp(e.target.value)}><option value="">No project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div style={{ position: "relative" }}><Label>Content <span style={{ fontWeight: 400, color: "var(--text3)" }}>— type / for commands</span></Label><textarea ref={newRef} value={nc} onChange={e => handleTA(e, "new")} rows={8} placeholder="# Your thoughts here..." />{slashOpen && st2 === "new" && <SlashMenu position={sp} filter={sf} onSelect={handleSlashSelect} onClose={() => setSO(false)} />}</div>
          <Btn onClick={() => { if (nt.trim()) { onAddNote({ title: nt, content: nc, projectId: np || null }); setNt(""); setNc(""); setNp(""); setShowNew(false) } }} disabled={!nt.trim()}>Create Note</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHIPPED
   ═══════════════════════════════════════════════ */

function ShippedView({ projects }) {
  const shipped = projects.flatMap(p => p.tasks.filter(t => t.status === "done").map(t => ({ ...t, pN: p.name, pC: p.colorId }))).sort((a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0));
  const td2 = shipped.length, tt2 = projects.reduce((s, p) => s + p.tasks.length, 0);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        {[{ l: "Shipped", v: td2, i: "🚀", c: "var(--st-done)" }, { l: "Total", v: tt2, i: "📋", c: "var(--st-planned)" }, { l: "Projects", v: projects.length, i: "📂", c: "var(--accent)" }, { l: "Done %", v: tt2 ? Math.round(td2 / tt2 * 100) + "%" : "0%", i: "📊", c: "var(--st-idea)" }].map((s, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 13, background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center" }}><div style={{ fontSize: 22, marginBottom: 4 }}>{s.i}</div><div style={{ fontSize: 24, fontWeight: 800, fontFamily: DISPLAY, color: s.c }}>{s.v}</div><div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: .5 }}>{s.l}</div></div>
        ))}
      </div>
      {!shipped.length ? <Empty icon="🎯" title="Nothing shipped yet" sub="Complete tasks to see them here" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{shipped.map(task => { const tt3 = TASK_TYPES.find(t => t.id === task.type) || TASK_TYPES[5]; const tpc = PROJECT_COLORS.find(c => c.id === task.pC) || PROJECT_COLORS[0];
          return (<div key={task.id} style={{ padding: "12px 16px", borderRadius: 11, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, borderLeft: `3px solid ${tpc.hex}` }}><div style={{ fontSize: 18 }}>✅</div><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{task.title}</div><div style={{ display: "flex", gap: 6 }}><Badge color={tpc.hex} style={{ fontSize: 10 }}>{task.pN}</Badge><Badge color={tpc.hex} style={{ fontSize: 10 }}>{tt3.icon} {tt3.label}</Badge></div></div>{task.dueDate && <span style={{ fontSize: 11, color: "var(--text3)" }}>{fmtDate(task.dueDate)}</span>}</div>);
        })}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MODALS
   ═══════════════════════════════════════════════ */

function TaskModal({ open, onClose, onSave, initialStatus = "idea", projectName = "" }) {
  const [title, setTitle] = useState(""); const [type, setType] = useState("dev"); const [status, setStatus] = useState(initialStatus); const [sd, setSd] = useState(""); const [dd, setDd] = useState("");
  useEffect(() => { setStatus(initialStatus) }, [initialStatus]);
  return (
    <Modal open={open} onClose={onClose} title={`Add task${projectName ? ` → ${projectName}` : ""}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div><Label>Task title</Label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" autoFocus /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><div><Label>Type</Label><select value={type} onChange={e => setType(e.target.value)}>{TASK_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}</select></div><div><Label>Status</Label><select value={status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}</select></div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><div><Label>Start</Label><input type="date" value={sd} onChange={e => setSd(e.target.value)} /></div><div><Label>Due</Label><input type="date" value={dd} onChange={e => setDd(e.target.value)} /></div></div>
        <Btn onClick={() => { if (title.trim()) { onSave({ id: gid(), title, type, status, startDate: sd, dueDate: dd, description: "", notes: "" }); setTitle(""); setType("dev"); setSd(""); setDd(""); onClose() } }} disabled={!title.trim()} size="lg" style={{ width: "100%", justifyContent: "center" }}>Add Task</Btn>
      </div>
    </Modal>
  );
}

function ProjectModal({ open, onClose, onSave }) {
  const [name, setName] = useState(""); const [desc, setDesc] = useState(""); const [colorId, setColorId] = useState("rose");
  return (
    <Modal open={open} onClose={onClose} title="New Project">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div><Label>Project name</Label><input value={name} onChange={e => setName(e.target.value)} placeholder="My brilliant idea..." autoFocus /></div>
        <div><Label>Description</Label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="What's this about?" style={{ fontFamily: BODY }} /></div>
        <div><Label>Project color — themes everything inside</Label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{PROJECT_COLORS.map(c => (<button key={c.id} onClick={() => setColorId(c.id)} style={{ width: 38, height: 38, borderRadius: 10, background: c.hex, cursor: "pointer", border: colorId === c.id ? "3px solid var(--text)" : "3px solid transparent", transition: "all .15s", position: "relative" }}>{colorId === c.id && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 16, fontWeight: 700 }}>✓</span>}</button>))}</div>
        </div>
        <Btn onClick={() => { if (name.trim()) { onSave({ id: gid(), name, description: desc, colorId, createdAt: new Date().toISOString(), tasks: [] }); setName(""); setDesc(""); setColorId("rose"); onClose() } }} disabled={!name.trim()} size="lg" style={{ width: "100%", justifyContent: "center" }}>Create Project</Btn>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════ */

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
  const addTask = (pid, s) => { setNts(s); setShowNT(true) };
  const saveTask = task => setProjects(ps => ps.map(p => p.id === apId ? { ...p, tasks: [...p.tasks, task] } : p));
  const delTask = (pid, tid) => setProjects(ps => ps.map(p => p.id === pid ? { ...p, tasks: p.tasks.filter(t => t.id !== tid) } : p));
  const addProj = proj => { setProjects(ps => [...ps, proj]); setApId(proj.id); setView("kanban") };
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
          <Sidebar projects={projects} activeProjectId={apId} onSelectProject={setApId} onNewProject={() => setShowNP(true)} activeView={view} onViewChange={setView} notesCount={notes.length} mode={mode} onToggleMode={() => setMode(m => m === "dark" ? "light" : "dark")} atmosphere={atm} onAtmosphere={setAtm} stats={stats} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
            <div style={{ padding: "16px 26px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", backdropFilter: "var(--backdrop-val)", flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, fontFamily: DISPLAY, letterSpacing: -.3 }}>{globalViews.includes(view) ? vt[view] : ap?.name || "Select a project"}</h1>
                {ap && !globalViews.includes(view) && <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ap.description} · {vt[view]}</p>}
              </div>
              {!globalViews.includes(view) && ap && <Btn onClick={() => addTask(apId, "idea")} style={{ flexShrink: 0 }}>+ Add Task</Btn>}
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
