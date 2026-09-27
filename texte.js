// Texte der normalen Version (index.html).
// Feste Texte im Seitenaufbau stehen direkt in index.html.
window.TEXTE = {
  richtig: "Richtig!",

  einstieg: "Schnapp dir die Karte und wirf sie dahin, wo sie hingehört.",
  vergleichHinweis: "Jemand will wissen, wie du tickst. Am Ende gibt's den Abgleich.",

  kickerFertig: "Endstand",
  kickerZwischen: "Zwischenstand",
  titelFertig: () => "Du hast zu 100 % recht.",
  unterzeileFertig: (gesamt) => `${gesamt} von ${gesamt} Einschätzungen korrekt. Das schafft sonst kaum jemand. Großartig.`,
  titelZwischen: (n) => `${n} von ${n} richtig.`,
  unterzeileZwischen: (n, gesamt) => `Bisher fehlerfrei. ${gesamt - n} Dinge warten noch auf deine Expertise.`,
  titelLeer: "Noch keine einzige Karte. Trau dich!",
  leer: "gähnende Leere",

  vergleichAnders: (einig, n) => `Ihr habt beide zu 100 % recht. Einig seid ihr euch trotzdem nur bei ${einig} von ${n} Dingen. Hier habt ihr beide recht:`,
  vergleichEinig: (n) => `${n} von ${n} gleich. Zwei Menschen, die immer recht haben. Verdächtig harmonisch.`,
  du: "du",
  gegenueber: "Gegenüber",

  teilenText: "Ich habe zu 100 % recht. Bei allem. Lastenrad, Schnitzel, Gartenzwerg: links oder rechts? Mal sehen, ob du auch immer recht hast.",
  kopiert: "Kopiert! Ab damit in den Gruppenchat.",
  linkPrompt: "Link zum Kopieren:",

  loeschen: "Alles auf Anfang",
  loeschenSicher: "Sicher? Nochmal tippen",
};
