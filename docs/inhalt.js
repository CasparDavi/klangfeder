/* KlangFeder – Inhalt der Landingpage. Lieder UND Gedichte (Caspar_D 12.11.2026: „es müssen nicht lieder sein, es kann auch
   reine Lyrik sein, ggf etwas allgemeiner formulieren“; „eher, für Gedichte und Lieder – es heisst ja schließlich
   KlangFeder“) – Gedichte zuerst; Suno ist ein Anwendungsfall, nicht der Rahmen.
  : EINE Textquelle (Bauart der KlangTresor-Feature-Seite, docs/features/inhalt.js;
   Caspar_D 12.11.2026: „a la KlangTresor“, „immer auf altbewährtes zurückgreifen“). Sprachen DE und EN.
   Kachel = {id, w (Breite 4/5/6/7/8/12), klein, h, p, d (Einzelheiten)}. Bilder: BILDER[id]; fehlt der Eintrag, steht ein Platzhalter.
   Bilder zeigen „Erlkönig“ von Caspar_D (öffentlich auf Suno; Caspar_D 12.11.2026). */
const S = {
 kopf:{
  marke:{en:'KlangFeder',de:'KlangFeder'},
  h:{en:'Hear your verse while you write it.',de:'Verse, die man schon beim Schreiben hört.'},
  p:{en:'For poems and songs: KlangFeder shows you while you write how your lines sound – stress, metre, rhyme. And it finds the words that fit. German and English, on your own computer, free.',
     de:'Für Gedichte und Lieder: Die KlangFeder zeigt dir beim Schreiben, wie deine Zeilen klingen – Betonung, Versmaß, Reim. Und sie findet die Wörter, die passen. Deutsch und Englisch, auf deinem Rechner, kostenlos.'},
  mehr:{en:'More',de:'Mehr'}, zu:{en:'Close',de:'Schließen'}, abspielen:{en:'Play',de:'Abspielen'},
  platz:{en:'Picture follows',de:'Bild folgt'}
 },
 abschnitte:[
 {augenbraue:{en:'Write',de:'Schreiben'},
  h:{en:'You see how it sounds.',de:'Du siehst, wie es klingt.'},
  p:{en:'Every syllable shows its stress, every line its metre. If a line stumbles, you see it before anyone sings or reads it aloud.',
     de:'Jede Silbe zeigt ihre Betonung, jede Zeile ihr Maß. Holpert ein Vers, siehst du es, bevor ihn jemand singt oder vorliest.'},
  kacheln:[
  {id:'schreiben',w:12,klein:{en:'Stress and metre',de:'Betonung und Versmaß'},
   h:{en:'Bright means stressed.',de:'Hell ist betont.'},
   p:{en:'Stressed syllables light up, unstressed ones step back. On the right, the beats of each line as bars, their number and the rhyme.',
      de:'Betonte Silben leuchten, unbetonte treten zurück. Rechts die Hebungen jeder Zeile als Balken, ihre Zahl und der Reim.'},
   d:{en:['<b>German and English</b>, also mixed in one text; KlangFeder detects the language line by line.','<b>Pronunciation dictionaries</b> with over 800,000 word forms, plus Viëtor’s pronunciation dictionary of 1921, digitised by us and released freely.','<b>Syllables on the left</b>, beats and cadence (masculine or feminine ending) on the right; the section shows its metre, such as Knittelvers.'],
      de:['<b>Deutsch und Englisch</b>, auch gemischt in einem Text; die Sprache erkennt die KlangFeder Zeile für Zeile.','<b>Aussprachewörterbücher</b> mit über 800 000 Wortformen, dazu Viëtors Aussprachewörterbuch von 1921, von uns digitalisiert und frei veröffentlicht.','<b>Silbenzahl links</b>, Hebungen und Kadenz (männlich oder weiblich) rechts; der Abschnitt zeigt sein Versmaß, etwa Knittelvers.']}},
  ]},
 {augenbraue:{en:'Rhyme',de:'Reimen'},
  h:{en:'Same colour rhymes.',de:'Gleiche Farbe reimt.'},
  p:{en:'KlangFeder hears rhymes, it does not read them: by sound, not by spelling – pure, impure, assonance. And it finds new ones.',
     de:'Die KlangFeder hört Reime, sie liest sie nicht: nach dem Klang, nicht nach der Schreibung – rein, unrein, Assonanz. Und sie findet neue.'},
  kacheln:[
  {id:'reimschema',w:6,klein:{en:'Rhyme scheme',de:'Reimschema'},
   h:{en:'Every section knows its scheme.',de:'Jeder Abschnitt kennt sein Schema.'},
   p:{en:'Letters show which lines rhyme. Next to each heading the scheme: found in the text, or set by you.',
      de:'Buchstaben zeigen, welche Zeilen reimen. Neben jeder Überschrift das Schema: im Text gefunden oder von dir vorgegeben.'},
   d:{en:['<b>Fours, sixes and eights</b> to choose from: alternate rhyme ABAB, couplets AABB, tail rhyme AABCCB, ottava rima ABABABCC; any scheme can also be typed.','<b>“auto”</b> takes the scheme that best fits sections of this kind.','<b>Impure rhymes</b> by the rules of prosody count too (mir/Tür, Liebe/trübe).'],
      de:['<b>Vierer, Sechser, Achter</b> zur Wahl: Kreuzreim ABAB, Paarreim AABB, Schweifreim AABCCB, Stanze ABABABCC; jedes Schema lässt sich auch selbst tippen.','<b>„auto“</b> nimmt das Schema, das zu den Abschnitten dieser Art am besten passt.','<b>Unreine Reime</b> nach der Verslehre zählen mit (mir/Tür, Liebe/trübe).']}},
  {id:'reimsuche',w:6,klein:{en:'Rhyme search',de:'Reimsuche'},
   h:{en:'Right-click, and the rhymes are there.',de:'Rechtsklick, und die Reime stehen da.'},
   p:{en:'Rhymes on a word, pure, impure and as assonance, with how often they rhyme in poems and songs. Bold fits the metre.',
      de:'Reime auf ein Wort, rein, unrein und als Assonanz, mit ihrer Häufigkeit in Gedichten und Liedern. Fett passt ins Maß.'},
   d:{en:['<b>In the same workbench:</b> replacements with the same stress pattern, opposites and phrases.','<b>How often</b> from about 61,000 German poems and – if you fetch it – from German song lyrics.','<b>One click</b> puts the word in; ⌘Z takes it back.'],
      de:['<b>In derselben Werkbank:</b> Ersatzwörter im gleichen Rhythmus, Gegenteile und Wendungen.','<b>Wie oft</b> aus rund 61 000 deutschen Gedichten und – wenn du es holst – aus deutschen Liedtexten.','<b>Ein Klick</b> setzt das Wort ein; ⌘Z nimmt es zurück.']}},
  ]},
 {augenbraue:{en:'Find',de:'Finden'},
  h:{en:'The right word, in the right metre.',de:'Das passende Wort, im passenden Maß.'},
  p:{en:'Synonyms, opposites and phrases – sorted by whether they fit the line. And gaps that KlangFeder fills.',
     de:'Synonyme, Gegenteile und Wendungen – sortiert danach, ob sie in den Vers passen. Und Lücken, die die KlangFeder füllt.'},
  kacheln:[
  {id:'ersatz',w:7,klein:{en:'Replacements',de:'Ersatzwörter'},
   h:{en:'Same meaning, same stress.',de:'Gleich gemeint, gleich betont.'},
   p:{en:'Synonyms with the same syllable pattern come first; the others show where their stress lies. Plus opposites and phrases.',
      de:'Synonyme mit demselben Silbenmuster stehen vorn; die übrigen zeigen, wo ihre Betonung liegt. Dazu Gegenteile und Wendungen.'},
   d:{en:['<b>From OpenThesaurus and Wiktionary</b>; on a Mac also from the Dictionary app and, if it is running, Microsoft Word.','<b>“rhymes”</b> marks synonyms that also rhyme with the partner line.','<b>English</b> from the Open English WordNet.'],
      de:['<b>Aus OpenThesaurus und dem Wiktionary</b>, auf dem Mac zusätzlich aus dem Programm Lexikon und, wenn es läuft, aus Microsoft Word.','<b>„reimt“</b> markiert Synonyme, die zugleich auf die Partnerzeile reimen.','<b>Englisch</b> aus dem Open English WordNet.']}},
  {id:'luecke',w:5,klein:{en:'Gaps',de:'Lücken'},
   h:{en:'Three strokes, and the words fit.',de:'Drei Striche, und die Wörter passen.'},
   p:{en:'Write ___ or a pattern like x-X-x-X where the word is missing. A right-click shows words in exactly that metre that rhyme as well.',
      de:'Schreib ___ oder ein Muster wie x-X-x-X, wo dir das Wort fehlt. Ein Rechtsklick zeigt Wörter in genau diesem Maß, die auch noch reimen.'},
   d:{en:['<b>The metre</b> comes from the partner line, the rhyme from the rhyme scheme.','<b>Placeholders</b> such as x-X-x-X: small unstressed, capital stressed; a rhyme sound may end it, as in the German x-x-ICHT.','<b>One click</b> puts the suggestion in place of the gap.'],
      de:['<b>Das Maß</b> kommt aus der Partnerzeile, der Reim aus dem Reimschema.','<b>Platzhalter</b> wie x-X-x-X: klein unbetont, groß betont; am Ende darf ein Reimklang stehen (x-x-ICHT).','<b>Ein Klick</b> setzt den Vorschlag an die Stelle der Lücke.']}},
  ]},
 {augenbraue:{en:'For Suno',de:'Für Suno'},
  h:{en:'Ready to paste.',de:'Fertig zum Einfügen.'},
  p:{en:'If you write for Suno, KlangFeder lays out text and style the way Suno wants them – counted and ready to copy.',
     de:'Schreibst du für Suno, legt die KlangFeder Text und Stil so bereit, wie Suno sie will – gezählt und zum Kopieren.'},
  kacheln:[
  {id:'zaehlen',w:6,klein:{en:'Character count',de:'Zeichen zählen'},
   h:{en:'It fits, or you see that it does not.',de:'Es passt, oder du siehst es.'},
   p:{en:'Lyrics and styles counted separately against Suno’s limits of 5,000 and 1,000 characters. One button copies each field.',
      de:'Lyrics und Styles getrennt gezählt, gegen Sunos Grenzen von 5000 und 1000 Zeichen. Ein Knopf kopiert jedes Feld.'},
   d:{en:['<b>The style prompt</b> is saved with every version of your text.','<b>Together with KlangTresor</b>, KlangFeder also estimates the length of the song and how densely Suno will sing it.'],
      de:['<b>Der Stil-Prompt</b> wird mit jedem Stand deines Textes gespeichert.','<b>Zusammen mit dem KlangTresor</b> schätzt die KlangFeder auch die Länge des Lieds und wie dicht Suno es singen wird.']}},
  {id:'regie',w:6,klein:{en:'Directions',de:'Regie'},
   h:{en:'[Brackets] are for Suno.',de:'[Klammern] sind für Suno.'},
   p:{en:'What stands in square brackets is direction: sections, mood, instruments. KlangFeder reads it as structure and leaves it out of the metre.',
      de:'Was in eckigen Klammern steht, ist Regie: Abschnitte, Stimmung, Instrumente. Die KlangFeder liest es als Gliederung und misst es nicht mit.'},
   d:{en:['<b>Sections</b> such as [Verse], [Chorus], [Bridge] structure the text; rhyme scheme and metre apply per section.','<b># at the start of a line</b> is a note for you and does not go to Suno.','<b>Lines before the first bracket</b> count as a preamble (hints, thanks) and are not measured.'],
      de:['<b>Abschnitte</b> wie [Verse], [Chorus], [Bridge] gliedern den Text; Reimschema und Versmaß gelten je Abschnitt.','<b># am Zeilenanfang</b> ist eine Notiz für dich und geht nicht an Suno.','<b>Zeilen vor der ersten Klammer</b> gelten als Vorspann (Hinweise, Dank) und werden nicht mitgemessen.']}},
  ]},
 {augenbraue:{en:'If you like',de:'Wahlweise'},
  h:{en:'Good on its own.<br>More together.',de:'Allein gut.<br>Zusammen mehr.'},
  p:{en:'KlangFeder works entirely on its own. Switched on, an AI writes with you, and KlangTresor brings your Suno archive as a yardstick.',
     de:'Die KlangFeder arbeitet ganz für sich. Eingeschaltet schreibt eine KI mit, und der KlangTresor bringt dein Suno-Archiv als Maßstab.'},
  kacheln:[
  {id:'ki',w:5,klein:{en:'With AI',de:'Mit KI'},
   h:{en:'Claude or ChatGPT write with you.',de:'Claude oder ChatGPT schreiben mit.'},
   p:{en:'Suggest storylines, write a text in the style of your models, revise lines – via your own account with Anthropic or OpenAI.',
      de:'Handlungen vorschlagen, einen Text im Stil deiner Vorlagen erstellen, Zeilen überarbeiten – über dein eigenes Konto bei Anthropic oder OpenAI.'},
   d:{en:['<b>Your own account:</b> KlangFeder uses Claude Code or Codex on your computer; the System page helps you sign in.','<b>Rhyme, beats and structure</b> are rules for the AI.','<b>Switched off</b>, everything to do with AI is hidden, not greyed out.'],
      de:['<b>Dein eigenes Konto:</b> Die KlangFeder nutzt Claude Code bzw. Codex auf deinem Rechner; die Seite System hilft beim Anmelden.','<b>Reim, Hebungen und Aufbau</b> gelten der KI als Regel.','<b>Ausgeschaltet</b> ist alles zur KI ausgeblendet, nicht ausgegraut.']}},
  {id:'laenge',w:7,klein:{en:'With KlangTresor',de:'Mit KlangTresor'},
   h:{en:'Your archive as the yardstick.',de:'Dein Archiv als Maßstab.'},
   p:{en:'If KlangTresor is running, KlangFeder knows your songs: it estimates how long Suno will sing a text and how densely, measured on your archive.',
      de:'Läuft der KlangTresor, kennt die KlangFeder deine Lieder: Sie schätzt, wie lang Suno einen Text singt und wie dicht, gemessen an deinem Archiv.'},
   d:{en:['<b>Models:</b> songs from KlangTresor, ticked as models, show their style – metre, rhyme, structure – and serve the AI as examples.','<b>The length</b> is rough (±12 % on average); density says more.','<b>KlangTresor</b> is a separate free program for your Suno archive: <a href="https://github.com/CasparDavi/klangtresor">github.com/CasparDavi/klangtresor</a>.'],
      de:['<b>Vorlagen:</b> Lieder aus dem KlangTresor, als Vorlagen angekreuzt, zeigen ihren Stil – Versmaß, Reim, Aufbau – und dienen der KI als Vorbild.','<b>Die Länge</b> ist grob (im Mittel ±12 %); die Dichte sagt mehr.','<b>Der KlangTresor</b> ist ein eigenes, freies Programm für dein Suno-Archiv: <a href="https://github.com/CasparDavi/klangtresor">github.com/CasparDavi/klangtresor</a>.']}},
  ]},
 {augenbraue:{en:'Yours',de:'Bei dir'},
  h:{en:'Your verse stays with you.',de:'Deine Verse bleiben bei dir.'},
  p:{en:'KlangFeder runs on your computer, without an account and without a cloud. Every version is kept. The dictionaries come from free sources – among them Viëtor’s pronunciation dictionary of 1921, which we digitised and <a href="https://github.com/CasparDavi/vietor-1921">released freely</a>.',
     de:'Die KlangFeder läuft auf deinem Rechner, ohne Konto und ohne Cloud. Jeder Stand wird aufgehoben. Die Wörterbücher stammen aus freien Quellen – darunter Viëtors Aussprachewörterbuch von 1921, das wir digitalisiert und <a href="https://github.com/CasparDavi/vietor-1921">frei veröffentlicht</a> haben.'},
  kacheln:[
  {id:'vergleich',w:12,klein:{en:'Versions',de:'Fassungen'},
   h:{en:'Every version stays.',de:'Jeder Stand bleibt.'},
   p:{en:'“Save” keeps a version with date and time. “old | new” puts it next to your text and shows what changed – in the metre too.',
      de:'„Speichern“ hebt einen Stand mit Datum und Uhrzeit auf. „alt | neu“ legt ihn neben den Text und zeigt, was sich geändert hat – auch im Maß.'},
   d:{en:['<b>In numbers:</b> lines with the same beats, end rhymes, stressed line endings, characters – before and after.','<b>What was cut</b> is marked on the left; you keep writing on the right.','<b>For songs from KlangTresor</b>, the original stands on the left.'],
      de:['<b>In Zahlen:</b> Zeilen mit gleichen Hebungen, Endreime, betonte Zeilenenden, Zeichen – vorher und nachher.','<b>Gestrichenes</b> ist links markiert; rechts wird weitergeschrieben.','<b>Bei Liedern aus dem KlangTresor</b> steht links das Original.']}},
  ]},
 ],
 grenzen:{
  h:{en:'Good to know',de:'Gut zu wissen'},
  l:{en:['KlangFeder suggests, it does not decide. Stress, metre and rhymes are computed and can be wrong; the judgement stays with you.','Your texts stay on your computer. Only if you let an AI write or revise do text and request go to Claude or ChatGPT, via your own account there.','KlangFeder is not part of Suno. It only counts what fits into Suno’s fields.'],
     de:['Die KlangFeder schlägt vor, sie entscheidet nicht. Betonung, Versmaß und Reime sind gerechnet und können irren; das Urteil bleibt bei dir.','Deine Texte bleiben auf deinem Rechner. Nur wenn du eine KI schreiben oder überarbeiten lässt, gehen Text und Wunsch an Claude oder ChatGPT, über dein eigenes Konto dort.','Die KlangFeder gehört nicht zu Suno. Sie zählt nur, was in Sunos Felder passt.']}
 },
 fuss:{en:'KlangFeder is free software by Caspar_D · github.com/CasparDavi/klangfeder',
       de:'Die KlangFeder ist freie Software von Caspar_D · github.com/CasparDavi/klangfeder'},
 stern:{en:'',de:''}
};

