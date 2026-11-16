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
import { execFileSync } from 'node:child_process';
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
// Worauf die Werkbank aufgeht. Gewählt sind Zeilenenden, weil dort zusätzlich die Reimpartner stehen und ein Bild
// so beide Hälften der Werkbank zeigt – Ersatzwörter liefert sie an jeder Stelle der Zeile. (Hier stand bis zum
// 15.11.2026 das Gegenteil: „nur bei einem Wort am Zeilenende". Das war falsch, geprüft an „Sohn" mitten in der
// Zeile: 2+14 Synonyme, 1 Antonym. Jörgs Einwand hat außerdem einen echten Fehler zutage gebracht – das erste
// Wort jeder Zeile lieferte wirklich nichts, siehe kern/werkbank-de.mjs:321.)
// Gemessen an allen Zeilenenden des jeweiligen Beispieltexts (Jörg, 15.11.2026: ein Wort, das von jeder Kategorie
// etwas liefert, aber von keiner zu viel):
//   Not    49 reine · 23 unreine · 118 Assonanzen · 18 Konsonanzen · 80 Anklänge · 2+25 Synonyme · 1 Antonym · 7 Wendungen
//   sight  23+17 Synonyme · 1 Antonym · 6 Wendungen
//   водой  1+7 Synonyme · 13 Antonyme
// Jörgs erste Wahl „Nebel" geht nicht: im deutschen Lied steht es nur als „Nebelstreif", und darauf geht die
// Werkbank als ganzes Wort auf – Zusammensetzungen liefern nichts.
const WORT = { de: 'Not', en: 'sight', ru: 'водой' };
// Die Wendung für das Bild „luecke" muss MEHRERE Hebungen haben: die Werkbank sucht dort Wendungen, die über jede
// Hebung mitreimen. „the night" (15.11.2026) hatte nur eine – das englische Bild zeigte zweimal den Satz „The
// selection has only one beat" und sonst nichts. Gemessen an /api/reimsuche/zeile und /ketten:
//   with crown and with train  56 Wendungen · 10 Wortketten   (Bowring, Zeile 12)
//   garments of gold           48 · 3
//   the night dark and drear    0 · 0   (nicht jede Folge trägt – vorher prüfen, nicht raten)
const WENDUNG = { de: 'bei Nacht', en: 'with crown and with train', ru: 'лесной царь' };
// Für „alt | neu" wird EINE Zeile überarbeitet – sonst hat die Ansicht nichts zu zeigen. Gewählt ist je Sprache eine
// Zeile, die das Maß des Lieds verfehlt UND im Bildausschnitt liegt; geändert wird nur, was zu viel ist. Gemessen
// mit /api/analyse (Hebungen je Zeile) am jeweiligen Beispieltext – jede dieser Zeilen geht dabei von 5 auf 4:
//   de  „'s ist nur" → „es ist"   (dieselbe Überarbeitung wie im Bild vom 12.11.2026)
//   en  „tightly" gestrichen      (Verse 1, Zeile 3)
//   ru  „так" gestrichen          (Строфа 2, Zeile 1)
// Nicht raten: „Look," (en) und „lovely" (en) ändern die Zählung NICHT, die Zeilen bleiben bei 6 bzw. 5.
const FEILEN = {
  de: ["Mein Sohn, 's ist nur ein Nebelstreif", 'Mein Sohn, es ist ein Nebelstreif'],
  en: ["He holdeth the boy tightly clasp'd in his arm,", "He holdeth the boy clasp'd in his arm,"],
  ru: ['— Дитя, что ко мне ты так робко прильнул?', '— Дитя, что ко мне ты робко прильнул?'],
};

const laden = () => {
  const p = TEXT[SPR];
  if (SPR === 'ru') return null;                      // der Beispieltext der KlangFeder steht schon im Feld
  if (!p) { console.error(`Für ${SPR} fehlt der Text: TEXT_${SPR.toUpperCase()}=<Datei> setzen.`); process.exit(2); }
  return fs.readFileSync(p, 'utf8');
};

