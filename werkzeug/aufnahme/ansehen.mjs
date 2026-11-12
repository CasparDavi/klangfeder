// Aufnahmen für die Kachel „Ansehen“ (Jörg, 12.11.2026: „eine Abbildung mit Registerlaschen – flächentreue Wort-Cloud,
// Dotplot der Wiederholungen, Circos-Plot der Wiederholungen; mehr würde ich nicht zeigen“). Text: „Erlkönig“ (TEXT=<Datei>).
// Aufruf aus dem Aufnahmeordner: URL=http://127.0.0.1:8792/ SPR=de TEXT=$A/erlkoenig.txt node <repo>/werkzeug/aufnahme/folge.mjs 1440 900 0 <repo>/werkzeug/aufnahme/ansehen.mjs
// Ergebnis: wolke-<spr>.png, dotplot-<spr>.png, kreis-<spr>.png (nur die Fläche der Lasche, ohne Kopfzeile).
import fs from 'node:fs';
const text = fs.readFileSync(process.env.TEXT, 'utf8'), spr = process.env.SPR || 'de';
const flaeche = name => ({ clip: { sel: ['#woFlaeche'], name: `${name}-${spr}`, rand: 0 } });
const modus = v => `document.querySelector('#wolke .modi[data-wo="was"] button[data-v="${v}"]').click(); return WO.was`;
export default [
  { js: `const t = document.getElementById('text'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return t.value.length`, warte: 4000 },
  // frische Einstellungen der Wolke: Schublade zu, waagerecht, Bögen als Kreis
  { js: `WO.drawer = false; WO.ausr = 'h'; WO.bgForm = 'kreis'; WO.dpFarbe = 'abschnitt'; WO.bgWert = ${+(process.env.BGWERT || 40)}; document.querySelector('[data-lasche="wolke"]').click(); return WO.offen`, warte: 1500 },
  { js: modus('woerter'), warte: 23000 },   // Abkühlen: höchstens 20 s
  flaeche('wolke'),
  { js: modus('dotplot'), warte: 4000 },
  flaeche('dotplot'),
  { js: modus('boegen'), warte: 4000 },
  flaeche('kreis'),
];
