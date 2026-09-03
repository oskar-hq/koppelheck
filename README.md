# Wiesenhalle Koppelheck — Website-Relaunch (Entwurf)

Ein Neuentwurf der Website für die **Wiesenhalle Koppelheck** in Niesgrau —
eigenständig, ohne Baukasten, ohne Framework.

**Gestalterische Linie:** ruhiger dunkler Grund, eine Signalfarbe pro Seite,
harte Kanten, große Typo. Keine Verläufe, kein Glow, keine runden Ecken.

Dahinter stehen drei Regeln, an die sich jede Seite hält:

1. **Farbe heißt klickbar.** Die Signalfarbe erscheint nur auf Buttons, Links
   und der aktiven Navigation. Alles andere ist Grauwert. Wer Farbe sieht,
   weiß: da geht was.
2. **Eine Signalfarbe pro Seite.** Sie steckt in `--acc` und wird über eine
   Klasse am `<body>` getauscht — Magenta überall, Grün auf der
   Trecker-Treck-Seite. Nie beide gleichzeitig.
3. **Hierarchie über Größe und Luft**, nicht über Effekte. Pro Abschnitt gibt
   es genau eine Sache, die laut ist.

Das Magenta stammt vom Original-Flyer, ist gegenüber dem ersten Entwurf aber
entsättigt (`#E4609F` statt `#FF2ECC`) und der Grund ist kein reines Schwarz
mehr (`#111116`) — das Paar knallte vorher so hart, dass das Auge keinen
Halt fand.

Als Überschriftenschrift läuft **Archivo Black** — sie kommt dem
Original-Logo am nächsten und bleibt den beiden großen Ebenen `h1`/`h2`
vorbehalten. Ab `h3` läuft **Inter**, sonst schreit jede Ebene gleich laut.
Für Labels und Zahlen **Space Mono**.

---

## Aufbau der Startseite

```
Hero          Original-Logo + Slogan "…deine Partylocation!", Scheinwerfer dahinter
Nächster      Die einzige Magenta-Fläche der Seite: Datum, Name, Eckdaten, Countdown
Schnellzugriff Termine · Muttizettel · Anmeldung · Anfahrt · Anrufen
Weitere       Die drei folgenden Termine als leichte Liste
Trecker Treck Kurzfassung mit Foto, Rest auf eigener Seite
Gut zu wissen Alter, Einlass, Anfahrt, Kontakt
```

## Die eine Bewegung

**Scheinwerfer-Traverse (three.js).** Oben auf der Startseite hängen Movingheads
unter einer Traverse und leuchten im 45°-Winkel auf den Boden. Scrollt man nach
unten, fahren sie auf 90° hoch und zeigen nach vorne — der Lichtkegel
verschwindet, übrig bleibt die leuchtende LED. Bewusst leise gehalten: sechs
Scheinwerfer, schwache Kegel — Atmosphäre, kein Wettbewerb mit der Überschrift.
Ohne WebGL, bei abgeschalteten Animationen oder wenn die Bibliothek nicht lädt,
zeigt die Seite eine Traverse aus reinem CSS und funktioniert vollständig.

Sonst bewegt sich nichts. Scroll-Fortschrittsbalken, LED-Trenner und
Einblend-Animationen sind raus — sie haben Aufmerksamkeit gekostet, ohne etwas
zu sagen.

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

## Anmeldung: eine Stelle, ein Knopf

Auf der Trecker-Treck-Seite gab es zwei Wege zur Anmeldung — Human Pulling hatte
seinen eigenen Download-Knopf, alle anderen Klassen lagen weiter unten in einer
Liste. Jetzt gilt: **`#anmeldung` ist die einzige Anmeldestelle.** Dort stehen
alle vier Formulare in derselben Zeilenform, Human Pulling eingeschlossen; noch
fehlende Formulare sind sichtbar als „Folgt" gekennzeichnet statt nur blass.
Jeder Abschnitt, in dem man sich anmelden kann, endet mit demselben Knopf mit
derselben Beschriftung: **Zur Anmeldung ↓**. Eine Sprungnavigation unter dem
Seitenkopf zeigt außerdem gleich, was auf der Seite überhaupt steht.

---

## Aufbau

```
index.html            Start — Hero, alle Termine, Trecker Treck, Infos
trecker-treck.html    Trecker Treck 2026, Klassen, Human Pulling, Anmeldung
muttizettel.html      Download + Erklärung
kontakt.html          Formular, Adresse, Anfahrt
impressum.html
datenschutz.html
assets/css/style.css  Design-System
assets/js/main.js     Navigation, LED-Leiste, Countdown, Formular
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
6. Optional: Google Fonts und three.js lokal ausliefern, dann geht keine
   Verbindung mehr an externe Server.

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
