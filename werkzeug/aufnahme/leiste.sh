#!/bin/bash
# Fensterleiste „KlangFeder“ über ein Bild setzen (Regel „Kein Bild ohne Namen“, Jörg 17.11.2026) – für Bilder, die nicht
# über alle.mjs entstehen (Ansehen: Wortwolke, Dotplot, Kreis). alle.mjs setzt die Leiste selbst (leisteDavor).
#   werkzeug/aufnahme/leiste.sh <bild> [<bild> …]      die Leiste kommt oben dazu; Höhe 22/344 der Bildbreite
set -e
for f in "$@"; do
  w=$(magick identify -format %w "$f"); h=$(( w * 22 / 344 )); r=$(( h * 17 / 100 )); y=$(( h / 2 )); x0=$(( h * 62 / 100 )); dx=$x0
  t=$(mktemp -t leiste).png
  magick -size ${w}x${h} xc:'#232326' -fill '#ff5f57' -draw "circle $x0,$y $((x0+r)),$y" -fill '#febc2e' -draw "circle $((x0+dx)),$y $((x0+dx+r)),$y" \
    -fill '#28c840' -draw "circle $((x0+2*dx)),$y $((x0+2*dx+r)),$y" -fill '#d6d6da' -font /System/Library/Fonts/SFNS.ttf \
    -pointsize $(( h * 46 / 100 )) -gravity center -annotate +0+0 KlangFeder "$t"
  magick "$t" "$f" -append "$f"; rm -f "$t"
done
