# ⚡ Arbitask (IdeaForge v4)

A gamified project & idea management app built with React. Turn raw ideas into shipped projects — with Kanban boards, timelines, notes, and an XP/leveling system to keep you motivated.

![Dashboard](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite) ![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## Features

- **Dashboard** — XP bar, level progression, achievement badges, and productivity stats at a glance
- **Kanban Board** — drag-and-drop tasks across status columns (Idea → Planned → In Progress → Blocked → Done)
- **List View** — sortable table view of all tasks with inline status editing
- **Timeline** — Gantt-style visual of tasks with start/due dates
- **Notes** — markdown editor with slash commands (`/h1`, `/bullet`, `/code`, etc.) and live preview
- **Shipped** — dedicated view for all completed tasks across projects
- **Gamification** — earn XP for completing tasks, writing notes, and creating projects; level up through 8 tiers
- **Achievements** — 15 unlockable badges (First Blood, Hat Trick, Grand Master, etc.)
- **Themes** — dark/light mode + 3 atmosphere backgrounds (Ocean, Aurora, Minimal)
- **Project colors** — each project gets its own accent color that themes the entire UI

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 6 | Dev server & bundler |
| CSS-in-JS (inline styles) | Styling — no external CSS library |
| Google Fonts | Bricolage Grotesque, Manrope, JetBrains Mono |

No backend, no database — all state lives in React (in-memory, resets on refresh).

---

## Project Structure

```
src/
├── App.jsx                        # Root component, state management
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
    ├── Sidebar.jsx                # Navigation, project list, level badge
    ├── FormattingToolbar.jsx      # Markdown toolbar (bold, italic, etc.)
    ├── SlashMenu.jsx              # / command palette in note editors
    ├── ui/
    │   ├── Btn.jsx                # Button (primary/secondary/ghost/danger)
    │   ├── Badge.jsx              # Colored tag badge
    │   ├── Modal.jsx              # Generic modal wrapper
    │   ├── Empty.jsx              # Empty state placeholder
    │   ├── Label.jsx              # Form field label
    │   └── index.js               # Barrel export
    ├── views/
    │   ├── DashboardView.jsx      # XP hero, stats, achievements
    │   ├── KanbanView.jsx         # Drag-and-drop board
    │   ├── ListView.jsx           # Sortable task table
    │   ├── TimelineView.jsx       # Gantt timeline
    │   ├── NotesView.jsx          # Notes list + markdown editor
    │   └── ShippedView.jsx        # Completed tasks summary
    └── modals/
        ├── TaskModal.jsx          # Add task form
        ├── ProjectModal.jsx       # New project form
        └── TaskDetailModal.jsx    # Full task edit with markdown description
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Installation

```bash
# Clone the repo
git clone https://github.com/kaustavr19/Arbitask.git
cd Arbitask

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

---

## Usage Guide

### Managing Projects

1. Click **+ New idea...** in the bottom of the sidebar, or the **+** icon next to "Projects"
2. Give your project a name, description, and pick a color
3. The project color themes the entire UI when that project is active
4. Click any project in the sidebar to switch to it

### Working with Tasks

**Adding tasks**
- In Kanban view, click **+ Add task** under any column
- Or click **+ Add Task** in the top-right header
- Fill in title, type (Design / Dev / Research / Content / Marketing / Other), status, and optional dates

**Editing tasks**
- Click any task card to open the full detail modal
- Write a description in markdown — use the formatting toolbar or type `/` for the slash command palette
- Toggle between **Write** and **Preview** tabs to see rendered markdown

**Moving tasks (Kanban)**
- Drag and drop task cards between status columns
- Or use the inline status dropdown in List view

**Deleting tasks**
- Click the **✕** button on a task card (Kanban) or row (List view)

### Notes

1. Navigate to **Notes** in the sidebar
2. Click **+ New** to create a note
3. Optionally link a note to a project
4. In the editor, type `/` to open the slash command menu:

| Command | Output |
|---------|--------|
| `/h1` | `# Heading 1` |
| `/h2` | `## Heading 2` |
| `/bullet` | `- list item` |
| `/todo` | `- [ ] checkbox` |
| `/quote` | `> blockquote` |
| `/code` | ` ``` code block ``` ` |
| `/divider` | `---` |
| `/bold` | `**text**` |
| `/callout` | `> 💡 callout` |

5. Click **Edit** on a saved note to modify it; **Delete** to remove it

### Gamification

XP is earned automatically based on your activity:

| Action | XP |
|--------|----|
| Task completed | +50 XP |
| Task in progress | +15 XP |
| Task created | +10 XP |
| Note written | +10 XP |
| Project created | +20 XP |
| Task with description | +5 XP |

**Levels** (8 tiers):

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

Check the **Dashboard** view to see your XP breakdown, level progress, and unlocked achievements.

### Themes & Appearance

- Click the **☀️ / 🌙** button in the top-left to toggle dark/light mode
- Use the **Ocean / Aurora / Minimal** buttons to change the background atmosphere
- The active project's color automatically updates the accent color throughout the UI

---

## Customization

### Adding a new task type

In `src/constants/index.js`, add an entry to `TASK_TYPES`:

```js
{ id: "ops", label: "Ops", icon: "⚙️" }
```

### Adding a new achievement

In `src/constants/index.js`, add an entry to `ACHIEVEMENTS`:

```js
{
  id: "overachiever",
  title: "Overachiever",
  desc: "Complete 25 tasks",
  emoji: "🌟",
  check: (s) => s.done >= 25
}
```

The `check` function receives the `stats` object from `calcStats()` — refer to `src/utils/gamification.js` for all available fields.

### Persisting data

State currently resets on page refresh. To add persistence, wrap the `useState` calls in `src/App.jsx` with `localStorage`:

```js
// Example for projects
const [projects, setProjects] = useState(() => {
  const saved = localStorage.getItem("arbitask_projects");
  return saved ? JSON.parse(saved) : INIT_PROJECTS;
});

// Persist on change
useEffect(() => {
  localStorage.setItem("arbitask_projects", JSON.stringify(projects));
}, [projects]);
```

---

## License

MIT — free to use, modify, and distribute.
