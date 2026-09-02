# Wiesenhalle Koppelheck — Website-Relaunch (Entwurf)

Ein Neuentwurf der Website für die **Wiesenhalle Koppelheck** in Niesgrau —
eigenständig, ohne Baukasten, ohne Framework.

**Gestalterische Linie:** schwarz, eine einzige Signalfarbe, harte Kanten, große
Typo bis an den Rand. Keine Verläufe, keine Weichzeichner, keine runden Ecken —
das sind die Merkmale, an denen Standard-Layouts sofort erkennbar sind. Die
Signalfarbe ist das Magenta vom Original-Flyer. Der Trecker Treck bekommt als
Tagesveranstaltung ein eigenes Grün.

---

## Die zwei Bewegungen

**Scheinwerfer-Traverse (three.js).** Oben auf der Startseite hängen Movingheads
unter einer Traverse und leuchten im 45°-Winkel auf den Boden. Scrollt man nach
unten, fahren sie auf 90° hoch und zeigen nach vorne — der Lichtkegel
verschwindet, übrig bleibt die leuchtende LED. Gesteuert wird das rein über die
Scrollposition. Ohne WebGL, bei abgeschalteten Animationen (`prefers-reduced-motion`)
oder wenn die Bibliothek nicht lädt, zeigt die Seite eine Traverse aus reinem CSS
und funktioniert vollständig.

**LED-Leiste.** Am linken Rand läuft eine Diodenleiste durch die ganze Seite und
füllt sich mit dem Scrollfortschritt. Zwischen den Sektionen sitzen waagerechte
LED-Bars, die beim Hereinscrollen von links nach rechts zünden. Beide werden per
JavaScript aus einzelnen Segmenten aufgebaut, damit das Markup lesbar bleibt.

---

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
assets/css/style.css  Design-System
assets/js/main.js     Navigation, LED-Leiste, Countdown, Formular
assets/js/rig.js      Scheinwerfer-Traverse (three.js)
assets/pdf/           Formulare (aktuell Platzhalter)
assets/img/           Fotos (siehe assets/img/README.md)
```

Keine Build-Schritte: `index.html` im Browser öffnen genügt.

---

## Vor dem Live-Gang noch zu erledigen

1. **Fotos einsetzen** — überall, wo ein Platzhalter steht.
   Anleitung: [`assets/img/README.md`](assets/img/README.md)
2. **PDFs austauschen** — Original-Formulare nach `assets/pdf/` legen,
   Dateinamen beibehalten, dann stimmen alle Links sofort.
3. **Social-Links eintragen** — echte Instagram- und Facebook-URLs
   (aktuell Platzhalter).
4. **Kontaktformular anbinden** — läuft derzeit über einen `mailto:`-Fallback.
   Für echten Versand einen Formular-Dienst in `assets/js/main.js` eintragen.
5. **Datenschutzerklärung** — bestehende Fassung übernehmen und prüfen lassen.
6. Optional: Google Fonts und three.js lokal ausliefern, dann geht keine
   Verbindung mehr an externe Server.

---

## Hosting auf GitHub Pages

Für die Präsentation läuft die Seite direkt über GitHub Pages — kein Server nötig.
Der Deploy-Workflow liegt bereits im Repository; **Pages muss aber einmalig von Hand
eingeschaltet werden**, weil der Automatik-Token von GitHub Actions eine Pages-Site
nicht selbst anlegen darf (`Resource not accessible by integration`).

**Einmalig einrichten — dauert eine Minute:**

1. Im Repository auf **Settings → Pages** gehen
   ([direkt hier](https://github.com/oskar-hq/koppelheck/settings/pages))
2. Unter *Source* **„GitHub Actions"** auswählen
3. Unter **Actions → Deploy to GitHub Pages → Run workflow** einmal starten
   (Branch `claude/party-website-redesign-1vvkyo` auswählen)

Danach ist die Seite erreichbar unter
**https://oskar-hq.github.io/koppelheck/** — und jeder weitere Push auf diesen
Branch aktualisiert sie automatisch.

**Alternative ohne Actions:** unter *Source* stattdessen „Deploy from a branch"
wählen, Branch `claude/party-website-redesign-1vvkyo`, Ordner `/ (root)`.
Funktioniert genauso; dann sollte der Workflow
[`.github/workflows/pages.yml`](.github/workflows/pages.yml) deaktiviert werden,
damit er nicht bei jedem Push rot wird.

Die Datei `.nojekyll` liegt bereits im Repository, damit GitHub die Dateien
unverändert ausliefert.

Später ist der Umzug auf die eigene Domain `wiesenhalle-koppelheck.de` jederzeit
möglich — alle Pfade sind relativ, es muss nichts umgeschrieben werden.
