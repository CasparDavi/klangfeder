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
// Derbe Wörter (nur für die Unschärfe in den Bildern der Feature-Seite – die App zeigt sie ungefiltert): Wortstämme
const DERB = '/(fick|fotz|wichs|nutte|hure|scheiß|scheiss|fuck|cunt|shit|bitch|whore|motherf|nigg|пизд|хуй|хуе|хуя|хуё|ебл|ебат|ебан|ёбан|бляд|блят|мудак|муди|залуп|сучк|сука|суки|шлюх|жоп)/';
// Die Wendung für das Bild „luecke" muss MEHRERE Hebungen haben: die Werkbank sucht dort Wendungen, die über jede
// Hebung mitreimen. „the night" (15.11.2026) hatte nur eine – das englische Bild zeigte zweimal den Satz „The
// selection has only one beat" und sonst nichts. Gemessen an /api/reimsuche/zeile und /ketten:
//   with crown and with train  56 Wendungen · 10 Wortketten   (Bowring, Zeile 12)
//   garments of gold           48 · 3
//   the night dark and drear    0 · 0   (nicht jede Folge trägt – vorher prüfen, nicht raten)
// 17.11.2026: „bei Nacht“ und „лесной царь“ zählten nur noch eine Hebung – das Bild zeigte dann statt Vorschlägen den
// Hinweis „für einfache Endreime die Zeile anklicken“. Jetzt Wendungen mit sicher zwei Hebungen.
const WENDUNG = { de: 'Nacht und Wind', en: 'with crown and with train', ru: 'туман над водой' };
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
      // seit 16.11.2026 steht der Rahmen (#werkbank) immer; ob etwas darin steht, sagt #wbInhalt
      const w = document.getElementById('wbInhalt');
      return (w.hidden ? 'ZU' : 'offen') + ': ' + w.textContent.trim().slice(0, 90).replace(/\\s+/g, ' ')`),
  // Probetext je Sprache für Klangketten und Fluss (gemeinfrei; Caspar_D 17.11.2026: „gemeinfrei reicht“): Rilke „Der Panther“,
  // Poe „The Raven“, Majakowski „Послушайте!“ – gemessen: sie zeigen Mehrsilbenreim, Schlagreim, Zeilensprung, Pause, Drop
  async probe(K) {
    const f = { de: process.env.PROBE_DE, en: process.env.PROBE_EN, ru: process.env.PROBE_RU }[SPR];
    if (!f || !fs.existsSync(f)) return 'KEIN Probetext für ' + SPR;
    const t = fs.readFileSync(f, 'utf8');
    // der echte Titel des Gedichts – sonst bliebe der Titel des vorigen Texts stehen (gesehen beim Raben: „Who rides there …“)
    const titel = { de: 'Der Panther', en: 'The Raven', ru: 'Послушайте!' }[SPR];
    return K.ev(`const e = document.getElementById('text'); e.value = ${J(t)};
      e.dispatchEvent(new Event('input', { bubbles: true }));
      const h = document.getElementById('songtitel'); if (h) { h.textContent = ${J(titel)}; h.dispatchEvent(new Event('input', { bubbles: true })); }
      await new Promise(r => setTimeout(r, 4500)); return e.value.length + ' Zeichen Probetext · ' + (h && h.textContent)`);
  },
  // Klangketten-Pillen setzen: genau diese an (binnen = Binnenreim)
  ketten: (arten = []) => async K => K.ev(`for (const b of document.querySelectorAll('#ketten [data-kette]')) { if (b.classList.contains('an') !== ${J(arten)}.includes(b.dataset.kette)) b.click(); }
      await new Promise(r => setTimeout(r, 2500));
      return [...document.querySelectorAll('#ketten [data-kette].an')].map(b => b.dataset.kette).join(' + ') || 'keine'`),
  // Werkbank auf ein beliebiges Wort des Texts
  werkbankAuf: woerter => async K => K.ev(`const t = document.getElementById('text'), s = ${J(woerter)}['${SPR}'];
      const p = t.value.indexOf(s);
      // steht das Wort nicht im Text, sucht die Werkbank es über ihr Suchfeld – wie ein Nutzer
      if (p < 0) { const f = document.getElementById('wbSuchfeld'); f.value = s; f.dispatchEvent(new Event('input', { bubbles: true })); await werkbankSuchen(s); }
      else { t.setSelectionRange(p + 1, p + 1); await wahlNachMarkierung(p + 1, p + 1); }
      await new Promise(r => setTimeout(r, 7000));
      return document.getElementById('wbInhalt').textContent.trim().slice(0, 80).replace(/\\s+/g, ' ')`),
  // nur bestimmte Gruppen der Werkbank zeigen (für ein Bild), die übrigen ausblenden
  nurGruppen: titel => async K => K.ev(`const soll = ${J(titel)}.map(x => x.split('{w}')[0]).map(k => typeof t === 'function' ? t(k, { w: '' }) : k);
      let n = 0; for (const h of document.querySelectorAll('#wbInhalt .lxh')) { const g = h.nextElementSibling, ja = soll.some(s => s && h.textContent.startsWith(s.replace(/[„“«»"]/g, '').trim().split(' ')[0]));
        h.style.display = ja ? '' : 'none'; if (g && g.classList.contains('lxg')) g.style.display = ja ? '' : 'none'; if (ja) n++; }
      document.querySelectorAll('#wbInhalt .klangwahl, #wbInhalt .lxbed, #wbUeb').forEach(e => e.style.display = 'none');
      return n + ' Gruppen gezeigt'`),
  // „Anlaut wie in …“: Pille an, Wort ins Feld
  anlaut: woerter => async K => K.ev(`const f = document.getElementById('wbAnlaut'); if (!f) return 'Anlaut-Feld fehlt';
      f.value = ${J(woerter)}['${SPR}']; f.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 5000)); return 'Anlaut: ' + f.value + ' ' + (document.querySelector('.alziel') || {}).textContent`),
  // Klangfarben-Pillen setzen (additiv; leer = alle aus)
  klang: (arten = []) => async K => K.ev(`for (const b of document.querySelectorAll('[data-klang]')) { const soll = ${J(arten)}.includes(b.dataset.klang); if (b.classList.contains('an') !== soll) b.click(); }
      await new Promise(r => setTimeout(r, 2500));
      return [...document.querySelectorAll('[data-klang].an')].map(b => b.textContent).join(' + ') || 'keine'`),
};

// ---------- die Bilder ----------
const BILDER = [
  { name: 'titel', zeigt: 'das ganze Fenster: Aufbau links, Text in der Mitte, Reimwerkbank rechts',
    vor: [schritte.text, schritte.abschnitt(3), schritte.werkbank()], ganz: true },

  { name: 'schreiben', zeigt: 'das Textblatt beim Schreiben – Hebungen, Reimfarben, Zeilenzahlen',
    vor: [schritte.text, schritte.abschnitt(3)], clip: ['#blatt'], bis: 2 },

  { name: 'reimschema', zeigt: 'die Reimspalte rechts am Text: Hebungsmuster, Reimbuchstabe, Kadenz, Reimwähler je Abschnitt',
    // Die Kommentarzeile des russischen Beispiels (# Пример: Гёте … Правый клик …) ist ein Bedienhinweis, kein Liedtext; sie läuft
    // ohne Umbruch und schiebt die Reimspalte weit nach rechts – ein leerer Streifen mitten im Bild. Für dieses Bild aus dem Feld
    // nehmen (nur in der Probeinstanz). Feld, Fenster und Werkbankbreite: FELD unten.
    vor: [schritte.text, schritte.abschnitt(3), async K => K.ev(`const t = document.getElementById('text');
      if (/^#/m.test(t.value)) { t.value = t.value.split('\\n').filter(z => !z.startsWith('#')).join('\\n'); t.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 3000)); }
      return 'ohne Kommentarzeile'`)],
    clip: ['#blatt'], bis: 7 },

  { name: 'reimsuche', zeigt: 'die Reimliste der Werkbank: rein, unrein, Assonanz, mit Häufigkeitsskala',
    vor: [schritte.text, schritte.werkbank()], clip: ['#werkbank'], hoch: 1.15, rand: 0 },

  { name: 'ersatz', zeigt: 'Ersatzwörter: Synonyme, Gegenwörter, Wendungen – mit Maß und Reimhinweis',
    // nur die Liste, ans Ende gescrollt: dort stehen Wendungen, Synonyme und Gegenteile. Mit dem Kopf darüber
    // reichte der Ausschnitt nie bis dorthin – die Reimlisten sind länger als das Sichtfenster.
    vor: [schritte.text, schritte.werkbank()], clip: ['#werkbank .lexikon'], scroll: 'ende', rand: 8 },

  { name: 'luecke', zeigt: 'die Werkbank auf einer Wendung: was an diese Stelle passt',
    // rand 0: mit Luft kam oben ein Streifen der Leiste über der Werkbank mit (oranger Anschnitt, Jörg 17.11.2026);
    // hoch 0.9: gleich hoch wie das Ersatz-Bild daneben, dessen Text länger ist – sonst bleibt dort ein halber leerer Kasten
    vor: [schritte.text, schritte.werkbank('wendung')], clip: ['#werkbank'], hoch: 0.9, rand: 0 },

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
      // NICHT „ganz zeigen“: der volle Auftrag schiebt die Antwort der KI aus dem Feld – Auftrag und Antwort gehören beide ins Bild
      return alle.length + ' Einträge, gezeigt: ' + (treffer ? (treffer.innerText || '').slice(0, 40).replace(/\\n/g, ' ') : 'keiner')`)],
    clip: ['#kiverkehr'], rand: 14, hoch: 0.40 },

  // Klangfarbe: Pillen „hart“ und „dunkel“ an – danach wieder aus – orange Linie unter jedem Wort, wie stark es passt
  { name: 'klangfarbe', zeigt: 'Werkbank mit Klangfarben-Pillen: passende Wörter vorn, orange Linie zeigt, wie stark',
    vor: [schritte.text, schritte.werkbank(), schritte.klang(['hart', 'dunkel'])], clip: ['#wbInhalt .klangwahl', '#wbInhalt .lexikon'], rand: 10, hoch: 0.62 },
  { name: 'klangfarbe-aus', zeigt: '(kein Bild – Pillen wieder aus)', vor: [schritte.klang([])], nurSchritt: true },
  // Lautschrift tippen: Suchfeld der Werkbank mit einer Lautschrift-Suche, darunter die Bildschirmtastatur (ə-Knopf), in das
  // Feld der Werkbank gerückt (Jörg, 17.11.2026: „auch die Lautschrifttastatur hab ich nicht gesehen“)
  { name: 'lautschrift', zeigt: 'Suchfeld mit Lautschrift, Reime darauf, darunter die Lautschrift-Tastatur mit Erklärung',
    vor: [schritte.text, async K => K.ev(`const q = ${J({ de: '/ˈnaxt/', en: '/naɪt/', ru: '/ˈnot͡ɕ/' }[SPR])};
      const f = document.getElementById('wbSuchfeld'); f.focus(); f.value = q; f.dispatchEvent(new Event('input', { bubbles: true }));
      await werkbankSuchen(q); await new Promise(r => setTimeout(r, 5000));
      lautFenster(true); await new Promise(r => setTimeout(r, 600));
      const k = document.getElementById('lautFenster'), w = document.getElementById('werkbank').getBoundingClientRect();
      k.style.width = (w.width - 40) + 'px'; k.style.left = (w.left + 20) + 'px';
      k.style.top = (w.top + ${Math.round(560 / (1136 / 1600))} - k.offsetHeight - 18) + 'px';
      return q + ' · Tastatur ' + k.offsetWidth + '×' + k.offsetHeight + ' · ' + document.getElementById('wbInhalt').textContent.trim().slice(0, 60)`)] },
  { name: 'lautschrift-zu', zeigt: '(kein Bild – Tastatur zu, Suchfeld leer)', vor: [async K => K.ev(`lautFenster(false); const f = document.getElementById('wbSuchfeld'); f.value = ''; f.blur(); return 'zu'`)], nurSchritt: true },

  // Klangketten: alle Pillen an, das Blatt mit dem Probetext (Zeichen im Text, Pillenzeile darüber)
  { name: 'klangketten', zeigt: 'Klangketten im Blatt: Zeileneinstieg, Binnen- und Schlagreim, Mehrsilbenreim, Stammreim, Alliteration, Assonanz',
    vor: [schritte.probe, schritte.ketten(['einstieg', 'binnen', 'multi', 'stamm', 'allit', 'asso'])], clip: ['#kettenzeile', '#blatt'] },
  // Fluss: Hebungsdiagramm vor dem Text mit Pause, Drop-Haken und Zeilensprung-Pfeil; Klangketten aus (nur Binnenreim bleibt)
  { name: 'fluss', zeigt: 'Silbenzahl und Hebungsdiagramm vor den Zeilen: Lücke = Pause, Haken = Drop, Pfeil = Zeilensprung',
    vor: [schritte.probe, schritte.ketten(['binnen'])], clip: ['#blatt'] },
  // Stammreime und Wortfamilie in der Werkbank (nur diese beiden Gruppen)
  { name: 'stammreim', zeigt: 'Werkbank: Stammreime (gleiche betonte Silbe) und Wortfamilie eines Wortes',
    vor: [schritte.probe, schritte.werkbankAuf({ de: 'Nacht', en: 'fire', ru: 'богу' }), schritte.nurGruppen(['lx.stamm', 'lx.familie'])], clip: ['#wbInhalt .lexikon'], rand: 10 },
  // Anlaut wie in …: Pille an, ein Wort im Feld, die Listen nach dem Anlaut sortiert
  { name: 'anlaut', zeigt: 'Werkbank: „Anlaut wie in …“ – Wörter mit gleichem oder ähnlichem Stab-Anlaut rücken nach vorn',
    vor: [schritte.probe, schritte.werkbankAuf({ de: 'Kreise', en: 'door', ru: 'муку' }), schritte.anlaut({ de: 'Pein', en: 'dark', ru: 'мгла' }), async K => K.ev(`document.querySelectorAll('#wbInhalt .klangwahl, #wbInhalt .lxbed').forEach(e => e.style.display = 'none');
      for (const h of document.querySelectorAll('#wbInhalt .lxh')) if (h.nextElementSibling && h.nextElementSibling.classList.contains('lxbed')) h.style.display = 'none';
      return 'Klangfarbe und Bedeutung ausgeblendet'`)], clip: ['#wbInhalt .anlautwahl', '#wbInhalt .lexikon'], rand: 10, hoch: 0.62 },
  { name: 'anlaut-aus', zeigt: '(kein Bild – Anlaut aus)', vor: [async K => K.ev(`const f = document.getElementById('wbAnlaut'); if (f) { f.value = ''; f.dispatchEvent(new Event('input', { bubbles: true })); } if (typeof anlautSchalten === 'function') anlautSchalten(false); return 'aus'`)], nurSchritt: true },

  // Meine Laute: das Hörquiz (Pille „Meine Reime …“). In der Aufnahme-Ablage gibt es keine eigene Tafel, die Pille
  // öffnet also das Quiz. Drei Zeilen werden beantwortet, damit man sieht, wie eine Wahl aussieht; abgeschickt wird nichts.
  { name: 'hoerquiz', zeigt: 'das Hörquiz „Meine Reime“: ein Wort, zwei Reimwörter, A · B · gleich, Fortschrittsbalken',
    vor: [schritte.text, schritte.werkbank(), async K => K.ev(`// Die Pillen der Reimgrundlage stehen nur bei deutschen und russischen Wörtern; beim englischen Beispiel das Quiz direkt öffnen
      const p = document.querySelector('[data-matrix="meine"]'); if (p) p.click(); else ohrQuiz(); for (let i = 0; i < 20 && !document.querySelector('.ohrzeile'); i++) await new Promise(r => setTimeout(r, 300));
      [...document.querySelectorAll('.ohrzeile')].slice(0, 3).forEach((z, i) => z.querySelectorAll('button')[[0, 1, 0][i]].click());
      return document.getElementById('ohrSeite').textContent + ' · ' + document.querySelectorAll('.ohrzeile').length + ' Zeilen'`)],
    clip: ['#ohrFenster .ohrkasten'], rand: 0 },
  { name: 'hoerquiz-zu', zeigt: '(kein Bild – Quiz schließen)', vor: [async K => K.ev(`document.getElementById('ohrZu')?.click(); return 'zu'`)], nurSchritt: true },

  // Zuletzt, weil die Seite wechselt: die Systemseite listet die nutzbaren Korpora auf diesem Rechner (Lexikon des Macs, Word,
  // LibreOffice) – je mit Haken und eingeklappter Begründung (Jörg, 16.11.2026). Der OpenThesaurus ist aufgeklappt, damit man
  // sieht, was hinter dem Pfeil steht. Orte zeigt die Liste nicht mehr; unscharf zeichnen ist darum nicht mehr nötig.
  { name: 'eigene', zeigt: 'Systemseite: nutzbare Korpora auf diesem Rechner – Haken davor, Begründung hinter dem Pfeil',
    vor: [schritte.seite('/system'),
          async K => K.ev(`const z = [...document.querySelectorAll('#korpora .kz')], b = (z.find(x => /OpenThesaurus/.test(x.querySelector('.kzn b').textContent)) || z[0] || document).querySelector('[data-kqauf]');
            if (!b) return 'keine Korpora'; b.click(); await new Promise(r => setTimeout(r, 300)); return 'aufgeklappt: ' + b.dataset.kqauf`)],
    clip: ['#korpora'], rand: 18, inBlick: true, hoch: 0.40 }
];

