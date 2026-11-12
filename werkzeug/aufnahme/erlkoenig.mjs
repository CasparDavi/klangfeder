// Aufnahmeschritte für die Landingpage (docs/img/): „Erlkönig“ von Caspar_D (öffentlich auf Suno; Caspar_D 12.11.2026).
// Der Liedtext steht nicht im Repo: TEXT=<Datei> zeigt auf ihn. Danach zuschneiden: siehe LIESMICH.md.
import fs from 'node:fs';
const text = fs.readFileSync(process.env.TEXT, 'utf8');
export default [
  { js: `const t = document.getElementById('text'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return t.value.length`, warte: 4000 },
  // links den Aufbau aufklappen statt der Hilfe (Caspar_D 12.11.2026: „klappe mal links den struktur abschnitt aus, das sieht besser aus“)
  { js: `document.querySelectorAll('.sechd[aria-expanded="true"]').forEach(b => b.click()); document.querySelector('.sechd[data-sec="3"]').click(); return [...document.querySelectorAll('.sechd')].map(b => b.dataset.sec + ':' + b.getAttribute('aria-expanded')).join(' ')`, warte: 1500 },
  // rechts die Reimwerkbank auf „Kind“ (Caspar_D 12.11.2026: kein Bild, „wo 20% der Fläche keinen Inhalt hat“)
  { js: `const t = document.getElementById('text'), p = t.value.indexOf('Kind') + 1; t.setSelectionRange(p, p); await wahlNachMarkierung(p, p); return !document.getElementById('werkbank')?.hidden`, warte: 7000 },
  { bild: 'ganz' },
];
