# links oder rechts

Lastenrad, Schnitzel, Gartenzwerg: Karten nach links oder rechts wischen und damit dem politischen Spektrum zuordnen. Ein augenzwinkerndes Spiel darüber, dass inzwischen alles politisch aufgeladen ist.

- `index.html`: ruhige Version
- `pop.html`: knallbunte Version

Reines HTML/CSS/JS, kein Build-Schritt. Lokal starten mit `python3 -m http.server`.

## Dateien

| Datei | Inhalt |
|---|---|
| `dinge.js` | Alle Dinge. Neue nur **hinten** anfügen, sonst passen geteilte Links nicht mehr. |
| `texte.js`, `texte-pop.js` | Texte der beiden Versionen |
| `app.js` | Logik: Wischen, Ergebnis, Teilen/Vergleich |
| `style.css`, `pop.css` | Gestaltung (pop.css liegt über style.css) |
| `bilder/` | Strichzeichnungen als `<id>.png`. Fehlt eins, erscheint ein Platzhalter. |
| `BILDER.md`, `BILDER-AUFTRAG.md` | Prompts und Auftrag für die Bildgenerierung mit Flux.1 |

## Teilen

Die eigene Einordnung steckt im Link (`?v=…`, 2 Bit pro Ding). Wer ihn öffnet, sortiert selbst und sieht am Ende, wie sehr man übereinstimmt. Kein Server nötig.
