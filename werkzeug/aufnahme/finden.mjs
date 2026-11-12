// Aufnahmeschritte „Finden“ (Landingpage docs/img/): die Werkbank als Ausschnitt. TEXT=<Liedtext> wie in erlkoenig.mjs.
//   ART=ersatz  – Rechtsklick auf „Kind“, Werkbank bis zu den Ersatzwörtern gerollt  → ersatz.png
//   ART=luecke  – im Chorus „allein mit dir“ wird zu „allein mit ___“, Rechtsklick in die Lücke → luecke.png
import fs from 'node:fs';
const ART = process.env.ART || 'ersatz';
let text = fs.readFileSync(process.env.TEXT, 'utf8');
if (ART === 'luecke') text = text.replace('allein mit dir', 'allein mit ___');
const setzen = `const t = document.getElementById('text'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return t.value.length`;
const oeffnen = ART === 'luecke'
  ? `const t = document.getElementById('text'), p = t.value.indexOf('___') + 1; t.setSelectionRange(p, p); await lueckeWaehlen(p); return !document.getElementById('werkbank').hidden`
  : `const t = document.getElementById('text'), p = t.value.indexOf('Kind') + 1; t.setSelectionRange(p, p); await wahlNachMarkierung(p, p); return !document.getElementById('werkbank').hidden`;
// bis zur ersten Überschrift mit „Synonym“/„synonym“ rollen (die Werkbank rollt in sich)
const rollen = `const wb = document.getElementById('werkbank'); const h = [...wb.querySelectorAll('*')].find(e => e.children.length <= 2 && /synonym|ersatz/i.test(e.textContent) && e.textContent.length < 90 && e.getBoundingClientRect().top > 300);
  if (!h) return 'keine Überschrift'; const sc = (n => { while (n && n !== wb && n.scrollHeight <= n.clientHeight + 4) n = n.parentElement; return n || wb; })(h.parentElement);
  sc.scrollTop += h.getBoundingClientRect().top - sc.getBoundingClientRect().top - 12; return h.textContent.trim().slice(0, 60)`;
export default [
  { js: setzen, warte: 4000 },
  { js: oeffnen, warte: 8000 },
  ...(ART === 'ersatz' ? [{ js: rollen, warte: 1200 }] : []),
  { clip: { name: ART, sel: ['#werkbank'], rand: 0, scale: 2 } },
];