// ---------- Lauf ----------
fs.mkdirSync(ZIEL, { recursive: true });
// ---------- Bildkomposition: ein Maßstab für alle ----------
// Jörg, 17.11.2026: „die Schriften in den Screenshots sind überall anders groß, das ist doch Mist … warum kriegst du es nicht
// geplant, die einigermaßen platzangepasst in eine Feature-Page zu bekommen?“ und „die Schriftgröße auf dem Titelbild – so
// muss die überall in den Bildern aussehen“. Bis dahin wurde jedes Bild auf sein Element zugeschnitten und die Seite
// skalierte es auf die Kachel: Maßstäbe von 0,44 bis 2,26.
// Jetzt umgekehrt: Jedes Bild hat sein Kachelfeld in Seitenpixeln (feld, bei 1136 px Inhaltsbreite der Feature-Seite).
// Ausgeschnitten werden genau feld ÷ S CSS-Pixel der App – S ist der Maßstab des Titelbilds (1600 px Fenster auf 1136 px).
// Das App-Fenster, die Breite der linken Leiste und der Werkbank werden so gezogen, dass der Inhalt das Feld füllt
// (Jörg: „ziehe das App-Fenster so, dass es in das Format passt; wenn sich herausstellt, das passt nicht, nochmal an der
// Bildgröße arbeiten und von vorn“). Raster der Seite: w12 1136, w8 751, w7 654, w6 558, w5 462, w4 365 px.
// Die Höhe ist je Reihe gleich, damit kein Feld halb leer bleibt (Regel: höchstens ein Viertel leer).
const S = 1136 / 1600;
const WB = { werkbank: 786, fenster: [1700, 1000], anker: '#werkbank' };
const FELD = {
  // Blatt-Bilder: Leiste schmal (185 px), Ausschnitt ab dem linken Fensterrand – so reicht das Feld genau bis zur Reimspalte
  // (das Blatt allein ist schmaler als das Feld; rechts blieb ein Viertel leer). Ohne die Kommentarzeile des russischen Beispiels.
  schreiben:   { feld: [750, 420], fenster: [1600, 1000], leiste: 185, werkbank: 0, anker: '#blatt', mitTitel: true, abLinks: true, ohneKommentar: true, leisteZu: true },
  reimschema:  { feld: [654, 760], fenster: [1920, 1300], leiste: 340, werkbank: 651, anker: '#blatt', mitTitel: true },
  reimsuche:   { feld: [462, 760], fenster: [1920, 1300], leiste: 340, werkbank: 651, anker: '#werkbank' },
  ersatz:      { feld: [558, 560], ...WB },
  luecke:      { feld: [558, 560], ...WB },
  klangfarbe:  { feld: [558, 560], ...WB },
  lautschrift: { feld: [558, 560], ...WB },
  // gebunden steht quer neben einem langen Text: das Feld ist so hoch wie der Text (sonst schneidet die Seite das Bild zu)
  // wie die Blatt-Bilder (Jörg 17.11.2026: um die Lichter zentriert zeigte es Anschnitte von Leiste und Werkbank):
  // ab linkem Rand, oben die Werkzeugzeile mit den Lichtern, darunter das Blatt
  gebunden:    { feld: [750, 370], fenster: [1600, 1000], leiste: 185, werkbank: 0, anker: '#gebunden', abLinks: true, dy: -14, ohneMarke: true, ohneKommentar: true, leisteZu: true, hervor: '#gebunden' },
  zaehlen:     { feld: [365, 520], fenster: [1600, 1100], leiste: 520, anker: '.sec:has(#suno)', dx: -12, dy: -12, einblick: true, ohneMarke: true },
  regie:       { feld: [751, 520], fenster: [1600, 1100], leiste: 185, werkbank: 0, anker: '#blatt', mitTitel: true, abLinks: true, ohneKommentar: true, ohneMarke: true, leisteZu: true },
  // neu 17.11.2026: Klangketten (quer, wie „schreiben“), Fluss (w5 neben Versmaß w7), Stammreim und Anlaut (w6, Werkbank)
  klangketten: { feld: [750, 460], fenster: [1600, 1000], leiste: 185, werkbank: 0, anker: '#kettenzeile', dy: -4, ohneMarke: true, leisteZu: true },
  fluss:       { feld: [750, 420], fenster: [1600, 1000], leiste: 185, werkbank: 0, anker: '#blatt', dx: -8, ohneMarke: true, leisteZu: true },
  stammreim:   { feld: [558, 400], ...WB, fenster: [1700, 1500], anker: '#wbInhalt .lexikon', dy: -10 },
  anlaut:      { feld: [558, 400], ...WB, fenster: [1700, 1500], anker: '#wbInhalt .anlautwahl', dy: -4 },
  hoerquiz:    { feld: [462, 430], fenster: [1600, 1000], anker: '#ohrFenster .ohrkasten', mitte: true, dy: -12 },
  // KI und Länge sind kleine Kästen der linken Leiste: Leiste auf Feldbreite gezogen, flache Reihe. Die Länge steht unten im
  // Aufbau – „unten“ legt das Feld mit dem Kasten an seinen Fuß, darüber stehen die Abschnitte, aus denen sie gerechnet wird.
  ki:          { feld: [558, 300], fenster: [1700, 1000], leiste: 790, anker: '.sec:has(#claude)', dx: -12, dy: -12, einblick: true },
  laenge:      { feld: [558, 300], fenster: [1700, 1000], leiste: 790, anker: '#aLaenge', dx: -24, dy: 14, unten: true, einblick: true },
  // KI-Verkehr steht in der Blattspalte: Leiste schmal, Werkbank aus, Fenster so breit, dass die Spalte das Feld trägt
  kiverkehr:   { feld: [558, 330], fenster: [1000, 1000], leiste: 185, werkbank: 0, anker: '#kiverkehr', dx: -10, dy: -10, leisteZu: true },
  eigene:      { feld: [558, 330], fenster: [800, 1000], anker: '#korpora', einblick: true },
  vergleich:   { feld: [1136, 600], fenster: [1600, 1100], anker: '#vergleich' },
};
// Leiste und Werkbank so breit ziehen, wie das Feld es verlangt (werkbank 0 = ausblenden, fehlt = Vorgabe)
const lage = (K, F) => K.ev(`const h = document.querySelector('main');
  ${F.leiste ? `h.style.setProperty('--leiste', '${F.leiste}px');` : `h.style.removeProperty('--leiste');`}
  const w = document.getElementById('werkbank');
  if (w) { ${F.werkbank === 0 ? "w.style.display = 'none';" : `w.style.display = ''; try { wbGezogen = ${F.werkbank || 'null'}; wbBreite(); } catch (e) { w.style.width = '${F.werkbank || 568}px'; }`} }
  dispatchEvent(new Event('resize')); await new Promise(r => setTimeout(r, 900));
  return 'Lage: Fenster ' + innerWidth + '×' + innerHeight + ', Leiste ' + getComputedStyle(h).gridTemplateColumns.split(' ')[0] + ', Werkbank ' + (w && w.style.display !== 'none' ? Math.round(w.getBoundingClientRect().width) : 'aus')`);
