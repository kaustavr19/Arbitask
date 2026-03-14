export const fmtDate = (d: Date | string | null | undefined): string =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
