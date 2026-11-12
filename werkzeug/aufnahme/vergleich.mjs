// Aufnahmeschritte „Jeder Stand bleibt“ (Landingpage docs/img/): „Erlkönig“ direkt aus dem KlangTresor (URL=…/?song=<id>;
// Probeinstanz mit {"mitTresor":true}), eine Zeile überarbeitet, Ansicht „alt | neu“ → vergleich.png
export default [
  { js: `await new Promise(r => setTimeout(r, 3000)); return document.getElementById('text').value.length`, warte: 1500 },
  { js: `const t = document.getElementById('text'); t.value = t.value.replace("Mein Sohn, 's ist nur ein Nebelstreif", 'Mein Sohn, es ist ein Nebelstreif'); t.dispatchEvent(new Event('input', { bubbles: true })); return t.value.includes('es ist ein Nebelstreif')`, warte: 3000 },
  { js: `document.querySelectorAll('.sechd[aria-expanded="true"]').forEach(b => b.click()); document.querySelector('[data-ansicht="zwei"]').click(); return 1`, warte: 6000 },
  { js: `const z = [...document.querySelectorAll('#blatt *')].find(e => e.children.length === 0 && /Nebelstreif/.test(e.textContent)); z?.scrollIntoView({ block: 'center' }); return !!z`, warte: 1500 },
  { bild: 'vergleich' },
];
