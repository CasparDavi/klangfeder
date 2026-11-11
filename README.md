# KlangFeder – Downloads

KlangFeder ist ein Werkzeug zum Schreiben von Liedtexten: Betonung, Versmaß, Reime, Reimsuche, Aufbau.
Hier liegen nur die Installer und das Datenpaket; der Programmcode wird woanders gepflegt.

| System | Datei |
|---|---|
| Windows 10/11 | [KlangFeder-Setup.exe](https://github.com/CasparDavi/klangfeder-releases/releases/latest/download/KlangFeder-Setup.exe) |
| macOS | [KlangFeder.dmg](https://github.com/CasparDavi/klangfeder-releases/releases/latest/download/KlangFeder.dmg) |
| Linux: Ubuntu, Debian, Mint (x86_64) | [KlangFeder-amd64.deb](https://github.com/CasparDavi/klangfeder-releases/releases/latest/download/KlangFeder-amd64.deb) – empfohlen |
| Linux: andere (x86_64) | [KlangFeder-x86_64.AppImage](https://github.com/CasparDavi/klangfeder-releases/releases/latest/download/KlangFeder-x86_64.AppImage) |

Die Wörterbücher (Datenpaket) holt die KlangFeder bei der Installation selbst.

### Linux: so geht's

**Ubuntu, Debian, Mint – das .deb-Paket**
1. `KlangFeder-amd64.deb` herunterladen und im Ordner „Downloads“ doppelklicken.
2. Das App-Zentrum (bzw. die Paketinstallation) öffnet sich: **Installieren** und dein Passwort eingeben.
3. **KlangFeder** im Anwendungsmenü starten. Beim ersten Start legt sie sich nach `~/KlangFeder`, der Browser geht auf,
   und die Seite „System“ holt die Wörterbücher (Fortschrittsbalken).

Erneuern: das neuere Paket genauso installieren. Entfernen: im App-Zentrum, oder `sudo apt remove klangfeder`;
deine Texte und Wörterbücher in `~/KlangFeder` bleiben.

**Andere Linux-Systeme – das AppImage**
1. `KlangFeder-x86_64.AppImage` herunterladen.
2. Linux startet heruntergeladene Dateien nicht von selbst: **Rechtsklick → Eigenschaften → „Als Programm ausführen“**
   einschalten (je nach System auch „Ausführbar“ / „Allow executing file as program“).
3. Doppelklicken. Weiter wie oben ab Schritt 3.

## Datenpaket und Lizenzen
Das Datenpaket enthält Wörterbücher aus freien Quellen und daraus abgeleitete Daten. Die Quellen und Lizenzen
stehen vollständig in `QUELLEN.md` im Paket, unter anderem:
- Wiktionary über ipa-dict (CC BY-SA)
- OpenThesaurus (LGPL 2.1 / CC BY-SA 4.0)
- Open English WordNet (CC BY 4.0)
- CMUdict (BSD)
- Wortschatz Leipzig (CC BY)
- TextGrid (CC BY 3.0 DE)
- Gutenberg Poetry Corpus (CC0)

Im Programm selbst (nicht im Datenpaket): die Lautschrift aus Viëtor, *Deutsches Aussprachewörterbuch*, 3. Aufl. 1921
– gemeinfrei, für die KlangFeder digitalisiert und frei veröffentlicht unter CC0:
[github.com/CasparDavi/vietor-1921](https://github.com/CasparDavi/vietor-1921).

Abgeleitete Wörterbuchdaten stehen unter derselben Lizenz wie ihre Quelle (CC BY-SA).

Wendungen aus Liedtexten (Songkorpus, IDS Mannheim, CC BY-NC 4.0, „non-commercial scientific research only“) sind
**nicht** im Paket. Wer sie nutzen will, lässt sie die KlangFeder selbst von songkorpus.de holen und stimmt dabei
den Bedingungen des IDS zu.

---

KlangFeder is a tool for writing song lyrics (stress, metre, rhymes). This repository only hosts the installers
and the data package. Sources and licences of the data are listed in `QUELLEN.md` inside the package.

Linux: on Ubuntu, Debian or Mint take `KlangFeder-amd64.deb` – double-click it, install it in the App Center and
start KlangFeder from the application menu. Other distributions: the AppImage; downloaded files are not executable,
so first right-click → Properties → "Allow executing file as program", then double-click.
