# Auftrag: Bilder für „links oder rechts“ erzeugen

Du erzeugst mit Flux.1 lokal eine Serie von Strichzeichnungen für eine Webseite.

## Quelle

Alle Motive und fertigen Prompts stehen in der Datei **`BILDER.md`**. Sie liegt im selben Ordner wie dieser Auftrag.

Lies die Datei vollständig. Maßgeblich ist der Abschnitt **„Alle Prompts zum Kopieren“**: Jeder Eintrag besteht aus einem Dateinamen (fett, z. B. **lastenrad.png**) und dem Prompt im Codeblock darunter.

## Ziel

Lege neben `BILDER.md` einen Ordner **`bilder/`** an, falls es ihn noch nicht gibt, und speichere jedes Bild dort:

`bilder/<dateiname>`

Der Dateiname muss **exakt** dem aus BILDER.md entsprechen (Kleinbuchstaben, Bindestriche, Endung `.png`). Die Webseite findet die Bilder nur über diesen Namen.

## Vorgaben

- Prompt **wörtlich** übernehmen, nichts ergänzen oder umformulieren.
- Format: PNG, 1024 × 1024 px.
- Für **alle** Bilder denselben Seed verwenden, damit der Strich einheitlich bleibt.
- Guidance ca. 3, Steps ca. 25 (bei Flux.1 schnell: 4 Steps, Guidance entfällt).
- Hintergrund muss reinweiß sein, schwarze Linien, keine Farbe, keine Schattierung, kein Text.
- Bereits vorhandene Dateien im Ordner `bilder/` **nicht überschreiben**, sondern überspringen. So kann der Auftrag jederzeit fortgesetzt werden.
- Arbeite die Liste der Reihe nach ab.

## Qualitätsprüfung

Schau dir jedes Ergebnis kurz an. Wenn ein Bild eindeutig misslungen ist (Farbe, grauer oder farbiger Hintergrund, Text im Bild, Motiv nicht erkennbar), erzeuge es **einmal** neu mit einem anderen Seed. Klappt es dann immer noch nicht, lass es stehen und notiere es.

## Abschluss

Gib am Ende eine kurze Liste aus:
1. wie viele Bilder neu erzeugt wurden,
2. welche übersprungen wurden, weil sie schon da waren,
3. welche Bilder fraglich sind oder fehlen, jeweils mit einem Satz, was nicht stimmt.
