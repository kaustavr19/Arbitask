# ⚡ Arbitask — v4 (Vite SPA) Legacy Docs

> This documents the original **IdeaForge v4** single-page app architecture, before the migration to Next.js 15. It is preserved for historical reference.
>
> **Current documentation:** [README.md](../README.md)

---

## Overview

A gamified project & idea management app built with React 18 + Vite 6. All state lived in-memory (no backend, no database — resets on refresh).

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 6 | Dev server & bundler |
| CSS-in-JS (inline styles) | Styling — no external CSS library |
| Google Fonts | Bricolage Grotesque, Manrope, JetBrains Mono |

No backend, no database — all state lived in React memory.

---

## Features

- **Dashboard** — XP bar, level progression, achievement badges, productivity stats
- **Kanban Board** — drag-and-drop tasks across status columns
- **List View** — sortable table view with inline status editing
- **Timeline** — Gantt-style visual for tasks with start/due dates
- **Notes** — markdown editor with slash commands and live preview
- **Shipped** — dedicated view for completed tasks
- **Gamification** — XP, 8 levels, 15 achievements
- **Themes** — dark/light mode + 3 atmosphere backgrounds (Ocean, Aurora, Minimal)
- **Project colors** — per-project accent color that themes the UI

---

## Project Structure

```
src/
├── App.jsx                        # Root component, all state management
├── main.jsx                       # React entry point
├── constants/
│   └── index.js                   # TASK_TYPES, STATUSES, PROJECT_COLORS,
│                                  # ATMOSPHERES, SLASH_COMMANDS, LEVELS, ACHIEVEMENTS
├── data/
│   └── initialData.js             # Seed projects and notes
├── styles/
│   └── fonts.js                   # Font vars + injected global CSS
├── utils/
│   ├── gamification.js            # XP & level calculation
│   ├── helpers.js                 # gid(), fmtDate()
│   ├── markdown.js                # Markdown → HTML renderer
│   └── theme.js                   # CSS variable builder, stC()
└── components/
    ├── Sidebar.jsx
    ├── FormattingToolbar.jsx
    ├── SlashMenu.jsx
    ├── ui/
    │   ├── Btn.jsx
    │   ├── Badge.jsx
    │   ├── Modal.jsx
    │   ├── Empty.jsx
    │   └── index.js
    ├── views/
    │   ├── DashboardView.jsx
    │   ├── KanbanView.jsx
    │   ├── ListView.jsx
    │   ├── TimelineView.jsx
    │   ├── NotesView.jsx
    │   └── ShippedView.jsx
    └── modals/
        ├── TaskModal.jsx
        ├── ProjectModal.jsx
        └── TaskDetailModal.jsx
```

---

## Getting Started

```bash
git clone https://github.com/kaustavr19/Arbitask.git
cd Arbitask
git checkout a17b7c0   # last Vite commit
npm install
npm run dev            # http://localhost:5173
```

---

## Customization

### Adding a task type

In `src/constants/index.js`, add to `TASK_TYPES`:

```js
{ id: "ops", label: "Ops", icon: "⚙️" }
```

### Adding an achievement

In `src/constants/index.js`, add to `ACHIEVEMENTS`:

```js
{
  id: "overachiever",
  title: "Overachiever",
  desc: "Complete 25 tasks",
  emoji: "🌟",
  check: (s) => s.done >= 25
}
```

### Persisting data

State reset on refresh. To persist, wrap `useState` in `src/App.jsx` with `localStorage`:

```js
const [projects, setProjects] = useState(() => {
  const saved = localStorage.getItem("arbitask_projects");
  return saved ? JSON.parse(saved) : INIT_PROJECTS;
});
useEffect(() => {
  localStorage.setItem("arbitask_projects", JSON.stringify(projects));
}, [projects]);
```

---

## Gamification

| Action | XP |
|--------|----|
| Task completed | +50 XP |
| Task in progress | +15 XP |
| Task created | +10 XP |
| Note written | +10 XP |
| Project created | +20 XP |
| Task with description | +5 XP |

**Levels:**

| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | 💭 Dreamer | 0 |
| 2 | 🔧 Tinkerer | 100 |
| 3 | 🏗️ Builder | 250 |
| 4 | ⚡ Maker | 500 |
| 5 | 🚀 Shipper | 800 |
| 6 | 🤖 Machine | 1200 |
| 7 | 👑 Legend | 1800 |
| 8 | 🔱 Mythic | 2500 |
