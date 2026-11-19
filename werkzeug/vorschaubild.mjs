// Vorschaubild für Links (Discord, Mastodon, Messenger, Suchmaschinen): docs/img/og-<de|en|ru>.jpg, 1280 × 640.
// Ausschnitt vom Kopf der Feature-Seite – Marke, Spruch, Kopftext, darunter das App-Bild –, ohne Sprachleiste und
// Download-Knöpfe. Nach jeder Änderung an Spruch, Kopftext oder Titelbild neu laufen lassen:
//   node werkzeug/vorschaubild.mjs     (danach node werkzeug/sprachseiten.mjs, falls die Bildversion steigt)
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { starte, warte } from './aufnahme/cdp.mjs';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.join(HIER, '..', 'docs');
const PORT = 8796, W = 1280, H = 640;
const CSS = `html{scrollbar-width:none} ::-webkit-scrollbar{display:none}
  .sprache,.held .knoepfe,.held .pdf{display:none!important}
  .held{padding:44px 0 0!important}
  .held h1{font-size:96px!important;margin:0 0 6px!important}
  .held .spruch{font-size:44px!important;margin:0 0 14px!important}
  .held p:not(.spruch){font-size:20px!important;margin:0 auto 34px!important;max-width:36em!important}`;

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', DOCS], { stdio: 'ignore' });
process.on('exit', () => { try { server.kill(); } catch (e) {} });
await warte(800);

for (const L of ['en', 'de', 'ru']) {
  const datei = { en: 'index.html', de: 'de.html', ru: 'ru.html' }[L];
  const b = await starte({ w: W, h: H, mobile: false, touch: false, coarse: false, url: `http://127.0.0.1:${PORT}/${datei}?s=${Date.now()}`,
    vorScript: `try{localStorage.setItem('kf-seite-sprache',${JSON.stringify(L)})}catch(e){}` });
  await b.sende('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await warte(1500);
  await b.ev(`const s=document.createElement('style'); s.textContent=${JSON.stringify(CSS)}; document.head.appendChild(s);
    scrollTo(0,0); await Promise.all([...document.querySelectorAll('.held img')].map(i => i.complete ? 0 : new Promise(r => i.onload = r)));
    await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); return 1`);
  const png = await b.bild('og-' + L);
  const ziel = path.join(DOCS, 'img', `og-${L}.jpg`);
  execFileSync('magick', [png, '-resize', `${W}x${H}!`, '-quality', '85', ziel]);
  console.log(ziel, Math.round(fs.statSync(ziel).size / 1024), 'KB', b.fehler.length ? b.fehler.join(' ; ') : '');
  b.ende?.();
}
process.exit(0);
