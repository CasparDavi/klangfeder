// Titelband fürs README – ohne Sprachwahl und ohne Download-Knöpfe (im Bild nicht klickbar; Caspar_D 12.11.2026)
// (wie readme-<spr>.jpg im KlangTresor): der Kopf der Landing-/Feature-Seite docs/ als Bild.
// Aufruf mit URL=http://127.0.0.1:<port>/?lang=de|en (docs/ lokal ausgeliefert, z. B. python3 -m http.server).
export default [ { js: `scrollTo(0, 0); document.querySelector('.sprache')?.remove(); document.querySelector('.held .knoepfe')?.remove(); document.documentElement.style.overflow = 'hidden'; return document.title`, warte: 1500 }, { bild: 'kopf' } ];
