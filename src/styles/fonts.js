export const DISPLAY = `'Bricolage Grotesque',serif`;
export const BODY = `'Manrope',sans-serif`;
export const MONO = `'JetBrains Mono',monospace`;

export const CSS = `
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
