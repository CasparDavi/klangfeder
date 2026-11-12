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
   d:{en:['<b>German and English</b>, also mixed in one text; KlangFeder detects the language line by line.','<b>Pronunciation dictionaries</b> with over 800,000 word forms.','<b>Syllables on the left</b>, beats and cadence (masculine or feminine ending) on the right.'],
      de:['<b>Deutsch und Englisch</b>, auch gemischt in einem Text; die Sprache erkennt die KlangFeder Zeile für Zeile.','<b>Aussprachewörterbücher</b> mit über 800 000 Wortformen.','<b>Silbenzahl links</b>, Hebungen und Kadenz (männlich oder weiblich) rechts.']}},
  {id:'versmass',w:12,klein:{en:'Metre',de:'Versmaß'},
   h:{en:'Iamb, blank verse, sonnet – recognised.',de:'Jambus, Knittelvers, Sonett – erkannt.'},
   p:{en:'From the beats of each line KlangFeder reads the foot, the line form and the stanza form, following classical prosody.',
      de:'Aus den Hebungen jeder Zeile liest die KlangFeder Versfuß, Versform und Strophenform – nach der klassischen Verslehre.'},
   d:{en:['<b>Poems strictly, songs freely:</b> in a song, a double offbeat or an upbeat is not a fault.','<b>The forms catalogue</b> in the help shows every form as a picture of beats and offbeats.'],
      de:['<b>Gedichte streng, Lieder frei:</b> Im Lied gelten Doppelsenkung und Auftakt nicht als Fehler.','<b>Der Formenkatalog</b> in der Hilfe zeigt jede Form als Bild aus Hebungen und Senkungen.']}},
  ]},
 {augenbraue:{en:'Rhyme',de:'Reimen'},
  h:{en:'Same colour rhymes.',de:'Gleiche Farbe reimt.'},
  p:{en:'KlangFeder hears rhymes, it does not read them: by sound, not by spelling, in seven levels. And it finds new ones.',
     de:'Die KlangFeder hört Reime, sie liest sie nicht: nach dem Klang, nicht nach der Schreibung, in sieben Stufen. Und sie findet neue.'},
  kacheln:[
  {id:'reimschema',w:6,klein:{en:'Rhyme scheme',de:'Reimschema'},
   h:{en:'Every section knows its scheme.',de:'Jeder Abschnitt kennt sein Schema.'},
   p:{en:'Letters show which lines rhyme. Next to each heading the scheme: found in the text, or set by you.',
      de:'Buchstaben zeigen, welche Zeilen reimen. Neben jeder Überschrift das Schema: im Text gefunden oder von dir vorgegeben.'},
   d:{en:['<b>Fours, sixes and eights</b> to choose from: alternate rhyme ABAB, couplets AABB, tail rhyme AABCCB, ottava rima ABABABCC; any scheme can also be typed.','<b>“auto”</b> takes the scheme that best fits sections of this kind.'],
      de:['<b>Vierer, Sechser, Achter</b> zur Wahl: Kreuzreim ABAB, Paarreim AABB, Schweifreim AABCCB, Stanze ABABABCC; jedes Schema lässt sich auch selbst tippen.','<b>„auto“</b> nimmt das Schema, das zu den Abschnitten dieser Art am besten passt.']}},
  {id:'reimsuche',w:6,klein:{en:'Rhyme search',de:'Reimsuche'},
   h:{en:'Right-click, and the rhymes are there.',de:'Rechtsklick, und die Reime stehen da.'},
   p:{en:'Rhymes on a word, level by level, with how often they rhyme in poems and songs. Bold fits the metre.',
      de:'Reime auf ein Wort, Stufe für Stufe, mit ihrer Häufigkeit in Gedichten und Liedern. Fett passt ins Maß.'},
   d:{en:['<b>In the same workbench:</b> replacements with the same stress pattern, opposites and phrases.','<b>How often</b> from about 61,000 German poems and – if you fetch it – from German song lyrics.','<b>One click</b> puts the word in; ⌘Z takes it back.'],
      de:['<b>In derselben Werkbank:</b> Ersatzwörter im gleichen Rhythmus, Gegenteile und Wendungen.','<b>Wie oft</b> aus rund 61 000 deutschen Gedichten und – wenn du es holst – aus deutschen Liedtexten.','<b>Ein Klick</b> setzt das Wort ein; ⌘Z nimmt es zurück.']}},
  {id:'reimstufen',w:12,klein:{en:'Rhyme levels',de:'Reimstufen'},
   h:{en:'Seven levels, each in its colour.',de:'Sieben Stufen, jede in ihrer Farbe.'},
   p:{en:'How well two words rhyme, KlangFeder hears from their pronunciation. The colour stands as a stripe next to every list of rhymes. Examples in German:',
      de:'Wie gut zwei Wörter reimen, hört die KlangFeder an ihrer Aussprache. Die Farbe steht als Streifen an jeder Reimliste.'},
   d:{en:['<b>Impure rhymes</b> by the rules of prosody (mir/Tür, Zeit/freut) count in the rhyme scheme.','<b>The list of rhymes</b> runs from identical to echo; the scroll wheel decides how far.'],
      de:['<b>Unreine Reime</b> nach der Verslehre (mir/Tür, Zeit/freut) zählen im Reimschema mit.','<b>Die Reimliste</b> läuft von rührend bis Anklang; das Mausrad entscheidet, wie weit.']}},
  ]},
 {augenbraue:{en:'Under the hood',de:'Unter der Haube'},
  h:{en:'Rhymes, analysed with the methods of bioinformatics.',de:'Reime, mit Verfahren der Bioinformatik analysiert.'},
  p:{en:'As biology compares protein and DNA sequences, KlangFeder compares chains of sounds: aligned like BLAST, scored with a substitution matrix learned from rhymes.',
     de:'Wie die Biologie Eiweiß- und Erbgutsequenzen vergleicht, vergleicht die KlangFeder Lautketten: ausgerichtet wie mit BLAST, bewertet mit einer Austauschmatrix, die aus Reimen gelernt ist.'},
  kacheln:[
  {id:'blast',w:6,klein:{en:'How it finds rhymes',de:'Wie sie Reime findet'},
   h:{en:'Rhymes aligned like genes.',de:'Reime aligniert wie Gene.'},
   p:{en:'Every word becomes a chain of sounds and is aligned from its end, sound against sound. Three real alignments from KlangFeder: the same sounds give full points, similar ones fewer, and what comes before the rhyme does not count.',
      de:'Jedes Wort wird zur Kette von Lauten und vom Ende her ausgerichtet, Laut gegen Laut. Drei echte Ausrichtungen aus der KlangFeder: Gleiche Laute bringen volle Punkte, ähnliche weniger, was vor dem Reim steht, zählt nicht.'},
   d:{en:['<b>Anchored at the end, open to the left</b> (as in BLAST): the alignment grows as long as the score carries it.','<b>A table of sound pairs</b> (a substitution matrix, as BLOSUM is for proteins): how often two sounds stand together at the rhyme, more often than chance gives points.','<b>Syllables have weight:</b> a missing unstressed syllable costs little, a stressed one a lot – Tag / sagen rhymes, Heim / Heimat does not.'],
      de:['<b>Am Ende verankert, nach links offen</b> (wie bei BLAST): Die Ausrichtung wächst, solange die Punkte tragen.','<b>Eine Tafel der Lautpaare</b> (Austauschmatrix, wie BLOSUM bei Eiweißen): Wie oft zwei Laute an Reimstelle zusammenstehen – häufiger als der Zufall gibt Punkte.','<b>Silben haben Gewicht:</b> Eine fehlende unbetonte Silbe kostet wenig, eine betonte viel – Tag / sagen reimt, Heim / Heimat nicht.']}},
  {id:'lautmatrix',w:6,klein:{en:'Sound matrix',de:'Lautmatrix'},
   h:{en:'Which vowels rhyme.',de:'Welche Vokale sich reimen.'},
   p:{en:'Learned from the rhymes of about 61,000 poems: how much more often two vowels stand together at the rhyme than chance would have it. Warm: more often, blue: less often, empty: never seen together.',
      de:'Aus den Reimen von rund 61 000 Gedichten gelernt: wie viel öfter zwei Vokale an Reimstelle zusammenstehen, als der Zufall erwarten lässt. Warm: öfter, blau: seltener, leer: nie zusammen gesehen.'},
   d:{en:['<b>For example:</b> i and ɪ (Miete / Mitte) almost never rhyme, i and y (Liebe / trübe) often.','<b>The measure</b> is pointwise mutual information (PMI) per pair of sounds, scaled so that every sound gives 1 with itself.','<b>Consonants</b> have the same kind of table; it decides how much a different final consonant costs.'],
      de:['<b>Ein Beispiel:</b> i und ɪ (Miete / Mitte) reimen fast nie, i und y (Liebe / trübe) oft.','<b>Gemessen</b> als punktweise Transinformation (PMI) je Lautpaar, so bemessen, dass jeder Laut mit sich selbst 1 ergibt.','<b>Für Konsonanten</b> gibt es dieselbe Art Tafel; sie bestimmt, was ein anderer Endkonsonant kostet.']}},
  ]},
 {augenbraue:{en:'Find',de:'Finden'},
  h:{en:'The right word, in the right metre.',de:'Das passende Wort, im passenden Maß.'},
  p:{en:'Synonyms, opposites and phrases – each with a sign of how well it fits your line. And gaps that KlangFeder fills.',
     de:'Synonyme, Gegenteile und Wendungen – jedes mit einem Zeichen, wie gut es in deinen Vers passt. Und Lücken, die die KlangFeder füllt.'},
  kacheln:[
  {id:'ersatz',w:7,klein:{en:'Replacements',de:'Ersatzwörter'},
   h:{en:'Same meaning, same stress.',de:'Gleich gemeint, gleich betont.'},
   p:{en:'Synonyms with the same syllable pattern come first. A small battery shows for every suggestion how well it fits exactly this place in the line.',
      de:'Synonyme mit demselben Silbenmuster stehen vorn. Eine kleine Batterie zeigt bei jedem Vorschlag, wie gut er an genau diese Stelle der Zeile passt.'},
   d:{en:['<b>At the top</b> the line with its beats, the selection marked. Full battery: exactly the beats of this place; three quarters: a syllable more or less; half: it stumbles; a quarter: a main stress on an offbeat; empty: the line gets a different number of beats.','<b>From OpenThesaurus and Wiktionary</b>; on a Mac also from the Dictionary app and, if it is running, Microsoft Word.','<b>“rhymes”</b> marks synonyms that also rhyme with the partner line.','<b>English</b> from the Open English WordNet.'],
      de:['<b>Oben</b> die Zeile mit ihren Hebungen, die Auswahl markiert. Volle Batterie: genau die Hebungen dieser Stelle; drei Viertel: eine Silbe mehr oder weniger; halb: es holpert; ein Viertel: ein Hauptton in der Senkung; leer: die Zeile bekommt eine andere Zahl Hebungen.','<b>Aus OpenThesaurus und dem Wiktionary</b>, auf dem Mac zusätzlich aus dem Programm Lexikon und, wenn es läuft, aus Microsoft Word.','<b>„reimt“</b> markiert Synonyme, die zugleich auf die Partnerzeile reimen.','<b>Englisch</b> aus dem Open English WordNet.']}},
  {id:'luecke',w:5,klein:{en:'Gaps',de:'Lücken'},
   h:{en:'Three strokes, and the words fit.',de:'Drei Striche, und die Wörter passen.'},
   p:{en:'Write ___ or a pattern like x-X-x-X where the word is missing. A right-click shows words in exactly that metre that rhyme as well.',
      de:'Schreib ___ oder ein Muster wie x-X-x-X, wo dir das Wort fehlt. Ein Rechtsklick zeigt Wörter in genau diesem Maß, die auch noch reimen.'},
   d:{en:['<b>The metre</b> comes from the partner line, the rhyme from the rhyme scheme.','<b>Placeholders</b> such as x-X-x-X: small unstressed, capital stressed; a rhyme sound may end it, as in the German x-x-ICHT.','<b>One click</b> puts the suggestion in place of the gap.'],
      de:['<b>Das Maß</b> kommt aus der Partnerzeile, der Reim aus dem Reimschema.','<b>Platzhalter</b> wie x-X-x-X: klein unbetont, groß betont; am Ende darf ein Reimklang stehen (x-x-ICHT).','<b>Ein Klick</b> setzt den Vorschlag an die Stelle der Lücke.']}},
  ]},
 {augenbraue:{en:'Structure',de:'Aufbau'},
  h:{en:'First the form, then the words.',de:'Erst die Form, dann die Worte.'},
  p:{en:'A frame for a song or a poem, written into the sheet as placeholders. You write over it, and the plan stays visible.',
     de:'Ein Gerüst für ein Lied oder ein Gedicht, als Platzhalter ins Blatt geschrieben. Du schreibst darüber, und der Plan bleibt sichtbar.'},
  kacheln:[
  {id:'geruest',w:6,klein:{en:'Frames',de:'Gerüste'},
   h:{en:'Song or poem.',de:'Lied oder Gedicht.'},
   p:{en:'One switch chooses between song forms and classical poem forms. Every form comes into the sheet with its lines, beats and rhyme scheme.',
      de:'Ein Umschalter wählt zwischen Liedformen und klassischen Gedichtformen. Jede Form kommt mit Zeilen, Hebungen und Reimschema ins Blatt.'},
   d:{en:['<b>Songs:</b> pop with pre-chorus, verse–chorus–bridge, AABA, ballad, blues, rap and more – or the structure of your models.','<b>Poems:</b> sonnet, ottava rima, terza rima, folk-song stanza, ghazal, ode stanzas, limerick, haiku, elfchen.','<b>In the structure panel</b> every section can be changed: lines, beats, rhyme, cadence.'],
      de:['<b>Lieder:</b> Pop mit Pre-Chorus, Strophe–Refrain–Bridge, AABA, Ballade, Blues, Rap und mehr – oder der Aufbau deiner Vorlagen.','<b>Gedichte:</b> Sonett, Stanze, Terzinen, Volksliedstrophe, Ghasel, Odenstrophen, Limerick, Haiku, Elfchen.','<b>Im Aufbau</b> lässt sich jeder Abschnitt ändern: Zeilen, Hebungen, Reim, Kadenz.']}},
  {id:'soll',w:6,klein:{en:'Plan and result',de:'Soll und Ist'},
   h:{en:'The plan stays.',de:'Der Plan bleibt stehen.'},
   p:{en:'Next to every line an outline shows what the frame asks for. What is missing stays hollow; what is too much lights up.',
      de:'Neben jeder Zeile zeigt ein Umriss, was das Gerüst verlangt. Was fehlt, bleibt hohl; was zu viel ist, leuchtet.'},
   d:{en:['<b>Poems</b> syllable by syllable, <b>songs</b> by their beats – a double offbeat and an upbeat are allowed there.','<b>The rhyme letter</b> stays pale until the line really rhymes.'],
      de:['<b>Gedichte</b> Silbe für Silbe, <b>Lieder</b> nach Hebungen – Doppelsenkung und Auftakt sind dort erlaubt.','<b>Der Reimbuchstabe</b> steht blass, bis die Zeile wirklich reimt.']}},
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
 {augenbraue:{en:'Sources',de:'Quellen'},
  h:{en:'Old dictionaries, read anew.',de:'Alte Wörterbücher, neu gelesen.'},
  p:{en:'Free modern dictionaries do not know many words – and where they do, the secondary stress is often missing. So we went through two public-domain pronunciation dictionaries page by page.',
     de:'Freie moderne Wörterbücher kennen viele Wörter nicht – und wo sie sie kennen, fehlt oft der Nebenton. Zwei gemeinfreie Aussprachewörterbücher haben wir deshalb Seite für Seite ausgewertet.'},
  kacheln:[
  {id:'buecher',w:7,klein:{en:'Muret-Sanders 1900 · Viëtor 1921',de:'Muret-Sanders 1900 · Viëtor 1921'},
   h:{en:'Stress as it was printed.',de:'Betonung, wie sie gedruckt steht.'},
   p:{en:'Muret-Sanders marks every syllable with an arc or a bar, with main and secondary stress; Viëtor spells every word in phonetic script. From that comes the stress KlangFeder works with.',
      de:'Muret-Sanders setzt über jede Silbe Bogen oder Strich, mit Haupt- und Nebenton; Viëtor schreibt jedes Wort in Lautschrift. Daraus wird die Betonung, mit der die KlangFeder rechnet.'},
   d:{en:['<b>What for:</b> rare and old words, compounds and names get their stress from a dictionary instead of a rule – <b>Un</b>wert, <b>Ur</b>kraft, pianis<b>si</b>mo.','<b>Viëtor</b> is released freely: <a href="https://github.com/CasparDavi/vietor-1921">github.com/CasparDavi/vietor-1921</a>.','<b>Both works</b> are in the public domain; the scans come from the Internet Archive.'],
      de:['<b>Wozu:</b> Seltene und alte Wörter, Zusammensetzungen und Namen bekommen ihre Betonung aus einem Wörterbuch statt aus einer Regel – <b>Un</b>wert, <b>Ur</b>kraft, pianis<b>si</b>mo.','<b>Viëtor</b> ist frei veröffentlicht: <a href="https://github.com/CasparDavi/vietor-1921">github.com/CasparDavi/vietor-1921</a>.','<b>Beide Werke</b> sind gemeinfrei; die Scans stammen aus dem Internet Archive.']}},
  {id:'umfang',w:5,klein:{en:'Size',de:'Umfang'},
   h:{en:'Almost 100,000 headwords.',de:'Fast 100 000 Stichwörter.'},
   p:{en:'Read, and of those new to KlangFeder: words the free modern dictionaries do not know.',
      de:'Gelesen, und davon neu für die KlangFeder: Wörter, die die freien modernen Wörterbücher nicht kennen.'},
   d:{en:['<b>Muret-Sanders</b>, Encyclopaedic Dictionary, German–English part, Langenscheidt 1900: two volumes, about 2,500 pages.','<b>Viëtor</b>, Deutsches Aussprachewörterbuch, 3rd edition 1921: about 500 pages.'],
      de:['<b>Muret-Sanders</b>, Enzyklopädisches Wörterbuch, Teil Deutsch–Englisch, Langenscheidt 1900: zwei Bände, rund 2 500 Seiten.','<b>Viëtor</b>, Deutsches Aussprachewörterbuch, 3. Auflage 1921: rund 500 Seiten.']}},
  ]},
 {augenbraue:{en:'Yours',de:'Bei dir'},
  h:{en:'Your verse stays with you.',de:'Deine Verse bleiben bei dir.'},
  p:{en:'KlangFeder runs on your computer, without an account and without a cloud. Every version is kept. The dictionaries come from free sources.',
     de:'Die KlangFeder läuft auf deinem Rechner, ohne Konto und ohne Cloud. Jeder Stand wird aufgehoben. Die Wörterbücher stammen aus freien Quellen.'},
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
 anf:{en:'<b>System requirements.</b> About 1.5 GB free for program and dictionaries. A current web browser. Other Linux systems: the <a href="https://github.com/CasparDavi/klangfeder/releases/latest/download/KlangFeder-x86_64.AppImage">AppImage</a>. Not signed: on Windows, Edge first holds the download back – click the arrow next to “Delete” → “Keep”; on first launch Windows may ask once more, and macOS blocks the app until you allow it under Privacy & Security → “Open Anyway”. Once installed, KlangFeder updates itself: a bell next to “System” shows a new version.',
      de:'<b>Systemanforderungen.</b> Rund 1,5 GB frei für Programm und Wörterbücher. Ein aktueller Webbrowser. Andere Linux-Systeme: das <a href="https://github.com/CasparDavi/klangfeder/releases/latest/download/KlangFeder-x86_64.AppImage">AppImage</a>. Nicht signiert: Unter Windows hält Edge den Download zuerst zurück – Pfeil neben „Löschen“ → „Beibehalten“; beim ersten Start fragt Windows unter Umständen noch einmal nach, und macOS blockiert die App, bis du sie unter Datenschutz & Sicherheit → „Dennoch öffnen“ freigibst. Einmal installiert, erneuert sich die KlangFeder selbst: Eine Glocke neben „System“ zeigt eine neue Fassung.'}
};

const BV = '4';   // Bildstand: hochzählen, wenn Bilder ersetzt werden (sonst zeigt der Browser alte)
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
  /* Aufbau als Schaubilder statt Screenshots (Caspar_D, 12.11.2026: „keine screenshots, lieber zwei schaubilder“) */
  geruest: { schaubild: { umschalter: true, links: { de: 'Lied', en: 'Song' }, rechts: { de: 'Gedicht', en: 'Poem' }, knopf: { de: 'ein Klick', en: 'one click' },
   von: { de: ['Pop', 'Strophe · Refrain', 'AABA', 'Ballade', 'Blues', 'Rap'], en: ['pop', 'verse · chorus', 'AABA', 'ballad', 'blues', 'rap'] },
   bei: { de: ['Sonett', 'Stanze', 'Terzinen', 'Volksliedstrophe', 'Limerick', 'Haiku'], en: ['sonnet', 'ottava rima', 'terza rima', 'folk-song stanza', 'limerick', 'haiku'] } } },
  /* Soll und Ist: Balken wie im Programm. m je Silbe: w/s gefüllt (Senkung/Hebung), W/S Umriss (fehlt noch), ! zu viel.
     Deutsch: Eichendorff, „In einem kühlen Grunde“ (1813), Volksliedstrophe; Englisch: Wordsworth (1807), vierhebige Jamben.
     Die dritte Zeile ist absichtlich um eine Silbe verlängert, die vierte erst angefangen. */
  soll: { sollbild: {
   de: [ { t: 'x-X-x-X-x-X-x', m: 'wswswsw', r: 'A', n: 'Gerüst', platz: true },
         { t: 'In einem kühlen Grunde', m: 'wswswsw', r: 'A', n: 'passt' },
         { t: 'Da geht ein Mühlenrad', m: 'wswsws', r: 'B', n: 'passt' },
         { t: 'Mein Liebste ist <b>nun</b> verschwunden', m: 'wsws!wsw', r: 'A', n: 'Silbe zu viel' },
         { t: 'Die dort gewoh▏', m: 'wswsWWS', r: 'B', blass: true, n: 'Rest als Umriss' } ],
   en: [ { t: 'x-X-x-X-x-X-x-X', m: 'wswswsws', r: 'A', n: 'frame', platz: true },
         { t: 'I wandered lonely as a cloud', m: 'wswswsws', r: 'A', n: 'fits' },
         { t: 'That floats on high o’er vales and hills', m: 'wswswsws', r: 'B', n: 'fits' },
         { t: 'When all at once I saw a <b>big</b> crowd', m: 'wswswsw!s', r: 'A', n: 'one too many' },
         { t: 'A host of golden daff▏', m: 'wswswsWS', r: 'B', blass: true, n: 'the rest as an outline' } ] } },
  buecher: `img/buecher.webp?v=${BV}`,
  /* Versfüße, Versformen, Strophenformen – Beispielwörter mit der betonten Silbe fett */
  versmass: { liste: [
   { k: { de: 'Versfüße', en: 'Feet' }, w: { de: ['Jambus: Ver·<b>stand</b>', 'Trochäus: <b>Va</b>·ter', 'Daktylus: <b>Kö</b>·ni·gin', 'Anapäst: Pa·ra·<b>dies</b>'], en: ['iamb: a·<b>bove</b>', 'trochee: <b>gar</b>·den', 'dactyl: <b>beau</b>·ti·ful', 'anapaest: in·ter·<b>vene</b>'] } },
   { k: { de: 'Versformen', en: 'Line forms' }, w: { de: ['Volksliedvers', 'Knittelvers', 'Blankvers', 'Alexandriner', 'Hexameter', 'freie Rhythmen'], en: ['folk song line', 'knittelvers', 'blank verse', 'alexandrine', 'hexameter', 'free rhythms'] } },
   { k: { de: 'Strophenformen', en: 'Stanza forms' }, w: { de: ['Sonett', 'Stanze', 'Terzine', 'Volksliedstrophe', 'Ghasel', 'Limerick', 'und 15 weitere'], en: ['sonnet', 'ottava rima', 'terza rima', 'folk-song stanza', 'ghazal', 'limerick', 'and 15 more'] } } ] },
  /* Reimstufen in den Farben der KlangFeder (Streifen an der Reimliste); Beispiele vom Kern geprüft (Reimsuche, 12.11.2026) */
  reimstufen: { liste: [
   { k: { de: 'rührend', en: 'identical' }, f: '#f2f2f2', w: { de: ['Liebe / bliebe', 'auch der Anlaut gleich'], en: ['Liebe / bliebe', 'even the onset is the same'] } },
   { k: { de: 'rein', en: 'perfect' }, f: '#4a8fff', w: { de: ['Herz / Schmerz', 'ab dem betonten Vokal gleich'], en: ['Herz / Schmerz', 'the same from the stressed vowel on'] } },
   { k: { de: 'fast rein', en: 'near-perfect' }, f: '#45c26a', w: { de: ['Rad / Stadt', 'nur die Vokallänge anders'], en: ['Rad / Stadt', 'only the vowel length differs'] } },
   { k: { de: 'unrein', en: 'impure' }, f: '#e6d23e', w: { de: ['Liebe / trübe', 'Vokal leicht anders'], en: ['Liebe / trübe', 'vowel slightly different'] } },
   { k: { de: 'Assonanz', en: 'assonance' }, f: '#f08a24', w: { de: ['Liebe / Wiege', 'nur die Vokale gleich'], en: ['Liebe / Wiege', 'only the vowels match'] } },
   { k: { de: 'Konsonanz', en: 'consonance' }, f: '#c0646c', w: { de: ['Liebe / lebe', 'nur die Konsonanten gleich'], en: ['Liebe / lebe', 'only the consonants match'] } },
   { k: { de: 'Anklang', en: 'echo' }, f: '#76767b', w: { de: ['Wind / Winter', 'klingt ähnlich, andere Silbenzahl'], en: ['Wind / Winter', 'sounds alike, other syllable count'] } } ] },
  /* Ausrichtung zweier Lautketten wie im Programm (kern/laute.mjs ausrichten, Gedichte-Matrix; Punkte am 12.11.2026 gerechnet):
     | gleich, : ähnlich, · verschieden; „von“ = Punkte des Worts gegen sich selbst */
  blast: { ausrichtung: {
   zeilen: [
    { a: 'Liebe', b: 'trübe', s: [['l', 'tʁ', ' '], ['iː', 'yː', ':'], ['b', 'b', '|'], ['ə', 'ə', '|']], p: '10,4', pe: '10.4', max: '11,4', maxe: '11.4', st: 'unrein' },
    { a: 'Liebe', b: 'Wiege', s: [['l', 'v', ' '], ['iː', 'iː', '|'], ['b', 'ɡ', '·'], ['ə', 'ə', '|']], p: '7,7', pe: '7.7', max: '11,4', maxe: '11.4', st: 'Assonanz' },
    { a: 'Herz', b: 'Schmerz', s: [['h', 'ʃm', ' '], ['ɛ', 'ɛ', '|'], ['ɐ̯', 'ɐ̯', '|'], ['t͡s', 't͡s', '|']], p: '6,0', pe: '6.0', max: '6,0', maxe: '6.0', st: 'rein' } ],
   stufen: { unrein: { de: 'unrein', en: 'impure', f: '#e6d23e' }, Assonanz: { de: 'Assonanz', en: 'assonance', f: '#f08a24' }, rein: { de: 'rein', en: 'perfect', f: '#4a8fff' } },
   von: { de: 'von', en: 'of' },
   leg: { gleich: { de: 'gleich', en: 'same' }, aehnlich: { de: 'ähnlich', en: 'similar' }, anders: { de: 'verschieden', en: 'different' }, aussen: { de: 'vor dem Reim', en: 'before the rhyme' } } } },
  /* Vokalmatrix aus der gelernten Reimmatrix (KlangFeder daten/de/laut/pmi.json, TextGrid-Gedichte, Stand 10.11.2026):
     normierte PMI je Paar, 1 = gleicher Laut; fehlende Paare wurden nie zusammen gesehen (bleiben leer) */
  lautmatrix: { matrix: { laute: ["i", "ɪ", "e", "ɛ", "y", "ʏ", "ø", "œ", "u", "ʊ", "o", "ɔ", "a", "ə", "ɐ", "aɪ̯", "ɔʏ̯", "aʊ̯"], werte: {"a|a": 1, "ə|ə": 1, "aɪ̯|aɪ̯": 1, "ɛ|ɛ": 1, "œ|ɛ": 0.582, "ɐ|ɐ": 1, "e|ɛ": -0.095, "ɪ|ʏ": 0.536, "e|e": 1, "i|i": 1, "o|ɔ": 0.274, "ɪ|ɪ": 1, "i|y": 0.671, "œ|ɪ": -0.1, "ɔ|ɔ": 1, "u|u": 1, "o|o": 1, "ɔʏ̯|ɔʏ̯": 1, "ʏ|ʏ": 1, "ʊ|ʊ": 1, "e|ø": 0.552, "y|ʏ": 0.203, "aʊ̯|aʊ̯": 1, "y|y": 1, "œ|ʏ": -0.47, "aɪ̯|ɔʏ̯": 0.515, "u|ʊ": -0.466, "i|ʏ": -0.354, "ø|ø": 1, "œ|œ": 1, "o|ø": -0.493, "ø|œ": 0.237, "ø|ɛ": -0.127, "œ|ɔ": -0.445, "y|ø": -0.293, "i|ɪ": -1.45, "œ|ʊ": -0.501, "ɛ|ɪ": -1.78, "ɪ|ʊ": -1.821},
   leg: { links: { de: 'seltener als Zufall', en: 'less often than chance' }, rechts: { de: 'öfter', en: 'more often' }, leer: { de: 'nie gesehen', en: 'never seen' } } } },
  /* Umfang der ausgewerteten gemeinfreien Werke: gelesene Stichwörter, davon neu (nicht in ipa-dict bzw. ipa-dict + Viëtor) */
  umfang: { balken: { zeilen: [
   { n: 'Muret-Sanders 1900', ges: 62047, neu: 26322 },
   { n: 'Viëtor 1921', ges: 36779, neu: 11223 } ],
   leg: { ges: { de: 'gelesen', en: 'read' }, neu: { de: 'davon neu', en: 'of those new' } } } },
};
const POSTER = {}, TEMPO = {};
const NUR_TEXT = new Set([]);   // Kacheln, die ohne Bild stehen
const GH = 'github.com/CasparDavi/klangfeder';
const ghLink = (s) => s.replace(GH, `<a class="gh" href="https://${GH}">${GH}</a>`);
const KONSOLE = {}, konsole = () => [];
const FORMAT = { schreiben: '1560/700', reimschema: '1310/950', reimsuche: '1310/950', ersatz: '1380/1095', luecke: '1000/1111', zaehlen: '676/620', regie: '1090/1000', ki: '676/680', laenge: '1495/1073', vergleich: '1560/1045', buecher: '1320/880' };   /* ki w5 / laenge w7: 5·680/676 = 7·1073/1495 */   /* ersatz w7 / luecke w5: 7·1095/1380 = 5·1111/1000, Unterkanten fluchten */   /* Kacheln, deren Bild ein eigenes Seitenverhaeltnis hat */
