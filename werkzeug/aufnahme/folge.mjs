// node folge.mjs <w> <h> <mobile> <schritte.mjs>  — schritte.mjs exportiert [{js, bild?, warte?}]
// Übernommen aus dem KlangTresor (Sicherung 20261027/werkzeuge-scratchpad-2217.tar.gz, fb/folge.mjs). Angepasst: Sprache
// über SPR=de|en (die KlangFeder kennt ?sprache=), keine KlangTresor-Eigenheiten (#eingefroren). Aufruf aus dem Zielordner:
//   URL=http://127.0.0.1:8792/ SPR=de node ../werkzeug/aufnahme/folge.mjs 1440 900 0 ../werkzeug/aufnahme/erlkoenig.mjs
import { starte, warte } from './cdp.mjs';
import fs from 'node:fs';
const [w, h, mob, datei] = process.argv.slice(2);
const m = mob === '1';
const LS = JSON.parse(process.env.LS || '{}');
const vor = Object.keys(LS).length ? `try{${Object.entries(LS).map(([k,v])=>`localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(v)})`).join(';')}}catch(e){}` : null;
const c = await starte({ w: +w, h: +h, mobile: m, touch: m, coarse: m, vorScript: vor });
if(!m){ await c.sende('Emulation.setDeviceMetricsOverride',{width:+w,height:+h,deviceScaleFactor:+(process.env.DPR||2),mobile:false}); await c.ev('location.reload(); return 1'); await warte(5000); }
await c.ev(`try{spracheSetzen(${JSON.stringify(process.env.SPR || 'de')}); spracheAnwenden()}catch(e){}; await new Promise(r=>setTimeout(r,1500)); return 1`);
const { default: S } = await import(new URL(datei, 'file://' + process.cwd() + '/').href);
for (const s of S){
  if (s.skip) continue;
  if (s.js){ const r = await c.ev(s.js); console.log('ERG', (s.bild||''), JSON.stringify(r)?.slice(0, 400)); }
  if (s.tipp) await c.tipp(...s.tipp);
  if (s.maus) await c.maus(...s.maus);
  await warte(s.warte ?? 1200);
  if (s.clip){ const r = await c.ev(`const rs=${JSON.stringify(s.clip.sel)}.map(q=>document.querySelector(q)).filter(Boolean).map(e=>e.getBoundingClientRect()); if(!rs.length) return null; const x=Math.min(...rs.map(r=>r.left)),y=Math.min(...rs.map(r=>r.top)),X=Math.max(...rs.map(r=>r.right)),Y=${s.clip.erstesUnten ? 'rs[0].bottom' : 'Math.max(...rs.map(r=>r.bottom))'}; return {x:x+scrollX,y:y+scrollY,w:X-x,h:Y-y}`);
    console.log('CLIP', s.clip.name, JSON.stringify(r));
    if (r){ const m = s.clip.rand ?? 10; const b = await c.sende('Page.captureScreenshot', { format:'png', clip:{ x:Math.max(0,r.x-m), y:Math.max(0,r.y-m), width:r.w+2*m, height:r.h+2*m, scale: s.clip.scale || 3 } });
      fs.writeFileSync(`${process.cwd()}/${s.clip.name}.png`, Buffer.from(b.result.data, 'base64')); } }
  if (s.pdf){ const r = await c.sende('Page.printToPDF', { preferCSSPageSize: true, printBackground: true }); if (r.result) fs.writeFileSync(`${process.cwd()}/${s.pdf}.pdf`, Buffer.from(r.result.data, 'base64')); console.log('PDF', s.pdf, r.result ? 'ok' : JSON.stringify(r.error)); }
  if (s.bild){ const p = await c.bild(s.bild); fs.renameSync(p, `${process.cwd()}/${s.bild}.png`); }
}
console.log('FEHLER', c.fehler.filter(f => !/404/.test(f)).slice(0, 8).join('\n'));
await c.ende();
