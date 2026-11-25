// Alle Bilder der Feature-Seite in einer Sprache erzeugen – ein Lauf, ein Ergebnis, wiederholbar.
// (Jörg, 15.11.2026: „dokumentiere bitte die Erstellung, damit du jederzeit nach Programmänderungen die shots mit
// einem automatischen Ablaufskript jederzeit in jeder Sprache neu erstellen kannst".)
//
// Aufgenommen wird nie an der Arbeitsinstanz, sondern an einer Probeinstanz mit eigener Ablage (siehe LIESMICH.md).
// Für die Bilder „laenge" und „vergleich" muss in dieser Ablage mitTresor an sein und der KlangTresor laufen.
// Die KI ist seit 22.11.2026 immer an. „kiverkehr“ (der KI-Bereich) braucht eine echte Antwort: ein Gemini-Lauf über den
// Schlüssel im Schlüsselbund (kostenlos); „webchat“ und „entwurf“ brauchen keine KI. „hoeren“ braucht geladene Stimmen in der
// Ablage (ablage/stimmen, Wahl in einstellungen.json).
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
const TEXT = { de: process.env.TEXT_DE, en: process.env.TEXT_EN, ru: process.env.TEXT_RU || null };   // RU fest seit den Probetexten (17.11.2026) – sonst bliebe Majakowski im Feld
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
const DERB = '/(fick|fotz|wichs|nutte|hure|scheiß|scheiss|fuck|cunt|shit|bitch|whore|motherf|nigg|пизд|хуй|хуе|хуя|хуё|ебл|ебал|ебат|ебан|ёбан|бляд|блят|мудак|муди|залуп|сучк|сука|суки|шлюх|жоп)/';
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
  if (SPR === 'ru' && !p) return null;               // ohne TEXT_RU: der Beispieltext der KlangFeder steht schon im Feld
  if (!p) { console.error(`Für ${SPR} fehlt der Text: TEXT_${SPR.toUpperCase()}=<Datei> setzen.`); process.exit(2); }
  return fs.readFileSync(p, 'utf8');
};

