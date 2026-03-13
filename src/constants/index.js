export const TASK_TYPES = [
  { id: "design", label: "Design", icon: "◆" },
  { id: "dev", label: "Dev", icon: "⚡" },
  { id: "research", label: "Research", icon: "◎" },
  { id: "content", label: "Content", icon: "✦" },
  { id: "marketing", label: "Marketing", icon: "▲" },
  { id: "other", label: "Other", icon: "●" },
];

export const STATUSES = [
  { id: "idea", label: "Idea", emoji: "💡" },
  { id: "planned", label: "Planned", emoji: "📋" },
  { id: "in_progress", label: "In Progress", emoji: "🔥" },
  { id: "blocked", label: "Blocked", emoji: "🚧" },
  { id: "done", label: "Done", emoji: "✅" },
  { id: "archived", label: "Archived", emoji: "📦" },
];

export const PROJECT_COLORS = [
  { id: "rose", hex: "#F43F5E", lightText: "#9F1239" },
  { id: "violet", hex: "#8B5CF6", lightText: "#5B21B6" },
  { id: "cyan", hex: "#06B6D4", lightText: "#155E75" },
  { id: "emerald", hex: "#10B981", lightText: "#065F46" },
  { id: "amber", hex: "#F59E0B", lightText: "#92400E" },
  { id: "blue", hex: "#3B82F6", lightText: "#1E40AF" },
  { id: "pink", hex: "#EC4899", lightText: "#9D174D" },
  { id: "teal", hex: "#14B8A6", lightText: "#115E59" },
];

export const ATMOSPHERES = [
  { id: "ocean", label: "Ocean", icon: "🌊", darkGrad: "radial-gradient(ellipse at 20% 80%,#0A2E4D 0%,#0C1929 40%,#080F18 100%)", lightGrad: "radial-gradient(ellipse at 20% 80%,#D4EAF7 0%,#E8F1F8 40%,#F0F6FA 100%)" },
  { id: "aurora", label: "Aurora", icon: "🌌", darkGrad: "radial-gradient(ellipse at 70% 20%,#1A0A2E 0%,#0D1117 50%,#080B10 100%),radial-gradient(ellipse at 20% 80%,#0A2E2A 0%,transparent 60%)", lightGrad: "radial-gradient(ellipse at 70% 20%,#F0E6FF 0%,#F5F0FA 50%,#F8F6FB 100%),radial-gradient(ellipse at 20% 80%,#E6FAF8 0%,transparent 60%)" },
  { id: "minimal", label: "Minimal", icon: "◻️", darkGrad: "linear-gradient(180deg,#111113 0%,#0D0D0F 100%)", lightGrad: "linear-gradient(180deg,#FAFAFA 0%,#F5F5F5 100%)" },
];

export const SLASH_COMMANDS = [
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

export const TOOLBAR_ITEMS = [
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

export const LEVELS = [
  { level: 1, title: "Dreamer", emoji: "💭", minXP: 0, color: "#94A3B8" },
  { level: 2, title: "Tinkerer", emoji: "🔧", minXP: 100, color: "#60A5FA" },
  { level: 3, title: "Builder", emoji: "🏗️", minXP: 250, color: "#34D399" },
  { level: 4, title: "Maker", emoji: "⚡", minXP: 500, color: "#FBBF24" },
  { level: 5, title: "Shipper", emoji: "🚀", minXP: 800, color: "#F97316" },
  { level: 6, title: "Machine", emoji: "🤖", minXP: 1200, color: "#EC4899" },
  { level: 7, title: "Legend", emoji: "👑", minXP: 1800, color: "#A78BFA" },
  { level: 8, title: "Mythic", emoji: "🔱", minXP: 2500, color: "#F43F5E" },
];

export const ACHIEVEMENTS = [
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
