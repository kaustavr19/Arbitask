export const gid = () => Math.random().toString(36).substr(2, 9);

export const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