// ---------- Hilfen für die Zustände ----------
const J = o => JSON.stringify(o);
const schritte = {
  // Der Ausgang für „alt | neu": es muss eine ÄLTERE Fassung dasein, sonst steht links „leer (neuer Text)" und die
  // halbe Ansicht ist leer – so geschehen in den Bildern vom 15.11.2026 (Caspar_D, 16.11.: „damit ist die
  // Zweispaltendarstellung zur Hälfte leer"). Beim Nutzer entsteht sie von selbst: wer einen Text EINFÜGT, bekommt
  // eine Start-Version (werkBeiEingabe, inputType „insertFromPaste"). schritte.text setzt den Wert dagegen direkt –
  // dabei entsteht ein Werk, aber keine Fassung. Darum hier derselbe Weg, den das Programm beim Einfügen geht.
  async ausgang(K) {
    return K.ev(`const t = document.getElementById('text'), tx = t.value;
      if (!tx.trim()) return 'kein Text im Feld';
      werkSetzen({ id: 'frei:' + neueId(), songId: null, titel: titelAus(tx) }, null);
      gesichert = tx;
      const f = await standAblegen('start', 'Start-Version ' + jetzt());
      await new Promise(r => setTimeout(r, 1500));
      return f ? 'Start-Version abgelegt: ' + (werk && werk.titel || '') : 'KEINE Fassung abgelegt'`);
  },
  // … und danach die eine Zeile überarbeiten (FEILEN), damit links das Gestrichene steht und die Kennzahlen sich bewegen.
  async feilen(K) {
    const [alt, neu] = FEILEN[SPR];
    return K.ev(`const t = document.getElementById('text');
      if (!t.value.includes(${J(alt)})) return 'NICHT im Text: ' + ${J(alt)};
      t.value = t.value.replace(${J(alt)}, ${J(neu)});
      t.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 4000));
      return 'überarbeitet: ' + ${J(neu)}`);
  },
  // „alt | neu": die ältere Fassung links neben den Text legen (schritte.ausgang muss vorher gelaufen sein).
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
  // auf eine andere Seite der KlangFeder wechseln (Systemseite: /system). Danach steht das Arbeitsblatt nicht mehr –
  // solche Bilder gehören darum ans Ende der Liste.
  seite: pfad => async K => { await K.sende('Page.navigate', { url: URL.replace(/\/$/, '') + pfad });
      await new Promise(r => setTimeout(r, 4500));
      return K.ev(`return location.pathname + ' / ' + document.title`); },
  abschnitt: nr => async K => K.ev(`document.querySelectorAll('.sechd[aria-expanded="true"]').forEach(b => b.click());
      const b = document.querySelector('.sechd[data-sec="${nr}"]'); if (!b) return 'Abschnitt ${nr} fehlt'; b.click();
      await new Promise(r => setTimeout(r, 2500));
      return [...document.querySelectorAll('.sechd')].map(x => x.dataset.sec + ':' + x.getAttribute('aria-expanded')).join(' ')`),
  // Werkbank auf ein Wort (oder eine Wendung) aufklappen
  werkbank: (was = 'wort') => async K => K.ev(`const t = document.getElementById('text');
      const s = ${J(was === 'wort' ? WORT[SPR] : WENDUNG[SPR])};
      const p = t.value.indexOf(s); if (p < 0) return 'nicht im Text: ' + s;
      // Beim Wort genügt der Einfügestrich MITTEN im Wort (p + 1); bei einer Wendung muss die Markierung am
      // ersten Zeichen beginnen. Bis zum 15.11.2026 begann auch sie bei p + 1 – im Bild stand dann „‚ei Nacht'
      // ist markiert" statt „bei Nacht", und die erste Hebung fehlte in der Zählung („1 Hebung" statt 2).
      const von = ${was === 'wort' ? 'p + 1' : 'p'}, bis = ${was === 'wort' ? 'p + 1' : 'p + s.length'};
      t.setSelectionRange(von, bis);
      await wahlNachMarkierung(von, bis);
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
    vor: [schritte.text, schritte.werkbank()], clip: ['#werkbank'], hoch: 1.15 },

  { name: 'ersatz', zeigt: 'Ersatzwörter: Synonyme, Gegenwörter, Wendungen – mit Maß und Reimhinweis',
    // nur die Liste, ans Ende gescrollt: dort stehen Wendungen, Synonyme und Gegenteile. Mit dem Kopf darüber
    // reichte der Ausschnitt nie bis dorthin – die Reimlisten sind länger als das Sichtfenster.
    vor: [schritte.text, schritte.werkbank()], clip: ['#werkbank .lexikon'], scroll: 'ende', rand: 8 },

  { name: 'luecke', zeigt: 'die Werkbank auf einer Wendung: was an diese Stelle passt',
    vor: [schritte.text, schritte.werkbank('wendung')], clip: ['#werkbank'], hoch: 1.15 },

  { name: 'zaehlen', zeigt: 'Abschnitt „Für Suno": Zeichenzahl gegen Sunos Grenze, Lyrics zum Kopieren',
    vor: [schritte.text, schritte.abschnitt(5)], clip: ['.sec:has(#suno)'], hoch: 0.95 },

  { name: 'gebunden', zeigt: 'die zehn Lichter zwischen „frei" und „streng" in der Werkzeugzeile über dem Text',
    vor: [schritte.text], clip: ['#gebunden'], rand: 14 },

  { name: 'regie', zeigt: 'Regieanweisungen in eckigen Klammern, wie Suno sie liest',
    vor: [schritte.text, schritte.abschnitt(3)], clip: ['#blatt'], bis: 3 },

  { name: 'ki', zeigt: 'Abschnitt „Schreiben mit KI": Anbieter, Modell, Denktiefe, Aufträge',
    vor: [schritte.text, schritte.abschnitt(4)], clip: ['.sec:has(#claude)'], hoch: 1.05 },

  { name: 'laenge', zeigt: 'Länge bei Suno: Spielzeit, Platz je Zeile, Dichte gegen das Archiv',
    vor: [schritte.text, schritte.abschnitt(3), async K => K.ev(`const e = document.getElementById('aLaenge');
      for (let i = 0; i < 25 && !/\\d/.test(e.textContent); i++) await new Promise(r => setTimeout(r, 500));
      return e.textContent.trim().slice(0, 90).replace(/\\s+/g, ' ')`)], clip: ['#aLaenge'], inBlick: true },

  { name: 'vergleich', zeigt: 'alte und neue Fassung nebeneinander, mit Kennzahlen darüber',
    vor: [schritte.text, schritte.ausgang, schritte.feilen, schritte.vergleich], clip: ['#vergleich'] },

  // SONDERFALL: Dieses Bild braucht echten KI-Verkehr und läuft darum gegen die ARBEITSINSTANZ (URL=…:8790),
  // nicht gegen die Probeinstanz – dort kommt kein Auftrag durch (Knopf bleibt gesperrt, kein Protokoll).
  // Caspar_D, 15.11.2026: „dann nutze die normale instanz in claude".
  // Der Text wird NICHT gesetzt: die Lasche braucht ihn nicht, und der offene Stand bleibt unberührt.
  // Gezeigt wird allein der OBERSTE Eintrag – die älteren enthalten Liedtexte im Klartext und werden ausgeblendet.
  { name: 'kiverkehr', zeigt: 'die Lasche „KI-Verkehr": ein Auftrag an die KI und ihre Antwort, mit Modell und Dauer',
    vor: [async K => K.ev(`const l = document.querySelector('[data-lasche="ki"]'); if (!l) return 'Lasche fehlt';
      l.click(); await new Promise(r => setTimeout(r, 1500));
      // Der Filter steht beim Laden auf „dieses Lied" – im Aufnahme-Browser ist aber keins geladen, die Lasche
      // bliebe leer. „diese Sitzung" zeigt den Verkehr des laufenden Servers, unabhängig vom Lied.
      const sicht = document.getElementById('kvSicht');
      if (sicht) { sicht.value = 'sitzung'; sicht.dispatchEvent(new Event('change', { bubbles: true })); }
      // Die Liste wird nachgeladen – warten, bis sie steht, sonst bleibt das Bild leer.
      for (let i = 0; i < 30; i++) { if (document.querySelectorAll('#kiverkehr .kvlauf').length) break; await new Promise(r => setTimeout(r, 500)); }
      await new Promise(r => setTimeout(r, 900));
      // Gezeigt wird der Eintrag IN DER SPRACHE DER OBERFLÄCHE. Seit die Prompts übersetzt sind (ki-prompts.mjs),
      // ist die Anrede der KlangFeder je Sprache verschieden – daran lässt sich der passende Lauf erkennen.
      const marke = { de: 'In der KlangFeder wird dir geschrieben', en: 'You are being written to in KlangFeder', ru: 'Вам пишут в KlangFeder' }['${SPR}'] || '';
      const alle = [...document.querySelectorAll('#kiverkehr .kvlauf')];
      const treffer = alle.find(e => (e.innerText || '').includes(marke)) || alle[0];
      alle.forEach(e => { if (e !== treffer) e.style.display = 'none'; });
      return alle.length + ' Einträge, gezeigt: ' + (treffer ? (treffer.innerText || '').slice(0, 40).replace(/\\n/g, ' ') : 'keiner')`)],
    clip: ['#kiverkehr'], rand: 14, hoch: 0.40 },

  // Zuletzt, weil die Seite wechselt: die Systemseite zeigt, welche Nachschlagewerke anderer Programme auf diesem
  // Rechner liegen (fremdwoerterbuecher.mjs). Was davon eingebunden wird, entscheidet der Nutzer.
  { name: 'eigene', zeigt: 'Systemseite: Wörterbücher anderer Programme auf diesem Rechner, mit Ort und Größe',
    // Die Orte werden unscharf gezeichnet (Jörg, 15.11.2026: „du könntest es auch blurren"): im Programm stehen sie
    // im Klartext, im Bild für die öffentliche Seite sagen sie nur noch „hier steht ein Pfad". Den Benutzernamen
    // kürzt fremdwoerterbuecher.mjs ohnehin mit ~ ab; unscharf bleiben die maschinenlangen Asset-Nummern und die
    // Frage, welche Sprachwörterbücher gerade auf diesem Rechner liegen.
    vor: [schritte.seite('/system'),
          async K => K.ev(`const o = document.querySelectorAll('#fremd .fo');
            o.forEach(e => { e.style.filter = 'blur(3px)'; e.style.opacity = '0.75'; });
            return o.length + ' Orte unscharf'`)],
    clip: ['#fremd'], rand: 18, inBlick: true, hoch: 0.40 }
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
  // Es scrollt nicht die Werkbank selbst, sondern die Liste darin (.lexikon, overflow-y: auto).
  // Es scrollt nicht die Werkbank selbst, sondern die Liste darin (.lexikon, overflow-y: auto) – und sie lädt
  // beim Scrollen nach, darum in Schleife, bis der Boden steht.
  if (b.scroll === 'ende') console.log('    ', await K.ev(`const l = document.querySelector('#werkbank .lexikon');
    if (!l) return 'keine Liste';
    // zielgenau: den letzten Eintrag in den Blick holen. Reines scrollTop = scrollHeight bleibt stehen, weil die
    // Liste beim Scrollen nachlädt und der alte Endwert dann nicht mehr das Ende ist.
    for (let i = 0; i < 10; i++) { l.lastElementChild?.scrollIntoView({ block: 'end' }); await new Promise(r => setTimeout(r, 400)); }
    const b = l.getBoundingClientRect();
    const sicht = [...l.querySelectorAll('.lxh')].filter(h => { const r = h.getBoundingClientRect();
      return r.top >= b.top - 2 && r.top <= b.bottom + 2; }).map(h => h.textContent.trim().slice(0, 40));
    return l.scrollTop + '/' + (l.scrollHeight - l.clientHeight) + ' · im Blick: ' + (sicht.join(' | ') || '(keine)')`));
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
          // Der Liedtitel steht ÜBER dem Blatt (H2#songtitel, direkt an dessen Oberkante). Bis zum 15.11.2026
          // begann der Ausschnitt an der Blattkante, und der Rand schnitt quer durch den Titel. Jetzt kommt er
          // ganz mit: man sieht, an welchem Lied gearbeitet wird.
          const t = document.querySelector('#songtitel');
          const tr = t && t.getBoundingClientRect();
          const oben = tr && tr.bottom <= bb.top + 8 && tr.height > 8 ? tr.top : bb.top;
          // Die rechte Kante am Inhalt messen, nicht am Kasten: die Spalte mit Hebungen, Reim und Kadenz stand
          // sonst angeschnitten am Bildrand.
          const rs = [...blatt.querySelectorAll('*')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0 && r.height > 0 && r.top < unten);
          const rechts = Math.max(bb.right, ...rs.map(r => r.right));
          return { x: bb.left + scrollX, y: oben + scrollY, w: rechts - bb.left, h: Math.max(80, unten - oben) }`)
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
    const w = r.w + 2 * m;
    // „hoch" begrenzt das Seitenverhältnis: ein Abschnitt der linken Spalte ist dreimal so hoch wie breit und
    // würde als Kachelbild zum Streifen. Abgeschnitten wird unten, der Kopf bleibt stehen.
    const h = Math.min(r.h + 2 * m, b.hoch ? w * b.hoch : Infinity);
    // Kleine Kästen bekommen eine höhere Pixeldichte, sonst steht später ein briefmarkengroßes Bild über die
    // halbe Kachelbreite. clip.scale hilft hier nicht – Chrome richtet sich nach dem deviceScaleFactor.
    // Chrome rendert einen Ausschnitt neu und verwirft dabei den Scrollzustand innerer Listen – „ersatz" zeigte
    // darum den Anfang der Werkbank statt ihres Endes. Wo der Scrollzustand zählt, wird deshalb das ganze
    // Fenster aufgenommen (da wird nichts neu gerendert) und erst danach zugeschnitten.
    // „inBlick": dasselbe für Kästen, die WEITER UNTEN auf der Seite stehen als das Fenster hoch ist. Chrome
    // rendert beim Zuschneiden nur, was auf dem Schirm steht – „laenge" kam am 15.11.2026 als ganz schwarzes
    // Bild heraus, obwohl der Kasten seine Zahlen hatte. Darum erst hinscrollen, dann das ganze Fenster nehmen.
    let x = Math.max(0, r.x - m), y = Math.max(0, r.y - m);
    if (b.scroll || b.inBlick) {
      if (b.inBlick) {
        console.log('    ', await K.ev(`document.querySelector(${J(b.clip[0])})?.scrollIntoView({ block: 'center' });
          await new Promise(r => setTimeout(r, 700)); return 'gescrollt auf ' + Math.round(scrollY)`));
        await warte(500);
      }
      // Jetzt zählen die Koordinaten IM FENSTER, nicht auf der Seite: das Vollbild zeigt nur das Fenster.
      const v = await K.ev(`const es = [...document.querySelectorAll(${J(b.clip.join(','))})];
        if (!es.length) return null; const rs = es.map(e => e.getBoundingClientRect());
        const x = Math.min(...rs.map(r => r.left)), y = Math.min(...rs.map(r => r.top));
        return { x, y, w: Math.max(...rs.map(r => r.right)) - x, h: Math.max(...rs.map(r => r.bottom)) - y }`);
      if (v) { x = Math.max(0, v.x - m); y = Math.max(0, v.y - m); }
      const voll = await K.bild(`${b.name}-${SPR}-voll`);
      const d = +(process.env.DPR || 2);
      execFileSync('magick', [voll, '-crop', `${Math.round(w * d)}x${Math.round(h * d)}+${Math.round(x * d)}+${Math.round(y * d)}`, '+repage', datei]);
      fs.unlinkSync(voll);
    } else {
      const s = await K.sende('Page.captureScreenshot', { format: 'png', fromSurface: true,
        clip: { x, y, width: w, height: h, scale: 1 } });
      fs.writeFileSync(datei, Buffer.from(s.result.data, 'base64'));
    }
  }
  console.log(`    → ${datei}`);
}
console.log('\nKonsolenfehler:', K.fehler.filter(f => !/404|favicon/.test(f)).slice(0, 5));
await K.ende();
process.exit(0);
