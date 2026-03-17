# ⚡ Arbitask

A gamified project & idea management app — turn raw ideas into shipped work. Kanban boards, timelines, notes, collaboration, and an XP leveling system to keep you motivated.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript) ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma) ![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple?style=flat) ![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## Features

### Core
- **Dashboard** — XP bar, level progression, achievement badges, and productivity stats
- **Kanban Board** — drag-and-drop tasks across status columns (Idea → Planned → In Progress → Blocked → Done)
- **List View** — sortable table view with inline status editing
- **Timeline** — Gantt-style visualization for tasks with start/due dates
- **Notes** — markdown editor with slash commands (`/h1`, `/bullet`, `/code`, …) and a fullscreen editing mode
- **Shipped** — dedicated view for all completed tasks

### Collaboration
- **Multi-user projects** — invite collaborators via a shareable link
- **Role-based access** — Owner · Admin · Member · Viewer
- **Task assignees** — assign one or more project members to any task; avatar chips shown on cards
- **Project settings** — manage members, update project details, generate invite links

### Navigation & UX
- **Global views** — Kanban, List, and Timeline at `/kanban`, `/list`, `/timeline` show tasks across **all** your projects, with a project filter dropdown
- **Project canvas** — clicking a project opens a per-project workspace with a tab bar (Kanban · List · Timeline · Notes · Shipped)
- **Project-independent Add Task** — the header "+ Add Task" button is always visible and lets you pick the project inside the modal
- **Collapsible sidebar** — click `«` to collapse to an icon-only strip; `»` to expand
- **Themes** — dark / light / eye-protection (warm sepia) modes, cycled with a single toggle
- **Project icons** — each project gets an emoji icon for instant visual identification

### Gamification
- Earn XP for completing tasks, writing notes, creating projects
- 8 levels from 💭 Dreamer → 🔱 Mythic
- 15 unlockable achievement badges

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | [Next.js 15](https://nextjs.org/) — App Router, RSC, Server Actions |
| Language | TypeScript 5 |
| Auth | [Auth.js v5](https://authjs.dev/) — Google OAuth + Credentials provider |
| Database | [Prisma 5](https://www.prisma.io/) ORM — SQLite (dev) / PostgreSQL (prod) |
| Styling | CSS-in-JS (inline styles) + CSS custom properties — zero external CSS library |
| Fonts | [Outfit](https://fonts.google.com/specimen/Outfit) (geometric sans-serif, Google Fonts) |

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # → redirects to /dashboard
│   ├── login/page.tsx                      # Sign-in page (Google + demo)
│   ├── invite/[token]/page.tsx             # Invite accept page (public)
│   ├── (app)/                              # Auth-protected route group
│   │   ├── layout.tsx                      # Fetches projects, wraps AppShell
│   │   ├── dashboard/page.tsx
│   │   ├── kanban/page.tsx                 # Global kanban (all projects)
│   │   ├── list/page.tsx                   # Global list
│   │   ├── timeline/page.tsx               # Global timeline
│   │   ├── notes/page.tsx
│   │   ├── shipped/page.tsx
│   │   └── projects/[projectId]/
│   │       ├── layout.tsx                  # Tab bar (Kanban·List·Timeline·Notes·Shipped)
│   │       ├── kanban/page.tsx
│   │       ├── list/page.tsx
│   │       ├── timeline/page.tsx
│   │       ├── notes/page.tsx
│   │       └── shipped/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── projects/route.ts               # GET list, POST create
│   │   ├── projects/[projectId]/route.ts   # PATCH, DELETE
│   │   ├── tasks/route.ts                  # POST create
│   │   ├── tasks/[taskId]/route.ts         # PATCH, DELETE
│   │   ├── tasks/[taskId]/assignees/route.ts
│   │   ├── notes/route.ts
│   │   ├── notes/[noteId]/route.ts
│   │   ├── members/route.ts
│   │   ├── members/[memberId]/route.ts
│   │   ├── invites/route.ts                # POST create invite
│   │   └── invites/[token]/route.ts        # GET validate, POST accept
│   └── globals.css
│
├── components/
│   ├── AppShell.tsx                        # Client shell: sidebar + header + modals
│   ├── Sidebar.tsx                         # Collapsible nav (expanded / icon-only)
│   ├── FormattingToolbar.tsx
│   ├── SlashMenu.tsx
│   ├── providers/
│   │   ├── ThemeProvider.tsx               # Dark/light/eye-protection, ambient gradients
│   │   └── SessionProvider.tsx
│   ├── ui/
│   │   ├── Avatar.tsx                      # User avatar (image or initials)
│   │   ├── AssigneeSelector.tsx            # Multi-select member picker
│   │   ├── Btn.tsx · Badge.tsx · Modal.tsx · Empty.tsx
│   │   └── index.ts
│   ├── views/
│   │   ├── DashboardView.tsx
│   │   ├── KanbanView.tsx                  # Single-project or global multi-project
│   │   ├── ListView.tsx
│   │   ├── TimelineView.tsx
│   │   ├── NotesView.tsx
│   │   └── ShippedView.tsx
│   └── modals/
│       ├── TaskModal.tsx                   # Add task (with project selector)
│       ├── TaskDetailModal.tsx             # Edit task + assignees
│       ├── ProjectModal.tsx
│       └── ProjectSettingsModal.tsx        # Members + invite link
│
├── lib/
│   ├── auth.ts                             # Auth.js config
│   ├── db.ts                               # Prisma singleton
│   ├── actions.ts                          # Server actions (sign-in, createProject)
│   ├── auth-helpers.ts                     # requireProjectMember/Admin
│   ├── constants.ts                        # Role, InviteStatus, TASK_TYPES, etc.
│   ├── gamification.ts · helpers.ts · markdown.ts · theme.ts · fonts.ts
│
├── prisma/
│   └── schema.prisma
├── middleware.ts                           # Protect all routes except /login, /invite/*
├── .env.local.example
├── next.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

### 1. Clone & install

```bash
git clone https://github.com/kaustavr19/Arbitask.git
cd Arbitask
npm install
```

### 2. Configure environment

Copy the example and fill in the values:

```bash
cp .env.local.example .env.local
```

```env
# .env.local
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (from console.cloud.google.com)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Database — SQLite for local dev (no setup needed)
DATABASE_URL=file:./prisma/dev.db
```

> **Google OAuth setup:** Create a project at [console.cloud.google.com](https://console.cloud.google.com), enable the Google+ API, create OAuth 2.0 credentials, and add `http://localhost:3000/api/auth/callback/google` as an authorised redirect URI.
>
> Leave `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` empty to use **demo login only**.

Also create `.env` (for the Prisma CLI):

```bash
echo 'DATABASE_URL="file:./prisma/dev.db"' > .env
```

### 3. Set up the database

```bash
npx prisma db push      # creates prisma/dev.db and applies the schema
npx prisma generate     # generates the Prisma client
```

### 4. Run the dev server

```bash
npm run dev
```

Open **http://localhost:3000** — you'll be redirected to the login page.

### 5. Sign in

- **Demo (no OAuth needed):** use `demo@arbitask.app` / `demo1234`
- **Google:** click "Continue with Google" (requires OAuth credentials configured above)

---

## Usage Guide

### Projects

| Action | How |
|--------|-----|
| Create a project | Click **+ New idea…** at the bottom of the sidebar, or **+** next to "PROJECTS" |
| Open a project | Click its name in the sidebar → lands on the project Kanban with the tab bar |
| Edit / delete | Click **···** in the top-right header while inside a project |
| Pick an icon | Create/edit a project → choose from 20 emoji icons for visual identification |

### Tasks

| Action | How |
|--------|-----|
| Add a task | Click **+ Add Task** (header, always visible) — choose project inside the modal |
| Add to a column | Click **+ Add task** at the bottom of any Kanban column |
| Move status | Drag a card to another column, or use the inline dropdown in List view |
| Edit details | Click any task card to open the detail modal (description, dates, assignees) |
| Delete | Click **✕** on a card (Kanban) or row (List) |

**Task types:** Design · Dev · Research · Content · Marketing · Other

**Statuses:** 💡 Idea → 📋 Planned → 🔥 In Progress → 🚧 Blocked → ✅ Done → 📦 Archived

### Global Views vs Project Views

| View | URL | Shows |
|------|-----|-------|
| Global Kanban | `/kanban` | All tasks, all projects — filter by project dropdown |
| Global List | `/list` | Same, with a "Project" column |
| Global Timeline | `/timeline` | Same, with project prefix on task labels |
| Project Kanban | `/projects/[id]/kanban` | Only that project's tasks, no filter needed |
| Project Notes | `/projects/[id]/notes` | Notes linked to that project |

### Notes

1. Go to **Notes** in the sidebar (or a project's Notes tab)
2. Click **+ New** to create a note — optionally link it to a project
3. Type `/` in the editor to open the slash command palette:

| Command | Inserts |
|---------|---------|
| `/h1` | `# Heading 1` |
| `/h2` | `## Heading 2` |
| `/bullet` | `- list item` |
| `/todo` | `- [ ] checkbox` |
| `/quote` | `> blockquote` |
| `/code` | ` ``` code block ``` ` |
| `/divider` | `---` |
| `/bold` | `**text**` |
| `/callout` | `> 💡 callout` |

4. Click **⛶** to open the note in a **fullscreen editor** for distraction-free writing
5. Click **Edit** to modify inline; **Delete** to remove

### Collaboration

**Inviting collaborators:**

1. Open a project and click **⚙️** → **Project Settings**
2. Go to the **Invite** section → click **Generate Link**
3. Copy and share the link — it's valid for 7 days
4. The recipient opens the link, signs in (Google or demo), and clicks **Accept** — they're added as a Member

**Managing members:**

- In Project Settings → Members tab, see all members with their roles
- Admins and Owners can remove members (except the Owner)

**Roles:**

| Role | Can do |
|------|--------|
| Owner | Everything — cannot be removed |
| Admin | Edit project, manage members, invite |
| Member | Create/edit/delete tasks and notes |
| Viewer | Read-only |

### Sidebar

- Click **«** to collapse the sidebar to a 56px icon-only strip — hover icons for tooltips
- Click **»** to expand back to full width

### Themes & Appearance

Click the mode icon in the sidebar header to cycle through three modes:

| Mode | Icon | Look |
|------|------|------|
| Dark | 🌙 | Warm dark surfaces with a deep orange accent and subtle ambient glow |
| Light | ☀️ | Warm off-white background with a burnt-orange accent |
| Eye protection | 👁 | Warm parchment/sepia tones — easier on the eyes in low light |

All three modes use a consistent warm orange accent palette and subtle radial gradient orbs in the background for depth.

---

## Gamification

XP is calculated automatically from your activity:

| Action | XP |
|--------|----|
| Task completed | +50 XP |
| Task in progress | +15 XP |
| Task created | +10 XP |
| Note written | +10 XP |
| Project created | +20 XP |
| Task with description | +5 XP |

**Levels (8 tiers):**

| Level | Title | XP Needed |
|-------|-------|-----------|
| 1 | 💭 Dreamer | 0 |
| 2 | 🔧 Tinkerer | 100 |
| 3 | 🏗️ Builder | 250 |
| 4 | ⚡ Maker | 500 |
| 5 | 🚀 Shipper | 800 |
| 6 | 🤖 Machine | 1200 |
| 7 | 👑 Legend | 1800 |
| 8 | 🔱 Mythic | 2500 |

Visit the **Dashboard** to see your XP breakdown, level progress bar, and unlocked achievements.

---

## Deploying to Production

### Database

Switch from SQLite to [Neon](https://neon.tech) (PostgreSQL, free tier):

1. Create a Neon project and copy the connection strings
2. In `prisma/schema.prisma`, change the datasource:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

3. Update `.env.local`:

```env
DATABASE_URL=postgres://...  # pooled connection (Neon)
DIRECT_URL=postgres://...    # direct connection (for migrations)
```

4. Run `npx prisma migrate deploy`

### Deploy on Vercel

```bash
# Install Vercel CLI
npm i -g vercel
vercel
```

Set all `.env.local` variables in the Vercel dashboard under **Settings → Environment Variables**. Update `NEXTAUTH_URL` to your production domain and add the production callback URL to your Google OAuth app.

---

## Customization

### Add a task type

In `lib/constants.ts`, add to `TASK_TYPES`:

```ts
{ id: "ops", label: "Ops", icon: "⚙️" }
```

### Add an achievement

In `lib/constants.ts`, add to `ACHIEVEMENTS`:

```ts
{
  id: "overachiever",
  title: "Overachiever",
  desc: "Complete 25 tasks",
  emoji: "🌟",
  check: (s: Stats) => s.done >= 25,
}
```

The `check` function receives the `Stats` object from `calcStats()` — see `lib/gamification.ts` for all available fields.

---

## Legacy Documentation

The original **v4 Vite SPA** (React 18 + Vite 6, no backend, in-memory state) is documented at:

📄 **[docs/v4-vite-spa.md](./docs/v4-vite-spa.md)**

To run the legacy version, checkout the last Vite commit:

```bash
git checkout a17b7c0
npm install
npm run dev   # http://localhost:5173
```

---

## License

MIT — free to use, modify, and distribute.