const fenster = async (K, w, h) => { await K.sende('Emulation.clearDeviceMetricsOverride'); await K.sende('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: DPR, mobile: false }); await warte(900); };

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
  const F = FELD[b.name];
  if (F) { await fenster(K, ...F.fenster); console.log('    ', await lage(K, F)); }
  for (const s of b.vor) console.log('   ', JSON.stringify(await s(K)).slice(0, 170));
  if (F && F.ohneKommentar) console.log('    ', await K.ev(`const t = document.getElementById('text');
    if (/^#/m.test(t.value)) { t.value = t.value.split('\\n').filter(z => !z.startsWith('#')).join('\\n'); t.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 3000)); return 'Kommentarzeile raus'; } return 'keine Kommentarzeile'`));
  // leisteZu: in der schmalen Leiste nur die Abschnittsköpfe – aufgeklappt drängt sich ihr Inhalt übereinander
  if (F && F.leisteZu) console.log('    ', await K.ev(`document.querySelectorAll('.sechd[aria-expanded="true"]').forEach(b => b.click()); await new Promise(r => setTimeout(r, 900));
    // NICHT Abschnitt 1 aufklappen: mit KlangTresor steht dort die Liedliste des eigenen Archivs (persönlich, nicht auf die Seite)
    return 'Leiste zu'`));
  // hervor: ein Element im Bild mit orangem Rahmen hervorheben – nur in der Aufnahme (Jörg 17.11.2026: „mach ein Highlight drauf“)
  if (F && F.hervor) console.log('    ', await K.ev(`const e = document.querySelector(${J(F.hervor)}); if (!e) return 'hervor: fehlt';
    Object.assign(e.style, { outline: '2px solid #ff7a1a', outlineOffset: '5px', borderRadius: '6px', boxShadow: '0 0 0 9px rgba(255,122,26,.18)' }); return 'hervorgehoben: ' + ${J(F.hervor)}`));
  // ohneMarke: die Markierung eines vorigen Werkbank-Bildes (orange hinterlegte Zeilen) schließen
  if (F && F.ohneMarke) console.log('    ', await K.ev(`document.getElementById('wbzu')?.click(); const t = document.getElementById('text'); t.setSelectionRange(0, 0); t.blur();
    await new Promise(r => setTimeout(r, 800)); return 'Markierung zu: ' + document.querySelectorAll('#blatt .markiert, #blatt [class*=mark]').length`));
  if (F) console.log('    ', await lage(K, F));
  if (b.nurSchritt) continue;   // Zwischenschritt ohne Bild (z. B. Pillen wieder aus)
  // Kleine Kästen bekommen eine höhere Pixeldichte. Chrome beachtet weder clip.scale noch einen Zoom am body
  // zuverlässig; die Emulation muss erst gelöscht und dann neu gesetzt werden, sonst bleibt der alte Wert stehen.
  // Das Textblatt scrollt in sich; ohne diesen Schritt beginnt der Ausschnitt mitten im Titel.
  // Derbe Wörter gehören in die KlangFeder und werden nie umgangen; NUR in den Bildern der Feature-Seite werden sie unscharf
  // gezeichnet (Jörg, 17.11.2026: „du darfst sie in der Feature-Seite (und auch nur dort) blurren“).
  console.log('    ', await K.ev(`const derb = ${DERB}; let n = 0;
    for (const e of document.querySelectorAll('button.lxe[data-w], .wahl button')) {
      const t = (e.dataset && e.dataset.w) || e.textContent || ''; if (derb.test(t.toLowerCase())) { e.style.filter = 'blur(5px)'; n++; } }
    return 'unscharf: ' + n`));
  await K.ev(`for (const e of document.querySelectorAll('#blatt, #editor, .secbody, #werkbank, #wbInhalt, #wbInhalt .lexikon')) e.scrollTop = 0;
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
  if (F) {
    const dateiF = path.join(ZIEL, `${b.name}-${SPR}.png`);
    const [cw, ch] = [F.feld[0] / S, F.feld[1] / S];
    const a = await K.ev(`const e = document.querySelector(${J(F.anker)}); if (!e) return null;
      ${F.einblick ? `e.scrollIntoView({ block: '${F.unten ? 'end' : 'start'}' }); await new Promise(r => setTimeout(r, 600));` : ''}
      const r = e.getBoundingClientRect(); let y = ${F.unten ? `r.bottom - ${ch}` : 'r.top'};
      ${F.mitTitel ? "const t = document.querySelector('#songtitel'); if (t) { const q = t.getBoundingClientRect(); if (q.height > 8 && q.bottom <= r.top + 8) y = q.top - 6; }" : ''}
      const x = ${F.abLinks ? '0' : F.mitte ? `r.left + r.width / 2 - ${cw} / 2` : 'r.left'} + ${F.dx || 0};
      return { x, y: y + ${F.dy || 0}, iw: innerWidth, ih: innerHeight, ew: r.width, eh: r.height }`);
    if (!a) { console.log(`    ! ${F.anker} nicht gefunden – übersprungen`); await fenster(K, FB, FH); await lage(K, {}); continue; }
    // Passt das Feld nicht ins Fenster, wird das gemeldet: dann Fenster oder Feld ändern und von vorn (nie den Maßstab).
    if (cw > a.iw + 0.5 || ch > a.ih + 0.5) console.log(`    !! Feld ${Math.round(cw)}×${Math.round(ch)} größer als Fenster ${a.iw}×${a.ih}`);
    const x = Math.max(0, Math.min(a.x, a.iw - cw)), y = Math.max(0, Math.min(a.y, a.ih - ch));
    if (Math.abs(x - a.x) > 2 || Math.abs(y - a.y) > 2) console.log(`    ! Anker verschoben um ${Math.round(x - a.x)}/${Math.round(y - a.y)} px, damit das Feld im Fenster bleibt`);
    console.log(`     Feld ${F.feld.join('×')} → App ${Math.round(cw)}×${Math.round(ch)} ab ${Math.round(x)},${Math.round(y)} · Anker ${Math.round(a.ew)}×${Math.round(a.eh)}`);
    const voll = await K.bild(`${b.name}-${SPR}-voll`);
    execFileSync('magick', [voll, '-crop', `${Math.round(cw * DPR)}x${Math.round(ch * DPR)}+${Math.round(x * DPR)}+${Math.round(y * DPR)}`, '+repage', dateiF]);
    fs.unlinkSync(voll);
    console.log(`    → ${dateiF}`);
    await fenster(K, FB, FH); await lage(K, {});
    continue;
  }
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
          // „buendig“: rechts an der letzten Schrift enden statt an der Blattkante – ohne Werkbank ist das Blatt breiter als sein
          // Inhalt, das rechte Drittel bliebe leer. Gemessen an Elementen ohne Kinder; Rahmen reichen sonst bis zur Kante. Kommentarzeilen
          // (# …) laufen ohne Umbruch über die Reimspalte hinaus – im Russischen der Hinweis auf Schukowski – und zählen nicht.
          const rechts = ${b.buendig ? 'Math.max(...[...blatt.querySelectorAll("*")].filter(e => !e.children.length && !e.closest(".kommentar")).map(e => e.getBoundingClientRect()).filter(r => r.width > 0 && r.height > 0 && r.top < unten).map(r => r.right)) + 12' : 'Math.max(bb.right, ...rs.map(r => r.right))'};
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
