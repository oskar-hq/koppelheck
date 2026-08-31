# Wiesenhalle Koppelheck — Website-Relaunch (Entwurf)

Ein kompletter Neuentwurf der Website für die **Wiesenhalle Koppelheck** in Niesgrau —
gebaut als schnelle, eigenständige Website ohne Baukasten-Abhängigkeit.

**Ziel:** die Halle so zeigen, wie sich die Nächte dort anfühlen — laut, nah, echt —
und dabei die Infos, die Gäste wirklich suchen (Termin, Einlass, Preis, Muttizettel,
Anfahrt), in maximal einem Klick erreichbar machen.

---

## Was neu ist

| | Bisher | Neu |
|---|---|---|
| **Auftritt** | heller Standard-Baukasten, wirkt wie jede zweite Vereinsseite | dunkles Nacht-Design mit eigener Handschrift, das zur Location passt |
| **Startseite** | Termin-Kacheln ohne Hierarchie | großer Hero mit dem nächsten Termin, Live-Countdown und allen Eckdaten sofort sichtbar |
| **Termine** | Aufklapp-Liste, Details versteckt | eigene Seite, jeder Termin als Karte mit Preisen, Line-up und Reservierung |
| **Trecker Treck** | eine sehr lange Textseite + 5 Unterseiten | eine strukturierte Seite mit Sprungmarken, Zeitstrahl, Klassen-Übersicht und allen Downloads an einem Ort |
| **Mobil** | Desktop-Layout verkleinert | von Grund auf für das Handy gebaut — dort schaut fast jeder Gast nach |
| **Tempo** | Baukasten-Ballast | reines HTML/CSS/JS, kein Framework, lädt praktisch sofort |
| **Karte** | Google Maps (einwilligungspflichtig) | OpenStreetMap — datensparsam, kein Cookie-Banner nötig |

Inhaltlich ist alles von der bestehenden Seite übernommen: Termine, Preise,
Trecker-Treck-Klassen, Human Pulling, Muttizettel, Impressum.

---

## Aufbau

```
index.html            Startseite — nächster Termin, Countdown, Saisonübersicht
veranstaltungen.html  Alle vier Termine 2026 mit Details und Preisen
trecker-treck.html    Trecker Treck 2026, Klassen, Human Pulling, Anmeldung
muttizettel.html      Muttizettel-Download + Erklärung
kontakt.html          Kontaktformular, Adresse, Anfahrt
impressum.html
datenschutz.html
assets/css/style.css  Design-System (Farben, Typo, Komponenten)
assets/js/main.js     Navigation, Countdown, Scroll-Effekte, Formular
assets/pdf/           Formulare (aktuell Platzhalter)
assets/img/           Fotos (siehe assets/img/README.md)
```

Keine Build-Schritte, keine Abhängigkeiten: `index.html` im Browser öffnen genügt.

---

## Vor dem Live-Gang noch zu erledigen

1. **Fotos einsetzen** — überall, wo aktuell ein Platzhalter steht.
   Anleitung: [`assets/img/README.md`](assets/img/README.md)
2. **PDFs austauschen** — die Original-Formulare nach `assets/pdf/` legen,
   Dateinamen beibehalten, dann stimmen alle Links sofort.
3. **Social-Links eintragen** — die echten Instagram- und Facebook-URLs
   (aktuell Platzhalter, im Quelltext mit `TODO` markiert).
4. **Kontaktformular anbinden** — läuft derzeit über einen sauberen
   `mailto:`-Fallback. Für echten Versand einen Formular-Dienst
   (z. B. Formspree, Netlify Forms) in `assets/js/main.js` eintragen.
5. **Datenschutzerklärung** — die bestehende Fassung übernehmen bzw. an die
   tatsächlich genutzten Dienste anpassen und rechtlich prüfen lassen.
6. Optional: Google Fonts lokal ausliefern, dann geht gar keine Verbindung
   mehr an externe Server.

---

## Hosting auf GitHub Pages

Für die Präsentation läuft die Seite direkt über GitHub Pages — kein Server nötig.

**Variante A — direkt aus dem Branch (am einfachsten):**
Repository → **Settings → Pages** → *Source:* „Deploy from a branch" →
Branch `claude/party-website-redesign-1vvkyo`, Ordner `/ (root)` → **Save**.
Nach ein bis zwei Minuten ist die Seite unter
`https://<organisation>.github.io/koppelheck/` erreichbar.

**Variante B — über GitHub Actions:**
Repository → **Settings → Pages** → *Source:* „GitHub Actions".
Der Workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) läuft dann
bei jedem Push auf diesen Branch automatisch und lässt sich zusätzlich unter
*Actions → Deploy to GitHub Pages → Run workflow* von Hand starten.

Die Datei `.nojekyll` liegt bereits im Repository, damit GitHub die Dateien
unverändert ausliefert.

Später ist der Umzug auf die eigene Domain `wiesenhalle-koppelheck.de` jederzeit
möglich — alle Pfade sind relativ, es muss nichts umgeschrieben werden.
