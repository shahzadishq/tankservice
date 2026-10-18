# Paul Demand Tankservice – Homepage (Staging)

Statische, responsive deutschsprachige Homepage für **Paul Demand Tankservice**
(Heizöltank-Ausbau, Tankdemontage und fachgerechte Entsorgung).

> **Hinweis:** Dies ist eine **Staging-Vorschau** zur Abstimmung mit dem Kunden,
> noch nicht die finale Produktivversion. Es wurde ausschließlich die Startseite
> umgesetzt (keine Unterseiten, kein Impressum, keine Datenschutzerklärung – siehe *Scope*).

## Stack

Bewusst schlank gehalten, da nur eine Startseite gefordert ist – kein Build-Schritt,
voll portabel und leicht zu übergeben:

- **HTML5** – semantisch, barrierearm (`index.html`)
- **CSS3** – eigenes Design-System mit Design-Tokens (`css/styles.css`)
- **Vanilla JavaScript** – Mobile-Navigation, Sticky-Header, Smooth-Scroll,
  aktive Navigationshervorhebung, Scroll-Reveal, Formular-Validierung (`js/main.js`)
- **Google Fonts** – Manrope (Überschriften) & Inter (Fließtext, Buttons, Navigation)

Keine Frameworks, keine Abhängigkeiten, keine Tracker.

## Projektstruktur

```
.
├── index.html                 # komplette Startseite
├── css/styles.css             # Design-System & Styles
├── js/main.js                 # Interaktionen
├── assets/
│   ├── favicon.svg            # Favicon (Marke)
│   ├── logo-icon.svg          # Logo-Signet (hell/dunkel) – Haus + Tank + Blatt
│   ├── logo-icon-light.svg    # Logo-Signet für dunkle Flächen (Footer)
│   └── images/                # optimierte Projektfotos (vom Kunden)
└── README.md
```

## Lokale Vorschau

Einfach `index.html` im Browser öffnen – oder ein kleiner Server:

```bash
npx serve .        # oder: python3 -m http.server 8000
```

## Markenvorgaben (umgesetzt)

| Element        | Wert |
|----------------|------|
| Primärgrün     | `#4A703A` |
| Anthrazit      | `#2E3230` |
| Hintergründe   | Weiß `#FFFFFF`, Hellgrau `#F5F6F3` |
| Überschriften  | Manrope 600–700 |
| Fließtext      | Inter 400–500 |
| Buttons / Navigation | Inter 500–600 |

Das Logo-Signet (Heizöltank, Haus-/Dach-Symbol, Blatt) wurde als **skalierbares,
scharfes SVG** in den exakten Markenfarben neu umgesetzt. Der Wortmarken-Text
nutzt die Markenschrift Manrope/Inter.

## Abschnitte der Startseite

Header (Sticky) · Hero · Leistungen (3 Karten) · Über uns · Warum wir (4 Vorteile) ·
Ablauf (4 Schritte) · Einsatzgebiet (50-km-Radius) · Kontakt (CTA + Formular) · Footer.

Alle Navigationspunkte und CTA-Buttons scrollen per Smooth-Scroll zu den
entsprechenden Abschnitten derselben Seite. Es gibt keine toten Links.

## Inhalte

Die Texte zu „Über uns“, Ablauf und Einsatzgebiet basieren auf dem vom Kunden
gelieferten Referenzmaterial (zertifizierter Fachbetrieb nach § 62 AwSV seit 2009,
Übernahme des Familienbetriebs 2022, Vor-Ort-Besichtigung, transparente Kosten,
Rechnung + Entsorgungsnachweis nach Abschluss, Einsatzgebiet 50 km um Landau in der Pfalz).
Es wurden **keine zusätzlichen Firmenangaben erfunden** – die Inhalte sind zur
Prüfung und Korrektur durch den Kunden gedacht.

Alle Fotos stammen aus den vom Kunden übermittelten Projektbildern und wurden nur
für das Web aufbereitet (zugeschnitten, leicht aufgehellt, komprimiert).

## Bilder

- `hero-tankausbau.jpg` – Stahltank-Ausbau mit Werkzeug (Hero)
- `leistung-ausbau.jpg` – Heizöltanks (Leistung: Heizöltank-Ausbau)
- `leistung-demontage.jpg` – zerlegte Batterietanks (Leistung: Tankdemontage)
- `leistung-entsorgung.jpg` – besenrein übergebener Kellerraum (Leistung: Entsorgung)
- `ueber-uns.jpg` – Tank im Kellerraum (Über uns)

## Offene Punkte vor dem Produktiv-Launch

- [ ] **Kontaktformular an ein Backend anbinden.** Aktuell nur Frontend:
      Pflichtfeld-Validierung läuft, es wird **noch nichts versendet**
      (Erfolgsmeldung ist simuliert). Benötigt wird ein Mail-/Form-Handler
      (z. B. Formspree/Netlify Forms oder ein serverseitiges Skript) **inkl.
      Double-Opt-in/DSGVO-konformer Verarbeitung**.
- [ ] **Echte Kontaktdaten** ergänzen (Telefon, E-Mail, ggf. Adresse) –
      wurden bewusst **nicht erfunden**.
- [ ] **Impressum & Datenschutzerklärung** erstellen und verlinken
      (rechtlich für den Live-Betrieb erforderlich; laut Auftrag für die
      Staging-Phase ausgeklammert).
- [ ] Inhalte „Über uns“ durch den Kunden **prüfen und freigeben**.
- [ ] Domain `demand-tankservice.de` registrieren/verbinden (sofern gewünscht).
- [ ] Optional: Fotos durch professionelle Aufnahmen ergänzen; `og:image`
      (Social-Sharing-Vorschaubild) ergänzen.
- [ ] Optional: Fonts selbst hosten (Performance/DSGVO), statt Google-Fonts-CDN.
