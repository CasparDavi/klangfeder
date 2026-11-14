/* KlangFeder – Inhalt der Landingpage. Lieder UND Gedichte (Caspar_D 12.11.2026: „es müssen nicht lieder sein, es kann auch
   reine Lyrik sein, ggf etwas allgemeiner formulieren“; „eher, für Gedichte und Lieder – es heisst ja schließlich
   KlangFeder“) – Gedichte zuerst; Suno ist ein Anwendungsfall, nicht der Rahmen.
  : EINE Textquelle (Bauart der KlangTresor-Feature-Seite, docs/features/inhalt.js;
   Caspar_D 12.11.2026: „a la KlangTresor“, „immer auf altbewährtes zurückgreifen“). Sprachen DE und EN.
   Kachel = {id, w (Breite 4/5/6/7/8/12), klein, h, p, d (Einzelheiten)}. Bilder: BILDER[id]; fehlt der Eintrag, steht ein Platzhalter.
   Bilder zeigen „Erlkönig“ von Caspar_D (öffentlich auf Suno; Caspar_D 12.11.2026). */
const S = {
 kopf:{
  marke:{en:'KlangFeder',de:'KlangFeder',ru:'KlangFeder'},
  h:{en:'Hear your verse while you write it.',de:'Verse, die man schon beim Schreiben hört.',ru:'Стихи, которые слышно уже при письме.'},
  p:{en:'For poems and songs: KlangFeder shows you while you write how your lines sound – stress, metre, rhyme. And it finds the words that fit. German, English and Russian, on your own computer, free.',
     de:'Für Gedichte und Lieder: Die KlangFeder zeigt dir beim Schreiben, wie deine Zeilen klingen – Betonung, Versmaß, Reim. Und sie findet die Wörter, die passen. Deutsch, Englisch und Russisch, auf deinem Rechner, kostenlos.',
     ru:'Для стихов и песен: KlangFeder прямо во время письма показывает, как звучат ваши строки, — ударение, размер, рифма. И находит слова, которые подходят. Немецкий, английский и русский, на вашем компьютере, бесплатно.'},
  mehr:{en:'More',de:'Mehr',ru:'Подробнее'}, zu:{en:'Close',de:'Schließen',ru:'Закрыть'}, abspielen:{en:'Play',de:'Abspielen',ru:'Воспроизвести'},
  platz:{en:'Picture follows',de:'Bild folgt',ru:'Изображение будет'}
 },
 abschnitte:[
 {augenbraue:{en:'Write',de:'Schreiben',ru:'Писать'},
  h:{en:'You see how it sounds.',de:'Du siehst, wie es klingt.',ru:'Вы видите, как это звучит.'},
  p:{en:'Every syllable shows its stress, every line its metre. If a line stumbles, you see it before anyone sings or reads it aloud.',
     de:'Jede Silbe zeigt ihre Betonung, jede Zeile ihr Maß. Holpert ein Vers, siehst du es, bevor ihn jemand singt oder vorliest.',
     ru:'Каждый слог показывает своё ударение, каждая строка — свой размер. Если стих спотыкается, вы увидите это раньше, чем его кто-нибудь споёт или прочтёт вслух.'},
  kacheln:[
  {id:'schreiben',w:12,klein:{en:'Stress and metre',de:'Betonung und Versmaß',ru:'Ударение и размер'},
   h:{en:'Bright means stressed.',de:'Hell ist betont.',ru:'Светлое — ударное.'},
   p:{en:'Stressed syllables light up, unstressed ones step back. On the right, the beats of each line as bars, with their count and the rhyme.',
      de:'Betonte Silben leuchten, unbetonte treten zurück. Rechts die Hebungen jeder Zeile als Balken, ihre Zahl und der Reim.',
      ru:'Ударные слоги светятся, безударные отступают. Справа — ударные слоги каждой строки полосками, их число и рифма.'},
   d:{en:['<b>German, English and Russian</b>, also mixed in one text; KlangFeder detects the language line by line.','<b>Pronunciation dictionaries</b> with over 800,000 word forms.','<b>Syllable count on the left</b>, beats and ending on the right (s = stressed ending, u = unstressed ending).','<b>The language of poetry:</b> turn’d, heav’n, o’er and e’er are read with their real number of syllables.'],
      de:['<b>Deutsch, Englisch und Russisch</b>, auch gemischt in einem Text; die Sprache erkennt die KlangFeder Zeile für Zeile.','<b>Aussprachewörterbücher</b> mit über 800 000 Wortformen.','<b>Silbenzahl links</b>, rechts die Hebungen (betonte Silben) und die Kadenz: endet die Zeile betont, männlich, unbetont, weiblich.','<b>Eigenheiten der Dichtersprache:</b> im Englischen turn’d, heav’n, o’er; im Russischen е neben ё und gesetzte Betonungszeichen.'],
      ru:['<b>Немецкий, английский и русский</b>, даже вперемешку в одном тексте; язык KlangFeder определяет строка за строкой.','<b>Словари произношения</b> — больше 800 000 словоформ.','<b>Слева число слогов</b>, справа ударные слоги и клаузула: ударный конец строки — мужская, безударный — женская, два безударных — дактилическая.','<b>Поэтический язык:</b> е вместо ё и поставленные знаки ударения KlangFeder читает как они написаны, за́мок и замо́к различает.']}},
  {id:'versmass',w:12,klein:{en:'Metre',de:'Versmaß',ru:'Размер'},
   h:{en:'Iamb, blank verse, sonnet – recognised.',de:'Jambus, Knittelvers, Sonett – erkannt.',ru:'Ямб, онегинская строфа, сонет — распознаны.'},
   p:{en:'From the beats in each line KlangFeder reads the foot, the line form and the stanza form, following classical prosody.',
      de:'Aus den Hebungen jeder Zeile liest die KlangFeder Versfuß, Versform und Strophenform – nach der klassischen Verslehre.',
      ru:'По ударным слогам каждой строки KlangFeder определяет стопу, форму стиха и строфу — по классической теории стиха.'},
   d:{en:['<b>Poems strictly, songs freely:</b> in a song, two unstressed syllables in a row or an upbeat are not a fault.','<b>The forms catalogue</b> in the help shows every form as a picture of stressed and unstressed syllables.'],
      de:['<b>Gedichte streng, Lieder frei:</b> Im Lied gelten Doppelsenkung und Auftakt nicht als Fehler.','<b>Der Formenkatalog</b> in der Hilfe zeigt jede Form als Bild aus Hebungen und Senkungen.'],
      ru:['<b>Стихи — строго, песни — свободно:</b> в песне два безударных подряд и анакруза не считаются ошибкой.','<b>Каталог форм</b> в справке показывает каждую форму картинкой из ударных и безударных слогов.']}},
  ]},
 {augenbraue:{en:'Rhyme',de:'Reimen',ru:'Рифмовать'},
  h:{en:'Same colour rhymes.',de:'Gleiche Farbe reimt.',ru:'Одинаковый цвет — рифма.'},
  p:{en:'KlangFeder hears rhymes; it doesn’t read them. It judges by sound, not spelling – and it finds new ones.',
     de:'Die KlangFeder hört Reime, sie liest sie nicht: nach dem Klang, nicht nach der Schreibung. Und sie findet neue.',
     ru:'KlangFeder слышит рифмы, а не читает их: по звучанию, а не по написанию. И находит новые.'},
  kacheln:[
  {id:'reimschema',w:6,klein:{en:'Rhyme scheme',de:'Reimschema',ru:'Схема рифмовки'},
   h:{en:'Every section knows its scheme.',de:'Jeder Abschnitt kennt sein Schema.',ru:'Каждый раздел знает свою схему.'},
   p:{en:'Letters show which lines rhyme. Beside each heading you see its scheme – found in the text or set by you.',
      de:'Buchstaben zeigen, welche Zeilen reimen. Neben jeder Überschrift das Schema: im Text gefunden oder von dir vorgegeben.',
      ru:'Буквы показывают, какие строки рифмуются. Рядом с каждым заголовком — схема: найденная в тексте или заданная вами.'},
   d:{en:['<b>Schemes for four, six or eight lines</b>: alternate rhyme ABAB, couplets AABB, tail rhyme AABCCB, ottava rima ABABABCC; any scheme can also be typed.','<b>“auto”</b> takes the scheme that best fits sections of this kind.'],
      de:['<b>Strophen mit vier, sechs oder acht Zeilen</b> zur Wahl: Kreuzreim ABAB, Paarreim AABB, Schweifreim AABCCB, Stanze ABABABCC; jedes Schema lässt sich auch selbst tippen.','<b>„auto“</b> nimmt das Schema, das zu den Abschnitten dieser Art am besten passt.'],
      ru:['<b>Строфы из четырёх, шести или восьми строк</b> на выбор: перекрёстная рифма ABAB, парная AABB, хвостовая AABCCB, октава ABABABCC; любую схему можно и ввести вручную.','<b>«авто»</b> берёт схему, которая лучше всего подходит к разделам этого типа.']}},
  {id:'reimsuche',w:6,klein:{en:'Rhyme search',de:'Reimsuche',ru:'Поиск рифм'},
   h:{en:'Right-click, and the rhymes are there.',de:'Rechtsklick, und die Reime stehen da.',ru:'Правый клик — и рифмы на месте.'},
   p:{en:'In the workbench: rhymes for the word, level by level, with how often they have been rhymed. Bold ones fit the metre.',
      de:'In der Werkbank: Reime auf das Wort, Stufe für Stufe, mit ihrer Häufigkeit. Fett gedruckt passt ins Versmaß.',
      ru:'В Мастерской: рифмы к слову, степень за степенью, с их частотой. Жирным — то, что подходит по размеру.'},
   d:{en:['<b>Also in the workbench:</b> replacement words with the same stress pattern, opposites and phrases.','<b>How often a pair has been rhymed:</b> counted in about 450,000 German, 790,000 English and 1.1 million Russian rhymes.'],
      de:['<b>Ebenfalls in der Werkbank:</b> Ersatzwörter im gleichen Rhythmus, Gegenteile und Wendungen.','<b>Wie oft ein Paar schon gereimt wurde:</b> gezählt in rund 450 000 deutschen, 790 000 englischen und 1,1 Millionen russischen Reimen.'],
      ru:['<b>Там же, в Мастерской:</b> замены в том же ритме, антонимы и обороты.','<b>Как часто пара уже рифмовалась:</b> подсчитано примерно по 450 000 немецких, 790 000 английских и 1,1 миллиона русских рифм.']}},
  {id:'reimstufen',w:12,klein:{en:'Rhyme levels',de:'Reimstufen',ru:'Степени рифмы'},
   h:{en:'Seven levels, each in its colour.',de:'Sieben Stufen, jede in ihrer Farbe.',ru:'Семь степеней, у каждой свой цвет.'},
   p:{en:'KlangFeder hears from the pronunciation how well two words rhyme. The colour appears as a stripe beside each list of rhymes. The first four examples are rhymed in English verse; the last three never are – they are neighbourhoods, not rhymes:',
      de:'Wie gut zwei Wörter reimen, hört die KlangFeder an ihrer Aussprache. Die Farbe steht als Streifen an jeder Reimliste. Die ersten vier Beispiele sind in deutschen Liedern wirklich gereimt; die letzten drei kommen dort nie vor – das sind Nachbarschaften, keine Reime:',
      ru:'Насколько хорошо рифмуются два слова, KlangFeder слышит по их произношению. Цвет стоит полоской у каждого списка рифм. Первые четыре примера действительно рифмуются в русских стихах и песнях, последние три — никогда: это соседства, а не рифмы:'},
   d:{en:['<b>Impure rhymes</b> by the rules of prosody (again / pain, blood / good) count in the rhyme scheme.','<b>The list of rhymes</b> runs from identical to echo; the mouse wheel decides how far.'],
      de:['<b>Unreine Reime</b> nach der Verslehre (mir / Tür, Zeit / freut) zählen im Reimschema mit.','<b>Die Reimliste</b> läuft von rührend bis Anklang; das Mausrad entscheidet, wie weit.'],
      ru:['<b>Неточные рифмы</b> по правилам стихосложения (глаза / тебя, любовь / слов) засчитываются в схеме рифмовки.','<b>Список рифм</b> идёт от тавтологических до созвучий; колёсико мыши решает, насколько далеко.']}},
  ]},
 {augenbraue:{en:'Under the hood',de:'Unter der Haube',ru:'Под капотом'},
  h:{en:'Rhymes, analysed with the methods of bioinformatics.',de:'Reime, mit Verfahren der Bioinformatik analysiert.',ru:'Рифмы, разобранные методами биоинформатики.'},
  p:{en:'As biology compares protein and DNA sequences, KlangFeder compares chains of sounds: aligned like BLAST, the search tool for genes and proteins, scored with a substitution matrix learned from rhymes.',
     de:'Wie die Biologie Eiweiß- und Erbgutsequenzen vergleicht, vergleicht die KlangFeder Lautketten: ausgerichtet wie mit BLAST, dem Suchwerkzeug für Erbgut und Eiweiße, bewertet mit einer Austauschmatrix, die aus Reimen gelernt ist.',
     ru:'Как биология сравнивает последовательности белков и ДНК, так KlangFeder сравнивает цепочки звуков: выравнивает их, как BLAST — инструмент поиска для генов и белков, — и оценивает по матрице замен, выученной на рифмах.'},
  kacheln:[
  {id:'blast',w:6,klein:{en:'How it finds rhymes',de:'Wie sie Reime findet',ru:'Как находятся рифмы'},
   h:{en:'Rhymes aligned like genes.',de:'Reime aligniert wie Gene.',ru:'Рифмы, выровненные как гены.'},
   p:{en:'Every word becomes a chain of sounds and is aligned from its end, sound against sound. Three real alignments from KlangFeder: the same sounds give full points, similar ones fewer, and what comes before the rhyme does not count.',
      de:'Jedes Wort wird zur Kette von Lauten und vom Ende her ausgerichtet, Laut gegen Laut. Drei echte Beispiele aus der KlangFeder: Gleiche Laute bringen volle Punkte, ähnliche weniger; was vor dem Reim steht, zählt nicht.',
      ru:'Каждое слово становится цепочкой звуков и выравнивается от конца, звук против звука. Три настоящих выравнивания из KlangFeder: одинаковые звуки дают полные баллы, похожие — меньше, а то, что стоит до рифмы, не считается.'},
   d:{en:['<b>Anchored at the end, open to the left</b> (as in BLAST): the alignment keeps growing for as long as it keeps scoring.','<b>A table of sound pairs</b> (a substitution matrix, as BLOSUM is for proteins): sound pairs that meet at a rhyme more often than chance would predict earn points.','<b>Syllables have weight:</b> a missing unstressed syllable costs little, a stressed one a lot – which is why light does not rhyme with lighthouse.'],
      de:['<b>Am Ende verankert, nach links offen</b> (wie bei BLAST): Die Ausrichtung wächst, solange die Punkte tragen.','<b>Eine Tafel der Lautpaare</b> (Austauschmatrix, wie BLOSUM bei Eiweißen): Punkte gibt es für Lautpaare, die an der Reimstelle häufiger zusammenstehen, als der Zufall erwarten lässt.','<b>Silben haben Gewicht:</b> Eine fehlende unbetonte Silbe kostet wenig, eine betonte viel – darum reimt Heim nicht auf Heimat.'],
      ru:['<b>Якорь в конце, открыто влево</b> (как в BLAST): выравнивание растёт, пока набираются баллы.','<b>Таблица пар звуков</b> (матрица замен, как BLOSUM для белков): баллы получают пары звуков, которые встречаются на месте рифмы чаще, чем предсказывает случай.','<b>У слогов есть вес:</b> недостающий безударный слог стоит мало, ударный — много. Поэтому свет не рифмуется со светофор.']}},
  {id:'lautmatrix',w:6,klein:{en:'Sound matrix',de:'Lautmatrix',ru:'Матрица звуков'},
   h:{en:'Which vowels rhyme.',de:'Welche Vokale sich reimen.',ru:'Какие гласные рифмуются.'},
   p:{en:'Learned from real rhymes – 61,000 German poems for the German table, 22,500 Russian ones for the Russian: how much more often two vowels meet at a rhyme than chance would predict. Warm: more often, blue: less often, empty: never seen together.',
      de:'Aus echten Reimen gelernt – 61 000 deutsche Gedichte für die deutsche Tafel, 22 500 russische für die russische: wie viel öfter zwei Vokale an der Reimstelle zusammenstehen, als der Zufall erwarten lässt. Warm: öfter, blau: seltener, leer: nie zusammen gesehen.',
      ru:'Выучено на настоящих рифмах — для русской таблицы по 22 500 русских стихотворений, для немецкой по 61 000 немецких: насколько чаще два гласных встречаются на месте рифмы, чем предсказывает случай. Тёплые цвета — чаще, синий — реже, пусто — ни разу не встречались вместе.'},
   d:{en:['<b>For example, in German:</b> long and short i (Miete / Mitte) almost never rhyme, long i and long ü (Liebe / trübe) often. Shown here is the German table; Russian has its own.','<b>The measure</b> is pointwise mutual information (PMI) per pair of sounds, scaled so that every sound gives 1 with itself.','<b>Consonants</b> have the same kind of table; it decides how heavily a different final consonant counts against a rhyme.'],
      de:['<b>Ein Beispiel aus dem Deutschen:</b> Langes und kurzes i (Miete / Mitte) reimen fast nie, langes i und langes ü (Liebe / trübe) oft. Gezeigt ist die deutsche Tafel; für Russisch gibt es eine eigene.','<b>Gemessen</b> als punktweise Transinformation (PMI) je Lautpaar, so skaliert, dass jeder Laut mit sich selbst 1 ergibt.','<b>Für Konsonanten</b> gibt es dieselbe Art Tafel; sie bestimmt, was ein anderer Endkonsonant kostet.'],
      ru:['<b>Например:</b> ударные и и ы рифмуются (жить / любить), е и э — тоже; а безударные а/о и и в рифме почти не встречаются вместе.','<b>Мера</b> — поточечная взаимная информация (PMI) для каждой пары звуков, нормированная так, что каждый звук с самим собой даёт 1.','<b>Для согласных</b> есть такая же таблица; она решает, во что обходится рифме другой конечный согласный.']}},
  /* Ansehen (Jörg, 12.11.2026: „flächentreue Wort-Cloud, Dotplot der Wiederholungen, Circos-Plot der Wiederholungen;
     mehr würde ich nicht zeigen … als funktionierendes Addon drin, aber noch nicht die Megawerbung“; zuerst als Laschen,
     dann „nebeneinander, die Beschriftung oben drüber“). Bilder: „Die Gedanken sind frei“ (Volkslied, Fassung 1842),
     werkzeug/aufnahme/ansehen.mjs. */
  {id:'ansehen',w:12,klein:{en:'Look',de:'Ansehen',ru:'Смотреть'},
   h:{en:'The song as a picture.',de:'Das Lied als Bild.',ru:'Песня как картина.'},
   p:{en:'A tab of its own shows the text as a word cloud, as a dot plot and as a circle of its repetitions.',
      de:'Eine eigene Lasche zeigt den Text als Wortwolke, als Dotplot und als Kreis seiner Wiederholungen.',
      ru:'Отдельная вкладка показывает текст как облако слов, как точечную матрицу и как круг его повторов.'},
   d:{en:['<b>Word cloud:</b> the area of each word matches its weight; the words move as close together as they can.','<b>Dot plot:</b> the text against itself, syllable by syllable in phonetic script – repetitions become diagonals, as when two DNA sequences are compared.','<b>Circle:</b> the song runs clockwise around the circle; bands join passages that sound alike – like a Circos plot in genome research.','<b>In the picture:</b> “Die Gedanken sind frei”, German folk song (1842 version).'],
      de:['<b>Wortwolke:</b> Die Fläche jedes Wortes entspricht seinem Gewicht; die Wörter rücken so dicht zusammen, wie es geht.','<b>Dotplot:</b> der Text gegen sich selbst, Silbe für Silbe in Lautschrift – Wiederholungen werden zu Diagonalen, wie beim Vergleich zweier Erbgut-Sequenzen.','<b>Kreis:</b> Das Lied läuft im Uhrzeigersinn um den Kreis; Bänder verbinden Stellen, die gleich klingen – wie ein Circos-Plot in der Genomforschung.','<b>Im Bild:</b> „Die Gedanken sind frei“, Volkslied (Fassung von 1842).'],
      ru:['<b>Облако слов:</b> площадь каждого слова соответствует его весу; слова сдвигаются так плотно, как только можно.','<b>Точечная матрица:</b> текст против самого себя, слог за слогом в транскрипции; повторы становятся диагоналями, как при сравнении двух последовательностей ДНК.','<b>Круг:</b> песня идёт по кругу по часовой стрелке; ленты соединяют места, которые звучат одинаково, — как диаграмма Circos в геномике.','<b>На картинке:</b> «Калинка» (Иван Ларионов, 1860) — припев повторяется четыре раза, поэтому видны повторы.']}},
  ]},
 {augenbraue:{en:'Find',de:'Finden',ru:'Найти'},
  h:{en:'The right word, in the right metre.',de:'Das passende Wort, im passenden Maß.',ru:'Нужное слово — в нужном размере.'},
  p:{en:'Synonyms, opposites and phrases – each with a sign of how well it fits your line. And gaps that KlangFeder fills.',
     de:'Synonyme, Gegenteile und Wendungen – jedes mit einem Zeichen, wie gut es in deinen Vers passt. Und Lücken, die die KlangFeder füllt.',
     ru:'Синонимы, антонимы и обороты — у каждого знак, насколько он подходит к вашей строке. И пропуски, которые KlangFeder заполняет.'},
  kacheln:[
  {id:'ersatz',w:7,klein:{en:'Replacements',de:'Ersatzwörter',ru:'Замены'},
   h:{en:'Same meaning,<br>same stress.',de:'Gleich gemeint,<br>gleich betont.',ru:'Тот же смысл,<br>то же ударение.'},
   p:{en:'Synonyms with the same syllable pattern come first. A small battery shows for every suggestion how well it fits exactly this place in the line; at the top, the line with its beats and the selection marked.',
      de:'Synonyme mit demselben Silbenmuster stehen vorn. Eine kleine Batterie zeigt bei jedem Vorschlag, wie gut er an genau diese Stelle der Zeile passt; oben steht die Zeile mit ihren Hebungen, die Auswahl markiert.',
      ru:'Синонимы с тем же слоговым рисунком стоят первыми. Маленькая батарейка у каждого предложения показывает, насколько оно подходит именно к этому месту строки; вверху — строка с её ударными слогами и отмеченным выделением.'},
   d:{en:['<b>Full battery:</b> exactly the stress pattern of this spot; three quarters: one syllable more or fewer; half: it stumbles; a quarter: a stressed syllable in an unstressed position; empty: the line gets a different number of beats.','<b>English suggestions</b> come from the Open English WordNet; German ones from OpenThesaurus and Wiktionary, Russian ones from the Russian Wiktionary.','<b>“rhymes”</b> marks synonyms that also rhyme with the partner line.','<b>Matching the part of speech</b> (German): if a word can be a verb or an adjective – weiß in “ich weiß” (I know) or “ist weiß” (is white) – KlangFeder guesses from the context; one click switches.'],
      de:['<b>Volle Batterie:</b> genau die Hebungen dieser Stelle; drei Viertel: eine Silbe mehr oder weniger; halb: es holpert; ein Viertel: eine betonte Silbe an unbetonter Stelle; leer: die Zeile bekommt eine andere Zahl Hebungen.','<b>Deutsch</b> aus OpenThesaurus und dem Wiktionary, <b>Englisch</b> aus dem Open English WordNet, <b>Russisch</b> aus dem russischen Wiktionary.','<b>„reimt“</b> markiert Synonyme, die zugleich auf die Partnerzeile reimen.','<b>Passend zur Wortart</b> (Deutsch): Kann ein Wort Verb oder Adjektiv sein (ich weiß / ist weiß), rät die KlangFeder aus dem Zusammenhang; ein Klick schaltet um.'],
      ru:['<b>Полная батарейка:</b> ровно ударные слоги этого места; три четверти: слогом больше или меньше; половина: спотыкается; четверть: ударный слог на безударном месте; пусто: в строке станет другое число ударных.','<b>Русские предложения</b> — из русского Wiktionary, английские — из Open English WordNet, немецкие — из OpenThesaurus и Wiktionary.','<b>«рифмуется»</b> отмечает синонимы, которые к тому же рифмуются с парной строкой.','<b>С учётом части речи</b> (немецкий): если слово может быть глаголом или прилагательным — weiß в «ich weiß» (я знаю) или в «ist weiß» (белый), — KlangFeder угадывает по контексту; один клик переключает.']}},
  {id:'luecke',w:5,klein:{en:'Gaps',de:'Lücken',ru:'Пропуски'},
   h:{en:'Three strokes, and the words fit.',de:'Drei Striche, und die Wörter passen.',ru:'Три черты — и слова встают на место.'},
   p:{en:'Write ___ or a pattern like x-X-x-X where a word is missing. A right-click shows words in exactly that metre – at the end of a line, rhyming too.',
      de:'Schreib ___ oder ein Muster wie x-X-x-X, wo dir das Wort fehlt. Ein Rechtsklick zeigt Wörter in genau diesem Maß – am Zeilenende auch gleich reimend.',
      ru:'Напишите ___ или шаблон вроде x-X-x-X там, где не хватает слова. Правый клик покажет слова ровно этого размера — в конце строки сразу с рифмой.'},
   d:{en:['<b>The metre</b> comes from the partner line, the rhyme from the rhyme scheme.','<b>Placeholders</b> such as x-X-x-X: lower case unstressed, capitals stressed; a rhyme sound may end it, as in x-x-IGHT (night, light).','<b>One click</b> puts the suggestion in place of the gap.'],
      de:['<b>Das Maß</b> kommt aus der Partnerzeile (der Zeile, auf die deine reimen soll), der Reim aus dem Reimschema.','<b>Platzhalter</b> wie x-X-x-X: klein unbetont, groß betont; am Ende darf ein Reimklang stehen (x-x-ICHT).','<b>Ein Klick</b> setzt den Vorschlag an die Stelle der Lücke.'],
      ru:['<b>Размер</b> берётся из парной строки (той, с которой ваша должна рифмоваться), рифма — из схемы рифмовки.','<b>Заполнители</b> вроде x-X-x-X: строчная — безударный слог, прописная — ударный; в конце может стоять созвучие рифмы (например x-x-ОЧЬ — ночь, помочь).','<b>Один клик</b> ставит предложение на место пропуска.']}},
  ]},
 {augenbraue:{en:'Structure',de:'Aufbau',ru:'Структура'},
  h:{en:'First the form, then the words.',de:'Erst die Form, dann die Worte.',ru:'Сначала форма, потом слова.'},
  p:{en:'A frame for a song or a poem, written into the sheet as placeholders. You write over it, and the plan stays visible.',
     de:'Ein Gerüst für ein Lied oder ein Gedicht, als Platzhalter ins Arbeitsblatt geschrieben. Du schreibst darüber, und der Plan bleibt sichtbar.',
     ru:'Каркас песни или стихотворения, записанный на рабочий лист заполнителями. Вы пишете поверх, а план остаётся на виду.'},
  kacheln:[
  {id:'geruest',w:6,klein:{en:'Frames',de:'Gerüste',ru:'Каркасы'},
   h:{en:'Song or poem.',de:'Lied oder Gedicht.',ru:'Песня или стихотворение.'},
   p:{en:'One switch chooses between song forms and classical poem forms. Every form comes into the sheet with its lines, beats and rhyme scheme.',
      de:'Ein Umschalter wählt zwischen Liedformen und klassischen Gedichtformen. Jede Form kommt mit Zeilen, Hebungen und Reimschema ins Blatt.',
      ru:'Один переключатель выбирает между формами песен и классическими формами стихов. Каждая форма приходит на лист со строками, ударными слогами и схемой рифмовки.'},
   d:{en:['<b>Songs:</b> pop with pre-chorus, verse–chorus–bridge, AABA, ballad, blues, rap and more – or the structure of your models.','<b>Poems:</b> sonnet, Shakespearean sonnet, rhyme royal, ballad stanza, heroic couplets, limerick, terza rima, ghazal, ode stanzas, haiku.','<b>In the structure panel</b> every section can be changed: lines, beats, rhyme, line ending.'],
      de:['<b>Lieder:</b> Pop mit Pre-Chorus, Strophe–Refrain–Bridge, AABA, Ballade, Blues, Rap und mehr – oder der Aufbau deiner Vorlagen.','<b>Gedichte:</b> Sonett, Stanze, Terzinen, Volksliedstrophe, Schweifreimstrophe, Ghasel, Odenstrophen, Haiku, Elfchen.','<b>Im Aufbau</b> lässt sich jeder Abschnitt ändern: Zeilen, Hebungen, Reim, Kadenz.'],
      ru:['<b>Песни:</b> поп с предприпевом, куплет–припев–бридж, AABA, баллада, блюз, рэп и другие — или структура ваших образцов.','<b>Стихи:</b> онегинская строфа, одическая строфа, частушка, сонет, октава, терцины, триолет, газель, античные строфы, хайку.','<b>В структуре</b> можно изменить любой раздел: строки, ударные слоги, рифму, клаузулу.']}},
  {id:'soll',w:6,klein:{en:'Plan and result',de:'Soll und Ist',ru:'План и результат'},
   h:{en:'The plan stays.',de:'Der Plan bleibt stehen.',ru:'План остаётся.'},
   p:{en:'Next to every line an outline shows what the frame asks for. Anything missing stays hollow; anything extra lights up.',
      de:'Neben jeder Zeile zeigt ein Umriss, was das Gerüst verlangt. Was fehlt, bleibt hohl; was zu viel ist, leuchtet.',
      ru:'Рядом с каждой строкой контур показывает, чего требует каркас. Чего не хватает — остаётся пустым; что лишнее — светится.'},
   d:{en:['<b>Poems</b> syllable by syllable, <b>songs</b> only by their beats.','<b>The rhyme letter</b> stays in italics until the line really rhymes.'],
      de:['<b>Gedichte</b> Silbe für Silbe, <b>Lieder</b> nur nach ihren Hebungen.','<b>Der Reimbuchstabe</b> steht kursiv, bis die Zeile wirklich reimt.'],
      ru:['<b>Стихи</b> — слог за слогом, <b>песни</b> — только по ударным слогам.','<b>Буква рифмы</b> стоит курсивом, пока строка действительно не зарифмуется.']}},
  ]},
 {augenbraue:{en:'For Suno',de:'Für Suno',ru:'Для Suno'},
  h:{en:'Ready to paste.',de:'Fertig zum Einfügen.',ru:'Готово к вставке.'},
  p:{en:'If you write for Suno, the service that turns lyrics and a style into a song, KlangFeder lays out text and style the way Suno wants them – counted and ready to copy.',
     de:'Schreibst du für Suno, den Dienst, der aus Text und Stil ein Lied macht, legt die KlangFeder Text und Stil so bereit, wie Suno sie will – gezählt und zum Kopieren.',
     ru:'Если вы пишете для Suno — сервиса, который из текста и стиля делает песню, — KlangFeder готовит текст и стиль так, как их ждёт Suno: подсчитанными и готовыми к копированию.'},
  kacheln:[
  {id:'zaehlen',w:6,klein:{en:'Character count',de:'Zeichen zählen',ru:'Подсчёт знаков'},
   h:{en:'You see whether it fits.',de:'Du siehst, ob es passt.',ru:'Вы видите, помещается ли текст.'},
   p:{en:'Lyrics and styles counted separately against Suno’s limits of 5,000 and 1,000 characters. One button copies each field.',
      de:'Die Felder „Lyrics“ und „Styles“ getrennt gezählt, gegen Sunos Grenzen von 5000 und 1000 Zeichen. Ein Knopf kopiert jedes Feld.',
      ru:'Поля «Lyrics» и «Styles» считаются отдельно — против пределов Suno в 5000 и 1000 знаков. Одна кнопка копирует каждое поле.'},
   d:{en:['<b>The style prompt</b> is saved with every version of your text.','<b>Together with KlangTresor</b>, KlangFeder also estimates the length of the song and how densely Suno will sing it.'],
      de:['<b>Der Stil-Prompt</b> (die Stilbeschreibung für Suno) wird mit jeder Fassung deines Textes gespeichert.'],
      ru:['<b>Стиль-промпт</b> (описание стиля для Suno) сохраняется с каждой версией вашего текста.']}},
  {id:'regie',w:6,klein:{en:'Directions',de:'Regie',ru:'Указания'},
   h:{en:'[Brackets] are for Suno.',de:'[Klammern] sind für Suno.',ru:'[Скобки] — для Suno.'},
   p:{en:'What stands in square brackets is direction: sections, mood, instruments. KlangFeder reads it as structure and leaves it out of the metre.',
      de:'Was in eckigen Klammern steht, ist Regie: Abschnitte, Stimmung, Instrumente. Die KlangFeder liest es als Gliederung und misst es nicht mit.',
      ru:'То, что стоит в квадратных скобках, — указания: разделы, настроение, инструменты. KlangFeder читает их как членение текста и не включает в размер.'},
   d:{en:['<b>Sections</b> such as [Verse], [Chorus], [Bridge] structure the text; rhyme scheme and metre apply per section.','<b># at the start of a line</b> is a note for you and does not go to Suno.','<b>Lines before the first bracket</b> count as a preamble (hints, thanks) and are not measured.'],
      de:['<b>Abschnitte</b> wie [Verse], [Chorus], [Bridge] gliedern den Text; Reimschema und Versmaß gelten je Abschnitt.','<b># am Zeilenanfang</b> ist eine Notiz für dich und geht nicht an Suno.','<b>Zeilen vor der ersten Klammer</b> gelten als Vorspann (Hinweise, Dank) und werden nicht mitgemessen.'],
      ru:['<b>Разделы</b> вроде [Verse], [Chorus], [Bridge] членят текст; схема рифмовки и размер действуют для каждого раздела.','<b># в начале строки</b> — заметка для вас, в Suno она не уходит.','<b>Строки до первой скобки</b> считаются вступлением (пояснения, благодарности) и не измеряются.']}},
  ]},
 {augenbraue:{en:'If you like',de:'Wahlweise',ru:'По желанию'},
  h:{en:'Good on its own.<br>More together.',de:'Allein gut.<br>Zusammen mehr.',ru:'Хорошо и в одиночку.<br>Вместе — ещё больше.'},
  p:{en:'KlangFeder works entirely on its own. Switched on, an AI writes with you, and KlangTresor brings your Suno archive as a yardstick.',
     de:'Die KlangFeder arbeitet ganz für sich. Eingeschaltet schreibt eine KI mit, und der KlangTresor bringt dein Suno-Archiv als Maßstab.',
     ru:'KlangFeder работает полностью самостоятельно. Если включить, вместе с вами пишет ИИ, а KlangTresor приносит ваш архив Suno как мерило.'},
  kacheln:[
  {id:'ki',w:5,klein:{en:'With AI',de:'Mit KI',ru:'С ИИ'},
   h:{en:'Claude or ChatGPT write with you.',de:'Claude oder ChatGPT schreiben mit.',ru:'Claude или ChatGPT пишут вместе с вами.'},
   p:{en:'Propose storylines, draft a text in the style of your models, rework lines – all through your own Anthropic or OpenAI account.',
      de:'Handlungen vorschlagen, einen Text im Stil deiner Vorlagen erstellen, Zeilen überarbeiten – über dein eigenes Konto bei Anthropic oder OpenAI.',
      ru:'Предложить сюжеты, написать текст в стиле ваших образцов, переработать строки — через вашу собственную учётную запись в Anthropic или OpenAI.'},
   d:{en:['<b>Your own account:</b> KlangFeder uses Claude Code or Codex on your computer; the System page helps you sign in.','<b>The AI treats</b> your rhyme, beat and structure settings as rules.','<b>Switched off</b>, everything to do with AI is hidden, not greyed out.'],
      de:['<b>Dein eigenes Konto:</b> Die KlangFeder nutzt Claude Code bzw. Codex auf deinem Rechner; die Seite „System“ hilft beim Anmelden.','<b>Reim, Hebungen und Aufbau</b> bekommt die KI als Vorgabe mit.','<b>Ist die KI ausgeschaltet,</b> ist alles dazu ausgeblendet, nicht ausgegraut.'],
      ru:['<b>Ваша учётная запись:</b> KlangFeder использует Claude Code или Codex на вашем компьютере; страница «Система» помогает войти.','<b>Рифму, ударные слоги и структуру</b> ИИ получает как заданные правила.','<b>Если ИИ выключен,</b> всё, что к нему относится, скрыто, а не затемнено.']}},
  {id:'laenge',w:7,klein:{en:'With KlangTresor',de:'Mit dem KlangTresor',ru:'С KlangTresor'},
   h:{en:'Your archive as the yardstick.',de:'Dein Archiv als Maßstab.',ru:'Ваш архив как мерило.'},
   p:{en:'If KlangTresor is running, KlangFeder knows your songs: it estimates how long Suno will take to sing a text, and how densely, judged against your archive.',
      de:'Läuft der KlangTresor, kennt die KlangFeder deine Lieder: Sie schätzt, wie lang Suno einen Text singt und wie dicht, gemessen an deinem Archiv.',
      ru:'Если запущен KlangTresor, KlangFeder знает ваши песни: оценивает, как долго Suno будет петь текст и насколько плотно, — в сравнении с вашим архивом.'},
   d:{en:['<b>Models:</b> songs from KlangTresor, ticked as models, show their style – metre, rhyme, structure – and serve the AI as examples.','<b>The length</b> is rough (±12% on average); density says more.','<b>KlangTresor</b> is a separate free program for your Suno archive: <a href="https://github.com/CasparDavi/klangtresor">github.com/CasparDavi/klangtresor</a>.'],
      de:['<b>Vorlagen:</b> Lieder aus dem KlangTresor, als Vorlagen angekreuzt, zeigen ihren Stil – Versmaß, Reim, Aufbau – und dienen der KI als Vorbild.','<b>Die Länge</b> ist grob (im Mittel ±12 %); die Dichte sagt mehr.','<b>Der KlangTresor</b> ist ein eigenes, freies Programm für dein Suno-Archiv: <a href="https://github.com/CasparDavi/klangtresor">github.com/CasparDavi/klangtresor</a>.'],
      ru:['<b>Образцы:</b> песни из KlangTresor, отмеченные как образцы, показывают свой стиль — размер, рифму, структуру — и служат ИИ примером.','<b>Длительность</b> приблизительна (в среднем ±12 %); плотность говорит больше.','<b>KlangTresor</b> — отдельная свободная программа для вашего архива Suno: <a href="https://github.com/CasparDavi/klangtresor">github.com/CasparDavi/klangtresor</a>.']}},
  ]},
 {augenbraue:{en:'Sources',de:'Quellen',ru:'Источники'},
  h:{en:'Old dictionaries and free corpora, read anew.',de:'Alte Wörterbücher und freie Korpora, neu gelesen.',ru:'Старые словари и свободные корпуса, прочитанные заново.'},
  p:{en:'KlangFeder learns pronunciation, rhymes and phrases from openly licensed dictionaries and text collections (corpora). Where those do not know a word – or miss its secondary stress – two public-domain pronunciation dictionaries step in, evaluated for it.',
     de:'Aussprache, Reime und Wendungen lernt die KlangFeder aus freien Wörterbüchern und freien Textsammlungen (Korpora). Wo diese ein Wort nicht kennen – oder ihm der Nebenton fehlt –, helfen zwei gemeinfreie Aussprachewörterbücher, eigens dafür ausgewertet.',
     ru:'Произношение, рифмы и обороты KlangFeder берёт из свободных словарей и свободных собраний текстов (корпусов). Где они не знают слова — или не отмечают его побочное ударение, — помогают два словаря произношения в общественном достоянии, обработанные специально для этого.'},
  kacheln:[
  {id:'buecher',w:7,klein:{en:'Muret-Sanders 1900 · Viëtor 1921',de:'Muret-Sanders 1900 · Viëtor 1921',ru:'Muret-Sanders 1900 · Viëtor 1921'},
   h:{en:'Stress as it was printed.',de:'Betonung, wie sie gedruckt steht.',ru:'Ударение, как оно напечатано.'},
   p:{en:'Muret-Sanders marks each syllable with a curve or a dash to show main and secondary stress; Viëtor spells every word in phonetic script. That is where the stress KlangFeder works with comes from.',
      de:'Muret-Sanders setzt über jede Silbe Bogen oder Strich, mit Haupt- und Nebenton; Viëtor schreibt jedes Wort in Lautschrift. Daraus wird die Betonung, mit der die KlangFeder rechnet.',
      ru:'Muret-Sanders ставит над каждым слогом дугу или черту — для главного и побочного ударения; Viëtor записывает каждое слово транскрипцией. Отсюда и берётся ударение, с которым работает KlangFeder.'},
   d:{en:['<b>What for:</b> rare and old words, compounds and names get their stress from a dictionary instead of a rule – <b>Un</b>wert, <b>Ur</b>kraft, pia<b>nis</b>simo.','<b>English too:</b> the English–German part adds over 100,000 words the American dictionary (CMUdict) does not know – with their stress and rhyme sound.','<b>Viëtor’s data</b> is published openly: <a href="https://github.com/CasparDavi/vietor-1921">github.com/CasparDavi/vietor-1921</a>.','<b>Both works</b> are in the public domain; the scans come from the Internet Archive.','<b>Optionally as around 1900:</b> KlangFeder stresses as on the stage of the time – German unge<b>sagt</b> instead of <b>un</b>gesagt, English <b>ac</b>cessory instead of ac<b>ces</b>sory.'],
      de:['<b>Wozu:</b> Seltene und alte Wörter, Zusammensetzungen und Namen bekommen ihre Betonung aus einem Wörterbuch statt aus einer Regel – <b>Un</b>wert, <b>Ur</b>kraft, pia<b>nis</b>simo.','<b>Auch Englisch:</b> Der Teil Englisch–Deutsch ergänzt über 100 000 Wörter, die das amerikanische Wörterbuch (CMUdict) nicht kennt – mit Betonung und Reimklang.','<b>Die Viëtor-Daten</b> sind frei veröffentlicht: <a href="https://github.com/CasparDavi/vietor-1921">github.com/CasparDavi/vietor-1921</a>.','<b>Beide Werke</b> sind gemeinfrei; die Scans stammen aus dem Internet Archive.','<b>Wahlweise wie um 1900:</b> Die KlangFeder betont wie auf der Bühne jener Zeit – deutsch unge<b>sagt</b> statt <b>un</b>gesagt, englisch <b>ac</b>cessory statt ac<b>ces</b>sory.'],
      ru:['<b>Зачем:</b> редкие и старые слова, сложные слова и имена получают ударение из словаря, а не по правилу — <b>Un</b>wert, <b>Ur</b>kraft, pia<b>nis</b>simo.','<b>И английский:</b> англо-немецкая часть добавляет больше 100 000 слов, которых не знает американский словарь (CMUdict), — с ударением и созвучием рифмы.','<b>Данные Viëtor</b> опубликованы в открытом доступе: <a href="https://github.com/CasparDavi/vietor-1921">github.com/CasparDavi/vietor-1921</a>.','<b>Оба труда</b> находятся в общественном достоянии; сканы взяты из Internet Archive.','<b>По желанию — как около 1900 года:</b> KlangFeder ставит ударение, как на сцене того времени: по-немецки unge<b>sagt</b> вместо <b>un</b>gesagt, по-английски <b>ac</b>cessory вместо ac<b>ces</b>sory.']}},
  {id:'umfang',w:5,klein:{en:'Size',de:'Umfang',ru:'Объём'},
   h:{en:'Words with their stress.',de:'Wörter mit ihrer Betonung.',ru:'Слова с ударением.'},
   p:{en:'KlangFeder looks words up in this order. Each bar shows a dictionary’s words; filled: how many of them the earlier ones did not know.',
      de:'In dieser Reihenfolge schlägt die KlangFeder nach. Jeder Balken zeigt die Wörter eines Wörterbuchs, gefüllt: wie viele davon die vorigen noch nicht kannten.',
      ru:'В таком порядке KlangFeder ищет слова. Каждая полоса показывает слова одного словаря; закрашено — сколько из них не знали предыдущие.'},
   d:{en:['<b>Muret-Sanders</b>, Encyclopaedic Dictionary, German–English part, Langenscheidt 1900: two volumes, about 2,500 pages.','<b>Muret-Sanders</b>, English–German part, Langenscheidt: two volumes, about 2,550 pages.','<b>Viëtor</b>, Deutsches Aussprachewörterbuch, 3rd edition 1921: about 500 pages.'],
      de:['<b>Muret-Sanders</b>, Enzyklopädisches Wörterbuch, Teil Deutsch–Englisch, Langenscheidt 1900: zwei Bände, rund 2 500 Seiten.','<b>Muret-Sanders</b>, Teil Englisch–Deutsch, Langenscheidt: zwei Bände, rund 2 550 Seiten.','<b>Viëtor</b>, Deutsches Aussprachewörterbuch, 3. Auflage 1921: rund 500 Seiten.'],
      ru:['<b>Muret-Sanders</b>, «Энциклопедический словарь», немецко-английская часть, Langenscheidt 1900: два тома, около 2500 страниц.','<b>Muret-Sanders</b>, англо-немецкая часть, Langenscheidt: два тома, около 2550 страниц.','<b>Viëtor</b>, Deutsches Aussprachewörterbuch, 3-е издание, 1921: около 500 страниц.']}},
  {id:'korpora',w:12,klein:{en:'Free sources',de:'Freie Quellen',ru:'Свободные источники'},
   h:{en:'What KlangFeder learns from.',de:'Woraus die KlangFeder lernt.',ru:'На чём учится KlangFeder.'},
   p:{en:'Each source shows its licence; the full licence texts and attributions are in the data package (QUELLEN.md).',
      de:'Je Quelle steht ihre Lizenz dabei; die vollständigen Lizenztexte und Namensnennungen stehen im Datenpaket (QUELLEN.md).',
      ru:'У каждого источника указана лицензия; полные тексты лицензий и указания авторства — в пакете данных (QUELLEN.md).'},
   d:{en:['<b>Derived data</b> – pronunciations, rhyme pairs, phrases – keeps the licence of its source.','<b>Sources whose licence is incompatible with the package</b> are left out; you can fetch them yourself.'],
      de:['<b>Abgeleitete Daten</b> – Lautschrift, Reimpaare, Wendungen – behalten die Lizenz ihrer Quelle.','<b>Quellen, deren Lizenz nicht zum Paket passt,</b> sind nicht darin; wenn du sie willst, holst du sie selbst.'],
      ru:['<b>Производные данные</b> — транскрипция, пары рифм, обороты — сохраняют лицензию своего источника.','<b>Источников, чья лицензия не подходит к пакету,</b> в нём нет; если они вам нужны, вы загружаете их сами.']}},
  ]},
 {augenbraue:{en:'Yours',de:'Bei dir',ru:'У вас'},
  h:{en:'Your verse lives on your computer.',de:'Deine Verse liegen bei dir.',ru:'Ваши стихи остаются у вас.'},
  p:{en:'KlangFeder runs on your computer, without an account and without a cloud.',
     de:'Die KlangFeder läuft auf deinem Rechner, ohne Konto und ohne Cloud.',
     ru:'KlangFeder работает на вашем компьютере, без учётной записи и без облака.'},
  kacheln:[
  {id:'vergleich',w:12,klein:{en:'Versions',de:'Fassungen',ru:'Версии'},
   h:{en:'Every version stays.',de:'Jede Fassung bleibt.',ru:'Каждая версия остаётся.'},
   p:{en:'“Save” keeps a version with date and time. “old | new” puts it next to your text and shows what changed – in the metre too.',
      de:'„Speichern“ hebt eine Fassung mit Datum und Uhrzeit auf. „alt | neu“ legt ihn neben den Text und zeigt, was sich geändert hat – auch im Maß.',
      ru:'«Сохранить» сохраняет версию с датой и временем. «старая | новая» кладёт её рядом с текстом и показывает, что изменилось, — в том числе в размере.'},
   d:{en:['<b>In numbers:</b> lines with the same stress pattern, end rhymes, stressed line endings, characters – before and after.','<b>What was cut</b> is marked on the left; you keep writing on the right.','<b>For songs from KlangTresor</b>, the original stands on the left.'],
      de:['<b>In Zahlen:</b> Zeilen mit gleichen Hebungen, Endreime, betonte Zeilenenden, Zeichen – vorher und nachher.','<b>Gestrichenes</b> ist links markiert; rechts wird weitergeschrieben.','<b>Bei Liedern aus dem KlangTresor</b> steht links das Original.'],
      ru:['<b>В цифрах:</b> строки с одинаковым числом ударных, конечные рифмы, ударные концы строк, знаки — до и после.','<b>Вычеркнутое</b> отмечено слева; справа вы пишете дальше.','<b>У песен из KlangTresor</b> слева стоит оригинал.']}},
  ]},
 ],
 grenzen:{
  h:{en:'Good to know',de:'Gut zu wissen',ru:'Полезно знать'},
  l:{en:['KlangFeder suggests; it does not decide. Stress, metre and rhymes are calculated automatically and can be wrong; the judgement stays with you.','Your texts stay on your computer. Only if you let an AI write or revise do your text and request go to Claude or ChatGPT, via your own account there.'],
     de:['Die KlangFeder schlägt vor, sie entscheidet nicht. Betonung, Versmaß und Reime sind berechnet und können danebenliegen; das Urteil bleibt bei dir.','Deine Texte bleiben auf deinem Rechner. Nur wenn du eine KI schreiben oder überarbeiten lässt, gehen Text und Wunsch an Claude oder ChatGPT, über dein eigenes Konto dort.'],
     ru:['KlangFeder предлагает, но не решает. Ударение, размер и рифмы рассчитаны и могут ошибаться; оценка остаётся за вами.','Ваши тексты остаются на вашем компьютере. Только если вы поручаете ИИ написать или переработать текст, текст и ваша просьба уходят в Claude или ChatGPT — через вашу собственную учётную запись там.']}
 },
 fuss:{en:'KlangFeder is free of charge, by Caspar_D; program under the MIT licence, data under the licences of their sources · github.com/CasparDavi/klangfeder',
       de:'Die KlangFeder ist kostenlos, von Caspar_D; Programm unter MIT-Lizenz, Daten unter den Lizenzen ihrer Quellen · github.com/CasparDavi/klangfeder',
       ru:'KlangFeder — бесплатная программа от Caspar_D; код под лицензией MIT, данные — под лицензиями их источников · github.com/CasparDavi/klangfeder'},
 stern:{en:'',de:'',ru:''}
};

