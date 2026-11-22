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
#   ablage/                      Ablage der Probeinstanz, mit {"mitTresor":true}; Stimmen unter ablage/stimmen (für „hoeren“)
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
# Texte: fest unter _klangfeder-bau/aufnahme/texte (nicht in git – darin Caspar_Ds Liedtext; Kopie auf dem NAS). Nie wieder
# nur im Scratchpad (Jörg, 17.11.2026: „sichere dein Aufnahmeinstrumentarium“).
T_ORT=${T_ORT:-"$(cd "$(dirname "$0")/../../.." && pwd)/aufnahme/texte"}
for f in erlkoenig.txt erlking-en-strophen.txt erlkoenig-ru.txt panther.txt raven.txt poslushajte.txt gedanken.txt greensleeves.txt kalinka-lied.txt; do
  [ -e "$T_ORT/$f" ] || { echo "!! Text fehlt: $T_ORT/$f"; exit 2; }; done
# Seit 17.11.2026 haben alle Bilder ein Kachelfeld (FELD in alle.mjs) und denselben Maßstab wie das Titelbild – eine
# Pixeldichte für alle. Die Reihenfolge ist die der Tafel BILDER; die Zwischenschritte (…-aus, …-zu) gehören dazu.
# 22.11.2026: dazu Flusskontrolle, Verhörer, grammatischer Reim (liefen bis dahin einzeln), der KI-Bereich (kiverkehr, jetzt in der
# Probeinstanz mit einem Gemini-Lauf), Web-Chat-Bot, Entwurf, Durchsicht, Hören und die Systemseite (KI-Dienste, Stimme eichen).
GROB="titel schreiben klangketten fluss reimschema reimsuche ersatz luecke klangfarbe klangfarbe-aus lautschrift lautschrift-zu stammreim anlaut anlaut-aus gebunden zaehlen regie hoerquiz hoerquiz-zu flk-gedicht flk-zunge flk-aus verhoerer gramm ki laenge vergleich kiverkehr webchat entwurf ki-ende durchsicht hoeren eigene dienste stimmeichen"

for L in $SPRACHEN; do
  Z="$A/bilder-$L"; mkdir -p "$Z"
  echo "=============== $L ==============="
  for STUFE in "2 $GROB"; do
    set -- $STUFE; D=$1; shift
    echo "--- Pixeldichte $D: $* ---"
    URL="$URL" SPR="$L" DPR="$D" \
      TEXT_DE="$T_ORT/erlkoenig.txt" TEXT_EN="$T_ORT/erlking-en-strophen.txt" TEXT_RU="$T_ORT/erlkoenig-ru.txt" \
      PROBE_DE="$T_ORT/panther.txt" PROBE_EN="$T_ORT/raven.txt" PROBE_RU="$T_ORT/poslushajte.txt" \
      FLK_GEDICHT="$T_ORT/flk-gedicht-$L.txt" FLK_ZUNGE="$T_ORT/flk-zunge-$L.txt" \
      node werkzeug/aufnahme/alle.mjs "$@" --ziel="$Z" || echo "!! $L bei Pixeldichte $D abgebrochen"
  done
  # Die drei Bilder der Kachel „Ansehen" laufen über die ältere Schrittfolge: sie teilen einen Zustand (die Wolke
  # braucht gut 20 s zum Abkühlen) und schneiden nur die Fläche der Lasche aus. Sie zeigen als einzige NICHT den
  # „Erlkönig“, sondern je Sprache ein berühmtes Volkslied mit Kehrvers (Jörg, 15.11.2026: „Lieder, die tatsächlich
  # Wiederholungen zeigen“) – im „Erlkönig“ kommt keine Zeile zweimal vor, darum blieben Dotplot und Kreis leer.
  case $L in de) T="$T_ORT/gedanken.txt";; en) T="$T_ORT/greensleeves.txt";; ru) T="$T_ORT/kalinka-lied.txt";; esac
  echo "--- Ansehen: Wortwolke, Dotplot, Kreis ---"
  ( cd "$Z" && URL="$URL" SPR="$L" TEXT="$T" \
      node "$OLDPWD/werkzeug/aufnahme/folge.mjs" 1440 900 0 "$OLDPWD/werkzeug/aufnahme/ansehen.mjs" ) \
    || echo "!! $L: Ansehen abgebrochen"
  for N in wolke dotplot kreis; do
    [ -e "$Z/$N-$L.png" ] && mv "$Z/$N-$L.png" "$Z/ansehen-$N-$L.png" && werkzeug/aufnahme/leiste.sh "$Z/ansehen-$N-$L.png"
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