/* HERUNTERLADEN – wie im KlangTresor: oben die Knöpfe im Kopf, unten der Abschnitt mit den Anforderungen.
   Die Dateien liegen fest unter releases/latest/download/; mb = Größe der Release-Datei (Release 0.9.1). */
S.laden = {
 augenbraue:{en:'Download',de:'Herunterladen'},
 h:{en:'For your computer.',de:'Für deinen Rechner.'},
 p:{en:'One file, double-click, done. KlangFeder fetches its dictionaries itself, with a progress bar.',de:'Eine Datei, Doppelklick, fertig. Ihre Wörterbücher holt die KlangFeder selbst, mit Balken.'},
 knopf:{en:'Download',de:'Herunterladen'},
 systeme:[
  {name:'Windows',typ:'Setup.exe',zeile:{en:'Windows 10 / 11 · 64-bit',de:'Windows 10 / 11 · 64 Bit'},datei:'KlangFeder-Setup.exe',mb:22},
  {name:'macOS',typ:'DMG',zeile:{en:'macOS 11 or newer · Intel and Apple Silicon',de:'macOS 11 oder neuer · Intel und Apple Silicon'},datei:'KlangFeder.dmg',mb:78},
  {name:'Linux',typ:'.deb',zeile:{en:'Ubuntu, Debian, Mint · 64-bit',de:'Ubuntu, Debian, Mint · 64 Bit'},datei:'KlangFeder-amd64.deb',mb:43}
 ],
 anf:{en:'<b>System requirements.</b> About 1.5 GB free for program and dictionaries. A current web browser. Other Linux systems: the <a href="https://github.com/CasparDavi/klangfeder/releases/latest/download/KlangFeder-x86_64.AppImage">AppImage</a>. Not signed: on Windows, Edge first holds the download back – click the arrow next to “Delete” → “Keep”; on first launch Windows and macOS ask once more. Once installed, KlangFeder updates itself: a bell next to “System” shows a new version.',
      de:'<b>Systemanforderungen.</b> Rund 1,5 GB frei für Programm und Wörterbücher. Ein aktueller Webbrowser. Andere Linux-Systeme: das <a href="https://github.com/CasparDavi/klangfeder/releases/latest/download/KlangFeder-x86_64.AppImage">AppImage</a>. Nicht signiert: Unter Windows hält Edge den Download zuerst zurück – Pfeil neben „Löschen“ → „Beibehalten“; beim ersten Start fragen Windows und macOS noch einmal nach. Einmal installiert, erneuert sich die KlangFeder selbst: Eine Glocke neben „System“ zeigt eine neue Fassung.'}
};

