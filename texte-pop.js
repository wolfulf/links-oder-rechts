// Texte der knallbunten Version (pop.html).
// Feste Texte im Seitenaufbau stehen direkt in pop.html.
window.TEXTE = {
  richtig: "RICHTIG!",

  einstieg: "Karte packen. Wegpfeffern. Bloß nicht nachdenken!",
  vergleichHinweis: "Du wurdest herausgefordert! Mal sehen, ob ihr matcht.",

  kickerFertig: "Tadaaa!",
  kickerZwischen: "Boxenstopp",
  titelFertig: () => "100 % RECHT. IMMER.",
  unterzeileFertig: (gesamt) => `${gesamt} von ${gesamt}. Null Fehler. Du bist quasi ein politisches Orakel. Unfassbar stark!`,
  titelZwischen: (n) => `${n} von ${n} richtig!`,
  unterzeileZwischen: (n, gesamt) => `Makellos! Noch ${gesamt - n} Karten, dann ist es amtlich.`,
  titelLeer: "Null Karten? Na komm schon!",
  leer: "tote Hose",

  vergleichAnders: (einig, n) => `Ihr habt BEIDE zu 100 % recht. Trotzdem nur ${einig} von ${n} Treffern. Hier habt ihr beide recht:`,
  vergleichEinig: (n) => `${n} von ${n}! Zwei Genies, ein Gedanke.`,
  du: "du",
  gegenueber: "die anderen",

  teilenText: "Ich hab zu 100 % recht. Bei ALLEM. Lastenrad? Schnitzel? Gartenzwerg? Links oder rechts – beweis mir, dass du auch immer recht hast.",
  kopiert: "Zack, kopiert! Einfügen und zurücklehnen.",
  linkPrompt: "Hier, schnapp dir den Link:",

  loeschen: "Alles in die Tonne",
  loeschenSicher: "Echt jetzt? Nochmal!",
};
