import { LEVELS } from "../constants";

export function calcStats(projects, notes) {
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

  const xp = (done * 50) + (inProgress * 15) + (totalTasks * 10) + (notes.length * 10) + (projects.length * 20) + (withDesc * 5);

  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) { currentLevel = LEVELS[i]; nextLevel = LEVELS[i + 1] || null; break; }
  }
  const xpInLevel = xp - currentLevel.minXP;
  const xpNeeded = nextLevel ? nextLevel.minXP - currentLevel.minXP : 0;
  const levelProgress = nextLevel ? Math.min(xpInLevel / xpNeeded, 1) : 1;

  return {
    totalTasks, done, inProgress, blocked, planned, ideas,
    projects: projects.length, notes: notes.length,
    projectsWithTasks, maxDoneInProject, hasCleanProject,
    xp, currentLevel, nextLevel, xpInLevel, xpNeeded, levelProgress,
    completionRate: totalTasks ? Math.round((done / totalTasks) * 100) : 0,
  };
}
