# Bilder

Hier kommen die echten Fotos rein. Die Platzhalter im Layout sind so gebaut,
dass sie sich mit einer Zeile CSS ersetzen lassen.

Empfohlene Dateien:

| Datei                | Verwendung                          | Empfehlung        |
|----------------------|-------------------------------------|-------------------|
| `hero.jpg`           | Startseite, großer Header           | 2400 × 1600, quer |
| `flyer-90er.jpg`     | Startseite, Flyer-Karte             | 1200 × 1600, hoch |
| `halle.jpg`          | Startseite, Abschnitt "Willkommen"  | 1600 × 1200       |
| `trecker-treck.jpg`  | Trecker-Treck-Seite, Drohnenfoto    | 2400 × 1200, quer |
| `blau-weisse-nacht.jpg` | Veranstaltungsseite              | 1600 × 1200       |

Einbau: in `assets/css/style.css` bei `.hero__bg` bzw. `.media` die vorbereitete
Zeile einkommentieren, z. B.

```css
.hero__bg {
  background-image: url('../img/hero.jpg');
  background-size: cover;
  background-position: center;
}
```

Vor dem Hochladen bitte auf max. 2400 px Breite skalieren und als JPG
(Qualität ~75 %) oder WebP speichern — das hält die Seite schnell.
