// Alle Bilder der Feature-Seite in einer Sprache erzeugen – ein Lauf, ein Ergebnis, wiederholbar.
// (Jörg, 15.11.2026: „dokumentiere bitte die Erstellung, damit du jederzeit nach Programmänderungen die shots mit
// einem automatischen Ablaufskript jederzeit in jeder Sprache neu erstellen kannst".)
//
// Aufgenommen wird nie an der Arbeitsinstanz, sondern an einer Probeinstanz mit eigener Ablage (siehe LIESMICH.md).
// Für die Bilder „laenge" und „vergleich" muss in dieser Ablage mitTresor an sein und der KlangTresor laufen,
// für „ki" mitKI; die KlangFeder nutzt dafür Claude Code auf diesem Rechner, kein Schlüssel nötig.
//
//   URL=http://127.0.0.1:8792/ SPR=de node werkzeug/aufnahme/alle.mjs            alle Bilder
//   URL=… SPR=en node werkzeug/aufnahme/alle.mjs reimschema reimsuche            nur diese
//   … --ziel=/pfad/zum/ordner                                                    Ablageort (Vorgabe ./bilder)
//
// Jedes Bild steht unten in der Tafel BILDER mit drei Angaben: was es zeigt, wie der Zustand hergestellt wird
// („vor"), und welcher Ausschnitt genommen wird („clip" als CSS-Auswahl, „rand" als Luft darum herum).
// Der Ausschnitt wird NIE in Pixeln angegeben, sondern immer über die Elemente der Oberfläche – so überlebt die
// Aufnahme jede Änderung am Layout. Aufgenommen wird bei doppelter Pixeldichte.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { starte, warte } from './cdp.mjs';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const URL = process.env.URL || 'http://127.0.0.1:8792/';
const SPR = process.env.SPR || 'de';
const zielArg = process.argv.find(a => a.startsWith('--ziel='));
const ZIEL = zielArg ? zielArg.slice(7) : path.join(process.cwd(), 'bilder');
const nurDiese = process.argv.slice(2).filter(a => !a.startsWith('--'));
// Fenstermaß: 1600 × 1000 bei doppelter Pixeldichte. Die Breite entscheidet mit, wie groß die Kästen der linken
// Spalte werden – bei 1440 ist „Länge bei Suno" nur halb so breit und das Bild entsprechend grob.
const [FB, FH, DPR] = [+(process.env.BREIT || 1600), +(process.env.HOCH || 1000), +(process.env.DPR || 2)];

// ---------- Textgrundlage je Sprache ----------
// Deutsch: „Erlkönig" von Caspar_D (Suno, 12.11.2026). Englisch: Bowrings Übersetzung von 1853 (gemeinfrei), mit
// Abschnittsköpfen im Suno-Stil versehen, damit dieselben Teile der Oberfläche zu sehen sind. Russisch: der
// Beispieltext, den die KlangFeder selbst mitbringt (Schukowski 1818) – dort ist nichts zu laden.
// Die Liedtexte liegen NICHT im Repo; TEXT_DE und TEXT_EN zeigen auf sie (wie bei werkzeug/aufnahme/erlkoenig.mjs).
const TEXT = { de: process.env.TEXT_DE, en: process.env.TEXT_EN, ru: null };
const WORT = { de: 'Kind', en: 'child', ru: 'Дитя' };       // worauf die Werkbank aufgeht
const WENDUNG = { de: 'bei Nacht', en: 'the night', ru: 'лесной царь' };

const laden = () => {
  const p = TEXT[SPR];
  if (SPR === 'ru') return null;                      // der Beispieltext der KlangFeder steht schon im Feld
  if (!p) { console.error(`Für ${SPR} fehlt der Text: TEXT_${SPR.toUpperCase()}=<Datei> setzen.`); process.exit(2); }
  return fs.readFileSync(p, 'utf8');
};

