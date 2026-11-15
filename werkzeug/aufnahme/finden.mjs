// Aufnahmeschritte „Finden“ (Landingpage docs/img/): die Werkbank als Ausschnitt. TEXT=<Liedtext> wie in erlkoenig.mjs.
//   ART=ersatz  – Rechtsklick auf ein Wort, Werkbank bis zu den Ersatzwörtern gerollt  → ersatz.png
//   ART=luecke  – eine Wendung wird zur Lücke, Rechtsklick hinein                     → luecke.png
// Beide Stellen hängen am Text und sind darum einstellbar (sonst ließe sich die Aufnahme nur mit dem einen
// deutschen Lied machen):
//   WORT=<Wort>       worauf die Werkbank aufgeht (Vorgabe „Kind“, englisch z. B. „child“)
//   WENDUNG=<Text>    was durch ___ ersetzt wird (Vorgabe „allein mit dir“ → „allein mit ___“)
// Fehlt das Wort im Text, bricht der Lauf mit einer Meldung ab, statt ein Bild ohne Werkbank zu liefern.
import fs from 'node:fs';
const ART = process.env.ART || 'ersatz';
const WORT = process.env.WORT || 'Kind';
const WENDUNG = process.env.WENDUNG || 'allein mit dir';
let text = fs.readFileSync(process.env.TEXT, 'utf8');
if (ART === 'luecke') {
  if (!text.includes(WENDUNG)) { console.error(`WENDUNG "${WENDUNG}" steht nicht im Text – Abbruch.`); process.exit(2); }
  text = text.replace(WENDUNG, WENDUNG.replace(/\S+$/, '___'));
} else if (!text.includes(WORT)) { console.error(`WORT "${WORT}" steht nicht im Text – Abbruch.`); process.exit(2); }
const setzen = `const t = document.getElementById('text'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return t.value.length`;
const oeffnen = ART === 'luecke'
  ? `const t = document.getElementById('text'), p = t.value.indexOf('___') + 1; t.setSelectionRange(p, p); await lueckeWaehlen(p); return !document.getElementById('werkbank').hidden`
  : `const t = document.getElementById('text'), p = t.value.indexOf(${JSON.stringify(WORT)}) + 1; t.setSelectionRange(p, p); await wahlNachMarkierung(p, p); return !document.getElementById('werkbank').hidden`;
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
