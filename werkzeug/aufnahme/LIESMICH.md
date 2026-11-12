# Aufnahmen für die Landingpage

Werkzeuge aus dem KlangTresor übernommen (`cdp.mjs`, `folge.mjs`; Sicherung `KlangTresor-Sicherung/20261027/werkzeuge-scratchpad-2217.tar.gz`).
Aufgenommen wird **nie** an der Arbeitsinstanz (8790), sondern an einer Probeinstanz mit eigener Ablage, KI und KlangTresor aus
(so sieht ein neuer Nutzer die KlangFeder):

```bash
A=<Ordner für die Aufnahmen>; mkdir -p $A/ablage; ln -sfn <KlangFeder>/daten $A/ablage/daten
echo '{"mitKI":false,"mitTresor":false}' > $A/ablage/einstellungen.json
KLANGFEDER_PORT=8792 KLANGFEDER_ABLAGE=$A/ablage KLANGFEDER_DATEN=<KlangFeder>/daten node --experimental-sqlite server.mjs
```

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