// ---------- Hilfen für die Zustände ----------
const J = o => JSON.stringify(o);
const schritte = {
  // „alt | neu": die ältere Fassung links neben den Text legen. Ohne KlangTresor bleibt die Liste links leer.
  async vergleich(K) {
    return K.ev(`const b = document.querySelector('button[data-ansicht="zwei"]'); if (!b) return 'Knopf fehlt';
      b.click(); await new Promise(r => setTimeout(r, 6000));
      const v = document.getElementById('vergleich');
      return (v.hidden ? 'ZU' : 'offen') + ' · ' + v.textContent.trim().slice(0, 80).replace(/\\s+/g, ' ')`);
  },
  // Text einsetzen (oder beim russischen Beispiel: nichts tun, es ist schon da)
  async text(K) {
    const t = laden();
    if (!t) return 'Beispieltext der KlangFeder';
    return K.ev(`const e = document.getElementById('text'); e.value = ${J(t)};
      e.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 4000)); return e.value.length + ' Zeichen'`);
  },
  // einen der nummerierten Abschnitte links öffnen, die übrigen zu
  abschnitt: nr => async K => K.ev(`document.querySelectorAll('.sechd[aria-expanded="true"]').forEach(b => b.click());
      const b = document.querySelector('.sechd[data-sec="${nr}"]'); if (!b) return 'Abschnitt ${nr} fehlt'; b.click();
      await new Promise(r => setTimeout(r, 2500));
      return [...document.querySelectorAll('.sechd')].map(x => x.dataset.sec + ':' + x.getAttribute('aria-expanded')).join(' ')`),
  // Werkbank auf ein Wort (oder eine Wendung) aufklappen
  werkbank: (was = 'wort') => async K => K.ev(`const t = document.getElementById('text');
      const s = ${J(was === 'wort' ? WORT[SPR] : WENDUNG[SPR])};
      const p = t.value.indexOf(s); if (p < 0) return 'nicht im Text: ' + s;
      t.setSelectionRange(p + 1, ${was === 'wort' ? 'p + 1' : 'p + s.length'});
      await wahlNachMarkierung(p + 1, ${was === 'wort' ? 'p + 1' : 'p + s.length'});
      await new Promise(r => setTimeout(r, 7000));
      const w = document.getElementById('werkbank');
      return (w.hidden ? 'ZU' : 'offen') + ': ' + w.textContent.trim().slice(0, 90).replace(/\\s+/g, ' ')`),
};

// ---------- die Bilder ----------
const BILDER = [
  { name: 'titel', zeigt: 'das ganze Fenster: Aufbau links, Text in der Mitte, Reimwerkbank rechts',
    vor: [schritte.text, schritte.abschnitt(3), schritte.werkbank()], ganz: true },

  { name: 'schreiben', zeigt: 'das Textblatt beim Schreiben – Hebungen, Reimfarben, Zeilenzahlen',
    vor: [schritte.text, schritte.abschnitt(3)], clip: ['#blatt'], bis: 2 },

  { name: 'reimschema', zeigt: 'die Reimspalte rechts am Text: Hebungsmuster, Reimbuchstabe, Kadenz, Reimwähler je Abschnitt',
    vor: [schritte.text, schritte.abschnitt(3)], clip: ['#blatt'], bis: 4 },

  { name: 'reimsuche', zeigt: 'die Reimliste der Werkbank: rein, unrein, Assonanz, mit Häufigkeitsskala',
    vor: [schritte.text, schritte.werkbank()], clip: ['#werkbank'] },

  { name: 'ersatz', zeigt: 'Ersatzwörter: Synonyme, Gegenwörter, Wendungen – mit Maß und Reimhinweis',
    vor: [schritte.text, schritte.werkbank()], clip: ['#werkbank'] },

  { name: 'luecke', zeigt: 'die Werkbank auf einer Wendung: was an diese Stelle passt',
    vor: [schritte.text, schritte.werkbank('wendung')], clip: ['#werkbank'] },

  { name: 'zaehlen', zeigt: 'Abschnitt „Für Suno": Zeichenzahl gegen Sunos Grenze, Lyrics zum Kopieren',
    vor: [schritte.text, schritte.abschnitt(5)], clip: ['.sec:has(#suno)'] },

  { name: 'regie', zeigt: 'Regieanweisungen in eckigen Klammern, wie Suno sie liest',
    vor: [schritte.text, schritte.abschnitt(3)], clip: ['#blatt'], bis: 3 },

  { name: 'ki', zeigt: 'Abschnitt „Schreiben mit KI": Anbieter, Modell, Denktiefe, Aufträge',
    vor: [schritte.text, schritte.abschnitt(4)], clip: ['.sec:has(#claude)'] },

  { name: 'laenge', zeigt: 'Länge bei Suno: Spielzeit, Platz je Zeile, Dichte gegen das Archiv',
    vor: [schritte.text, schritte.abschnitt(3), async K => K.ev(`const e = document.getElementById('aLaenge');
      for (let i = 0; i < 25 && !/\\d/.test(e.textContent); i++) await new Promise(r => setTimeout(r, 500));
      return e.textContent.trim().slice(0, 90).replace(/\\s+/g, ' ')`)], clip: ['#aLaenge'] },

  { name: 'vergleich', zeigt: 'alte und neue Fassung nebeneinander, mit Kennzahlen darüber',
    vor: [schritte.text, schritte.vergleich], clip: ['#vergleich'] },
];

// ---------- Lauf ----------
fs.mkdirSync(ZIEL, { recursive: true });
const liste = nurDiese.length ? BILDER.filter(b => nurDiese.includes(b.name)) : BILDER;
if (!liste.length) { console.error(`kein Bild namens ${nurDiese.join(', ')}`); process.exit(2); }

