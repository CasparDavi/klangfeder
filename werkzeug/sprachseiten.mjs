// Sprachseiten der Feature-Seite: docs/index.html (Englisch), docs/de.html, docs/ru.html.
// Jede Seite trägt Kopf (Titel, Beschreibung, Link-Vorschau, hreflang, Programmbeschreibung) und den ganzen Seitentext schon
// im HTML, damit Suchmaschinen ohne JavaScript sie lesen (Caspar_D 19.11.2026: „A und B umsetzen“ – Auffindbarkeit).
// Quelle bleibt docs/index.html + docs/inhalt.js; dieses Werkzeug füllt nur die Bereiche <!--kopf-->…<!--/kopf--> und
// <!--seite-->…<!--/seite--> und schreibt de.html/ru.html daraus. Nach jeder Änderung an Text oder Seite neu laufen lassen:
//   node werkzeug/sprachseiten.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { starte, warte } from './aufnahme/cdp.mjs';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.join(HIER, '..', 'docs');
const BASIS = 'https://caspardavi.github.io/klangfeder/';
const DATEI = { en: 'index.html', de: 'de.html', ru: 'ru.html' };
const ADRESSE = { en: BASIS, de: BASIS + 'de.html', ru: BASIS + 'ru.html' };
const PORT = 8796;
const OG = (L) => `${BASIS}img/og-${L}.jpg?v=20261119`;   // Vorschaubild je Sprache (werkzeug/vorschaubild.mjs); v hochzählen, wenn es neu ist


const KOPF = {
  en: { titel: 'KlangFeder – rhyming dictionary, stress and metre for song lyrics and poems',
        beschr: 'Free songwriting tool for English, German and Russian: see stress, metre and rhyme while you write, find rhymes and words that fit. Runs on your own computer.',
        og: 'KlangFeder – Verse that sounds right while you write it.' },
  de: { titel: 'KlangFeder – Reime finden, Betonung und Versmaß für Liedtexte und Gedichte',
        beschr: 'Kostenloses Werkzeug für Liedtexte und Gedichte auf Deutsch, Englisch und Russisch: Betonung, Versmaß und Reim beim Schreiben sehen, Reime und passende Wörter finden.',
        og: 'KlangFeder – Verse, die schon beim Schreiben richtig klingen.' },
  ru: { titel: 'KlangFeder — подбор рифмы, ударения и размер стиха для песен и стихов',
        beschr: 'Бесплатная программа для песен и стихов на русском, немецком и английском: ударения, размер и рифма прямо при письме, подбор рифм и подходящих слов.',
        og: 'KlangFeder — Стихи, которые звучат верно уже при письме.' },
};
const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function kopf(L) {
  const k = KOPF[L];
  const ld = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'KlangFeder', url: ADRESSE[L],
    description: k.beschr, inLanguage: L, applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Windows 10, Windows 11, macOS 11+, Linux', isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    downloadUrl: 'https://github.com/CasparDavi/klangfeder/releases/latest', image: OG(L),
    license: 'https://opensource.org/licenses/MIT', author: { '@type': 'Person', name: 'Caspar_D' } };
  /* Startseite: wer Deutsch oder Russisch gewählt hat (oder dessen Browser so eingestellt ist), kommt sofort auf seine
     Sprachseite – vor dem ersten Bild, damit kein englischer Text aufblitzt. Gleiche Reihenfolge wie spracheWaehlen(): ?lang= vor dem Gemerkten. */
  const weiter = L !== 'en' ? '' : `<script>(function(){var l=new URLSearchParams(location.search).get('lang');`
    + `if(!/^(de|en|ru)$/.test(l||'')){l=null;try{l=localStorage.getItem('kf-seite-sprache')}catch(e){}}`
    + `if(!/^(de|en|ru)$/.test(l||'')){l=null;var n=navigator.languages||[navigator.language||'en'];for(var i=0;i<n.length&&!l;i++){var x=(n[i]||'').slice(0,2);if(/^(de|en|ru)$/.test(x))l=x}}`
    + `var d={de:'de.html',ru:'ru.html'}[l];if(d)location.replace(d+location.hash)})()</script>\n`;
  return `<!--kopf-->
<title>${esc(k.titel)}</title>
<meta name="description" content="${esc(k.beschr)}">
<link rel="canonical" href="${ADRESSE[L]}">
${['en', 'de', 'ru'].map((x) => `<link rel="alternate" hreflang="${x}" href="${ADRESSE[x]}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${BASIS}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="KlangFeder">
<meta property="og:locale" content="${{ en: 'en_US', de: 'de_DE', ru: 'ru_RU' }[L]}">
<meta property="og:title" content="${esc(k.og)}">
<meta property="og:description" content="${esc(k.beschr)}">
<meta property="og:url" content="${ADRESSE[L]}">
<meta property="og:image" content="${OG(L)}">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="640">
<meta property="og:image:alt" content="${esc(k.og)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${weiter}<!--/kopf-->`;
}

