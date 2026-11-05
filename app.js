const USER = "ZaperMaster";
// Repos que no se muestran aunque sean públicos (esta misma web y el README de perfil)
const HIDDEN = ["portfolio", USER.toLowerCase(), `${USER.toLowerCase()}.github.io`];

// Información extra de cada proyecto; los repos públicos nuevos aparecen solos con lo que diga GitHub
const EXTRA = {
  "lumen-office": {
    download: true, type: "dev", title: "Lumen Office",
    description: "Suite ofimática de escritorio para Windows: documentos, hojas de cálculo y presentaciones compatibles con Word, Excel y PowerPoint, con notas y un asistente de IA que funciona sin conexión. Tauri, React y TypeScript.",
    features: ["Documentos con comentarios, control de cambios y corrector", "Hojas con fórmulas, gráficos y tablas dinámicas", "Presentaciones con animaciones y vista del moderador", "Exporta a PDF y vídeo; abre y guarda Office", "Actualizaciones firmadas, activación propia e idiomas"],
    languages: { TypeScript: 1138068, CSS: 30827, JavaScript: 28114, Rust: 4556, HTML: 361 }
  },
  "WebAudit-Sec": {
    download: true, type: "sec",
    description: "Auditor de seguridad web: analiza una página o un sitio entero y explica cada hallazgo con su recomendación y su referencia OWASP. Versión web (FastAPI) y app de escritorio para Windows.",
    features: ["Cabeceras: CSP, HSTS, CORS, Permissions-Policy…", "Cookies, TLS, certificados y revocación OCSP/CRL", "DNS y correo: SPF, DMARC, CAA", "Archivos expuestos (.git, .env, backups…)", "Informes en PDF, HTML, JSON o CSV"],
    languages: { Python: 154028, JavaScript: 75607, CSS: 14486, HTML: 7067, Batchfile: 1134 }
  },
  "ForensiX-Hash": {
    download: true, type: "sec", title: "ForensiX Hash",
    description: "Herramienta forense de código abierto: calcula y verifica los hashes de archivos, carpetas y discos completos y guarda un informe PDF firmado. Instalador para Windows, web local (FastAPI) y línea de comandos.",
    features: ["Discos sector a sector, imágenes .dd y lectura de E01", "MD5, SHA-1, SHA-256, SHA-512, SHA3 y BLAKE2 a la vez", "Verificación automática con una segunda lectura", "Informe PDF con firma Ed25519 y sello de tiempo RFC 3161", "Cadena de custodia y actualizaciones firmadas"],
    languages: {"Python": 170415, "JavaScript": 56044, "CSS": 24416, "HTML": 20398, "Inno Setup": 3459, "Batchfile": 2805}
  },
  "Hexagonia": {
    type: "dev",
    description: "Juego multijugador en 3D hecho en equipo con Unity y Photon PUN 2: carreras de obstáculos online en las que los jugadores compiten por llegar a la meta de cada nivel.",
    features: ["Multijugador online: salas automáticas de hasta 10 jugadores", "Niveles encadenados que se sincronizan para toda la sala", "Suelos que se rompen cada vez más rápido y lava", "Obstáculos y puertas giratorias", "Personajes animados con su nombre sobre la cabeza"],
    languages: { "C#": 227654, ShaderLab: 80492, HLSL: 13994 }
  },
  "GestionAulas": {
    download: true, type: "dev", language: "Java",
    description: "Aplicación web para gestionar los edificios, plantas y aulas de un centro educativo y reservarlas para impartir cursos. Spring Boot, Spring Security, Thymeleaf y MySQL.",
    features: ["Reserva guiada: edificio → planta → aula", "Panel de administración y validación de reservas", "Roles ADMIN/USER, BCrypt y protección CSRF", "Aulas con capacidad, tipo y equipamiento", "Modo claro/oscuro y diseño adaptado a móvil"],
    languages: { HTML: 94252, Java: 83968, CSS: 22610, JavaScript: 3090 }
  },
  "Libroman": {
    type: "dev",
    description: "Gestión de una pequeña biblioteca en Odoo 18: catálogo de libros y reservas, repartido en dos módulos con permisos por grupos.",
    features: ["Módulo libro: catálogo con título, autor, ISBN y género", "Módulo reserva: préstamos con duración calculada", "Validación de fechas y de reservas solapadas", "Grupos Usuario y Bibliotecario"],
    languages: { Python: 6330 }
  }
};
// Proyectos principales: siempre primero y en este orden
const ORDER = ["lumen-office", "webaudit-sec", "forensix-hash"];
const FALLBACK = [
  { name: "lumen-office", html_url: `https://github.com/${USER}/lumen-office`, language: "TypeScript", stargazers_count: 0, pushed_at: "2026-11-02T13:00:00Z", homepage: "https://zapermaster.github.io/lumen-office/" },
  { name: "ForensiX-Hash", html_url: `https://github.com/${USER}/ForensiX-Hash`, language: "Python", stargazers_count: 0, pushed_at: "2026-11-04T09:00:00Z", homepage: "https://zapermaster.github.io/ForensiX-Hash/" },
  { name: "Hexagonia", html_url: `https://github.com/${USER}/Hexagonia`, language: "C#", stargazers_count: 0, pushed_at: "2026-10-26T13:20:47Z", homepage: "" },
  { name: "GestionAulas", html_url: `https://github.com/${USER}/GestionAulas`, language: "HTML", stargazers_count: 0, pushed_at: "2026-10-26T10:58:24Z", homepage: "" },
  { name: "WebAudit-Sec", html_url: `https://github.com/${USER}/WebAudit-Sec`, language: "Python", stargazers_count: 0, pushed_at: "2026-10-23T13:34:54Z", homepage: "" },
  { name: "Libroman", html_url: `https://github.com/${USER}/Libroman`, language: "Python", stargazers_count: 1, pushed_at: "2026-10-26T09:46:56Z", homepage: "" }
];