/* HERUNTERLADEN – wie im KlangTresor: oben die Knöpfe im Kopf, unten der Abschnitt mit den Anforderungen.
   Die Dateien liegen fest unter releases/latest/download/; mb = Größe der Release-Datei in MiB (Release 0.9.3). */
S.laden = {
 augenbraue:{en:'Download',de:'Herunterladen',ru:'Скачать'},
 h:{en:'For your computer.',de:'Für deinen Rechner.',ru:'Для вашего компьютера.'},
 p:{en:'One file, double-click, done. KlangFeder fetches its own dictionaries, with a progress bar.',de:'Eine Datei, Doppelklick, fertig. Die Wörterbücher lädt die KlangFeder selbst nach, mit Fortschrittsbalken.',ru:'Один файл, двойной клик — готово. Словари загружаются потом автоматически, с индикатором прогресса.'},
 knopf:{en:'Download',de:'Herunterladen',ru:'Скачать'},
 systeme:[
  {name:'Windows',typ:'Setup.exe',zeile:{en:'Windows 10 / 11 · 64-bit',de:'Windows 10 / 11 · 64 Bit',ru:'Windows 10 / 11 · 64 бит'},datei:'KlangFeder-Setup.exe',mb:24},
  {name:'macOS',typ:'DMG',zeile:{en:'macOS 11 or newer · Intel and Apple Silicon',de:'macOS 11 oder neuer · Intel und Apple Silicon',ru:'macOS 11 или новее · Intel и Apple Silicon'},datei:'KlangFeder.dmg',mb:82},
  {name:'Linux',typ:'.deb',zeile:{en:'Ubuntu, Debian, Mint · 64-bit',de:'Ubuntu, Debian, Mint · 64 Bit',ru:'Ubuntu, Debian, Mint · 64 бит'},datei:'KlangFeder-amd64.deb',mb:46}
 ],
 anf:{en:'<b>System requirements.</b> About 1.5 GB free for program and dictionaries. A current web browser. Other Linux systems: the <a href="https://github.com/CasparDavi/klangfeder/releases/latest/download/KlangFeder-x86_64.AppImage">AppImage</a>. Not signed: on Windows, Edge first holds the download back – click the arrow next to “Delete” → “Keep”; on first launch Windows may ask once more, and macOS blocks the app until you allow it under Privacy & Security → “Open Anyway”. Once installed, a bell next to “System” shows a new version; one click installs it.',
      de:'<b>Systemanforderungen.</b> Rund 1,5 GB frei für Programm und Wörterbücher. Ein aktueller Webbrowser. Andere Linux-Systeme: das <a href="https://github.com/CasparDavi/klangfeder/releases/latest/download/KlangFeder-x86_64.AppImage">AppImage</a>. Nicht signiert: Unter Windows hält Edge den Download zuerst zurück – Pfeil neben „Löschen“ → „Beibehalten“; beim ersten Start fragt Windows unter Umständen noch einmal nach, und macOS blockiert die App, bis du sie unter Datenschutz & Sicherheit → „Dennoch öffnen“ freigibst. Einmal installiert, zeigt eine Glocke neben „System“ eine neue Fassung; ein Klick spielt sie ein.',
      ru:'<b>Системные требования.</b> Около 1,5 ГБ свободного места для программы и словарей. Современный веб-браузер. Другие системы Linux: <a href="https://github.com/CasparDavi/klangfeder/releases/latest/download/KlangFeder-x86_64.AppImage">AppImage</a>. Без цифровой подписи: в Windows браузер Edge сначала задерживает загрузку — нажмите стрелку рядом с «Удалить» → «Сохранить»; при первом запуске Windows может спросить ещё раз, а macOS блокирует приложение, пока вы не разрешите его в разделе «Конфиденциальность и безопасность» → «Всё равно открыть». После установки колокольчик рядом с «Система» сообщает о новой версии; один клик её устанавливает.'}
};