const quelle = fs.readFileSync(path.join(DOCS, 'index.html'), 'utf8');
if (!quelle.includes('<!--kopf-->') || !quelle.includes('<!--seite-->')) throw new Error('Marken <!--kopf--> / <!--seite--> fehlen in docs/index.html');

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', DOCS], { stdio: 'ignore' });
process.on('exit', () => { try { server.kill(); } catch (e) {} });
await warte(800);
const b = await starte({ w: 1280, h: 900, mobile: false, touch: false, coarse: false, url: `http://127.0.0.1:${PORT}/index.html?s=${Date.now()}`,
  vorScript: `try{localStorage.setItem('kf-seite-sprache','en')}catch(e){}` });   /* sonst leitet die Browsersprache (hier Deutsch) weiter */
await warte(1500);

for (const L of ['en', 'de', 'ru']) {
  const html = await b.ev(`L=${JSON.stringify(L)}; bauen(); return document.getElementById('seite').innerHTML`);
  if (typeof html !== 'string' || html.length < 10000 || html.startsWith('EVALFEHLER')) throw new Error(`Seite ${L} leer: ${String(html).slice(0, 200)}`);
  /* Im HTML stehende Videos nicht schon laden – das Skript baut die Seite beim Öffnen ohnehin neu */
  const still = html.replace(/ autoplay(="")?/g, '').replace(/<video /g, '<video preload="none" ');
  const s = quelle
    .replace(/<html lang="[a-z]+"( data-seite="[a-z]+")?>/, `<html lang="${L}" data-seite="${L}">`)
    .replace(/<!--kopf-->[\s\S]*?<!--\/kopf-->/, () => kopf(L))
    .replace(/<!--seite-->[\s\S]*?<!--\/seite-->/, () => `<!--seite-->${still}<!--/seite-->`)
    .replace(/<nav class="sprache"/, L === 'en' ? '<nav class="sprache"' : `<!-- erzeugt von werkzeug/sprachseiten.mjs aus index.html – nicht von Hand ändern -->\n<nav class="sprache"`);
  fs.writeFileSync(path.join(DOCS, DATEI[L]), s);
  console.log(DATEI[L], Math.round(s.length / 1024), 'KB');
}
if (b.fehler.length) console.log('Fehler im Browser:\n' + b.fehler.join('\n'));

const heute = new Date().toISOString().slice(0, 10);
const alt = ['en', 'de', 'ru'].map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${ADRESSE[x]}"/>`).join('\n');
fs.writeFileSync(path.join(DOCS, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['en', 'de', 'ru'].map((L) => `  <url>\n    <loc>${ADRESSE[L]}</loc>\n    <lastmod>${heute}</lastmod>\n${alt}\n  </url>`).join('\n')}
</urlset>
`);
console.log('sitemap.xml');
b.ende?.();
process.exit(0);
