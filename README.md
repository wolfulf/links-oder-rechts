# links oder rechts

Lastenrad, Schnitzel, Gartenzwerg: Karten nach links oder rechts wischen und damit dem politischen Spektrum zuordnen. Ein augenzwinkerndes Spiel darüber, dass inzwischen alles politisch aufgeladen ist.

Knallbunt, frech, und du hast immer recht: Nach jedem Wischen gibt's ein „RICHTIG!“ mit Begründung, egal in welche Richtung.

Reines HTML/CSS/JS, kein Build-Schritt. Lokal starten mit `python3 -m http.server`.

Nach Änderungen an CSS/JS die Versionsnummer `?v=` in `index.html` hochzählen, damit Browser nicht die alte Fassung aus dem Cache zeigen.

## Dateien

| Datei | Inhalt |
|---|---|
| `dinge.js` | Alle Dinge samt Begründungen für links und rechts. Neue nur **hinten** anfügen, sonst passen geteilte Links nicht mehr. |
| `texte.js` | Alle Texte, die die Logik anzeigt |
| `app.js` | Logik: Wischen, Ergebnis, Teilen/Vergleich |
| `style.css` | Gestaltung |
| `pop.html` | Weiterleitung für alte Links auf die frühere Pop-Version |
| `bilder/` | Strichzeichnungen als `<id>.png`. Fehlt eins, erscheint ein Platzhalter. |
| `BILDER.md`, `BILDER-AUFTRAG.md` | Prompts und Auftrag für die Bildgenerierung mit Flux.1 |

## Teilen

Die eigene Einordnung steckt im Link (`?v=…`, 2 Bit pro Ding). Wer ihn öffnet, sortiert selbst und sieht am Ende, wie sehr man übereinstimmt. Kein Server nötig.
