# Wiesenhalle Koppelheck — Website-Relaunch (Entwurf)

Ein Neuentwurf der Website für die **Wiesenhalle Koppelheck** in Niesgrau —
eigenständig, ohne Baukasten, ohne Framework.

**Gestalterische Linie (Premium-Relaunch, Mobile First):** tiefes Schwarz, eine
einzige Signalfarbe, feine Haarlinien, weiche Radien und Licht statt Fläche —
Magenta-Schleier im Hero, leichtes Filmkorn, Glasflächen für Kopfzeile und Dock.
Die Signalfarbe ist das Magenta vom Original-Flyer; die Trecker-Treck-Seite
schaltet über `body.theme-lime` komplett auf Grün um.

**Schriften (lokal in `assets/fonts/`, keine Verbindung zu Google):**
**Archivo** (variabel, breit geschnitten, 800–900) für Überschriften — kommt dem
Original-Logo am nächsten. **Inter** für Fließtext, **Geist Mono** für Labels,
Uhrzeiten und Zahlen. Alle drei stehen unter der SIL Open Font License.

**Auf dem Handy** sitzt die Navigation als Tab-Dock unten im Daumenbereich
(mit Safe-Area für iPhones), oben nur Logo und „Anrufen". Ab 900 px wandert die
Navigation als Pillen-Menü in die Kopfzeile.

---

## Aufbau der Startseite

```
Hero          Slogan "…deine Partylocation!", Scheinwerfer-Traverse dahinter
Ticket        Nächste Party als Eintrittskarte: Datum, Eckdaten, Countdown, Aktionen
Schnellzugriff Muttizettel · Anfahrt · Anrufen · Anmeldung
Termine       Alle Termine als Karten, der nächste ist hervorgehoben
Trecker Treck Teaser-Karte mit Foto und Eckdaten
Gut zu wissen Alter, Einlass, Anfahrt, Fragen
```

### Termine pflegen

Termine stehen nur an **einer** Stelle: als `<article class="ev">` in
`index.html`. Das Ticket oben befüllt sich daraus selbst.

| Attribut          | Wofür                                              |
|-------------------|----------------------------------------------------|
| `data-start`      | Beginn mit Zeitzone, z. B. `2026-10-03T20:00:00+02:00` |
| `data-when`       | Zeile über dem Namen im Ticket, z. B. `Samstag · ab 20:00` |
| `data-price`      | Eintritt im Ticket (optional)                      |
| `data-highlight`  | Zweite Eckdate im Ticket, `Label|Wert` (optional)  |
| `data-action`     | an einem Link im Termin: wird zweiter Ticket-Button |
| `ev--away`        | Klasse für Termine in fremder Halle (Gastspiel)    |

Vergangene Termine (7 Stunden nach Beginn) blendet das Skript automatisch aus,
während einer Party zeigt das Ticket „Läuft gerade". Ist kein Termin mehr übrig,
steht dort „Neue Termine folgen".

## Die zwei Bewegungen

**Scheinwerfer-Traverse (three.js).** Oben auf der Startseite hängen Movingheads
unter einer Traverse und leuchten im 45°-Winkel auf den Boden. Scrollt man nach
unten, fahren sie auf 90° hoch und zeigen nach vorne — der Lichtkegel
verschwindet, übrig bleibt die leuchtende LED. Ohne WebGL, bei abgeschalteten
Animationen oder wenn die Bibliothek nicht lädt, zeigt die Seite eine Traverse
aus reinem CSS und funktioniert vollständig.

**LED.** Eine 2 px hohe Leiste am oberen Rand füllt sich mit dem
Scrollfortschritt. Auf den Unterseiten zündet unter dem Seitenkopf eine Reihe
Leuchtdioden von links nach rechts.

## Was aufgeräumt wurde

| | Vorher | Jetzt |
|---|---|---|
| **Seiten** | 7 | 6 — die Terminseite ist in die Startseite aufgegangen |
| **Navigation** | 5 Punkte | 4 Punkte |
| **Startseite** | 8 Abschnitte | 5 Abschnitte |
| **Termine** | eigene Seite, Details hinter „Mehr" | alle vier Termine mit allen Details direkt auf der Startseite |
| **Trecker Treck** | 1 Textseite + 5 Unterseiten | eine Seite mit Sprungmarken |
| **Seitenlänge Start** | ~6300 px | ~4500 px bei mehr sichtbarem Inhalt |