const KIND = { sec: "Seguridad", dev: "Desarrollo" };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = s => new Date(s).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
// El enlace a la web del proyecto no se muestra si apunta a este mismo portfolio
const isPortfolio = url => url.replace(/\/+$/, "").toLowerCase() === `https://${USER.toLowerCase()}.github.io/portfolio`;
const kindOf = (repo, x) => x.type || (/sec|audit|siem|hack|vuln|pentest|forens/i.test(repo.name) ? "sec" : "dev");
const topLangs = (repo, x, langs) => {
  const names = Object.entries(langs).sort((a, b) => b[1] - a[1]).map(([l]) => l).slice(0, 3);
  if (x.language) return [x.language, ...names.filter(n => n !== x.language)].slice(0, 3);
  return names;
};

function links(repo, x) {
  const out = [];
  if (repo.homepage && !isPortfolio(repo.homepage)) out.push(`<a class="text-link" href="${esc(repo.homepage)}" target="_blank" rel="noopener">Web del proyecto</a>`);
  if (x.download) out.push(`<a class="text-link" href="${esc(repo.html_url)}/releases/latest" target="_blank" rel="noopener">Descargar</a>`);
  out.push(`<a class="text-link" href="${esc(repo.html_url)}" target="_blank" rel="noopener">Código</a>`);
  return out.join("");
}

function featuredItem(repo, langs) {
  const x = EXTRA[repo.name] || {};
  const el = document.createElement("article");
  el.className = "project";
  el.innerHTML = `
    <div class="project-top">
      <span class="project-kind">${KIND[kindOf(repo, x)]}</span>
      <span>${esc(fmtDate(repo.pushed_at))}</span>
    </div>
    <div class="project-body">
      <div>
        <h3>${esc(x.title || repo.name)}</h3>
        <p>${esc(x.description || repo.description || "")}</p>
      </div>
      ${x.features ? `<ul class="highlights">${x.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
    </div>
    <div class="project-foot">
      <span class="tech">${esc(topLangs(repo, x, langs).join(" · "))}</span>
      ${links(repo, x)}
    </div>`;
  return el;
}

function otherItem(repo, langs) {
  const x = EXTRA[repo.name] || {};
  const el = document.createElement("article");
  el.className = "other";
  el.innerHTML = `
    <h4>${esc(x.title || repo.name)}</h4>
    <p>${esc(x.description || repo.description || "Proyecto sin descripción todavía.")}</p>
    <span class="tech">${esc(topLangs(repo, x, langs).join(" · "))}</span>
    <div class="project-foot">${links(repo, x)}</div>`;
  return el;
}

// Carga los repositorios públicos desde la API de GitHub
async function load() {
  let repos;
  try {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?type=owner&sort=pushed&per_page=100`);
    if (!res.ok) throw 0;
    repos = (await res.json()).filter(r => !r.fork && !r.archived && !HIDDEN.includes(r.name.toLowerCase()));
  } catch { repos = FALLBACK; }
  if (!repos.length) repos = FALLBACK;

  const rank = r => { const i = ORDER.indexOf(r.name.toLowerCase()); return i < 0 ? ORDER.length : i; };
  repos.sort((a, b) => rank(a) - rank(b) || new Date(b.pushed_at) - new Date(a.pushed_at));

  const langSets = await Promise.all(repos.map(async r => {
    if (EXTRA[r.name]?.languages) return EXTRA[r.name].languages;
    try { const res = await fetch(r.languages_url); if (res.ok) return await res.json(); } catch {}
    return r.language ? { [r.language]: 1 } : {};
  }));

  const featured = document.getElementById("featured");
  const others = document.getElementById("others");
  featured.textContent = "";
  repos.forEach((r, i) => {
    const el = rank(r) < ORDER.length ? featuredItem(r, langSets[i]) : otherItem(r, langSets[i]);
    el.style.animationDelay = `${i * 60}ms`;
    (rank(r) < ORDER.length ? featured : others).appendChild(el);
  });
  document.getElementById("othersBlock").hidden = !others.children.length;
}
load();

document.getElementById("year").textContent = new Date().getFullYear();

// Selector de modo claro/oscuro; la elección se recuerda en este navegador
const root = document.documentElement;
const themeColor = document.querySelector('meta[name="theme-color"]');
const currentTheme = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
const paintBar = () => themeColor.content = getComputedStyle(root).getPropertyValue("--bg").trim();
paintBar();
document.getElementById("themeToggle").addEventListener("click", () => {
  const next = currentTheme() === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try { localStorage.setItem("tema", next); } catch {}
  paintBar();
});
