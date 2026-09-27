(() => {
  "use strict";

  const BILD_ORDNER = "bilder/";
  const BILD_ENDUNG = ".png";
  const SPEICHER_SCHLUESSEL = "links-oder-rechts-v1";
  const VERGLEICH_SCHLUESSEL = "links-oder-rechts-vergleich";
  const SICHTBARE_KARTEN = 3;

  const dinge = new Map(window.DINGE.map((d) => [d.id, d]));
  const T = window.TEXTE; // Texte aus texte.js

  // Schnittstelle für eine spätere gemeinsame Statistik.
  // Im Moment passiert hier nichts, später z. B. fetch("/api/stimme", …).
  const Stimmen = {
    abgeben(id, seite) {},
    zuruecknehmen(id) {},
  };

  // ---------- Speicher ----------

  function lesen(schluessel) {
    try {
      return JSON.parse(localStorage.getItem(schluessel));
    } catch {
      return null;
    }
  }

  function schreiben(schluessel, wert) {
    try {
      if (wert == null) localStorage.removeItem(schluessel);
      else localStorage.setItem(schluessel, JSON.stringify(wert));
    } catch {}
  }

  // ---------- Zustand ----------

  let zustand = laden() || neuerDurchgang();

  function neuerDurchgang() {
    return { reihenfolge: mischen([...dinge.keys()]), verlauf: [], antworten: {} };
  }

  function mischen(liste) {
    for (let i = liste.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [liste[i], liste[j]] = [liste[j], liste[i]];
    }
    return liste;
  }

  function laden() {
    const z = lesen(SPEICHER_SCHLUESSEL);
    if (!z || !Array.isArray(z.reihenfolge)) return null;
    // Mit der aktuellen Liste abgleichen: Entferntes raus, Neues hinten dran.
    const bekannt = z.reihenfolge.filter((id) => dinge.has(id));
    const neu = mischen([...dinge.keys()].filter((id) => !bekannt.includes(id)));
    z.reihenfolge = [...bekannt, ...neu];
    z.verlauf = z.verlauf.filter((id) => dinge.has(id));
    return z;
  }

  const speichern = () => schreiben(SPEICHER_SCHLUESSEL, zustand);
  const position = () => zustand.verlauf.length;

  // ---------- Teilen & Vergleich ----------
  // Die Antworten werden kompakt in den Link gepackt: 2 Bit pro Ding,
  // in der Reihenfolge von dinge.js. Neue Dinge deshalb nur hinten anfügen.

  function kodieren(antworten) {
    const bytes = new Uint8Array(Math.ceil(window.DINGE.length / 4));
    window.DINGE.forEach((d, i) => {
      const wert = { links: 1, rechts: 2 }[antworten[d.id]] || 0;
      bytes[i >> 2] |= wert << ((i & 3) * 2);
    });
    return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function dekodieren(text) {
    try {
      const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const antworten = {};
      window.DINGE.forEach((d, i) => {
        const wert = (bytes[i >> 2] >> ((i & 3) * 2)) & 3;
        if (wert === 1) antworten[d.id] = "links";
        if (wert === 2) antworten[d.id] = "rechts";
      });
      return Object.keys(antworten).length ? antworten : null;
    } catch {
      return null;
    }
  }

  let vergleich = lesen(VERGLEICH_SCHLUESSEL);

  // Kommt jemand über einen geteilten Link, wird dessen Einordnung zum Vergleich.
  const linkParameter = new URLSearchParams(location.search).get("v");
  if (linkParameter) {
    const geteilt = dekodieren(linkParameter);
    if (geteilt) {
      vergleich = geteilt;
      schreiben(VERGLEICH_SCHLUESSEL, vergleich);
    }
    history.replaceState(null, "", location.pathname);
  }

  function teilenLink() {
    return `${location.origin}${location.pathname}?v=${kodieren(zustand.antworten)}`;
  }

  // ---------- DOM ----------

  const $ = (id) => document.getElementById(id);
  const stapel = $("stapel");
  const ergebnisAnsicht = $("ergebnis-ansicht");
  const fortschritt = $("fortschritt");
  const knopfLinks = $("knopf-links");
  const knopfRechts = $("knopf-rechts");
  const knopfZurueck = $("zurueck");
  const knopfErgebnis = $("ergebnis");
  const knopfWeiter = $("weiter");
  const knopfLoeschen = $("loeschen");
  const hinweis = $("hinweis");
  const urteil = $("urteil");
  const hinweisText = $("hinweis-text");
  const knopfVergleichBeenden = $("vergleich-beenden");
  const wortLinks = document.querySelector(".wort-links");
  const wortRechts = document.querySelector(".wort-rechts");

  const karten = new Map(); // id → Element
  let ergebnisOffen = false;
  let ersterAufbau = true;

  function erzeugeKarte(id) {
    const ding = dinge.get(id);
    const el = document.createElement("article");
    el.className = "karte";
    el.dataset.id = id;
    el.innerHTML = `
      <div class="bild"></div>
      <h2 class="name"></h2>
      <span class="stempel stempel-links">links</span>
      <span class="stempel stempel-rechts">rechts</span>`;
    el.querySelector(".name").textContent = ding.name;

    const img = new Image();
    img.alt = ding.name;
    img.draggable = false;
    img.onerror = () => img.replaceWith(platzhalter(id));
    img.src = BILD_ORDNER + id + BILD_ENDUNG;
    el.querySelector(".bild").append(img);
    return el;
  }

  function platzhalter(id) {
    const div = document.createElement("div");
    div.className = "platzhalter";
    div.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 7l3 3"/>
      </svg>
      <code></code>`;
    div.querySelector("code").textContent = BILD_ORDNER + id + BILD_ENDUNG;
    return div;
  }

  function ordneStapel() {
    const sichtbar = zustand.reihenfolge.slice(position(), position() + SICHTBARE_KARTEN);

    for (const [id, el] of karten) {
      if (!sichtbar.includes(id)) {
        el.remove();
        karten.delete(id);
      }
    }

    sichtbar.forEach((id, tiefe) => {
      let el = karten.get(id);
      if (!el) {
        el = erzeugeKarte(id);
        karten.set(id, el);
        stapel.append(el);
        // Nachrückende Karten blenden sanft ein, beim ersten Aufbau nicht.
        if (!ersterAufbau) {
          el.classList.add("neu");
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("neu")));
        }
      }
      el.dataset.tiefe = tiefe;
      el.style.zIndex = SICHTBARE_KARTEN - tiefe;
      if (tiefe === 0) el.style.transform = "";
    });
    ersterAufbau = false;

    aktualisiereAnzeige();
  }

  function aktualisiereAnzeige() {
    const gesamt = zustand.reihenfolge.length;
    const fertig = position() >= gesamt;
    const ergebnisSichtbar = fertig || ergebnisOffen;

    fortschritt.textContent = fertig ? `${gesamt} / ${gesamt}` : `${position() + 1} / ${gesamt}`;
    knopfLinks.disabled = knopfRechts.disabled = ergebnisSichtbar;
    knopfZurueck.disabled = position() === 0;
    knopfErgebnis.disabled = fertig;
    knopfErgebnis.setAttribute("aria-pressed", ergebnisSichtbar);
    stapel.hidden = ergebnisSichtbar;
    urteil.hidden = ergebnisSichtbar;
    ergebnisAnsicht.hidden = !ergebnisSichtbar;
    // Unter dem Titel: Einstiegshilfe vor der ersten Karte oder Vergleichshinweis
    const zeigeEinstieg = !vergleich && position() === 0;
    hinweis.hidden = ergebnisSichtbar || (!vergleich && !zeigeEinstieg);
    hinweisText.textContent = vergleich ? T.vergleichHinweis : T.einstieg;
    knopfVergleichBeenden.hidden = !vergleich;
    if (ergebnisSichtbar) zeigeErgebnis(fertig);
  }

  // ---------- Ergebnis ----------

  function zeigeErgebnis(fertig) {
    const gesamt = zustand.reihenfolge.length;
    const eingeordnet = position();

    $("ergebnis-kicker").textContent = fertig ? T.kickerFertig : T.kickerZwischen;
    $("ergebnis-titel").textContent = fertig
      ? T.titelFertig(gesamt)
      : eingeordnet
        ? T.titelZwischen(eingeordnet, gesamt)
        : T.titelLeer;
    $("ergebnis-unterzeile").textContent = fertig
      ? T.unterzeileFertig(gesamt)
      : eingeordnet
        ? T.unterzeileZwischen(eingeordnet, gesamt)
        : "";
    knopfWeiter.hidden = fertig;
    knopfLoeschen.hidden = eingeordnet === 0;
    $("teilen").hidden = eingeordnet === 0;
    $("teilen-status").textContent = "";
    loeschenZuruecksetzen();

    const anzahl = {};
    for (const seite of ["links", "rechts"]) {
      const ids = zustand.verlauf.filter((id) => zustand.antworten[id] === seite);
      anzahl[seite] = ids.length;
      $("anzahl-" + seite).textContent = ids.length;
      $("balken-" + seite).style.flexGrow = ids.length;
      $("liste-" + seite).replaceChildren(...listenEintraege(ids));
    }
    // Leerer Balken, wenn noch nichts da ist
    if (!anzahl.links && !anzahl.rechts) $("balken-links").style.flexGrow = $("balken-rechts").style.flexGrow = 0;

    zeigeVergleich();
  }

  function listenEintraege(ids) {
    if (!ids.length) {
      const li = document.createElement("li");
      li.className = "leer";
      li.textContent = T.leer;
      return [li];
    }
    return ids.map((id) => {
      const li = document.createElement("li");
      li.textContent = dinge.get(id).name;
      return li;
    });
  }

  function zeigeVergleich() {
    const block = $("vergleich");
    const gemeinsam = vergleich
      ? zustand.verlauf.filter((id) => vergleich[id])
      : [];
    block.hidden = !gemeinsam.length;
    if (!gemeinsam.length) return;

    const anders = gemeinsam.filter((id) => vergleich[id] !== zustand.antworten[id]);
    const einig = gemeinsam.length - anders.length;
    $("vergleich-prozent").textContent = `${Math.round((einig / gemeinsam.length) * 100)} %`;
    $("vergleich-text").textContent = anders.length
      ? T.vergleichAnders(einig, gemeinsam.length)
      : T.vergleichEinig(gemeinsam.length);

    $("unterschiede").replaceChildren(
      ...anders.map((id) => {
        const li = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = dinge.get(id).name;
        const wer = document.createElement("span");
        wer.className = "wer";
        const kurz = (s) => `<b class="${s === "links" ? "l" : "r"}">${s}</b>`;
        wer.innerHTML = `${T.du} ${kurz(zustand.antworten[id])} · ${T.gegenueber} ${kurz(vergleich[id])}`;
        li.append(name, wer);
        return li;
      })
    );
  }

  async function teilen() {
    const url = teilenLink();
    const text = T.teilenText;
    const status = $("teilen-status");

    if (navigator.share) {
      try {
        await navigator.share({ title: "links oder rechts", text, url });
        return;
      } catch (e) {
        if (e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      status.textContent = T.kopiert;
    } catch {
      window.prompt(T.linkPrompt, url);
    }
  }

  // Löschen braucht einen zweiten Klick zur Bestätigung.
  let loeschenTimer = null;

  function loeschenZuruecksetzen() {
    clearTimeout(loeschenTimer);
    knopfLoeschen.classList.remove("bestaetigen");
    knopfLoeschen.textContent = T.loeschen;
  }

  function loeschen() {
    if (!knopfLoeschen.classList.contains("bestaetigen")) {
      knopfLoeschen.classList.add("bestaetigen");
      knopfLoeschen.textContent = T.loeschenSicher;
      loeschenTimer = setTimeout(loeschenZuruecksetzen, 4000);
      return;
    }
    loeschenZuruecksetzen();
    zustand = neuerDurchgang();
    speichern();
    ergebnisOffen = false;
    leereUrteil();
    ordneStapel();
  }

  function vergleichBeenden() {
    vergleich = null;
    schreiben(VERGLEICH_SCHLUESSEL, null);
    aktualisiereAnzeige();
  }

  // ---------- Einordnen ----------

  function setzeNeigung(el, a) {
    el.style.setProperty("--a", a);
    document.documentElement.style.setProperty("--p", a);
  }

  const obersteKarte = () => karten.get(zustand.reihenfolge[position()]);

  let beschaeftigt = false;

  function einordnen(seite, el, dy = 0) {
    if (!el || beschaeftigt || ergebnisOffen) return;
    beschaeftigt = true;
    const id = el.dataset.id;
    const richtung = seite === "links" ? -1 : 1;

    karten.delete(id);
    setzeNeigung(el, richtung);
    el.classList.remove("zieht");
    el.classList.add("fliegt");
    const zielX = richtung * (window.innerWidth / 2 + el.offsetWidth * 1.2);
    el.style.transform = `translate(${zielX}px, ${dy + 60}px) rotate(${richtung * 28}deg)`;
    setTimeout(() => el.remove(), 500);

    pulsieren(seite);
    zeigeUrteil(id, seite);
    zustand.antworten[id] = seite;
    zustand.verlauf.push(id);
    speichern();
    Stimmen.abgeben(id, seite);

    ordneStapel();
    setTimeout(() => {
      document.documentElement.style.setProperty("--p", 0);
      beschaeftigt = false;
    }, 260);
  }

  // Egal wie entschieden wurde: Es ist RICHTIG. Mit Begründung.
  function zeigeUrteil(id, seite) {
    const ding = dinge.get(id);
    urteil.dataset.seite = seite;
    $("urteil-was").textContent = `${ding.name} → ${seite}`;
    $("urteil-richtig").textContent = T.richtig;
    $("urteil-grund").textContent = ding[seite];
    urteil.classList.remove("neu");
    void urteil.offsetWidth;
    urteil.classList.add("neu");
  }

  function leereUrteil() {
    delete urteil.dataset.seite;
    urteil.classList.remove("neu");
    for (const teil of ["was", "richtig", "grund"]) $("urteil-" + teil).textContent = "";
  }

  function pulsieren(seite) {
    const wort = seite === "links" ? wortLinks : wortRechts;
    wort.classList.remove("puls");
    void wort.offsetWidth;
    wort.classList.add("puls");
  }

  function zurueck() {
    if (beschaeftigt || position() === 0) return;
    ergebnisOffen = false;
    leereUrteil();
    const id = zustand.verlauf.pop();
    const seite = zustand.antworten[id];
    delete zustand.antworten[id];
    speichern();
    Stimmen.zuruecknehmen(id);

    // Karte kommt von der Seite zurück, zu der sie geworfen wurde.
    const el = erzeugeKarte(id);
    const richtung = seite === "links" ? -1 : 1;
    el.classList.add("zieht");
    el.dataset.tiefe = 0;
    el.style.zIndex = SICHTBARE_KARTEN + 1;
    el.style.transform = `translate(${richtung * window.innerWidth * 0.7}px, 40px) rotate(${richtung * 20}deg)`;
    stapel.append(el);
    karten.set(id, el);
    void el.offsetWidth;
    el.classList.remove("zieht");
    ordneStapel();
  }

  // ---------- Ziehen ----------

  let zug = null;

  stapel.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".karte");
    if (!el || el.dataset.tiefe !== "0" || beschaeftigt) return;
    el.setPointerCapture(e.pointerId);
    el.classList.add("zieht");
    zug = { el, id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, proben: [] };
  });

  stapel.addEventListener("pointermove", (e) => {
    if (!zug || e.pointerId !== zug.id) return;
    zug.dx = e.clientX - zug.x0;
    zug.dy = e.clientY - zug.y0;
    zug.proben.push({ t: e.timeStamp, x: e.clientX });
    if (zug.proben.length > 6) zug.proben.shift();

    const breite = zug.el.offsetWidth;
    zug.el.style.transform = `translate(${zug.dx}px, ${zug.dy * 0.4}px) rotate(${(zug.dx / breite) * 14}deg)`;
    setzeNeigung(zug.el, Math.max(-1, Math.min(1, zug.dx / (breite * 0.55))));
  });

  function zugEnde(e) {
    if (!zug || e.pointerId !== zug.id) return;
    const { el, dx, dy, proben } = zug;
    zug = null;

    let vx = 0;
    if (proben.length > 1) {
      const a = proben[0], b = proben[proben.length - 1];
      if (b.t - a.t > 0 && e.timeStamp - b.t < 100) vx = (b.x - a.x) / (b.t - a.t);
    }

    const weitGenug = Math.abs(dx) > el.offsetWidth * 0.4;
    const schwung = Math.abs(vx) > 0.5 && Math.sign(vx) === Math.sign(dx) && Math.abs(dx) > 20;

    if (weitGenug || schwung) {
      einordnen(dx < 0 ? "links" : "rechts", el, dy * 0.4);
    } else {
      el.classList.remove("zieht");
      el.style.transform = "";
      setzeNeigung(el, 0);
    }
  }

  stapel.addEventListener("pointerup", zugEnde);
  stapel.addEventListener("pointercancel", zugEnde);

  // ---------- Knöpfe & Tastatur ----------

  function ergebnisUmschalten(offen = !ergebnisOffen) {
    ergebnisOffen = offen;
    aktualisiereAnzeige();
    if (offen) ergebnisAnsicht.scrollTop = 0;
  }

  knopfLinks.addEventListener("click", () => einordnen("links", obersteKarte()));
  knopfRechts.addEventListener("click", () => einordnen("rechts", obersteKarte()));
  knopfZurueck.addEventListener("click", zurueck);
  knopfErgebnis.addEventListener("click", () => ergebnisUmschalten());
  knopfWeiter.addEventListener("click", () => ergebnisUmschalten(false));
  knopfLoeschen.addEventListener("click", loeschen);
  $("teilen-knopf").addEventListener("click", teilen);
  $("vergleich-beenden").addEventListener("click", vergleichBeenden);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") einordnen("links", obersteKarte());
    else if (e.key === "ArrowRight") einordnen("rechts", obersteKarte());
    else if (e.key === "Escape" && ergebnisOffen) ergebnisUmschalten(false);
    else if (e.key === "Backspace" || (e.key === "z" && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      zurueck();
    }
  });

  ordneStapel();
})();
