// Alle Ansichten der Lasche „Wortwolke“ für eine Gestaltungsprüfung (nicht für die Seite): Wörter, Laute, Vokale,
// Dotplot, Bögen gerade, Bögen als Kreis, Bögen mit Reimsuche. Text: TEXT=<Datei>. Aufruf wie ansehen.mjs.
import fs from 'node:fs';
const text = fs.readFileSync(process.env.TEXT, 'utf8'), spr = process.env.SPR || 'de';
const flaeche = name => ({ clip: { sel: ['#woFlaeche'], name: `${name}-${spr}`, rand: 0 } });
const modus = v => `document.querySelector('#wolke .modi[data-wo="was"] button[data-v="${v}"]').click(); return WO.was`;
export default [
  { js: `const t = document.getElementById('text'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return t.value.length`, warte: 4000 },
  { js: `WO.drawer = false; WO.ausr = 'h'; WO.bgForm = 'gerade'; WO.dpFarbe = 'abschnitt'; WO.bgWert = 40; document.querySelector('[data-lasche="wolke"]').click(); return WO.offen`, warte: 1500 },
  { js: modus('woerter'), warte: 23000 }, flaeche('woerter'),
  { js: modus('laute'), warte: 23000 }, flaeche('laute'),
  { js: modus('vokale'), warte: 23000 }, flaeche('vokale'),
  { js: modus('dotplot'), warte: 4000 }, flaeche('dotplot'),
  { js: modus('boegen'), warte: 4000 }, flaeche('boegen-gerade'),
  { js: `const s = document.getElementById('woSuche'); s.value = 'frei'; s.dispatchEvent(new Event('input')); return 1`, warte: 2500 }, flaeche('boegen-suche'),
  { js: `const s = document.getElementById('woSuche'); s.value = ''; s.dispatchEvent(new Event('input')); WO.bgForm = 'kreis'; document.querySelector('#wolke .modi[data-wo="was"] button[data-v="dotplot"]').click(); return 1`, warte: 1500 },
  { js: modus('boegen'), warte: 4000 }, flaeche('boegen-kreis'),
  // ganze Ansicht mit Schublade (Bedienfeld) für den Kontext
  { js: `document.getElementById('woDrawer').click(); return WO.drawer`, warte: 1500 }, { bild: `ganz-boegen-${spr}` },
];
