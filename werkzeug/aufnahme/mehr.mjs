// Aufnahmeschritte „Mit KI“ / „Mit KlangTresor“ (Landingpage docs/img/). Die Probeinstanz braucht dafür beide Arbeitsweisen
// ({"mitKI":true,"mitTresor":true} in ihrer einstellungen.json); der KlangTresor wird nur lesend gefragt (Längenschätzung).
//   ART=ki      – links „Schreiben mit KI“ aufgeklappt                 → ki.png
//   ART=laenge  – links der Aufbau mit Länge und Dichte unten          → laenge.png
import fs from 'node:fs';
const ART = process.env.ART || 'ki', text = fs.readFileSync(process.env.TEXT, 'utf8');
const sec = ART === 'ki' ? 4 : 3, koerper = ART === 'ki' ? '#claude' : '#aLaenge';
export default [
  { js: `const t = document.getElementById('text'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return t.value.length`, warte: 4000 },
  { js: `document.querySelectorAll('.sechd[aria-expanded="true"]').forEach(b => b.click()); document.querySelector('.sechd[data-sec="${sec}"]').click(); return 1`, warte: ART === 'laenge' ? 9000 : 2500 },
  ...(ART === 'laenge' ? [{ js: `const e = document.getElementById('aLaenge'); e.scrollIntoView({ block: 'end' }); return e.hidden ? 'versteckt' : e.innerText.slice(0, 200)`, warte: 1200 }] : []),
  { clip: { name: ART, sel: ART === 'ki' ? ['.sechd[data-sec="4"]', '#claude'] : ['#aLaenge'], rand: 8, scale: ART === 'laenge' ? 2.5 : 1 } },
];
