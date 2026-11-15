// Rechnet die Seitenverhältnisse der aufgenommenen Bilder gegen das Raster der Feature-Seite.
//
// Caspar_D, 27.10.2026: „die Bildunterkanten immer alignieren und die Überschriften der Unterschriften ebenfalls
// auf der gleichen Baseline". Zwei Kacheln einer Reihe haben gleich hohe Bilder, wenn gilt
//
//     Breite₁ / Verhältnis₁  =  Breite₂ / Verhältnis₂        (Breite in Rasterspalten, 12 je Reihe)
//
// Das Verhältnis steht in FORMAT (docs/inhalt.js) und beschneidet das Bild (object-fit: cover). Weicht es vom
// echten Maß der Aufnahme ab, fehlt etwas am Bild – darum rechnet dieses Werkzeug beides gegeneinander.
//
//   node werkzeug/aufnahme/formate.mjs <bilderordner>
//
// Ausgabe je Reihe: was fluchten würde, was das Bild wirklich hat, und wie viel Prozent verloren gingen.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ORDNER = process.argv[2];
if (!ORDNER) { console.error('Aufruf: node werkzeug/aufnahme/formate.mjs <bilderordner>'); process.exit(2); }

// Die Reihen der Seite, so wie docs/inhalt.js sie setzt (Summe je Reihe = 12).
const REIHEN = [
  [['schreiben', 12]],
  [['reimschema', 6], ['reimsuche', 6]],
  [['ersatz', 7], ['luecke', 5]],
  [['zaehlen', 6], ['regie', 6]],
  [['ki', 5], ['laenge', 7]],
  [['vergleich', 12]],
];

const mass = name => {
  const treffer = fs.readdirSync(ORDNER).filter(f => new RegExp(`^${name}-[a-z]{2}\\.(png|webp)$`).test(f));
  if (!treffer.length) return null;
  const [w, h] = execFileSync('magick', ['identify', '-format', '%w %h', path.join(ORDNER, treffer[0])], { encoding: 'utf8' }).split(' ').map(Number);
  return { w, h, r: w / h, datei: treffer[0] };
};

console.log('Reihe                     Bild        echt   fluchtend   Verlust');
for (const reihe of REIHEN) {
  const teile = reihe.map(([n, b]) => ({ n, b, m: mass(n) })).filter(x => x.m);
  if (!teile.length) continue;
  if (teile.length === 1) {
    const { n, m } = teile[0];
    console.log(`${n.padEnd(25)} ${(m.w + 'x' + m.h).padEnd(11)} ${m.r.toFixed(2).padStart(5)}   (allein)`);
    continue;
  }
  // Die erste Kachel gibt die Bildhöhe vor; die zweite muss sich fügen.
  const [a, z] = teile;
  const soll = a.m.r * z.b / a.b;
  // Verlust: wie viel Prozent der Bildfläche der Beschnitt wegnimmt (object-fit: cover)
  const verlust = soll > z.m.r ? (1 - z.m.r / soll) * 100 : (1 - soll / z.m.r) * 100;
  console.log(`${(a.n + ' (' + a.b + ')').padEnd(25)} ${(a.m.w + 'x' + a.m.h).padEnd(11)} ${a.m.r.toFixed(2).padStart(5)}   (gibt vor)`);
  console.log(`${(z.n + ' (' + z.b + ')').padEnd(25)} ${(z.m.w + 'x' + z.m.h).padEnd(11)} ${z.m.r.toFixed(2).padStart(5)}   ${soll.toFixed(2).padStart(6)}   ${verlust.toFixed(0).padStart(4)} %${verlust > 12 ? '   ← zu viel: Ausschnitt ändern oder Kachel auf „quer"' : ''}`);
}
console.log('\nFORMAT-Zeile für docs/inhalt.js (echte Maße, ohne Beschnitt):');
console.log('const FORMAT = { ' + REIHEN.flat().map(([n]) => { const m = mass(n); return m ? `${n}: '${m.w}/${m.h}'` : null; }).filter(Boolean).join(', ') + ' };');
