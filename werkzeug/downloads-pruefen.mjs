// Prüft die Download-Adressen der Feature-Seite, bevor etwas veröffentlicht wird.
// (Jörg, 15.11.2026: „de download adressen bitte vor jedem push prüfen".)
//
// Anlass: Am 14.11.2026 habe ich ein Datenpaket als Release angelegt. GitHub macht jedes neue Release automatisch zum
// „latest“ – und die Seite baut ihre Knöpfe über releases/latest/download/. Von 21:09 Uhr an gaben alle vier Knöpfe
// in allen drei Sprachen 404; die Seite stand da, aber niemand kam an die Software. Dieses Werkzeug fängt genau das ab.
//
// Geprüft wird:
//   1. Worauf „latest“ gerade zeigt – ein Datenpaket an dieser Stelle ist allein schon ein Fehler.
//   2. Jede Adresse unter releases/latest/download/, die in docs/ steht: Antwortet sie mit 200?
//   3. Die Dateigrößen, die die Seite nennt (mb in S.laden.systeme): stimmen sie noch?
//
// Aufruf: node werkzeug/downloads-pruefen.mjs [--still]
// Rückgabe: 0 alles gut · 1 eine Adresse ist kaputt (Push abbrechen) · 2 das Netz antwortet nicht (nur warnen)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const still = process.argv.includes('--still');
const sag = (...a) => { if (!still) console.log(...a); };
const REPO = 'CasparDavi/klangfeder';
const BASIS = `https://github.com/${REPO}/releases/latest/download/`;

// ---------- 1. Die Dateinamen aus docs/ holen ----------
const inhalt = fs.readFileSync(path.join(WURZEL, 'docs/inhalt.js'), 'utf8');
const index = fs.readFileSync(path.join(WURZEL, 'docs/index.html'), 'utf8');
const dateien = new Map();                       // datei → erwartete Größe in MiB (oder null)
for (const m of inhalt.matchAll(/datei:\s*'([^']+)'(?:\s*,\s*mb:\s*(\d+))?/g)) dateien.set(m[1], m[2] ? +m[2] : null);
for (const q of [inhalt, index]) {
  for (const m of q.matchAll(/releases\/latest\/download\/([A-Za-z0-9._-]+)/g)) if (!dateien.has(m[1])) dateien.set(m[1], null);
}
if (!dateien.size) { console.error('Keine Download-Adressen in docs/ gefunden – prüft dieses Werkzeug noch das Richtige?'); process.exit(1); }

// ---------- 2. Worauf zeigt „latest“? ----------
let netzWeg = false;
const hole = async (url, art = 'HEAD') => {
  try { return await fetch(url, { method: art, redirect: 'follow', signal: AbortSignal.timeout(20000) }); }
  catch (e) { netzWeg = true; sag(`  ! ${url}\n    ${e.message}`); return null; }
};

const api = await hole(`https://api.github.com/repos/${REPO}/releases/latest`, 'GET');
let marke = null;
if (api && api.ok) {
  const r = await api.json();
  marke = r.tag_name;
  const istProgramm = (r.assets || []).some(a => /\.(exe|dmg|deb|AppImage)$/.test(a.name));
  sag(`„latest“ = ${marke} (${r.name || ''})`);
  if (!istProgramm) {
    console.error(`FEHLER: „latest“ ist ${marke} und enthält kein Programm – die Knöpfe der Seite gehen damit ins Leere.`);
    console.error(`        Heilen mit: gh api -X PATCH /repos/${REPO}/releases/<id des Programm-Release> -f make_latest=true`);
    process.exit(1);
  }
} else if (api) sag(`  ! GitHub antwortet mit ${api.status} auf die Release-Abfrage`);

// ---------- 3. Jede Adresse abklopfen ----------
let kaputt = 0, schief = [];
for (const [datei, mb] of dateien) {
  const url = BASIS + datei;
  // GitHub antwortet auf HEAD der Weiterleitung nicht immer sauber – darum ein Bereichs-GET über das erste Byte.
  const a = await hole(url, 'HEAD');
  if (!a) continue;
  if (a.status !== 200) { console.error(`FEHLER: ${a.status} für ${url}`); kaputt++; continue; }
  const laenge = +(a.headers.get('content-length') || 0);
  const istMb = laenge ? laenge / 1048576 : null;
  if (mb != null && istMb != null && Math.abs(istMb - mb) > Math.max(1.5, mb * 0.08))
    schief.push(`${datei}: die Seite sagt ${mb} MB, die Datei hat ${istMb.toFixed(0)} MB`);
  sag(`  ok ${datei}${istMb ? ` · ${istMb.toFixed(0)} MB` : ''}`);
}

if (kaputt) { console.error(`\n${kaputt} von ${dateien.size} Adressen antworten nicht mit 200 – nicht veröffentlichen.`); process.exit(1); }
if (schief.length) { console.error('\nGrößenangaben der Seite stimmen nicht mehr:'); for (const s of schief) console.error('  ' + s); process.exit(1); }
if (netzWeg) { console.error('\nDas Netz hat nicht geantwortet – ungeprüft durchgelassen.'); process.exit(2); }
sag(`\nAlle ${dateien.size} Download-Adressen antworten.`);