const K = await starte({ w: FB, h: FH, mobile: false, touch: false, coarse: false, url: URL });
await K.ev(`localStorage.removeItem('klangfeder.entwurf'); localStorage.removeItem('klangfeder.beispiel'); return 1`);
await K.sende('Page.navigate', { url: URL });
await warte(5000);
// Die doppelte Pixeldichte erst JETZT setzen: beim Laden der Seite verwirft Chrome die Emulation wieder.
await K.sende('Emulation.setDeviceMetricsOverride', { width: FB, height: FH, deviceScaleFactor: DPR, mobile: false });
await warte(1200);
console.log('Sprache:', await K.ev(`try { spracheSetzen(${J(SPR)}); spracheAnwenden(); } catch (e) { return 'FEHLER ' + e.message }
  await new Promise(r => setTimeout(r, 2500)); return document.documentElement.lang || '?'`));

for (const b of liste) {
  console.log(`\n--- ${b.name}: ${b.zeigt}`);
  for (const s of b.vor) console.log('   ', JSON.stringify(await s(K)).slice(0, 170));
  // Kleine Kästen bekommen eine höhere Pixeldichte. Chrome beachtet weder clip.scale noch einen Zoom am body
  // zuverlässig; die Emulation muss erst gelöscht und dann neu gesetzt werden, sonst bleibt der alte Wert stehen.
  // Das Textblatt scrollt in sich; ohne diesen Schritt beginnt der Ausschnitt mitten im Titel.
  await K.ev(`for (const e of document.querySelectorAll('#blatt, #editor, .secbody, #werkbank')) e.scrollTop = 0;
    window.scrollTo(0, 0); return 1`);
  await warte(900);
  const datei = path.join(ZIEL, `${b.name}-${SPR}.png`);
  if (b.ganz) {
    const p = await K.bild(`${b.name}-${SPR}`);
    fs.copyFileSync(p, datei);
  } else {
    // Zwei Formen: entweder ganze Elemente (clip) oder ein Streifen des Textblatts von der ersten bis zur
    // n-ten Abschnittsmarke (bis). Die Marken ".abs" haben keine Ausdehnung, nur eine Höhe – sie taugen als
    // Schnittkante, nicht als Rahmen.
    const r = b.bis
      ? await K.ev(`const blatt = document.querySelector(${J(b.clip[0])}); if (!blatt) return null;
          const marken = [...document.querySelectorAll('.abs')];
          const bb = blatt.getBoundingClientRect();
          const ende = marken[${b.bis}];
          const unten = ende ? ende.getBoundingClientRect().top : bb.bottom;
          return { x: bb.left + scrollX, y: bb.top + scrollY, w: bb.width, h: Math.max(80, unten - bb.top) }`)
      : await K.ev(`const es = [...document.querySelectorAll(${J(b.clip.join(','))})]${b.anzahl ? `.slice(0, ${b.anzahl})` : ''};
          if (!es.length) return null;
          const rs = es.map(e => e.getBoundingClientRect());
          const x = Math.min(...rs.map(r => r.left)), y = Math.min(...rs.map(r => r.top));
          const X = Math.max(...rs.map(r => r.right)), Y = Math.max(...rs.map(r => r.bottom));
          return { x: x + scrollX, y: y + scrollY, w: X - x, h: Y - y }`);
    if (!r) { console.log(`    ! ${b.clip.join(', ')} nicht gefunden – übersprungen`); continue; }
    // Rand statt Beschnitt (Jörg, 15.11.2026: „für die feature page beschneidest du einen Rand") – das
    // Seitenverhältnis ergibt sich aus dem Inhalt, die Seite skaliert ohnehin.
    // Abschnitte haben einen eigenen Rahmen – dort genügt wenig Luft, sonst schneidet der Nachbar an.
    const m = b.rand ?? (b.clip[0].startsWith('.sec') ? 4 : 14);
    const w = r.w + 2 * m, h = r.h + 2 * m;
    // Kleine Kästen bekommen eine höhere Pixeldichte, sonst steht später ein briefmarkengroßes Bild über die
    // halbe Kachelbreite. clip.scale hilft hier nicht – Chrome richtet sich nach dem deviceScaleFactor.
    const s = await K.sende('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, fromSurface: true,
      clip: { x: Math.max(0, r.x - m), y: Math.max(0, r.y - m), width: w, height: h, scale: 1 } });
    fs.writeFileSync(datei, Buffer.from(s.result.data, 'base64'));
  }
  console.log(`    → ${datei}`);
}
console.log('\nKonsolenfehler:', K.fehler.filter(f => !/404|favicon/.test(f)).slice(0, 5));
await K.ende();
process.exit(0);
