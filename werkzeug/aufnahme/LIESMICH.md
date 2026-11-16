# Aufnahmen für die Landingpage

Werkzeuge aus dem KlangTresor übernommen (`cdp.mjs`, `folge.mjs`; Sicherung `KlangTresor-Sicherung/20261027/werkzeuge-scratchpad-2217.tar.gz`).
Aufgenommen wird **nie** an der Arbeitsinstanz (8790), sondern an einer Probeinstanz mit eigener Ablage, KI und KlangTresor aus
(so sieht ein neuer Nutzer die KlangFeder):

```bash
A=<Ordner für die Aufnahmen>; mkdir -p $A/ablage; ln -sfn <KlangFeder>/daten $A/ablage/daten
echo '{"mitKI":false,"mitTresor":false}' > $A/ablage/einstellungen.json
KLANGFEDER_PORT=8792 KLANGFEDER_ABLAGE=$A/ablage KLANGFEDER_DATEN=<KlangFeder>/daten node --experimental-sqlite server.mjs
```

## Alle Bilder, alle Sprachen (der übliche Weg)

`alle-sprachen.sh` nimmt jedes Bild in allen drei Sprachen auf, in beiden Pixeldichten, und wandelt am Ende nach
webp. Das ist der Aufruf nach einer Programmänderung:

```bash
A=<Aufnahmeordner> werkzeug/aufnahme/alle-sprachen.sh          # de en ru
A=<Aufnahmeordner> SPRACHEN="de" werkzeug/aufnahme/alle-sprachen.sh
```

Erwartet im Ordner `$A`: `ablage/` (mit `{"mitKI":true,"mitTresor":true}`), `erlkoenig.txt`,
`erlking-en-strophen.txt`. Laufen müssen die Probeinstanz auf 8792 und der KlangTresor auf 8788.
Ergebnis: `$A/bilder-de/`, `-en/`, `-ru/` mit `<name>-<sprache>.webp`.

* `vergleich` braucht den KlangTresor NICHT (mehr): der Lauf legt sich seine ältere Fassung selbst an – er fügt den
  Text so ein, wie ein Nutzer es tut (dabei entsteht die Start-Version), und überarbeitet dann eine Zeile. Ohne das
  steht links „leer (neuer Text)" und die halbe Ansicht ist leer; genau so waren die Bilder vom 15.11.2026
  (Caspar_D, 16.11.2026). Welche Zeile je Sprache überarbeitet wird, steht in `FEILEN` in `alle.mjs`.

## Nach dem Lauf: die Formate prüfen

Das Seitenverhältnis jedes Bildes steht in `FORMAT` (docs/inhalt.js) und **beschneidet** das Bild
(`object-fit: cover`). Caspar_Ds Regel vom 27.10.2026 – „die Bildunterkanten immer alignieren" – heißt: zwei
Kacheln einer Reihe haben gleich hohe Bilder, wenn `Breite₁/Verhältnis₁ = Breite₂/Verhältnis₂` (Breite in
Rasterspalten). `formate.mjs` rechnet beides gegeneinander und sagt, wie viel Prozent der Beschnitt kostet:

```bash
node werkzeug/aufnahme/formate.mjs <bilderordner>
```

Mehr als etwa 12 % heißt: Ausschnitt ändern, Kachelbreiten tauschen, oder die Kachel auf `quer`
(Beschriftung daneben statt darüber).

## Ein Lauf, eine Sprache (alle.mjs)

`alle.mjs` erzeugt jedes Bild der Feature-Seite in einer Sprache. Jedes Bild steht dort in einer Tafel mit drei
Angaben: was es zeigt, wie der Zustand hergestellt wird, und welcher Ausschnitt genommen wird. Der Ausschnitt wird
**nie in Pixeln** angegeben, sondern über die Elemente der Oberfläche – so überlebt die Aufnahme jede Änderung am
Layout.

```bash
URL=http://127.0.0.1:8792/ SPR=de TEXT_DE=$A/erlkoenig.txt node <repo>/werkzeug/aufnahme/alle.mjs
URL=http://127.0.0.1:8792/ SPR=en TEXT_EN=$A/erlking-en.txt node <repo>/werkzeug/aufnahme/alle.mjs reimschema ki
```

* Die Liedtexte liegen **nicht im Repo**; `TEXT_DE` und `TEXT_EN` zeigen auf sie. Russisch braucht keinen: dort
  steht der Beispieltext der KlangFeder im Feld.
* Für `laenge` muss in der Ablage `mitTresor` an sein und der KlangTresor laufen, für `ki`
  `mitKI` – die KlangFeder nutzt dafür Claude Code auf diesem Rechner, ein Schlüssel ist nicht nötig:
  `echo '{"mitKI":true,"mitTresor":true}' > $A/ablage/einstellungen.json`
* Fenster 1600 × 1000 bei doppelter Pixeldichte (`BREIT`, `HOCH`, `DPR`). **Die Kästen der linken Spalte haben
  eine feste Breite**, die nicht mit dem Fenster wächst – `laenge`, `zaehlen` und `ki` werden darum mit `DPR=4`
  aufgenommen, sonst sind sie auf der Seite unscharf:

```bash
URL=… SPR=de TEXT_DE=… DPR=4 node <repo>/werkzeug/aufnahme/alle.mjs laenge zaehlen ki
```

* Danach in webp wandeln und nach `docs/img/` legen, dann `BV` in `docs/inhalt.js` hochzählen.

## Einzelne Schrittfolgen (älter)

Dann je Sprache (aus `$A`):

```bash
URL=http://127.0.0.1:8792/ SPR=de TEXT=$A/erlkoenig.txt node <repo>/werkzeug/aufnahme/folge.mjs 1440 900 0 <repo>/werkzeug/aufnahme/erlkoenig.mjs
mv ganz.png ganz-de.png
```

Zuschnitt (2× Pixeldichte, Ausschnitte in Bildpunkten der Aufnahme 2880 × 1800):

| Bild | Befehl |
|---|---|
| `titel-<spr>.webp` | `magick ganz-<spr>.png -filter Lanczos -resize 2360x -quality 86 titel-<spr>.webp` |
| `schreiben-<spr>.webp` | `magick ganz-<spr>.png -crop 1560x700+780+470 +repage -quality 86 schreiben-<spr>.webp` |

Nach dem Ersetzen von Bildern `BV` in `docs/inhalt.js` hochzählen.