// ---------- Hilfen für die Zustände ----------
const J = o => JSON.stringify(o);
const schritte = {

  // ---------- 0.10.0: Handlung, Plan, Mischung, Stil – je Sprache
  plan: async K => K.ev(`neuAnfangen(false); await new Promise(r => setTimeout(r, 800));
    themaFeld.value = ${J({ de: 'Ein Leuchtturmwärter hält in einer Sturmnacht Wacht. Das Licht flackert und erlischt. Draußen ruft ein Schiff um Hilfe. Mit der letzten Kerze steigt er hinauf und entzündet das Feuer neu.',
      en: 'A lighthouse keeper keeps watch on a stormy night. The light flickers and goes out. Out at sea a ship calls for help. With his last candle he climbs up and lights the fire again.',
      ru: 'Смотритель маяка дежурит в штормовую ночь. Свет мигает и гаснет. В море корабль зовёт на помощь. С последней свечой он поднимается наверх и снова зажигает огонь.' }[SPR])};
    themaFeld.dispatchEvent(new Event('input')); AUF = FORMEN.find(f => f[0] === 'pre')[1](); GERUEST = 'pre'; aufbauMerken(); claudeGrund();
    await new Promise(r => setTimeout(r, 1200)); return 'Plan: ' + AUF.map(r => r.name).join(', ')`),
  // eine Mischung aus zwei Genres der Liedsprache (Folk und Liedermacher, sonst die beiden größten), gewürfelt wie auf der Karte
  mischung: async K => K.ev(`const sp = liedSprache(), d = await (await fetch('/api/genre/gruppen?sprache=' + sp)).json(), n = d.gruppen.filter(g => !g.mundart).map(g => g.name);
    const a = n.find(x => /folk|фолк/i.test(x)) || n[0], b = n.find(x => /lieder|singer|бард|шансон|chanson/i.test(x) && x !== a) || n[1], auswahl = { [a]: 2, [b]: 1 };
    const j = await (await fetch('/api/genre/wurf', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ auswahl, saat: 7, sprache: sprache(), liedSprache: sp }) })).json();
    genreSetzen({ auswahl, saat: 7, text: j.text, stil: j.stil, sprache: sp, aufbau: j.aufbau, aufbauGenre: j.aufbauGenre, ausschluss: j.ausschluss || '' });
    if (!stil.trim()) stilSetzen(j.stil || ''); claudeGrund(); return 'Mischung ' + a + ' ×2, ' + b`),
  // die Genre-Karte öffnen: zwei Genres gewichtet – oder nur die Genre-Datei des Dichters der Sprache
  genreKarte: was => async K => K.ev(`document.getElementById('aGenre').click(); for (let i = 0; i < 30 && document.getElementById('genreFenster').hidden; i++) await new Promise(r => setTimeout(r, 300));
    await new Promise(r => setTimeout(r, 1500)); GN.wahl = {}; GN.saat = ${J(was)} === 'dichter' ? ${J({ de: 10, en: 11, ru: 2 }[SPR])} : 7;   // Dichter: Saat mit einem gereimten Gedicht als Form
    document.getElementById('gnMundart').style.display = 'none';   // Mundart kommt auf der Feature-Seite nicht vor (Jörg, 25.11.2026)
    const warte = async () => { for (let i = 0; i < 60 && !(GN.textFuer === gnSchluessel() && document.getElementById('gnText').style.opacity !== '0.5'); i++) await new Promise(r => setTimeout(r, 250)); await new Promise(r => setTimeout(r, 400)); };
    if (${J(was)} === 'dichter') { const k = (GD_LISTE.find(d => /^§datei:(goethe|shakespeare|puschkin)$/.test(d.key)) || {}).key; if (!k) return 'keine Dichter-Datei';
      genreGewicht(k, 1); await warte(); GN.fokus = null; genreGewichteZeigen(); return 'Dichter: ' + k; }
    const n = GN.daten.gruppen.filter(g => !g.mundart).map(g => g.name), a = n.find(x => /folk|фолк/i.test(x)) || n[0], b = n.find(x => /lieder|singer|бард|шансон|chanson/i.test(x) && x !== a) || n[1];
    genreGewicht(a, 2); await warte(); genreGewicht(b, 1); await warte(); GN.fokus = null; genreGewichteZeigen(); return 'Genres: ' + a + ' ×2, ' + b`),
  // Stil und Ausschluss für Schritt 8; die KI hat mit dem letzten Text eigene geliefert (als Vorschlag)
  // ein Stil-Prompt in echter Länge (Suno-Prompts haben meist 150–300 Zeichen) – mit der Mischung allein blieb das Feld halb leer
  stilAus: async K => K.ev(`stilSetzen(${J({ de: 'dark folk ballad, fingerpicked acoustic guitar, upright bass, cello, low intimate male vocals, German lyrics, storytelling, minor key, slow build, galloping rhythm in the chorus, night wind atmosphere, sparse percussion, 72 bpm',
      en: 'dark folk ballad, fingerpicked acoustic guitar, upright bass, cello, low intimate male vocals, English lyrics, storytelling, minor key, slow build, galloping rhythm in the chorus, night wind atmosphere, sparse percussion, 72 bpm',
      ru: 'dark folk ballad, fingerpicked acoustic guitar, upright bass, cello, low intimate male vocals, Russian lyrics, storytelling, minor key, slow build, galloping rhythm in the chorus, night wind atmosphere, sparse percussion, 72 bpm' }[SPR])});
    ausschlussSetzen(${J({ de: 'schlager, autotune, trap hi-hats', en: 'autotune, trap hi-hats, country', ru: 'шансон, автотюн, трэп' }[SPR])});
    kiStilAnbieten(${J({ de: 'dark folk ballad, fingerpicked guitar, cello, intimate male vocals', en: 'dark folk ballad, fingerpicked guitar, cello, intimate male vocals', ru: 'dark folk ballad, fingerpicked guitar, cello, intimate male vocals, Russian vocals' }[SPR])});
    kiAusschlussAnbieten(${J({ de: 'pop punk, eurodance', en: 'pop punk, eurodance', ru: 'pop punk, eurodance' }[SPR])});
    sunoZeigen(); return 'Stil und Ausschluss gesetzt'`),
  // Handlungen aus Stichworten – echte KI, warten bis fertig
  handlungen: async K => K.ev(`themaFeld.value = ${J({ de: 'Leuchtturm, Sturm, das Licht erlischt, ein Schiff in Not', en: 'lighthouse, storm, the light goes out, a ship in distress', ru: 'маяк, шторм, свет гаснет, корабль в беде' }[SPR])};
    themaFeld.dispatchEvent(new Event('input')); claudeGrund(); await claudeAuftrag('handlungen');
    for (let i = 0; i < 400 && (K.auftrag || K.seit); i++) await new Promise(r => setTimeout(r, 1000));
    await new Promise(r => setTimeout(r, 1500)); const l = K.verlauf[K.verlauf.length - 1]; return l && l.handlungen ? 'Handlungen: ' + l.handlungen.handlungen.map(h => h.titel).join(' · ') : 'KEINE Handlungen: ' + (l && l.text || '')`),
  // Lektorat des fertigen Textes – echte KI, warten bis fertig
  // die Handlung, die zum Beispieltext gehört (Jörg, 25.11.2026: „was soll der screenshot mit dem erlkönig und dem leuchtturm“ –
  // mit dem Leuchtturm-Plan aus schritte.plan meldete das Lektorat nur, dass Text und Handlung nicht zusammengehören)
  lektorat: async K => K.ev(`themaFeld.value = ${J({ de: 'Ein Vater reitet nachts mit seinem kranken Kind durch Wind und Nebel nach Hause. Das Kind sieht den Erlkönig, der es mit Spielen und seinen Töchtern lockt; der Vater erklärt alles als Nebel, Wind und Weiden. Als der Erlkönig Gewalt androht, schreit das Kind auf. Der Vater reitet schneller, doch als er den Hof erreicht, ist das Kind tot. Gemeint ist: Der Erlkönig ist nur ein Fiebertraum des Kindes, und am Ende soll der Hörer das eindeutig erkennen.',
      en: 'A father rides home at night through wind and mist with his sick child. The child sees the Erl-King, who lures him with games and his daughters; the father explains it all away as mist, wind and willows. When the Erl-King threatens force, the child cries out. The father rides faster, but when he reaches the courtyard the child is dead. What is meant: the Erl-King is only the child’s fever dream, and by the end the listener should recognise that clearly.',
      ru: 'Отец ночью скачет домой сквозь ветер и туман с больным ребёнком. Ребёнок видит лесного царя, который манит его играми и своими дочерьми; отец объясняет всё туманом, ветром и ивами. Когда царь грозит силой, ребёнок кричит. Отец гонит коня, но, доехав до дома, видит, что ребёнок мёртв. Задумано так: лесной царь – лишь горячечный бред ребёнка, и в конце слушатель должен это ясно понять.' }[SPR])};
    themaFeld.dispatchEvent(new Event('input')); await new Promise(r => setTimeout(r, 800));
    $('kEntwurf').checked = false; await lektoratStarten('textpruefung');
    for (let i = 0; i < 400 && LK.auftrag; i++) await new Promise(r => setTimeout(r, 1000));
    await new Promise(r => setTimeout(r, 1500)); return 'Lektorat: ' + document.getElementById('status').textContent.slice(0, 90)`),
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
  // Fluss-Bild Deutsch (Jörg 26.11.2026: „ein paar gemeinfreie Gedichte nehmen“): Goethe „Wandrers Nachtlied“ (1780) zeigt
  // auf engem Raum Drop („Ist Ruh,“), Zeilensprung („Spürest du“) und Hebungsprall (Titel „Nachtlied“). Datei neben den Probetexten.
  async nachtlied(K) {
    const f = path.join(path.dirname(process.env.PROBE_DE || TEXT.de || ''), 'wandrers-nachtlied.txt');
    if (!fs.existsSync(f)) return 'KEIN Text: ' + f;
    const t = fs.readFileSync(f, 'utf8');
    return K.ev(`document.querySelector('button[data-ansicht="ein"]')?.click(); await new Promise(r => setTimeout(r, 800));
      const e = document.getElementById('text'); e.value = ${J(t)};
      e.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 4000)); return e.value.length + ' Zeichen Nachtlied'`);
  },
  async probe(K) {
    const f = { de: process.env.PROBE_DE, en: process.env.PROBE_EN, ru: process.env.PROBE_RU }[SPR];
    if (!f || !fs.existsSync(f)) return 'KEIN Probetext für ' + SPR;
    const t = fs.readFileSync(f, 'utf8');
    // der echte Titel des Gedichts – sonst bliebe der Titel des vorigen Texts stehen (gesehen beim Raben: „Who rides there …“)
    const titel = { de: 'Der Panther', en: 'The Raven', ru: 'Послушайте!' }[SPR];
    // einspaltig: läuft vorher „vergleich“ (alt | neu), bliebe die Ansicht sonst offen und das Blatt verdeckt (Gesamtlauf 17.11.2026)
    return K.ev(`document.querySelector('button[data-ansicht="ein"]')?.click(); await new Promise(r => setTimeout(r, 800));
      const e = document.getElementById('text'); e.value = ${J(t)};
      e.dispatchEvent(new Event('input', { bubbles: true }));
      const h = document.getElementById('songtitel'); if (h) { h.textContent = ${J(titel)}; h.dispatchEvent(new Event('input', { bubbles: true })); }
      await new Promise(r => setTimeout(r, 4500)); return e.value.length + ' Zeichen Probetext · ' + (h && h.textContent)`);
  },
  // Flusskontrolle (19.11.2026): ein bekanntes gemeinfreies Gedicht in einer Klang-Anzeige und ein überlieferter Zungenbrecher
  // im Phonemstau bei schnellem Tempo (Jörg: „keine Nonsense-Texte, echte Beispiele, die bekannt sind“). Texte aus T_ORT
  // (flk-gedicht-<spr>.txt, flk-zunge-<spr>.txt); danach ⌥ gedrückt – das Blatt zeigt nur Text und Balken.
  flk(art) { return async K => {
    const f = { gedicht: process.env.FLK_GEDICHT, zunge: process.env.FLK_ZUNGE, singbar: process.env.FLK_SINGBAR }[art];
    if (!f || !fs.existsSync(f)) return 'KEIN Text für ' + art;
    const t = fs.readFileSync(f, 'utf8');
    // 23.11.2026 (Jörg: Kacheln mit weniger Rand, „singbarkeit dazu“): drei schmale Kacheln (w4), Zeilen höchstens ~55 Zeichen
    // (Poe passt nicht mehr hinein); Zungenbrecher: die langen oben, unten rechts liegt auf der Seite der Knopf „+“. Singbarkeit zeigt den Schlusston: Atem erreicht bei
    // Gedichtzeilen selbst bei 40 BPM keine 4,5 s (nachgerechnet), der Schlusston wechselt dagegen sichtbar – Erlkönig
    // Wind/Kind geschlossen, Arm/warm offen; Daffodils cloud/crowd offen, hills/daffodils geschlossen; Памятник: нерукотворный geschlossen, тропа/столпа offen; deutsch Gryphius (Alexandriner, lange Zeilen).
    const titel = { gedicht: { de: 'Es ist alles eitel', en: 'Sonnet 18', ru: 'Зимнее утро' }, zunge: { de: 'Zungenbrecher', en: 'Tongue twisters', ru: 'Скороговорки' },
      singbar: { de: 'Erlkönig', en: 'Daffodils', ru: 'Памятник' } }[art][SPR];
    const [proj, bpm0] = { gedicht: ['hd', 120], zunge: ['stau', 200], singbar: ['schluss', 120] }[art];
    const bpm = +(process.env['FLK_BPM_' + art.toUpperCase()] || bpm0);   // zum Ausprobieren: FLK_BPM_ZUNGE=180
    return K.ev(`document.querySelector('button[data-ansicht="ein"]')?.click(); await new Promise(r => setTimeout(r, 800));
      const e = document.getElementById('text'); e.value = ${J(t)};
      e.dispatchEvent(new Event('input', { bubbles: true }));
      const h = document.getElementById('songtitel'); if (h) { h.textContent = ${J(titel)}; h.dispatchEvent(new Event('input', { bubbles: true })); }
      await new Promise(r => setTimeout(r, 4500));
      GL.proj = ${J(proj)}; GL.ebene = 'silbe'; GL.bpm = ${bpm}; glattMerken(); glattZeigen();
      await glattHolen(); balkenMalen(); flackernAn(); await new Promise(r => setTimeout(r, 400));
      return document.querySelectorAll('#balken i').length + ' Balken · ' + ${J(proj)} + ' · ' + ${bpm} + ' BPM'`);
  }; },
  // Verhörer (19.11.2026): je Sprache vier eigene Zeilen, jede mit einer Stelle, die zwei Hörweisen hat
  async verhoerer(K) {
    const t = { de: 'Seid ihr bereit für Träume\nEr scannt die leere Stadt\nIch sag dir, wie es war\nund alles in mir schweigt\nWann werd ich wieder lachen\nmein Traum aus Glas zerbricht\nnimmt ihr die Angst vom Herzen\nsie quält mich jede Nacht',
      en: "I scream into the night\nthat's tough to say out loud\nan aim beyond the stars\nmy tread is soft and slow\nupon two wings I fly\nhe asked a simple thing\nan ice cold wind\na notion of you",
      ru: 'На двор ушёл мой брат\nО друг, не уходи\nИ мрак ложится тихо\nГоворить мы не могли\nБыл же праздник светлый\nЛишь дал мне знак рукой\nИз лап зимы весна\nВаш ум и ваша речь' }[SPR];
    const titel = { de: 'Hörvarianten', en: 'Mondegreens', ru: 'Ослы́шки' }[SPR];
    return K.ev(`document.querySelector('button[data-ansicht="ein"]')?.click(); await new Promise(r => setTimeout(r, 800));
      const e = document.getElementById('text'); e.value = ${J(t)};
      e.dispatchEvent(new Event('input', { bubbles: true }));
      const h = document.getElementById('songtitel'); if (h) { h.textContent = ${J(titel)}; h.dispatchEvent(new Event('input', { bubbles: true })); }
      await new Promise(r => setTimeout(r, 4500)); return document.querySelectorAll('#ebene .vh-o.ve').length + ' Winkel'`);
  },
  // Grammatischer Reim (Russisch, 19.11.2026): in allen drei Sprachen derselbe russische Text, die Oberfläche in ihrer Sprache
  async gramm(K) {
    const t = 'Я тебя так долго любил\nИ к тебе под вечер ходил\nМы сидели за столом\nПод открытым окном\nТёмная холодная ночь\nГонит все сомнения прочь';
    const titel = { de: 'Grammatischer Reim', en: 'Grammatical rhyme', ru: 'Грамматическая рифма' }[SPR];
    return K.ev(`document.querySelector('button[data-ansicht="ein"]')?.click(); await new Promise(r => setTimeout(r, 800));
      const e = document.getElementById('text'); e.value = ${J(t)};
      e.dispatchEvent(new Event('input', { bubbles: true }));
      const h = document.getElementById('songtitel'); if (h) { h.textContent = ${J(titel)}; h.dispatchEvent(new Event('input', { bubbles: true })); }
      await new Promise(r => setTimeout(r, 4500)); return document.querySelectorAll('#ebene .r.gramm').length + ' gepunktet'`);
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
  // bestimmte Gruppen der Werkbank für ein Bild ausblenden (Ersatzwörter: Wortfamilie und Stammreime haben ihre eigene Kachel)
  ohneGruppen: titel => async K => K.ev(`const weg = ${J(titel)}.map(k => (typeof t === 'function' ? t(k, { w: '' }) : k).replace(/[„“«»‚‘"']/g, '').trim().split(' ')[0]);
      let n = 0; for (const h of document.querySelectorAll('#wbInhalt .lxh')) { if (!weg.some(s => s && h.textContent.startsWith(s))) continue;
        // ganz heraus statt nur versteckt: „scroll: ende“ holt den LETZTEN Eintrag in den Blick – ein versteckter bliebe stehen
        const g = h.nextElementSibling; if (g && g.classList.contains('lxg')) g.remove(); h.remove(); n++; }
      return n + ' Gruppen herausgenommen'`),
  // „Anlaut wie in …“: Pille an, Wort ins Feld
  anlaut: woerter => async K => K.ev(`const f = document.getElementById('wbAnlaut'); if (!f) return 'Anlaut-Feld fehlt';
      f.value = ${J(woerter)}['${SPR}']; f.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 5000)); return 'Anlaut: ' + f.value + ' ' + (document.querySelector('.alziel') || {}).textContent`),
  // Klangfarben-Pillen setzen (additiv; leer = alle aus)
  klang: (arten = []) => async K => K.ev(`for (const b of document.querySelectorAll('[data-klang]')) { const soll = ${J(arten)}.includes(b.dataset.klang); if (b.classList.contains('an') !== soll) b.click(); }
      await new Promise(r => setTimeout(r, 2500));
      return [...document.querySelectorAll('[data-klang].an')].map(b => b.textContent).join(' + ') || 'keine'`),
};

// ---------- KI-Bereich (seit 22.11.2026; vorher die Lasche „KI-Verkehr“) ----------
const WUNSCH = { de: 'mehr Bild', en: 'more imagery', ru: 'больше образности' };
const ki = {
  // KI-Bereich offen und hoch, Verlauf dieser Sitzung; Zwischenablage erlaubt (Kopieren beim Web-Chat-Bot)
  bereich: (hoehe = 0.86) => async K => { await K.sende('Browser.grantPermissions', { permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'], origin: URL.replace(/\/$/, '') }).catch(() => {});
    return K.ev(`localStorage.setItem('klangfeder-kidrawer', JSON.stringify({ hoehe: ${hoehe}, zu: false })); KD.hoehe = ${hoehe}; KD.zu = false;
      KV.sicht = 'sitzung'; KD.sig = null; kdSetzen(false); await new Promise(r => setTimeout(r, 1200)); return 'KI-Bereich offen'`); },
  anbieter: name => async K => K.ev(`for (let i = 0; i < 40; i++) { const s = ANBIETER_STAND; if (s && s[${J(name)}] && s[${J(name)}].vorhanden) break;
      ANBIETER_STAND = await (await fetch('/api/claude')).json(); claudeWahlFuellen(); await new Promise(r => setTimeout(r, 1500)); }
    const w = $('kAnbieter'); w.value = ${J(name)}; w.dispatchEvent(new Event('change')); await new Promise(r => setTimeout(r, 500));
    return 'Anbieter ' + w.value + (ANBIETER_STAND[${J(name)}] && ANBIETER_STAND[${J(name)}].vorhanden ? ' bereit' : ' NICHT bereit')`),
  vorschau: an => async K => K.ev(`KD_VORSCHAU = ${an}; $('kdVorschau').checked = ${an}; try { localStorage.setItem('klangfeder-ki-vorschau', '${an ? 1 : 0}'); } catch {} return 'vorschau ${an}'`),
  // die Zeile mit dem Werkbank-Wort neu fassen lassen; warten, bis der Auftrag im KI-Bereich steht (bei echter KI: bis die Antwort da ist)
  zeile: (warten = 'eintrag') => async K => K.ev(`const t = document.getElementById('text'), z = t.value.split('\\n'), w = ${J(WORT[SPR])};
    const i = z.findIndex(x => x.includes(w)); if (i < 0) return 'Zeile mit ' + w + ' fehlt';
    for (const k of [i, i + 1, i - 1]) { zeileWaehlen(k); await new Promise(r => setTimeout(r, 1800)); if (document.getElementById('wbWunsch')) break; }
    if (!document.getElementById('wbWunsch')) return 'Werkbank zu';
    // erst den Stand zählen: der neue Eintrag ist der, der danach dazukommt (sonst griff der vorige Lauf)
    const vorher = document.querySelectorAll('#kdListe .kvlauf').length;
    $('wbWunsch').value = ${J(WUNSCH[SPR])}; $('wbHolen').click();
    for (let n = 0; n < 300; n++) { await new Promise(r => setTimeout(r, 1000));   // Gemini braucht zeitweise über 150 s (26.11.2026)
      if (document.querySelectorAll('#kdListe .kvlauf').length <= vorher) continue;
      const l = [...document.querySelectorAll('#kdListe .kvlauf')].pop(); if (!l) continue;
      if (${J(warten)} === 'eintrag' && l.querySelector('.kvn.kf')) break;
      if (${J(warten)} === 'antwort' && l.querySelector('.kvn.ki .kdvar .vorschlag, .kvn.ki ol li')) break;
      if (${J(warten)} === 'antwort' && /fehler/.test(l.querySelector('.kvmeta')?.innerHTML || '')) return 'FEHLER: ' + l.querySelector('.kvmeta').textContent; }
    await new Promise(r => setTimeout(r, 1500));
    const l = [...document.querySelectorAll('#kdListe .kvlauf')].pop(); return (l ? l.querySelector('.kvmeta').textContent : 'kein Eintrag').slice(0, 90)`),
  // im letzten Eintrag einen Baustein aufklappen (Name wie im KI-Bereich) und den Eintrag oben in den Blick holen
  aufklappen: id => async K => K.ev(`const l = [...document.querySelectorAll('#kdListe .kvlauf')].pop(); if (!l) return 'kein Eintrag';
    const n = t('kd.b.' + ${J(id)}), z = [...l.querySelectorAll('.kfz')].find(r => r.querySelector('.n')?.textContent.trim().startsWith(n));
    if (z && !z.classList.contains('offen')) z.click(); await new Promise(r => setTimeout(r, 500));
    const el = $('kdInhalt'); el.scrollTop = l.offsetTop - 6; return z ? 'aufgeklappt: ' + n : 'Baustein fehlt: ' + n`),
  // nur der jüngste Eintrag ist zu sehen – die älteren (frühere Bilder, Abgebrochenes) werden für das Bild ausgeblendet
  nurLetzter: async K => K.ev(`const a = [...document.querySelectorAll('#kdListe .kvlauf')]; a.forEach((e, i) => { e.style.display = i === a.length - 1 ? '' : 'none'; }); return a.length + ' Einträge, 1 gezeigt'`),
  oben: async K => K.ev(`const l = [...document.querySelectorAll('#kdListe .kvlauf')].pop(); const el = $('kdInhalt'); if (l) el.scrollTop = l.offsetTop - 6;
    document.querySelectorAll('.toast, #meldung').forEach(e => e.remove?.()); return 'oben'`),
  unten: async K => K.ev(`const el = $('kdInhalt'); el.scrollTop = el.scrollHeight; return 'unten'`),
  anhang: async K => K.ev(`const f = document.querySelector('.kfedit[data-b="anhang"]'); if (!f) return 'kein Entwurf';
    f.value = ${J({ de: 'Kein Herz-Schmerz-Reim, bitte.', en: 'No heart/apart rhyme, please.', ru: 'Без рифмы любовь/кровь, пожалуйста.' }[SPR])}; f.dispatchEvent(new Event('input', { bubbles: true }));
    const el = $('kdInhalt'); const l = [...document.querySelectorAll('#kdListe .kvlauf')].pop(); if (l) el.scrollTop = l.offsetTop - 6; return 'Anhang eingetragen'`),
  // Aufräumen: offene Entwürfe und Wartende verwerfen, damit das nächste Bild sauber beginnt
  aufraeumen: async K => K.ev(`for (const e of (KD.liste || [])) if (['entwurf', 'laeuft'].includes(e.status) && e.id) await fetch('/api/claude/' + e.id, { method: 'DELETE' }).catch(() => {});
    KD_VORSCHAU = false; $('kdVorschau').checked = false; try { localStorage.setItem('klangfeder-ki-vorschau', '0'); } catch {}
    W.auftrag = null; K && null; KD.sig = null; await kdLaden(); return 'aufgeräumt'`),
};

// ---------- die Bilder ----------
const BILDER = [
  { name: 'titel', zeigt: 'das ganze Fenster: Aufbau links, Text in der Mitte, Reimwerkbank rechts',
    vor: [schritte.text, schritte.abschnitt(11), schritte.werkbank()], ganz: true },   // 11 = Schritt 4 Aufbau (seit 0.10.0 zählt die Leiste anders, 3 wäre die Handlung)

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
    // Wort mit vollen Gruppen (25.11.2026, Leere ≤ ¼): bei „Not“ standen viele Gruppen mit ein, zwei Wörtern
    vor: [schritte.text, schritte.werkbankAuf({ de: 'Kind', en: 'father', ru: 'водой' }), schritte.ohneGruppen(['lx.familie', 'lx.stamm', 'lx.redew', 'lx.sprich'])], clip: ['#werkbank .lexikon'], scroll: 'synonyme', rand: 8 },

  { name: 'luecke', zeigt: 'die Werkbank auf einer Wendung: was an diese Stelle passt',
    // rand 0: mit Luft kam oben ein Streifen der Leiste über der Werkbank mit (oranger Anschnitt, Jörg 17.11.2026);
    // hoch 0.9: gleich hoch wie das Ersatz-Bild daneben, dessen Text länger ist – sonst bleibt dort ein halber leerer Kasten
    // seit 26.11.2026 wirklich eine Lücke (Jörg: „das bild zeigt nicht das, was im Text steht“ – vorher Reime auf eine Wendung):
    // ___ am Zeilenende, die Werkbank zeigt Wörter im Maß der Partnerzeile, die sich auf sie reimen
    vor: [schritte.text, async K => K.ev(`const t = document.getElementById('text');
      const [alt, neu] = ${J({ de: ['er trägt sein Kind', 'er trägt sein ___'], en: ['he keepeth him warm.', 'he keepeth him ___.'], ru: ['с ним сын молодой.', 'с ним сын ___.'] })}['${SPR}'];
      const f = document.getElementById('wbSuchfeld'); if (f) f.value = '';   // Rest einer früheren Suche nicht ins Bild
      if (!t.value.includes(alt)) return 'nicht im Text: ' + alt;
      t.value = t.value.replace(alt, neu); t.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 2500));
      const p = t.value.indexOf('___') + 1; t.setSelectionRange(p, p); await wahlNachMarkierung(p, p);
      await new Promise(r => setTimeout(r, 7000)); if (f) f.value = '';
      return document.getElementById('wbInhalt').textContent.trim().slice(0, 120).replace(/\\s+/g, ' ')`)], clip: ['#werkbank'], hoch: 0.9, rand: 0 },

  { name: 'zaehlen', zeigt: 'Schritt 8 „Stil und Übergabe": Kopierknöpfe mit Zeichenzahl gegen Sunos Grenzen, Lyrics für Suno',
    vor: [schritte.text, schritte.mischung, schritte.stilAus, schritte.abschnitt(10)], clip: ['.sec:has(#stilRegie)'], hoch: 0.95 },

  { name: 'gebunden', zeigt: 'die zehn Lichter zwischen „frei" und „streng" in der Werkzeugzeile über dem Text',
    vor: [schritte.text], clip: ['#gebunden'], rand: 14 },

  { name: 'regie', zeigt: 'Regieanweisungen in eckigen Klammern, wie Suno sie liest',
    // kurze Regie (Jörg 26.11.2026: „wir brauchen einen Text mit kurzer Regie … wenn es um die Klammern geht, dann müssen sie auch
    // zu sehen sein“): je Klammerzeile nur Abschnitt und ein Stichwort, damit die Klammer im Viertelbild ganz steht
    vor: [schritte.text, async K => K.ev(`const t = document.getElementById('text'), KURZ = { 'Intro': 'wind', 'Verse 1': 'calm', 'Verse 2': 'tension', 'Chorus': 'hypnotic', 'Verse 3': 'faster', 'Chorus 2': 'darker', 'Bridge': 'panic', 'Breakdown': 'low', 'Climax': 'frantic', 'Outro': 'quiet', 'Final': 'spoken' };
      const n = t.value.split('\\n').map(z => z.replace(/^\\[([^\\]–]+?) – [^\\]]*\\]$/, (m, a) => KURZ[a.trim()] ? '[' + a.trim() + ' – ' + KURZ[a.trim()] + ']' : m)).join('\\n');
      if (n === t.value) return 'Regie unverändert'; t.value = n; t.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 2500)); return 'Regie gekürzt'`), schritte.abschnitt(3)], clip: ['#blatt'], bis: 3 },

  { name: 'ki', zeigt: 'Schritt 0 „KI-Einstellungen": Anbieter, Modell, Denktiefe',
    vor: [schritte.text, schritte.abschnitt(8)], clip: ['.sec:has(#kAnbieter)'], hoch: 1.05 },

  { name: 'laenge', zeigt: 'Länge bei Suno: Spielzeit, Platz je Zeile, Dichte gegen das Archiv',
    vor: [schritte.text, schritte.abschnitt(11), async K => K.ev(`const e = document.getElementById('aLaenge');
      for (let i = 0; i < 25 && !/\\d/.test(e.textContent); i++) await new Promise(r => setTimeout(r, 500));
      return e.textContent.trim().slice(0, 90).replace(/\\s+/g, ' ')`)], clip: ['#aLaenge'], inBlick: true },

  { name: 'vergleich', zeigt: 'alte und neue Fassung nebeneinander, mit Kennzahlen darüber',
    vor: [schritte.text, schritte.ausgang, schritte.feilen, schritte.vergleich], clip: ['#vergleich'] },

  // KI-Bereich (22.11.2026): eine echte Antwort von Gemini in der Probeinstanz – Du, KlangFeder mit Bausteinen („Maß der Zeile“
  // aufgeklappt), die KI mit ihren Fassungen. Der frühere Sonderfall (Lasche, Arbeitsinstanz 8790) entfällt.
  { name: 'kiverkehr', zeigt: 'der KI-Bereich: deine Nachricht, die Bausteine der KlangFeder, die Antwort der KI',
    // aufräumen und ohne Vorschau: ein früherer Entwurf-Lauf lässt sonst „vor dem Senden ansehen“ an, dann steht ein ungesendeter Entwurf im Bild (26.11.2026)
    vor: [schritte.text, ki.aufraeumen, ki.vorschau(false), ki.bereich(), ki.anbieter('gemini'), ki.zeile('antwort'), ki.nurLetzter, ki.aufklappen('ziel')] },
  // Web-Chat-Bot: der Auftrag ist kopiert, unten wartet das Feld für die Antwort
  { name: 'webchat', zeigt: 'Web-Chat-Bot: kopierter Auftrag, Feld für die eingefügte Antwort',
    vor: [schritte.text, ki.aufraeumen, ki.anbieter('webchat'), ki.bereich(), ki.zeile('eintrag'), ki.nurLetzter, ki.unten] },
  // Entwurf: vor dem Senden ansehen – Bausteine als Textfelder, ein eigener angehängt
  { name: 'entwurf', zeigt: 'Entwurf: Bausteine ändern, eigenen anhängen, dann senden',
    vor: [schritte.text, ki.aufraeumen, ki.anbieter('claude'), ki.vorschau(true), ki.bereich(), ki.zeile('eintrag'), ki.nurLetzter, ki.anhang] },
  { name: 'ki-ende', zeigt: '(Zwischenschritt: Entwürfe verwerfen, KI-Bereich zu)', nurSchritt: true,
    vor: [ki.aufraeumen, async K => K.ev(`KD.zu = true; kdMerken(); kdSetzen(false); return 'KI-Bereich zu'`)] },
  // Durchsicht (Flusskontrolle): alles Auffällige auf einen Blick
  // Durchsicht am Verhörer-Text (der Erlkönig hat nur eine Stelle, auch bei 150 BPM); die ersten Gruppen aufgeklappt
  { name: 'durchsicht', zeigt: 'Durchsicht: alle Stellen, die beim Singen haken könnten',
    vor: [schritte.verhoerer, schritte.abschnitt(6),
      async K => K.ev(`await new Promise(r => setTimeout(r, 2500)); const l = document.getElementById('dsListe');
        [...l.querySelectorAll('details')].slice(0, 2).forEach(d => { d.open = true; }); await new Promise(r => setTimeout(r, 600));
        return document.getElementById('dsZahl').textContent + ' · ' + l.textContent.trim().slice(0, 80).replace(/\\s+/g, ' ')`)] },
  // Hören: Klopfen, Vorlesen mit Art (natürlich, Versmaß, im Takt) – mit geladener Stimme
  { name: 'flusskontrolle', zeigt: 'Schritt 7: das Panel Flusskontrolle – Tempo, ⌥ zum Sehen, Anzeige, Ebene',
    vor: [schritte.text, schritte.abschnitt(6)] },
  { name: 'hoeren', zeigt: 'Hören: Klopfen, Vorlesen natürlich · Versmaß · im Takt',
    vor: [schritte.text, schritte.abschnitt(6), async K => K.ev(`for (let i = 0; i < 20 && $('vorleseArt').hidden; i++) await new Promise(r => setTimeout(r, 500));
      $('vorleseArt').value = 'takt'; return 'Art: ' + ($('vorleseArt').hidden ? 'keine Stimme' : $('vorleseArt').value)`)] },

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
  { name: 'flk-gedicht', zeigt: 'Flusskontrolle, Flickermodus: bekanntes Gedicht, hell · dunkel je Silbe (orange hell, blau dunkel)',
    vor: [schritte.flk('gedicht')], clip: ['#editor'] },
  { name: 'flk-zunge', zeigt: 'Flusskontrolle, Flickermodus: Zungenbrecher bei 200 BPM im Phonemstau – zu volle Schläge rot',
    vor: [schritte.flk('zunge')], clip: ['#editor'] },
  { name: 'flk-singbar', zeigt: 'Flusskontrolle, Singbarkeit: bekanntes Gedicht in der Anzeige Schlusston – offen trägt, geschlossen ist schwer zu halten',
    vor: [schritte.flk('singbar')], clip: ['#editor'] },
  { name: 'flk-aus', zeigt: '(kein Bild – Flickermodus aus)', vor: [async K => K.ev(`flackernAus(); return 'aus'`)], nurSchritt: true },
  { name: 'verhoerer', zeigt: 'gelbe Winkel: zwei Hörweisen an einer Wortgrenze (Seid ihr / sei dir)',
    vor: [schritte.verhoerer, schritte.ketten([])], clip: ['#blatt'] },
  { name: 'gramm', zeigt: 'grammatischer Reim im Russischen: gepunktete Linie am Reimteil (любил / ходил, столом / окном)',
    vor: [schritte.gramm, schritte.ketten([])], clip: ['#blatt'] },
  { name: 'fluss', zeigt: 'Silbenzahl und Hebungsdiagramm vor den Zeilen: Lücke = Pause, Haken = Drop, Pfeil = Zeilensprung',
    // Deutsch seit 26.11.2026 Goethe „Wandrers Nachtlied“ (Jörg: „ein Hebungsdiagramm mit mehr Variation, ggf ein Drop,
    // Hebungskollision“; der Erlkönig-Schluss hatte weder Drop noch Prall). Englisch bleibt Poe (die englischen Erlkönig-Zeilen sind zu lang für die Breite), Russisch Majakowski (Treppenzeilen).
    vor: SPR !== 'de' ? [schritte.probe, schritte.ketten(['binnen'])] : [schritte.nachtlied, schritte.ketten(['binnen'])], clip: ['#blatt'] },
  // Stammreime und Wortfamilie in der Werkbank (nur diese beiden Gruppen)
  { name: 'stammreim', zeigt: 'Werkbank: Stammreime (gleiche betonte Silbe) und Wortfamilie eines Wortes',
    vor: [schritte.probe, schritte.werkbankAuf({ de: 'Welt', en: 'back', ru: 'день' }), schritte.nurGruppen(['lx.stamm', 'lx.familie'])], clip: ['#wbInhalt .lexikon'], rand: 10 },
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

  // ---------- 0.10.0 (25.11.2026): der Ablauf in Schritten. Handlung und Lektorat mit echter KI (Claude-Abo der Probeinstanz).
  // Vorbilder: gemeinfreie Dichter als Genre-Datei in der Aufnahme-Ablage – Goethe, Shakespeare, Puschkin (Jörg: „man könnte das illustrieren
  // – schreib im Stil von Goethe … für RU und EN noch Puschkin und Shakespeare“).
  { name: 'ablauf', zeigt: 'die Leiste als Ablauf: Schritte als Balken untereinander, Sprache offen',
    vor: [schritte.plan, schritte.mischung, async K => K.ev(`kompaktSetzen(false); sektionOeffnen(-1); sektionOeffnen(7); await new Promise(r => setTimeout(r, 1500)); return 'ausführlich, Sprache offen'`)] },   // 7 = Schritt 1 Sprache: kurz, alle neun Schritte passen ins Bild (Jörg 26.11.2026)
  { name: 'ablauf-aus', zeigt: '(kein Bild – Leiste wieder ausführlich)', vor: [async K => K.ev(`kompaktSetzen(false); return 'aus'`)], nurSchritt: true },
  { name: 'aufbaubalken', zeigt: 'Schritt 4: Abschnitte als Balken, darunter die Sätze der Handlung',
    vor: [schritte.plan, schritte.abschnitt(11)] },
  { name: 'liedtext', zeigt: 'Schritt 5: Gerüst mit Handlung oder KI, „Das bekommt die KI“',
    vor: [schritte.plan, schritte.mischung, schritte.abschnitt(4)] },
  { name: 'genrekarte', zeigt: 'Genre-Karte: zwei Genres gemischt, rechts was die Mischung liefert',
    vor: [schritte.genreKarte('genres')] },
  { name: 'vorbilder', zeigt: 'Genre-Karte mit eigener Genre-Datei (gemeinfreier Dichter): Wortfeld und Form daraus',
    vor: [schritte.genreKarte('dichter')] },
  { name: 'genre-zu', zeigt: '(kein Bild – Genre-Karte zu)', vor: [async K => K.ev(`document.getElementById('gnAbbrechen').click(); return 'zu'`)], nurSchritt: true },
  { name: 'uebergabe', zeigt: 'Schritt 8: Kopierknöpfe oben, Styles und Exclude Styles mit Vorschlägen',
    vor: [schritte.text, schritte.mischung, schritte.stilAus,
      // ein Begriff, der auch im Stil-Prompt steht, damit die Warnung „steht in beiden“ zu sehen ist (alle drei Stil-Prompts nennen bass)
      async K => K.ev(`ausschlussSetzen($('sAus').value + ', bass'); return $('sAus').value`), schritte.abschnitt(10)] },
  { name: 'handlung', zeigt: 'KI-Bereich: drei Handlungen aus Stichworten (echte KI)',
    vor: [schritte.text, ki.aufraeumen, ki.anbieter('claude'), ki.vorschau(false), schritte.handlungen, ki.bereich(), ki.nurLetzter, ki.oben] },
  { name: 'lektorat', zeigt: 'KI-Bereich: das Lektorat liest den Text wie ein Hörer (echte KI)',
    vor: [schritte.text, ki.aufraeumen, ki.anbieter('claude'), ki.vorschau(false), schritte.lektorat, ki.bereich(), ki.nurLetzter, ki.oben] },
  { name: 'ki-ende2', zeigt: '(Zwischenschritt: KI-Bereich zu)', nurSchritt: true,
    vor: [ki.aufraeumen, async K => K.ev(`KD.zu = true; kdMerken(); kdSetzen(false); return 'KI-Bereich zu'`)] },

  // Zuletzt, weil die Seite wechselt: die Systemseite listet die nutzbaren Korpora auf diesem Rechner (Lexikon des Macs, Word,
  // LibreOffice) – je mit Haken und eingeklappter Begründung (Jörg, 16.11.2026). Der OpenThesaurus ist aufgeklappt, damit man
  // sieht, was hinter dem Pfeil steht. Orte zeigt die Liste nicht mehr; unscharf zeichnen ist darum nicht mehr nötig.
  { name: 'eigene', zeigt: 'Systemseite: nutzbare Korpora auf diesem Rechner – Haken davor, Begründung hinter dem Pfeil',
    vor: [schritte.seite('/system'),
          async K => K.ev(`const z = [...document.querySelectorAll('#korpora .kz')], b = (z.find(x => /OpenThesaurus/.test(x.querySelector('.kzn b').textContent)) || z[0] || document).querySelector('[data-kqauf]');
            if (!b) return 'keine Korpora'; b.click(); await new Promise(r => setTimeout(r, 300)); return 'aufgeklappt: ' + b.dataset.kqauf`)],
    clip: ['#korpora'], rand: 18, inBlick: true, hoch: 0.40 },
  // Seite System: die KI-Karten (Abo, Schlüssel, Apple) und der Stimm-Eichkasten – ans Ende, das Arbeitsblatt steht danach nicht mehr
  // Meldungen der Dienste können Konto- oder Team-Kennungen enthalten (Grok: console.x.ai/team/<id>) – im Bild unscharf, nie lesbar
  { name: 'dienste', zeigt: 'Seite System: KI-Dienste mit Abo, Schlüssel oder auf dem Mac',
    vor: [schritte.seite('/system#ki'), async K => K.ev(`let n = 0; for (const e of document.querySelectorAll('#karten .zustand')) if (/team\\/|[0-9a-f]{8}-[0-9a-f]{4}-|request_id|\\*{4}/i.test(e.textContent)) { e.style.filter = 'blur(6px)'; n++; } return 'unscharf: ' + n`)] },
  { name: 'stimmeichen', zeigt: 'Seite System: Vorlesestimme eichen',
    vor: [schritte.seite('/system')] },
];

// ---------- Fensterleiste mit Namen ----------
// Regel „Kein Bild ohne Namen“ (Jörg, 17.11.2026: „nicht ein einziges Bild zeigt die App mit Titlebar, das geht so nicht“ –
// „wie will man ein Produkt bekannt machen, wenn man seinen Namen nirgendwo sieht“): Über jedes App-Bild kommt eine schmale
// Fenster-Titelleiste – drei Punkte links, „KlangFeder“ in der Mitte. Sie ersetzt oben LEISTE Seitenpixel des Ausschnitts,
// so bleibt das Bild so groß wie sein Kachelfeld (FORMAT in docs/inhalt.js ändert sich nicht).
const LEISTE = 22;                                  // Seitenpixel (bei 1136 px Inhaltsbreite)
const NAME = 'KlangFeder';
function leisteDavor(datei) {
  const d = +(process.env.DPR || 2), b = +execFileSync('magick', ['identify', '-format', '%w', datei]).toString();
  const h = Math.round(LEISTE / S * d), r = Math.round(h * 0.17), y = Math.round(h / 2), x0 = Math.round(h * 0.62), dx = Math.round(h * 0.62);
  const leiste = datei.replace(/\.png$/, '-leiste.png');
  execFileSync('magick', ['-size', `${b}x${h}`, 'xc:#232326',
    '-fill', '#ff5f57', '-draw', `circle ${x0},${y} ${x0 + r},${y}`,
    '-fill', '#febc2e', '-draw', `circle ${x0 + dx},${y} ${x0 + dx + r},${y}`,
    '-fill', '#28c840', '-draw', `circle ${x0 + 2 * dx},${y} ${x0 + 2 * dx + r},${y}`,
    '-fill', '#d6d6da', '-font', '/System/Library/Fonts/SFNS.ttf', '-pointsize', String(Math.round(h * 0.46)), '-gravity', 'center', '-annotate', '+0+0', NAME,
    '-gravity', 'south', '-fill', '#38383d', '-draw', `rectangle 0,${h - Math.max(1, Math.round(d / 2))} ${b},${h}`, leiste]);
  execFileSync('magick', [leiste, datei, '-append', datei]); fs.unlinkSync(leiste);
}

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
  schreiben:   { feld: [365, 420], fenster: [1040, 1000], dx: 44, dy: 52, leiste: 185, werkbank: 0, anker: '#blatt', mitTitel: true, ohneKommentar: true, leisteZu: true },
  reimschema:  { feld: [448, 420], fenster: [860, 1100], leiste: 185, werkbank: 0, ohneDiagramm: true, dx: 14, dy: 52, anker: '#blatt', mitTitel: true },   // Text und Reimspalte, ohne Diagramm und Titel (Leere ≤ ¼, 25.11.2026)
  reimsuche:   { feld: { de: [430, 420], en: [383, 420], ru: [430, 420] }, fenster: [1920, 1300], leiste: 340, werkbank: { de: 606, en: 540, ru: 606 }, anker: '#werkbank' },
  ersatz:      { feld: [365, 420], ...WB, werkbank: 514 },   // Drittelbreite: die Spalten füllen die Werkbank (Leere ≤ ¼, 25.11.2026)
  luecke:      { feld: [365, 420], ...WB, werkbank: 514 },
  klangfarbe:  { feld: { de: [334, 420], en: [298, 420], ru: [334, 420] }, ...WB, werkbank: { de: 470, en: 420, ru: 470 } },
  lautschrift: { feld: [540, 215], ...WB, anker: '#lautFenster', unten: true, einblick: true, dx: -6, dy: 38 },   // die ganze Tastatur, darüber ein Stück Reimliste
  // gebunden steht quer neben einem langen Text: das Feld ist so hoch wie der Text (sonst schneidet die Seite das Bild zu)
  // wie die Blatt-Bilder (Jörg 17.11.2026: um die Lichter zentriert zeigte es Anschnitte von Leiste und Werkbank):
  // ab linkem Rand, oben die Werkzeugzeile mit den Lichtern, darunter das Blatt
  gebunden:    { feld: [485, 240], fenster: [1040, 1000], leiste: 185, werkbank: 0, anker: '#gebunden', abLinks: true, dx: 185, dy: -14, ohneMarke: true, ohneKommentar: true, leisteZu: true, hervor: '#gebunden' },
  zaehlen:     { feld: [269, 420], fenster: [1600, 1100], leiste: 400, anker: '.sunoleiste', dx: -12, dy: -13, einblick: true, ohneMarke: true, hervor: '.sunoleiste .zahl', hervorEng: true },   // Zahlen mit Rahmen (Jörg 26.11.2026)   // ab der Kopierleiste (Leere ≤ ¼, Jörg 25.11.2026)
  regie:       { feld: [269, 380], fenster: [1040, 1100], leiste: 185, werkbank: 0, anker: '#blatt', dx: 14, dy: { de: 0, en: 0, ru: 52 }, ohneDiagramm: true, mitTitel: true, ohneKommentar: true, ohneMarke: true, leisteZu: true },   // nur Text und Klammern, ohne Diagramm und Reimspalte (Leere ≤ ¼)
  // neu 17.11.2026: Klangketten (quer, wie „schreiben“), Fluss (w5 neben Versmaß w7), Stammreim und Anlaut (w6, Werkbank)
  klangketten: { feld: [338, 470], fenster: [760, 1000], ohneDiagramm: true, dx: 14, leiste: 185, werkbank: 0, anker: '#kettenzeile', dy: -4, ohneMarke: true, leisteZu: true },
  // neu 19.11.2026: Verhörer und grammatischer Reim, nebeneinander (w6), nur das Blatt mit Titel
  // neu 19.11.2026: Flusskontrolle – zwei Bilder nebeneinander (w6), Blatt mit Titel im Flickermodus
  // 23.11.2026: drei Bilder nebeneinander (w4), Feld so hoch wie Titel und vier Zeilen – weniger Rand (Jörg)
  'flk-gedicht': { feld: { de: [318, 135], en: [284, 135], ru: [250, 135] }, fenster: [1600, 1000], leiste: 185, werkbank: 0, anker: '#editor', dx: -10, dy: 45, mitTitel: true, ohneMarke: true, leisteZu: true },   // ohne Titelzeile: der Titel ließ rechts eine leere Fläche (Leere ≤ ¼, 25.11.2026)
  'flk-zunge':   { feld: { de: [365, 135], en: [272, 135], ru: [307, 135] }, fenster: [1600, 1000], leiste: 185, werkbank: 0, anker: '#editor', dx: -10, dy: 45, mitTitel: true, ohneMarke: true, leisteZu: true },   // ohne Titelzeile: der Titel ließ rechts eine leere Fläche (Leere ≤ ¼, 25.11.2026)
  'flk-singbar': { feld: { de: [250, 135], en: [227, 135], ru: [261, 135] }, fenster: [1600, 1000], leiste: 185, werkbank: 0, anker: '#editor', dx: -10, dy: 45, mitTitel: true, ohneMarke: true, leisteZu: true },   // ohne Titelzeile: der Titel ließ rechts eine leere Fläche (Leere ≤ ¼, 25.11.2026)
  verhoerer:   { feld: [250, 215], ohneDiagramm: true, dx: 14, fenster: [1040, 1000], leiste: 185, werkbank: 0, anker: '#blatt', mitTitel: true, ohneMarke: true, leisteZu: true },
  gramm:       { feld: [250, 190], ohneDiagramm: true, dx: 14, fenster: [1040, 1000], leiste: 185, werkbank: 0, anker: '#blatt', mitTitel: true, ohneMarke: true, leisteZu: true },
  fluss:       { feld: { de: [316, 280], en: [365, 300], ru: [330, 300] }, fenster: [1040, 1000], leiste: 185, werkbank: 0, anker: '#blatt', dx: 42, dy: 0, ohneMarke: true, leisteZu: true },
  stammreim:   { feld: [426, 215], ...WB, werkbank: 600, fenster: [1700, 1500], anker: '#wbInhalt .lexikon', dy: -10 },
  anlaut:      { feld: [426, 215], ...WB, werkbank: 600, fenster: [1700, 1500], anker: '#wbInhalt .anlautwahl', dy: -4 },
  hoerquiz:    { feld: [462, 430], fenster: [1600, 1000], anker: '#ohrFenster .ohrkasten', mitte: true, dy: -12 },
  // KI und Länge sind kleine Kästen der linken Leiste: Leiste auf Feldbreite gezogen, flache Reihe. Die Länge steht unten im
  // Aufbau – „unten“ legt das Feld mit dem Kasten an seinen Fuß, darüber stehen die Abschnitte, aus denen sie gerechnet wird.
  ki:          { feld: [558, 300], fenster: [1700, 1000], leiste: 790, anker: '.sec:has(#kAnbieter)', dx: -12, dy: -12, einblick: true },
  laenge:      { feld: [462, 420], fenster: [1600, 1000], leiste: 656, anker: '#aLaenge', dx: -12, dy: 14, unten: true, einblick: true },
  // KI-Verkehr steht in der Blattspalte: Leiste schmal, Werkbank aus, Fenster so breit, dass die Spalte das Feld trägt
  // KI-Bereich (Drawer) in der Blattspalte: Leiste schmal, Werkbank aus, Bereich fast so hoch wie die Spalte
  kiverkehr:   { feld: [558, 420], fenster: [1000, 1100], leiste: 185, werkbank: 0, anker: '#kiDrawer', dx: 6, dy: 0, leisteZu: true },
  webchat:     { feld: [558, 420], fenster: [1000, 1100], leiste: 185, werkbank: 0, anker: '#kiDrawer', dx: 6, dy: 0, leisteZu: true },
  entwurf:     { feld: [558, 420], fenster: [1000, 1100], leiste: 185, werkbank: 0, anker: '#kiDrawer', dx: 6, dy: 0, leisteZu: true },
  // Für Suno als vier Viertelkacheln (Jörg 26.11.2026, 1a); Regiezeilen rechts angeschnitten („schneide die regiezeilen rechts an“)
  durchsicht:  { feld: [269, 396], fenster: [1600, 1100], leiste: 400, anker: '#dsFeld', dx: -12, dy: -12, einblick: true },
  flusskontrolle: { feld: [365, 420], fenster: [1600, 1100], leiste: 520, anker: '#flFeld', dx: -12, dy: -12, einblick: true },   // Panel Flusskontrolle in Schritt 7 (Jörg 26.11.2026)
  hoeren:      { feld: [365, 420], fenster: [1600, 1500], leiste: 520, anker: 'h4.glteil[data-i18n="s6.hoeren"]', dx: -12, dy: -14, einblick: true },
  // Systemseite schmal, damit zwei Karten nebeneinander ins Feld passen
  dienste:     { feld: [558, 420], fenster: [800, 1500], anker: '#karten', dx: -8, dy: -8, einblick: true },
  stimmeichen: { feld: [365, 420], fenster: [540, 1500], anker: '#stimmEichung', dx: -8, dy: -8, einblick: true },
  eigene:      { feld: [558, 330], fenster: [800, 1000], anker: '#korpora', einblick: true },
  vergleich:   { feld: [1136, 600], fenster: [1600, 1100], werkbank: 0, anker: '#vergleich' },   // ohne leere Werkbank rechts (Leere ≤ ¼)
  // 0.10.0: der Ablauf – Leiste mit Schritt-Knöpfen (quer), Schritte breit gezogen, Genre-Karte, KI-Bereich wie „kiverkehr“
  ablauf:       { feld: [365, 520], fenster: [1600, 1100], leiste: 520, werkbank: 0, anker: '#leiste', abLinks: true, ohneMarke: true },   // die Leiste als schmale Spalte am linken Rand, so wie sie benutzt wird (Jörg, 25.11.2026)
  aufbaubalken: { feld: [365, 330], fenster: [1600, 1100], leiste: 520, werkbank: 0, anker: '.sec:has(#aufbau)', dx: -12, dy: 150, einblick: true },   // schmal: die Balken tragen auf schmaler Leiste genauso (Jörg, 25.11.2026: „nicht breiter als nötig“)
  uebergabe:    { feld: [269, 420], fenster: [1600, 1100], leiste: 400, werkbank: 0, anker: '#stVorschlaege', dx: -31, dy: -6, einblick: true },   // Vorschläge und Exclude Styles; Kopierleiste und Styles zeigt „Zeichen zählen“
  liedtext:     { feld: [365, 520], fenster: [1600, 1100], leiste: 520, anker: '.sec:has(#stilRegie)', dx: -12, dy: 12, unten: true, einblick: true },   // unten am Schritt 8: darüber das Ende des Aufbaus statt Leere
  genrekarte:   { feld: [751, 520], fenster: [1600, 930], anker: '#genreFenster .gnkarte', dx: -8, dy: -10 },
  vorbilder:    { feld: [558, 420], fenster: [1150, 820], anker: '#genreFenster .gnwurf', dx: -8, dy: -8 },
  handlung:     { feld: [558, 420], fenster: [1000, 1100], leiste: 185, werkbank: 0, anker: '#kiDrawer', dx: 6, dy: 0, leisteZu: true },
  lektorat:     { feld: [751, 520], fenster: [1240, 1100], leiste: 185, werkbank: 0, anker: '#kiDrawer', dx: 6, dy: 0, leisteZu: true },
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
  // FELDX='{…}': das Feld dieses Laufs überschreiben (Versuche mit anderer Breite, ohne die Tafel zu ändern)
  let F = FELD[b.name] && process.env.FELDX ? { ...FELD[b.name], ...JSON.parse(process.env.FELDX) } : FELD[b.name];
  // feld je Sprache ({ de: [w, h], en: …, ru: … }): der Inhalt ist je Sprache verschieden breit – das Bild nicht breiter als er
  if (F) F = Object.fromEntries(Object.entries(F).map(([k, v]) => [k, v && typeof v === 'object' && !Array.isArray(v) && SPR in v ? v[SPR] : v]));   // Angaben je Sprache
  if (F) { await fenster(K, ...F.fenster); console.log('    ', await lage(K, F)); }
  for (const s of b.vor) console.log('   ', JSON.stringify(await s(K)).slice(0, 170));
  if (F && F.ohneKommentar) console.log('    ', await K.ev(`const t = document.getElementById('text');
    if (/^#/m.test(t.value)) { t.value = t.value.split('\\n').filter(z => !z.startsWith('#')).join('\\n'); t.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 3000)); return 'Kommentarzeile raus'; } return 'keine Kommentarzeile'`));
  // leisteZu: in der schmalen Leiste nur die Abschnittsköpfe – aufgeklappt drängt sich ihr Inhalt übereinander
  if (F && F.leisteZu) console.log('    ', await K.ev(`document.querySelectorAll('.sechd[aria-expanded="true"]').forEach(b => b.click()); await new Promise(r => setTimeout(r, 900));
    // NICHT Abschnitt 1 aufklappen: mit KlangTresor steht dort die Liedliste des eigenen Archivs (persönlich, nicht auf die Seite)
    return 'Leiste zu'`));
  // hervor: ein Element im Bild mit orangem Rahmen hervorheben – nur in der Aufnahme (Jörg 17.11.2026: „mach ein Highlight drauf“)
  // seit 26.11.2026 alle Treffer des Selektors (Zeichenzahlen: drei Rahmen); hervorEng: Rahmen dicht am Element ohne Schein
  if (F && F.hervor) console.log('    ', await K.ev(`const l = [...document.querySelectorAll(${J(F.hervor)})]; if (!l.length) return 'hervor: fehlt';
    for (const e of l) Object.assign(e.style, ${F.hervorEng ? "{ outline: '2px solid #ff7a1a', outlineOffset: '3px', borderRadius: '4px' }" : "{ outline: '2px solid #ff7a1a', outlineOffset: '5px', borderRadius: '6px', boxShadow: '0 0 0 9px rgba(255,122,26,.18)' }"}); return 'hervorgehoben: ' + l.length + ' × ' + ${J(F.hervor)}`));
  // ohneMarke: die Markierung eines vorigen Werkbank-Bildes (orange hinterlegte Zeilen) schließen
  if (F && F.ohneMarke) console.log('    ', await K.ev(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));   /* das × gibt es seit 18.11.2026 nicht mehr; Esc leert die Werkbank */ const t = document.getElementById('text'); t.setSelectionRange(0, 0); t.blur();
    await new Promise(r => setTimeout(r, 800)); return 'Markierung zu: ' + document.querySelectorAll('#blatt .markiert, #blatt [class*=mark]').length`));
  // ohneDiagramm: Pille „Betonung“ aus – das Blatt zeigt nur Text und Reimspalte, ohne die leere Rinne vor dem Text
  // (Jörg, 25.11.2026: höchstens ein Viertel Leere; das Diagramm ist bei Hörfalle und grammatischem Reim nicht das Thema)
  if (F && F.ohneDiagramm) console.log('    ', await K.ev(`anzeigeSetzen('diagramm', false); await new Promise(r => setTimeout(r, 1200)); return 'Diagramm aus'`));
  if (F) console.log('    ', await lage(K, F));
  if (b.nurSchritt) continue;   // Zwischenschritt ohne Bild (z. B. Pillen wieder aus)
  // Kleine Kästen bekommen eine höhere Pixeldichte. Chrome beachtet weder clip.scale noch einen Zoom am body
  // zuverlässig; die Emulation muss erst gelöscht und dann neu gesetzt werden, sonst bleibt der alte Wert stehen.
  // Das Textblatt scrollt in sich; ohne diesen Schritt beginnt der Ausschnitt mitten im Titel.
  // Derbe Wörter gehören in die KlangFeder und werden nie umgangen; NUR in den Bildern der Feature-Seite werden sie unscharf
  // gezeichnet (Jörg, 17.11.2026: „du darfst sie in der Feature-Seite (und auch nur dort) blurren“).
  console.log('    ', await K.ev(`const derb = ${DERB}; let n = 0;
    for (const e of document.querySelectorAll('button.lxe[data-w], .wahl button, button[data-luecke]')) {   // Lückenknöpfe seit 26.11.2026
      const t = (e.dataset && e.dataset.w) || e.textContent || ''; if (derb.test(t.toLowerCase())) { e.style.filter = 'blur(5px)'; n++; } }
    return 'unscharf: ' + n`));
  await K.ev(`for (const e of document.querySelectorAll('#blatt, #editor, .secbody, #werkbank, #wbInhalt, #wbInhalt .lexikon')) e.scrollTop = 0;
    window.scrollTo(0, 0); return 1`);
  // Es scrollt nicht die Werkbank selbst, sondern die Liste darin (.lexikon, overflow-y: auto).
  // Es scrollt nicht die Werkbank selbst, sondern die Liste darin (.lexikon, overflow-y: auto) – und sie lädt
  // beim Scrollen nach, darum in Schleife, bis der Boden steht.
  if (b.scroll && typeof b.scroll === 'object') b.scroll = b.scroll[SPR];
  // scroll 'synonyme': die Liste so rollen, dass die erste Synonym-Gruppe oben steht (die Reime davor sind ein eigenes Bild)
  if (b.scroll === 'synonyme') console.log('    ', await K.ev(`const l = document.querySelector('#werkbank .lexikon'); if (!l) return 'keine Liste';
    const k = t('lx.syn.gleich').split(/[·(]/)[0].trim().slice(0, 6), h = [...l.querySelectorAll('.lxh')].find(x => x.textContent.trim().startsWith(k)) || [...l.querySelectorAll('.lxh')].find(x => x.textContent.includes(k));
    if (!h) return 'keine Synonyme';
    // was davor steht (Reimgruppen), ausblenden – rollen allein reicht nicht, wenn die Liste danach zu kurz ist
    let n = 0; for (let e = l.firstElementChild; e && e !== h; e = e.nextElementSibling) { e.style.display = 'none'; n++; }
    l.scrollTop = 0; await new Promise(r => setTimeout(r, 600)); return 'ab ' + h.textContent.trim() + ' (' + n + ' davor aus)'`));
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
    // oben die Leistenhöhe abziehen: der Inhalt beginnt dort, wo er ohne Leiste begann, und endet entsprechend früher
    const lh = LEISTE / S;
    execFileSync('magick', [voll, '-crop', `${Math.round(cw * DPR)}x${Math.round((ch - lh) * DPR)}+${Math.round(x * DPR)}+${Math.round(y * DPR)}`, '+repage', dateiF]);
    leisteDavor(dateiF);
    fs.unlinkSync(voll);
    if (F.ohneDiagramm) await K.ev(`anzeigeSetzen('diagramm', true); return 1`);
    console.log(`    → ${dateiF}`);
    await fenster(K, FB, FH); await lage(K, {});
    continue;
  }
  const datei = path.join(ZIEL, `${b.name}-${SPR}.png`);
  if (b.ganz) {
    const p = await K.bild(`${b.name}-${SPR}`);
    fs.copyFileSync(p, datei);
    leisteDavor(datei);
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
