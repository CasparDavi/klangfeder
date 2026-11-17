#!/bin/bash
# Alle Bilder der Feature-Seite in allen drei Sprachen – ein Aufruf, ein Ergebnis.
# (Jörg, 15.11.2026: „dokumentiere bitte die Erstellung, damit du jederzeit nach Programmänderungen die shots mit
# einem automatischen Ablaufskript jederzeit in jeder Sprache neu erstellen kannst".)
#
# Aufruf aus dem Repo heraus:
#   A=<Aufnahmeordner> werkzeug/aufnahme/alle-sprachen.sh            alle drei Sprachen
#   A=<Aufnahmeordner> SPRACHEN="de en" werkzeug/aufnahme/alle-sprachen.sh
#
# Erwartet im Aufnahmeordner $A:
#   ablage/                      Ablage der Probeinstanz, mit {"mitKI":true,"mitTresor":true}
#   erlkoenig.txt                deutscher Liedtext (Caspar_D, Suno 12.11.2026)
#   erlking-en-strophen.txt      Bowring 1853 mit Abschnittsköpfen im Suno-Stil
# Russisch braucht für diese Bilder keinen Text: dort steht der Beispieltext der KlangFeder (Schukowski 1818) im Feld.
# Nur die drei Bilder der Kachel „Ansehen“ brauchen je Sprache ein Volkslied mit Kehrvers (gemeinfrei):
#   gedanken.txt                 „Die Gedanken sind frei“
#   greensleeves.txt             „Greensleeves“ (aus dem englischen Liedkorpus, _klangfeder-bau/genius/en.ndjson.gz)
#   kalinka-lied.txt             „Калинка“
# Klangketten, Fluss, Stammreim und Anlaut zeigen je Sprache ein gemeinfreies Gedicht (Caspar_D, 17.11.2026: „gemeinfrei reicht“):
#   panther.txt (Rilke 1902) · raven.txt (Poe 1845, zwei Strophen) · poslushajte.txt (Majakowski 1914)
#
# Vorher müssen laufen: die Probeinstanz auf 8792 (siehe LIESMICH.md) und der KlangTresor auf 8788
# (für „laenge" und „vergleich"). Ohne KlangTresor bleiben diese zwei Bilder leer.
#
set -u
cd "$(dirname "$0")/../.."
: "${A:?A=<Aufnahmeordner> setzen}"
URL=${URL:-http://127.0.0.1:8792/}
SPRACHEN=${SPRACHEN:-"de en ru"}
# Seit 17.11.2026 haben alle Bilder ein Kachelfeld (FELD in alle.mjs) und denselben Maßstab wie das Titelbild – eine
# Pixeldichte für alle. Die Reihenfolge ist die der Tafel BILDER; die Zwischenschritte (…-aus, …-zu) gehören dazu.
# kiverkehr fehlt hier: es braucht echten KI-Verkehr (siehe alle.mjs).
GROB="titel schreiben klangketten fluss reimschema reimsuche ersatz luecke klangfarbe klangfarbe-aus lautschrift lautschrift-zu stammreim anlaut anlaut-aus gebunden zaehlen regie hoerquiz hoerquiz-zu ki laenge vergleich eigene"

for L in $SPRACHEN; do
  Z="$A/bilder-$L"; mkdir -p "$Z"
  echo "=============== $L ==============="
  for STUFE in "2 $GROB"; do
    set -- $STUFE; D=$1; shift
    echo "--- Pixeldichte $D: $* ---"
    URL="$URL" SPR="$L" DPR="$D" \
      TEXT_DE="$A/erlkoenig.txt" TEXT_EN="$A/erlking-en-strophen.txt" TEXT_RU="$A/erlkoenig-ru.txt" \
      PROBE_DE="$A/panther.txt" PROBE_EN="$A/raven.txt" PROBE_RU="$A/poslushajte.txt" \
      node werkzeug/aufnahme/alle.mjs "$@" --ziel="$Z" || echo "!! $L bei Pixeldichte $D abgebrochen"
  done
  # Die drei Bilder der Kachel „Ansehen" laufen über die ältere Schrittfolge: sie teilen einen Zustand (die Wolke
  # braucht gut 20 s zum Abkühlen) und schneiden nur die Fläche der Lasche aus. Sie zeigen als einzige NICHT den
  # „Erlkönig“, sondern je Sprache ein berühmtes Volkslied mit Kehrvers (Jörg, 15.11.2026: „Lieder, die tatsächlich
  # Wiederholungen zeigen“) – im „Erlkönig“ kommt keine Zeile zweimal vor, darum blieben Dotplot und Kreis leer.
  case $L in de) T="$A/gedanken.txt";; en) T="$A/greensleeves.txt";; ru) T="$A/kalinka-lied.txt";; esac
  echo "--- Ansehen: Wortwolke, Dotplot, Kreis ---"
  ( cd "$Z" && URL="$URL" SPR="$L" TEXT="$T" \
      node "$OLDPWD/werkzeug/aufnahme/folge.mjs" 1440 900 0 "$OLDPWD/werkzeug/aufnahme/ansehen.mjs" ) \
    || echo "!! $L: Ansehen abgebrochen"
  for N in wolke dotplot kreis; do
    [ -e "$Z/$N-$L.png" ] && mv "$Z/$N-$L.png" "$Z/ansehen-$N.png"
  done
  echo "--- $L fertig: $(ls "$Z" | wc -l | tr -d ' ') Bilder ---"
done

# In webp wandeln, wie die Seite sie braucht: <name>-<sprache>.webp
for L in $SPRACHEN; do
  for P in "$A/bilder-$L"/*.png; do
    [ -e "$P" ] || continue
    # alle.mjs legt schon <name>-<sprache>.png an; hier nur die Endung wechseln, nicht die Sprache anhängen.
    N=$(basename "$P" .png)
    magick "$P" -quality 82 "$A/bilder-$L/$N.webp" && rm "$P"
  done
done
echo
echo "Fertig. Bilder in $A/bilder-<sprache>/. Zum Einbauen nach docs/img/ legen und BV in docs/inhalt.js hochzählen."
