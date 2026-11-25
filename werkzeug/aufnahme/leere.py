# Leere eines Feature-Bilds: Anteil der Fläche, die reiner Hintergrund ist und groß genug, um als Leere zu wirken.
# Jörg, 25.11.2026: „wenn mehr als 25% background space ist – also nicht von buchstaben, elementen, grafiken etc pp
# bedeckt ist, dann erstelle Alternativen“.
#
# Verfahren
#  1. Hintergrund = häufigste dunkle, graue Farbe des Bilds (#0C0C0C im App-Grund, #161618 auf der Werkbank).
#  2. Raster aus Blöcken von 32 Bildpunkten (= 16 App-Pixel bei DPR 2, etwa eine Zeilenhöhe ohne Schrift).
#     Ein Block ist leer, wenn jeder Bildpunkt höchstens 4 Stufen vom Hintergrund abweicht.
#  3. Öffnen mit 3×3 Blöcken: leer zählt nur, was in einer Fläche liegt, in die ein Quadrat von 48 App-Pixeln passt.
#     Schmale Gassen zwischen Wortspalten und Zeilen fallen so heraus; Ränder, leere Spalten, leere Unterkanten bleiben.
# Aufruf: python3 werkzeug/aufnahme/leere.py [--maske DIR] bild …
import subprocess, sys, os
from collections import Counter

BLOCK, F, K = 32, 4, 3          # Block in Bildpunkten, Verkleinerung, Öffnungsgröße in Blöcken

FARBEN = None   # --bg #141416,#0c0c0c: feste Grundfarben statt der häufigsten (Kacheln der Seite: Kachel- und Bildgrund)

def raster(p):
    w, h = map(int, subprocess.run(['magick', 'identify', '-format', '%w %h', p + '[0]'], capture_output=True, text=True).stdout.split())
    W, H = w // F, h // F
    raw = subprocess.run(['magick', p, '-resize', f'{W}x{H}!', '-depth', '8', 'rgb:-'], capture_output=True).stdout
    cnt = Counter(raw[i:i + 3] for i in range(0, len(raw) - 2, 3 * 7))
    bg = next(c for c, _ in cnt.most_common() if max(c) < 60 and max(c) - min(c) < 6)
    gruende = FARBEN or [bg]
    b = BLOCK // F
    g = []
    for by in range(0, H - b + 1, b):
        zeile = []
        for bx in range(0, W - b + 1, b):
            ok = True
            for y in range(b):
                o = ((by + y) * W + bx) * 3
                seg = raw[o:o + b * 3]
                for i in range(0, len(seg), 3):
                    if not any(abs(seg[i] - g[0]) <= 4 and abs(seg[i + 1] - g[1]) <= 4 and abs(seg[i + 2] - g[2]) <= 4 for g in gruende):
                        ok = False; break
                if not ok: break
            zeile.append(ok)
        g.append(zeile)
    return g

def oeffnen(g):
    R = len(g); C = len(g[0]) if R else 0
    op = [[False] * C for _ in range(R)]
    for y in range(R - K + 1):
        for x in range(C - K + 1):
            if all(g[y + j][x + i] for j in range(K) for i in range(K)):
                for j in range(K):
                    for i in range(K): op[y + j][x + i] = True
    return op

def leere(p):
    g = oeffnen(raster(p))
    n = sum(len(r) for r in g)
    return sum(sum(r) for r in g) / n, g

def maske(p, g, ziel):
    zeilen = [f'rectangle {x*BLOCK},{y*BLOCK} {x*BLOCK+BLOCK-1},{y*BLOCK+BLOCK-1}' for y, r in enumerate(g) for x, v in enumerate(r) if v]
    mvg = ziel + '.mvg'
    with open(mvg, 'w') as f: f.write('fill rgba(255,0,0,0.35)\n' + '\n'.join(zeilen) + '\n')
    subprocess.run(['magick', p, '-draw', '@' + mvg, '-resize', '40%', ziel]); os.remove(mvg)

if __name__ == '__main__':
    a = sys.argv[1:]; mdir = None
    while a and a[0].startswith('--'):
        if a[0] == '--maske': mdir = a[1]
        if a[0] == '--bg': FARBEN = [tuple(int(h.strip('#')[i:i + 2], 16) for i in (0, 2, 4)) for h in a[1].split(',')]
        a = a[2:]
    for p in a:
        v, g = leere(p)
        if mdir: maske(p, g, os.path.join(mdir, os.path.basename(p).rsplit('.', 1)[0] + '-maske.png'))
        print(f'{v*100:5.1f} %  {os.path.basename(p)}', flush=True)
