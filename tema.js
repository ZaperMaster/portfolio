// Aplica el tema guardado antes de pintar la página
try { const t = localStorage.getItem("tema"); if (t) document.documentElement.dataset.theme = t; } catch {}
