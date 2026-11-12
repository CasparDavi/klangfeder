// Aufnahmeschritte „Für Suno“ (Landingpage docs/img/): links der Bereich „Für Suno“ aufgeklappt, mit Liedtext und dem
// öffentlichen Stil-Prompt von „Erlkönig“ (STIL=<Datei>, nicht im Repo). Ausschnitt: Überschrift + Bereich → suno.png
import fs from 'node:fs';
const text = fs.readFileSync(process.env.TEXT, 'utf8'), stil = fs.readFileSync(process.env.STIL, 'utf8');
export default [
  { js: `const t = document.getElementById('text'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return t.value.length`, warte: 4000 },
  { js: `document.querySelectorAll('.sechd[aria-expanded="true"]').forEach(b => b.click()); document.querySelector('.sechd[data-sec="5"]').click();
    const s = document.getElementById('sStil'); s.value = ${JSON.stringify(stil)}; s.dispatchEvent(new Event('input', { bubbles: true })); return document.getElementById('sLyZahl').textContent + ' | ' + document.getElementById('sStZahl').textContent`, warte: 2000 },
  { clip: { name: 'suno', sel: ['.sechd[data-sec="5"]', '#suno'], rand: 8, scale: 1 } },
];
