# Aufnahmen für die Landingpage

Werkzeuge aus dem KlangTresor übernommen (`cdp.mjs`, `folge.mjs`; Sicherung `KlangTresor-Sicherung/20261027/werkzeuge-scratchpad-2217.tar.gz`).
Aufgenommen wird **nie** an der Arbeitsinstanz (8790), sondern an einer Probeinstanz mit eigener Ablage, KI und KlangTresor aus
(so sieht ein neuer Nutzer die KlangFeder):

```bash
A=<Ordner für die Aufnahmen>; mkdir -p $A/ablage; ln -sfn <KlangFeder>/daten $A/ablage/daten
echo '{"mitKI":false,"mitTresor":false}' > $A/ablage/einstellungen.json
KLANGFEDER_PORT=8792 KLANGFEDER_ABLAGE=$A/ablage KLANGFEDER_DATEN=<KlangFeder>/daten node --experimental-sqlite server.mjs
```

## Alle Bilder auf einmal (seit 15.11.2026)

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
* Für `laenge` und `vergleich` muss in der Ablage `mitTresor` an sein und der KlangTresor laufen, für `ki`
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