const BV = '5';   // Bildstand: hochzählen, wenn Bilder ersetzt werden (sonst zeigt der Browser alte)
const BILDER = {
  titel: { sprachen: { de: `img/titel-de.webp?v=${BV}`, en: `img/titel-en.webp?v=${BV}`, ru: `img/titel-ru.webp?v=${BV}` } },
  schreiben: { sprachen: { de: `img/schreiben-de.webp?v=${BV}`, en: `img/schreiben-en.webp?v=${BV}`, ru: `img/schreiben-ru.webp?v=${BV}` } },
  reimschema: { sprachen: { de: `img/reimschema-de.webp?v=${BV}`, en: `img/reimschema-en.webp?v=${BV}`, ru: `img/reimschema-ru.webp?v=${BV}` } },
  reimsuche: { sprachen: { de: `img/reimsuche-de.webp?v=${BV}`, en: `img/reimsuche-en.webp?v=${BV}`, ru: `img/reimsuche-ru.webp?v=${BV}` } },
  ersatz: { sprachen: { de: `img/ersatz-de.webp?v=${BV}`, en: `img/ersatz-en.webp?v=${BV}`, ru: `img/ersatz-ru.webp?v=${BV}` } },
  luecke: { sprachen: { de: `img/luecke-de.webp?v=${BV}`, en: `img/luecke-en.webp?v=${BV}`, ru: `img/luecke-ru.webp?v=${BV}` } },
  zaehlen: { sprachen: { de: `img/zaehlen-de.webp?v=${BV}`, en: `img/zaehlen-en.webp?v=${BV}`, ru: `img/zaehlen-ru.webp?v=${BV}` } },
  regie: { sprachen: { de: `img/regie-de.webp?v=${BV}`, en: `img/regie-en.webp?v=${BV}` } },
  ki: { sprachen: { de: `img/ki-de.webp?v=${BV}`, en: `img/ki-en.webp?v=${BV}` } },
  laenge: { sprachen: { de: `img/laenge-de.webp?v=${BV}`, en: `img/laenge-en.webp?v=${BV}`, ru: `img/laenge-ru.webp?v=${BV}` } },
  vergleich: { sprachen: { de: `img/vergleich-de.webp?v=${BV}`, en: `img/vergleich-en.webp?v=${BV}` } },
  /* Ansehen: drei quadratische Bilder nebeneinander, je mit Beschriftung darüber, je Sprache */
  ansehen: { reihe: ['wolke', 'dotplot', 'kreis'].map((b, i) => ({ n: [{ de: 'Wortwolke', ru: 'Облако слов', en: 'Word cloud' }, { de: 'Dotplot', ru: 'Точечная матрица', en: 'Dot plot' }, { de: 'Kreis', ru: 'Круг', en: 'Circle' }][i],
   s: { de: `img/ansehen-${b}-de.webp?v=${BV}`, en: `img/ansehen-${b}-en.webp?v=${BV}`, ru: `img/ansehen-${b}-ru.webp?v=${BV}` } })) },
  /* Aufbau als Schaubilder statt Screenshots (Caspar_D, 12.11.2026: „keine screenshots, lieber zwei schaubilder“) */
  geruest: { schaubild: { umschalter: true, links: { de: 'Lied', ru: 'Песня', en: 'Song' }, rechts: { de: 'Gedicht', ru: 'Стихотворение', en: 'Poem' }, knopf: { de: '', ru: '', en: '' },
   von: { de: ['Pop', 'Strophe · Refrain', 'AABA', 'Ballade', 'Blues', 'Rap'], ru: ['поп', 'куплет · припев', 'AABA', 'баллада', 'блюз', 'рэп'], en: ['pop', 'verse · chorus', 'AABA', 'ballad', 'blues', 'rap'] },
   bei: { de: ['Sonett', 'Stanze', 'Terzinen', 'Volksliedstrophe', 'Ghasel', 'Haiku'], ru: ['сонет', 'октава', 'терцины', 'онегинская строфа', 'частушка', 'хайку'], en: ['sonnet', 'ottava rima', 'terza rima', 'rhyme royal', 'limerick', 'haiku'] } } },
  /* Soll und Ist: Balken wie im Programm. m je Silbe: w/s gefüllt (Senkung/Hebung), W/S Umriss (fehlt noch), ! zu viel.
     Deutsch: Eichendorff, „In einem kühlen Grunde“ (1813), Volksliedstrophe; Englisch: Wordsworth (1807), vierhebige Jamben.
     Die dritte Zeile ist absichtlich um eine Silbe verlängert, die vierte erst angefangen. */
  soll: { sollbild: {
   de: [ { t: 'x-X-x-X-x-X-x', m: 'wswswsw', r: 'A', n: 'Gerüst', platz: true },
         { t: 'In einem kühlen Grunde', m: 'wswswsw', r: 'A', n: 'passt' },
         { t: 'Da geht ein Mühlenrad', m: 'wswsws', r: 'B', n: 'passt' },
         { t: 'Mein Liebste ist <b>nun</b> verschwunden', m: 'wsws!wsw', r: 'A', n: 'Silbe zu viel' },
         { t: 'Die dort gewoh▏', m: 'wswsWWS', r: 'B', blass: true, n: 'Rest als Umriss' } ],
   ru: [ { t: 'x-X-x-X-x-X-x-X-x', m: 'wswswswsw', r: 'A', n: 'каркас', platz: true },
         { t: 'Мой дядя самых честных правил', m: 'wswswswsw', r: 'A', n: 'подходит' },
         { t: 'Когда не в шутку занемог', m: 'wswswsws', r: 'B', n: 'подходит' },
         { t: 'Он уважать себя <b>так</b> заставил', m: 'wswsws!wsw', r: 'A', n: 'лишний слог' },
         { t: 'И лучше вы▏', m: 'wswsWSWS', r: 'B', blass: true, n: 'остаток контуром' } ],
   en: [ { t: 'x-X-x-X-x-X-x-X', m: 'wswswsws', r: 'A', n: 'frame', platz: true },
         { t: 'I wandered lonely as a cloud', m: 'wswswsws', r: 'A', n: 'fits' },
         { t: 'That floats on high o’er vales and hills', m: 'wswswsws', r: 'B', n: 'fits' },
         { t: 'When all at once I saw a <b>big</b> crowd', m: 'wswswsw!s', r: 'A', n: 'one too many' },
         { t: 'A host of golden daff▏', m: 'wswswsWS', r: 'B', blass: true, n: 'the rest as an outline' } ] } },
  buecher: `img/buecher.webp?v=${BV}`,
  /* Versfüße, Versformen, Strophenformen – Beispielwörter mit der betonten Silbe fett. Die Listen nennen, was die
     KlangFeder in einem Text DIESER Sprache erkennt und benennt (Feld `sprachen` im FORMKATALOG, kern/formen.mjs;
     erzeugt und geprüft mit `node bin/formenlisten.mjs`). Strophenformen: 15 deutsche, 19 englische, 15 russische –
     daher die drei verschiedenen Reste. Einsetzen (Gerüst) lässt sich jede Form in jeder Sprache; erkannt wird nur,
     was zur Sprache gehört. */
  versmass: { liste: [
   { k: { de: 'Versfüße', ru: 'Стопы', en: 'Feet' }, w: { de: ['Jambus: Ver·<b>stand</b>', 'Trochäus: <b>Va</b>·ter', 'Daktylus: <b>Kö</b>·ni·gin', 'Anapäst: Pa·ra·<b>dies</b>'], ru: ['ямб: ру·<b>ка</b>', 'хорей: <b>ма</b>·ма', 'дактиль: <b>ко</b>·ло·кол', 'анапест: со·ло·<b>вей</b>'], en: ['iamb: a·<b>bove</b>', 'trochee: <b>gar</b>·den', 'dactyl: <b>beau</b>·ti·ful', 'anapaest: in·ter·<b>vene</b>'] } },
   { k: { de: 'Versformen', ru: 'Формы стиха', en: 'Line forms' }, w: { de: ['Volksliedvers', 'Knittelvers', 'Blankvers', 'Alexandriner', 'Hexameter', 'freie Rhythmen'], ru: ['дольник', 'тактовик', 'раёшный стих', 'белый стих', 'александрийский стих', 'свободные ритмы'], en: ['folk song line', 'blank verse', 'alexandrine', 'hexameter', 'pentameter', 'free rhythms'] } },
   { k: { de: 'Strophenformen', ru: 'Строфы', en: 'Stanza forms' }, w: { de: ['Sonett', 'Stanze', 'Terzine', 'Volksliedstrophe', 'Ghasel', 'Chevy-Chase-Strophe', 'und 9 weitere'], ru: ['онегинская строфа', 'одическая строфа', 'частушка', 'сонет', 'октава', 'терцины', 'и ещё 9'], en: ['sonnet', 'ottava rima', 'terza rima', 'rhyme royal', 'ballad stanza', 'limerick', 'and 13 more'] } } ] },
  /* Reimstufen in den Farben der KlangFeder (Streifen an der Reimliste). Je Sprache eigene Beispiele, am Kern gemessen
     (14.11.2026, Kern 2026-11-14.2): die Paare der oberen vier Stufen sind im jeweiligen Korpus belegt – die Zahl in
     Klammern sagt, wie oft Dichter sie gereimt haben (de 45 781 Paare aus Liedern, en 68 647 aus 3,09 Mio Verszeilen,
     ru 122 200 aus Gedichten + 430 495 aus Liedern). Assonanz, Konsonanz und Anklang kommen in keinem der drei Korpora
     vor: das sind Nachbarschaften, die die KlangFeder zeigt, keine Reime. Auch die Erklärungen sind sprachgebunden –
     die Vokallänge trägt den fast reinen Reim nur im Deutschen. */
  reimstufen: { liste: [
   { k: { de: 'rührend', ru: 'тавтологическая', en: 'identical' }, f: '#f2f2f2', w: { de: ['Liebe / bliebe', 'auch der Laut vor dem betonten Vokal gleich'], ru: ['свет / ответ', 'совпадает даже согласный перед ударным гласным'], en: ['breast / rest', 'even the sound before the stressed vowel is the same'] } },
   { k: { de: 'rein', ru: 'точная', en: 'perfect' }, f: '#4a8fff', w: { de: ['Herz / Schmerz', 'ab dem betonten Vokal gleich'], ru: ['нет / свет', 'одинаково, начиная с ударного гласного'], en: ['light / night', 'the same from the stressed vowel on'] } },
   { k: { de: 'fast rein', ru: 'почти точная', en: 'near-perfect' }, f: '#45c26a', w: { de: ['Rad / Stadt', 'nur die Vokallänge anders'], ru: ['жить / любить', 'и после ж звучит как ы'], en: ['gone / on', 'the two vowels have merged (cot–caught)'] } },
   { k: { de: 'unrein', ru: 'неточная', en: 'impure' }, f: '#e6d23e', w: { de: ['Liebe / trübe', 'Vokal leicht anders'], ru: ['глаза / тебя', 'ударный гласный немного другой'], en: ['again / pain', 'the stressed vowel is slightly different'] } },
   { k: { de: 'Assonanz', ru: 'ассонанс', en: 'assonance' }, f: '#f08a24', w: { de: ['Liebe / Wiege', 'nur die Vokale gleich'], ru: ['ночь / ложь', 'совпадают только гласные'], en: ['night / eyes', 'only the vowels match'] } },
   { k: { de: 'Konsonanz', ru: 'консонанс', en: 'consonance' }, f: '#c0646c', w: { de: ['Liebe / lebe', 'nur die Konsonanten gleich'], ru: ['день / конь', 'совпадают только согласные'], en: ['love / leave', 'only the consonants match'] } },
   { k: { de: 'Anklang', ru: 'созвучие', en: 'echo' }, f: '#8b8b90', w: { de: ['Wind / Winter', 'klingt ähnlich, andere Silbenzahl'], ru: ['ночь / очи', 'звучит похоже, но число слогов другое'], en: ['love / lover', 'sounds similar, different number of syllables'] } } ] },
  /* Ausrichtung zweier Lautketten wie im Programm (kern/laute.mjs ausrichten, Gedichte-Matrix; Punkte am 12.11.2026 gerechnet):
     | gleich, : ähnlich, · verschieden; „von“ = Punkte des Worts gegen sich selbst */
  /* Ausrichtung zweier Lautketten wie im Programm, je Sprache mit eigenen Wörtern – gerechnet mit
     bin/blast-seite.mjs der KlangFeder (Punkte aus kern/laute.mjs ausrichten, Deutsch und Russisch mit der an
     Gedichten gelernten Tafel, Englisch mit dem Merkmalsabstand – dort gibt es keine gelernte).
     | gleich, : ähnlich, · verschieden; das erste Kästchen steht vor dem Reim und zählt nicht, „von“ = Punkte des
     Worts gegen sich selbst. Die deutschen Zeilen sind dieselben wie vorher, jetzt nachgerechnet. */
  blast: { sprachen: {
   de: { ausrichtung: { zeilen: [{"a":"Liebe","b":"trübe","s":[["l","tʁ"," "],["iː","yː",":"],["b","b","|"],["ə","ə","|"]],"p":"10,4","pe":"10.4","max":"11,4","maxe":"11.4","st":"unrein"},{"a":"Liebe","b":"Wiege","s":[["l","v"," "],["iː","iː","|"],["b","ɡ","·"],["ə","ə","|"]],"p":"7,7","pe":"7.7","max":"11,4","maxe":"11.4","st":"Assonanz"},{"a":"Herz","b":"Schmerz","s":[["h","ʃm"," "],["ɛ","ɛ","|"],["ɐ̯","ɐ̯","|"],["t͡s","t͡s","|"]],"p":"6,0","pe":"6.0","max":"6,0","maxe":"6.0","st":"rein"}], stufen: {"unrein":{"de":"unrein","ru":"неточная","en":"impure","f":"#e6d23e"},"Assonanz":{"de":"Assonanz","ru":"ассонанс","en":"assonance","f":"#f08a24"},"rein":{"de":"rein","ru":"точная","en":"perfect","f":"#4a8fff"}}, von: {"de":"von","ru":"из","en":"of"}, leg: {"gleich":{"de":"gleich","ru":"одинаковые","en":"same"},"aehnlich":{"de":"ähnlich","ru":"похожие","en":"similar"},"anders":{"de":"verschieden","ru":"разные","en":"different"},"aussen":{"de":"vor dem Reim","ru":"до рифмы","en":"before the rhyme"}} } },
   en: { ausrichtung: { zeilen: [{"a":"fill","b":"feel","s":[["f","f"," "],["ɪ","i",":"],["l","l","|"]],"p":"4,2","pe":"4.2","max":"8,0","maxe":"8.0","st":"unrein"},{"a":"night","b":"time","s":[["n","t"," "],["aɪ","aɪ","|"],["t","m","·"]],"p":"3,1","pe":"3.1","max":"8,0","maxe":"8.0","st":"Assonanz"},{"a":"light","b":"night","s":[["l","n"," "],["aɪ","aɪ","|"],["t","t","|"]],"p":"8,0","pe":"8.0","max":"8,0","maxe":"8.0","st":"rein"}], stufen: {"unrein":{"de":"unrein","ru":"неточная","en":"impure","f":"#e6d23e"},"Assonanz":{"de":"Assonanz","ru":"ассонанс","en":"assonance","f":"#f08a24"},"rein":{"de":"rein","ru":"точная","en":"perfect","f":"#4a8fff"}}, von: {"de":"von","ru":"из","en":"of"}, leg: {"gleich":{"de":"gleich","ru":"одинаковые","en":"same"},"aehnlich":{"de":"ähnlich","ru":"похожие","en":"similar"},"anders":{"de":"verschieden","ru":"разные","en":"different"},"aussen":{"de":"vor dem Reim","ru":"до рифмы","en":"before the rhyme"}} } },
   ru: { ausrichtung: { zeilen: [{"a":"любовь","b":"слов","s":[["b","sɫ"," "],["o","o","|"],["fʲ","f",":"]],"p":"4,0","pe":"4.0","max":"12,0","maxe":"12.0","st":"unrein"},{"a":"ночь","b":"ложь","s":[["n","ɫ"," "],["o","o","|"],["t͡ɕ","ʂ","·"]],"p":"3,0","pe":"3.0","max":"6,0","maxe":"6.0","st":"Assonanz"},{"a":"нет","b":"свет","s":[["nʲ","svʲ"," "],["e","e","|"],["t","t","|"]],"p":"6,0","pe":"6.0","max":"6,0","maxe":"6.0","st":"rein"}], stufen: {"unrein":{"de":"unrein","ru":"неточная","en":"impure","f":"#e6d23e"},"Assonanz":{"de":"Assonanz","ru":"ассонанс","en":"assonance","f":"#f08a24"},"rein":{"de":"rein","ru":"точная","en":"perfect","f":"#4a8fff"}}, von: {"de":"von","ru":"из","en":"of"}, leg: {"gleich":{"de":"gleich","ru":"одинаковые","en":"same"},"aehnlich":{"de":"ähnlich","ru":"похожие","en":"similar"},"anders":{"de":"verschieden","ru":"разные","en":"different"},"aussen":{"de":"vor dem Reim","ru":"до рифмы","en":"before the rhyme"}} } } } },
  /* Vokalmatrix aus der gelernten Reimmatrix (KlangFeder daten/de/laut/pmi.json, TextGrid-Gedichte, Stand 10.11.2026):
     normierte PMI je Paar, 1 = gleicher Laut; fehlende Paare wurden nie zusammen gesehen (bleiben leer) */
  /* schreibung: welche Buchstaben im Deutschen für das Lautzeichen stehen (Jörg, 12.11.2026: „um die Buchstabenkombis
     ergänzen, für die die Lautzeichen stehen“) – Liebe, mir, ihn · Mitte · Weg, See, sehr · Bett, Hände · trübe, Kühe, Typ ·
     Hütte · schön, Höhle · Hölle · gut, Uhr · Mutter · Rose, Boot, Sohn · Sonne · Tag, Saal, Bahn, Mann · Liebe (unbetont) ·
     Vater, mir · Zeit, Mai · Freude, Häuser · Haus */
  /* Die Tafel je Sprache, gelernt aus den Reimen dieser Sprache (bin/lautmatrix-seite.mjs der KlangFeder; beide an
     Gedichten gelernt: 61 000 deutsche aus TextGrid, 22 500 russische aus Wikisource – gleiches Maß beidseits).
     Für Englisch gibt es keine gelernte Tafel; dort steht die deutsche, und die Kachel sagt das auch. Die Werte sind
     Zeichen für Zeichen die des Kerns: `node bin/lautmatrix-seite.mjs de --vergleich docs/inhalt.js`. */
  lautmatrix: { sprachen: {
   de: { matrix: {"laute":["i","ɪ","e","ɛ","y","ʏ","ø","œ","u","ʊ","o","ɔ","a","ə","ɐ","aɪ̯","ɔʏ̯","aʊ̯"],"schreibung":{"i":"ie, i, ih","ɪ":"i","e":"e, ee, eh","ɛ":"e, ä","y":"ü, üh, y","ʏ":"ü","ø":"ö, öh","œ":"ö","u":"u, uh","ʊ":"u","o":"o, oo, oh","ɔ":"o","a":"a, aa, ah","ə":"e","ɐ":"er, r","aɪ̯":"ei, ai","ɔʏ̯":"eu, äu","aʊ̯":"au"},"werte":{"a|a":1,"ə|ə":1,"aɪ̯|aɪ̯":1,"ɛ|ɛ":1,"œ|ɛ":0.582,"ɐ|ɐ":1,"e|ɛ":-0.095,"ɪ|ʏ":0.536,"e|e":1,"i|i":1,"o|ɔ":0.274,"ɪ|ɪ":1,"i|y":0.671,"œ|ɪ":-0.1,"ɔ|ɔ":1,"u|u":1,"o|o":1,"ɔʏ̯|ɔʏ̯":1,"ʏ|ʏ":1,"ʊ|ʊ":1,"e|ø":0.552,"y|ʏ":0.203,"aʊ̯|aʊ̯":1,"y|y":1,"œ|ʏ":-0.47,"aɪ̯|ɔʏ̯":0.515,"u|ʊ":-0.466,"i|ʏ":-0.354,"ø|ø":1,"œ|œ":1,"o|ø":-0.493,"ø|œ":0.237,"ø|ɛ":-0.127,"œ|ɔ":-0.445,"y|ø":-0.293,"i|ɪ":-1.45,"œ|ʊ":-0.501,"ɛ|ɪ":-1.78,"ɪ|ʊ":-1.821},"leg":{"links":{"de":"seltener als Zufall","ru":"реже случайного","en":"less often than chance"},"rechts":{"de":"öfter","ru":"чаще","en":"more often"},"leer":{"de":"nie gesehen","ru":"ни разу не встречались","en":"never seen"}}} },
   ru: { matrix: {"laute":["i","ɨ","e","ɛ","a","o","u","ɪ","ʊ","ə"],"schreibung":{"i":"и","ɨ":"ы, и","e":"е","ɛ":"э, е","a":"а, я","o":"о, ё","u":"у, ю","ɪ":"и, е, я","ʊ":"у","ə":"а, о"},"werte":{"o|o":1,"ɨ|ɨ":1,"e|e":1,"ə|ə":1,"i|i":1,"ə|ɨ":-0.714,"ʊ|ʊ":1,"a|a":1,"i|ɨ":0.264,"ɪ|ɪ":1,"u|u":1,"ɪ|ʊ":-0.861,"ɨ|ʊ":-1.06,"ə|ʊ":-0.896,"e|ɛ":0.724,"ɛ|ɛ":1,"ə|ɪ":-3.893},"leg":{"links":{"de":"seltener als Zufall","ru":"реже случайного","en":"less often than chance"},"rechts":{"de":"öfter","ru":"чаще","en":"more often"},"leer":{"de":"nie gesehen","ru":"ни разу не встречались","en":"never seen"}}} },
   en: { matrix: {"laute":["i","ɪ","e","ɛ","y","ʏ","ø","œ","u","ʊ","o","ɔ","a","ə","ɐ","aɪ̯","ɔʏ̯","aʊ̯"],"schreibung":{"i":"ie, i, ih","ɪ":"i","e":"e, ee, eh","ɛ":"e, ä","y":"ü, üh, y","ʏ":"ü","ø":"ö, öh","œ":"ö","u":"u, uh","ʊ":"u","o":"o, oo, oh","ɔ":"o","a":"a, aa, ah","ə":"e","ɐ":"er, r","aɪ̯":"ei, ai","ɔʏ̯":"eu, äu","aʊ̯":"au"},"werte":{"a|a":1,"ə|ə":1,"aɪ̯|aɪ̯":1,"ɛ|ɛ":1,"œ|ɛ":0.582,"ɐ|ɐ":1,"e|ɛ":-0.095,"ɪ|ʏ":0.536,"e|e":1,"i|i":1,"o|ɔ":0.274,"ɪ|ɪ":1,"i|y":0.671,"œ|ɪ":-0.1,"ɔ|ɔ":1,"u|u":1,"o|o":1,"ɔʏ̯|ɔʏ̯":1,"ʏ|ʏ":1,"ʊ|ʊ":1,"e|ø":0.552,"y|ʏ":0.203,"aʊ̯|aʊ̯":1,"y|y":1,"œ|ʏ":-0.47,"aɪ̯|ɔʏ̯":0.515,"u|ʊ":-0.466,"i|ʏ":-0.354,"ø|ø":1,"œ|œ":1,"o|ø":-0.493,"ø|œ":0.237,"ø|ɛ":-0.127,"œ|ɔ":-0.445,"y|ø":-0.293,"i|ɪ":-1.45,"œ|ʊ":-0.501,"ɛ|ɪ":-1.78,"ɪ|ʊ":-1.821},"leg":{"links":{"de":"seltener als Zufall","ru":"реже случайного","en":"less often than chance"},"rechts":{"de":"öfter","ru":"чаще","en":"more often"},"leer":{"de":"nie gesehen","ru":"ни разу не встречались","en":"never seen"}}} } } },
  /* Freie Wörterbücher und Korpora (daten/QUELLEN.md der KlangFeder); Zahlen wie dort */
  korpora: { liste: [
   { k: { de: 'Korpora', ru: 'Корпуса', en: 'Corpora' }, w: { de: [
     { n: 'TextGrid / Zeno.org', b: 'rund 61 000 deutsche Gedichte', l: 'CC BY 3.0 DE' },
     { n: 'Gutenberg Poetry Corpus', b: 'rund 3 Millionen englische Verszeilen', l: 'CC0' },
     { n: 'Wikisource', b: 'rund 22 500 gemeinfreie russische Gedichte', l: 'gemeinfrei' },
     { n: 'Genius (über Hugging Face)', b: 'Reimpaare aus rund 180 000 russischen Liedern – nur die Paare mit ihrer Zahl, keine Texte', l: 'Lizenz nicht angegeben' },
     { n: 'Wortschatz Leipzig', b: 'Nachrichten, Wikipedia und Webtexte, je 1 Million Sätze', l: 'CC BY' },
     { n: 'FrequencyWords', b: 'die 50 000 häufigsten Wörter je Sprache, aus Untertiteln', l: 'CC BY-SA' } ], ru: [{ n: 'TextGrid / Zeno.org', b: 'около 61 000 немецких стихотворений', l: 'CC BY 3.0 DE' }, { n: 'Gutenberg Poetry Corpus', b: 'около 3 миллионов строк английских стихов', l: 'CC0' }, { n: 'Wikisource', b: 'около 22 500 русских стихотворений в общественном достоянии', l: 'общественное достояние' }, { n: 'Genius (через Hugging Face)', b: 'пары рифм примерно из 180 000 русских песен — только пары и их число, без текстов', l: 'лицензия не указана' }, { n: 'Wortschatz Leipzig', b: 'новости, Википедия и веб-тексты, по 1 миллиону предложений', l: 'CC BY' }, { n: 'FrequencyWords', b: '50 000 самых частых слов каждого языка, по субтитрам', l: 'CC BY-SA' }], en: [
     { n: 'TextGrid / Zeno.org', b: 'about 61,000 German poems', l: 'CC BY 3.0 DE' },
     { n: 'Gutenberg Poetry Corpus', b: 'about 3 million English lines of verse', l: 'CC0' },
     { n: 'Wikisource', b: 'about 22,500 public-domain Russian poems', l: 'public domain' },
     { n: 'Genius (via Hugging Face)', b: 'rhyme pairs from about 180,000 Russian songs – only the pairs and their counts, no lyrics', l: 'licence not stated' },
     { n: 'Wortschatz Leipzig', b: 'news, Wikipedia and web texts, 1 million sentences each', l: 'CC BY' },
     { n: 'FrequencyWords', b: 'the 50,000 most frequent words per language, from subtitles', l: 'CC BY-SA' } ] } },
   { k: { de: 'Wörterbücher', ru: 'Словари', en: 'Dictionaries' }, w: { de: [
     { n: 'Wiktionary', b: 'deutsche Wortformen mit Lautschrift', l: 'CC BY-SA' },
     { n: 'CMUdict', b: 'englische Wörter mit Betonung', l: 'BSD' },
     { n: 'OpenThesaurus', b: 'Gruppen sinnverwandter deutscher Wörter', l: 'LGPL / CC BY-SA' },
     { n: 'Open English WordNet', b: 'englische Synonyme und Gegenteile', l: 'CC BY 4.0' },
     { n: 'Wiktionary (Russisch)', b: 'drei Millionen russische Wortformen mit Betonung, dazu Synonyme, Gegenteile und Beugung', l: 'CC BY-SA' } ], ru: [{ n: 'Wiktionary', b: 'немецкие словоформы с транскрипцией', l: 'CC BY-SA' }, { n: 'CMUdict', b: 'английские слова с ударением', l: 'BSD' }, { n: 'OpenThesaurus', b: 'группы близких по смыслу немецких слов', l: 'LGPL / CC BY-SA' }, { n: 'Open English WordNet', b: 'английские синонимы и антонимы', l: 'CC BY 4.0' }, { n: 'Wiktionary (русский)', b: 'три миллиона русских словоформ с ударением, а также синонимы, антонимы и словоизменение', l: 'CC BY-SA' }], en: [
     { n: 'Wiktionary', b: 'German word forms with pronunciation', l: 'CC BY-SA' },
     { n: 'CMUdict', b: 'English words with stress', l: 'BSD' },
     { n: 'OpenThesaurus', b: 'groups of related German words', l: 'LGPL / CC BY-SA' },
     { n: 'Open English WordNet', b: 'English synonyms and opposites', l: 'CC BY 4.0' },
     { n: 'Wiktionary (Russian)', b: 'three million Russian word forms with stress, plus synonyms, opposites and inflection', l: 'CC BY-SA' } ] } },
   /* Lizenz verträgt sich nicht mit dem Paket: nicht dabei, holt der Nutzer selbst (Seite System, beim Einrichten) */
   { k: { de: 'Auf Wunsch', ru: 'По запросу', en: 'On request' }, w: { de: [
     { n: 'Songkorpus (IDS Mannheim)', b: 'Wendungen aus deutschen Liedtexten – nicht im Paket, lässt sich beim Einrichten auf der Seite System dazuholen', l: 'CC BY-NC 4.0, nur nicht-kommerziell' } ], ru: [{ n: 'Songkorpus (IDS Mannheim)', b: 'обороты из немецких текстов песен — не входят в пакет, их можно загрузить при настройке на странице «Система»', l: 'CC BY-NC 4.0, только для некоммерческого использования' }], en: [
     { n: 'Songkorpus (IDS Mannheim)', b: 'phrases from German song lyrics – not in the package, can be fetched during setup on the System page', l: 'CC BY-NC 4.0, non-commercial only' } ] } } ] },
  /* Umfang der ausgewerteten gemeinfreien Werke: gelesene Stichwörter, davon neu (nicht in ipa-dict bzw. ipa-dict + Viëtor) */
  umfang: { balken: { zeilen: [
   { kopf: { de: 'Deutsch', ru: 'Немецкий', en: 'German' } },
   { n: 'Wiktionary', ges: 705180, neu: 705180 },
   { n: 'Viëtor 1921', ges: 36779, neu: 11223 },
   { n: 'Muret-Sanders 1900', zus: { de: 'Deutsch–Englisch', ru: 'немецко-английская часть', en: 'German–English' }, ges: 62047, neu: 26322 },
   { kopf: { de: 'Englisch', ru: 'Английский', en: 'English' }, farbe: 'blau' },
   { n: 'CMUdict', ges: 126052, neu: 126052 },
   { n: 'Muret-Sanders 1900', zus: { de: 'Englisch–Deutsch', ru: 'англо-немецкая часть', en: 'English–German' }, ges: 136592, neu: 101946 },
   /* Russisch rot (Caspar_D 13.11.2026: „mache rote balken für russisch“): Wortformen mit Betonung aus dem Wiktionary (en + ru,
      bin/betonung-ru-bauen.mjs) – alle neu, vorher hatte die KlangFeder kein russisches Wörterbuch */
   { kopf: { de: 'Russisch', ru: 'Русский', en: 'Russian' }, farbe: 'rot' },
   { n: 'Wiktionary', zus: { de: 'Wortformen mit Betonung', ru: 'словоформы с ударением', en: 'word forms with stress' }, ges: 3037570, neu: 3037570 } ],
   bruch: 750000,   // Achse bis 750 000, darüber gebrochen (Russisch: 3 Mio.)
   leg: { ges: { de: 'Wörter', ru: 'слова', en: 'words' }, neu: { de: 'davon neu', ru: 'из них новые', en: 'of those new' }, alle: { de: 'alle neu', ru: 'все новые', en: 'all new' } } } },
};
const POSTER = {}, TEMPO = {};
const NUR_TEXT = new Set([]);   // Kacheln, die ohne Bild stehen
const GH = 'github.com/CasparDavi/klangfeder';
const ghLink = (s) => s.replace(GH, `<a class="gh" href="https://${GH}">${GH}</a>`);
const KONSOLE = {}, konsole = () => [];
const FORMAT = { schreiben: '1560/700', reimschema: '1310/950', reimsuche: '1310/950', ersatz: '1380/1095', luecke: '1000/1111', zaehlen: '676/620', regie: '1090/1000', ki: '676/680', laenge: '1495/1073', vergleich: '1560/1045', buecher: '1536/1024' };   /* ki w5 / laenge w7: 5·680/676 = 7·1073/1495 */   /* ersatz w7 / luecke w5: 7·1095/1380 = 5·1111/1000, Unterkanten fluchten */   /* Kacheln, deren Bild ein eigenes Seitenverhaeltnis hat */