Nichts musste dafür weggelassen werden: Termine, Preise, Klassen, Human Pulling,
Muttizettel und Impressum sind vollständig übernommen. Aus Emoji-Listen sind
Spec-Listen mit Mono-Labels geworden — schneller zu scannen und weniger beliebig.

---

## Aufbau

```
index.html            Start — Hero, alle Termine, Trecker Treck, Infos
trecker-treck.html    Trecker Treck 2026, Klassen, Human Pulling, Anmeldung
muttizettel.html      Download + Erklärung
kontakt.html          Formular, Adresse, Anfahrt
impressum.html
datenschutz.html
assets/css/style.css  Design-System (Mobile First)
assets/fonts/         Archivo, Inter, Geist Mono (woff2, lokal)
assets/js/main.js     Kopfzeile, LED-Leiste, Termine/Ticket, Countdown, Formular
assets/js/rig.js      Scheinwerfer-Traverse (three.js)
assets/pdf/           Formulare (aktuell Platzhalter)
assets/img/           Fotos (siehe assets/img/README.md)
```

Keine Build-Schritte: `index.html` im Browser öffnen genügt.

---

## Vor dem Live-Gang noch zu erledigen

1. **Fotos einsetzen** — bisher gibt es nur die Luftaufnahme vom
   Trecker-Treck-Gelände (640 × 400 px, für größere Flächen zu klein).
   Es fehlen Bilder aus der Halle und von den Partys.
   Anleitung: [`assets/img/README.md`](assets/img/README.md)
2. **Zwei Formulare fehlen noch** — Standard Klasse und Oldtimer Klasse.
   Sie stehen auf der Trecker-Treck-Seite als „Bald" und sind nicht verlinkt.
   Sobald sie da sind: als `anmeldung-standard-klasse.pdf` bzw.
   `anmeldung-oldtimer.pdf` nach `assets/pdf/` legen und die beiden
   `.dl--soon`-Einträge in `trecker-treck.html` zu Links machen.
   Muttizettel, Super Standard Klasse und Human Pulling sind bereits eingebaut.
3. **Social-Links eintragen** — echte Instagram- und Facebook-URLs
   (aktuell Platzhalter).
4. **Kontaktformular anbinden** — läuft derzeit über einen `mailto:`-Fallback.
   Für echten Versand einen Formular-Dienst in `assets/js/main.js` eintragen.
5. **Datenschutzerklärung** — bestehende Fassung übernehmen und prüfen lassen.

Die Koordinaten der Halle (54.749462, 9.838642) stecken an drei Stellen:
in der eingebetteten Karte, in den Links zu Google Maps und Apple Karten
(beide in `kontakt.html`) und in den strukturierten Daten in `index.html`.
6. Optional: three.js lokal ausliefern, dann geht keine Verbindung mehr an
   externe Server (die Schriften liegen bereits lokal).
7. **Trecker Treck 2027** — der Termin 2026 ist vorbei; die Seite zeigt
   automatisch „Rückblick". Sobald das neue Datum feststeht, Texte und die
   `data-past-after`-Attribute (Startseite und `trecker-treck.html`) anpassen.

---

## Hosting auf GitHub Pages

**Ein einziger Schritt, kein Workflow nötig:**

1. Repository → **Settings → Pages**
   ([direkt hier](https://github.com/oskar-hq/koppelheck/settings/pages))
2. *Source:* **„Deploy from a branch"**
3. Branch: `claude/party-website-redesign-1vvkyo`, Ordner: **`/ (root)`** → **Save**

Nach ein bis zwei Minuten läuft die Seite unter
**https://oskar-hq.github.io/koppelheck/** und aktualisiert sich bei jedem Push
auf diesen Branch von selbst.

### Warum kein GitHub-Actions-Workflow

Der ursprüngliche Workflow ist zweimal an `actions/configure-pages` gescheitert:
`Resource not accessible by integration`. Der Automatik-Token von GitHub Actions
darf eine Pages-Site nicht selbst anlegen, und solange Pages nicht schon
eingerichtet ist, bricht der Workflow ab und verschickt Fehlermails. Für eine
Seite ganz ohne Build-Schritt bringt er ohnehin nichts — deshalb ist er
entfernt. Die Datei `.nojekyll` sorgt dafür, dass GitHub die Dateien unverändert
ausliefert.

Später ist der Umzug auf die eigene Domain `wiesenhalle-koppelheck.de` jederzeit
möglich — alle Pfade sind relativ, es muss nichts umgeschrieben werden.