const BV = '3';   // Bildstand: hochzählen, wenn Bilder ersetzt werden (sonst zeigt der Browser alte)
const BILDER = {
  titel: { sprachen: { de: `img/titel-de.webp?v=${BV}`, en: `img/titel-en.webp?v=${BV}` } },
  schreiben: { sprachen: { de: `img/schreiben-de.webp?v=${BV}`, en: `img/schreiben-en.webp?v=${BV}` } },
  reimschema: { sprachen: { de: `img/reimschema-de.webp?v=${BV}`, en: `img/reimschema-en.webp?v=${BV}` } },
  reimsuche: { sprachen: { de: `img/reimsuche-de.webp?v=${BV}`, en: `img/reimsuche-en.webp?v=${BV}` } },
  ersatz: { sprachen: { de: `img/ersatz-de.webp?v=${BV}`, en: `img/ersatz-en.webp?v=${BV}` } },
  luecke: { sprachen: { de: `img/luecke-de.webp?v=${BV}`, en: `img/luecke-en.webp?v=${BV}` } },
  zaehlen: { sprachen: { de: `img/zaehlen-de.webp?v=${BV}`, en: `img/zaehlen-en.webp?v=${BV}` } },
  regie: { sprachen: { de: `img/regie-de.webp?v=${BV}`, en: `img/regie-en.webp?v=${BV}` } },
  ki: { sprachen: { de: `img/ki-de.webp?v=${BV}`, en: `img/ki-en.webp?v=${BV}` } },
  laenge: { sprachen: { de: `img/laenge-de.webp?v=${BV}`, en: `img/laenge-en.webp?v=${BV}` } },
  vergleich: { sprachen: { de: `img/vergleich-de.webp?v=${BV}`, en: `img/vergleich-en.webp?v=${BV}` } },
};
const POSTER = {}, TEMPO = {};
const NUR_TEXT = new Set([]);   // Kacheln, die ohne Bild stehen
const GH = 'github.com/CasparDavi/klangfeder';
const ghLink = (s) => s.replace(GH, `<a class="gh" href="https://${GH}">${GH}</a>`);
const KONSOLE = {}, konsole = () => [];
const FORMAT = { schreiben: '1560/700', reimschema: '1310/950', reimsuche: '1310/950', ersatz: '1380/1095', luecke: '1000/1111', zaehlen: '676/620', regie: '1090/1000', ki: '676/680', laenge: '1495/1073', vergleich: '1560/1045' };   /* ki w5 / laenge w7: 5·680/676 = 7·1073/1495 */   /* ersatz w7 / luecke w5: 7·1095/1380 = 5·1111/1000, Unterkanten fluchten */   /* Kacheln, deren Bild ein eigenes Seitenverhaeltnis hat */
