# Werkzeuge der Feature-Seite

## Vor jedem Push: die Download-Adressen prüfen

```bash
node werkzeug/downloads-pruefen.mjs
```

Die Knöpfe der Seite zeigen fest auf `releases/latest/download/…`. Wer ein Release anlegt – auch eines, das gar kein
Programm enthält –, macht es damit zum „latest“, und alle Knöpfe laufen ins Leere. Genau das ist am 14.11.2026 passiert:
Ein Datenpaket verdrängte `v0.9.6`, und von 21:09 Uhr an gaben alle vier Knöpfe in allen drei Sprachen 404.

Das Werkzeug prüft dreierlei:

1. worauf `latest` zeigt – ein Release ohne Programmdatei ist allein schon ein Fehler,
2. jede Adresse unter `releases/latest/download/`, die in `docs/` steht,
3. die Dateigrößen, die die Seite in `S.laden.systeme` nennt.

**Ein Datenpaket-Release bekommt `--prerelease`**, dann bleibt das Programm-Release „latest“. Ist es doch passiert:

```bash
gh api -X PATCH /repos/CasparDavi/klangfeder/releases/<id> -f make_latest=true
```

### Eingerichtet als Push-Bremse

Nach einem frischen Clone einmal:

```bash
git config core.hooksPath werkzeug/git-hooks
```

Danach läuft die Prüfung vor jedem `git push` und bricht ihn ab, wenn eine Adresse nicht mit 200 antwortet. Bewusst
darüber hinweg: `OHNE_DOWNLOADPRUEFUNG=1 git push`. Antwortet das Netz gar nicht, lässt die Bremse den Push durch und
sagt es.

## Aufnahmen für die Seite

Siehe `werkzeug/aufnahme/LIESMICH.md`.

## Sprachseiten für Suchmaschinen

`docs/index.html` (Englisch), `docs/de.html` und `docs/ru.html` tragen Kopf und Seitentext schon im HTML, dazu
`docs/sitemap.xml`. Quelle bleibt `docs/index.html` mit `docs/inhalt.js`; de.html und ru.html nie von Hand ändern.
Nach jeder Änderung an Text oder Seite:

    node werkzeug/sprachseiten.mjs

Titel und Beschreibung je Sprache stehen oben im Werkzeug (`KOPF`).

## Vorschaubild für Links

`docs/img/og-{en,de,ru}.jpg` (1280 × 640, Discord, Messenger, Suchmaschinen) ist der Kopf der Feature-Seite ohne
Sprachleiste und Knöpfe. Nach Änderungen an Spruch, Kopftext oder Titelbild: `node werkzeug/vorschaubild.mjs`, dann in
`werkzeug/sprachseiten.mjs` die Version bei `OG` hochzählen und `node werkzeug/sprachseiten.mjs`.
