export const INIT_PROJECTS = [
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

export const INIT_NOTES = [
  { id: "n1", title: "Voice-controlled todo app", content: "What if you could just **speak** your tasks?\n\n- Natural language parsing\n- Auto-assign to projects\n- Set deadlines from speech", projectId: null, createdAt: "2025-02-20T00:00:00.000Z" },
  { id: "n2", title: "API rate limiting notes", content: "# Rate Limiting\n\nImplement:\n1. Token bucket algorithm\n2. Per-user limits\n3. Graceful degradation", projectId: null, createdAt: "2025-03-01T00:00:00.000Z" },
];
