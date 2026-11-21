# Demand Tankservice – Homepage (Staging)

Statische, responsive deutschsprachige Homepage für **Demand Tankservice**
(Heizöltank-Ausbau, Tankdemontage und fachgerechte Entsorgung).

> **Hinweis:** Dies ist eine **Staging-Vorschau** zur Abstimmung mit dem Kunden,
> noch nicht die finale Produktivversion. Umgesetzt sind die Startseite, vier
> Leistungs-Unterseiten, Kontakt und Impressum (Datenschutzerklärung fehlt noch).

## Stack

Bewusst schlank gehalten, da nur eine Startseite gefordert ist – kein Build-Schritt,
voll portabel und leicht zu übergeben:

- **HTML5** – semantisch, barrierearm (`index.html`)
- **CSS3** – eigenes Design-System mit Design-Tokens (`css/styles.css`)
- **Vanilla JavaScript** – Mobile-Navigation, Sticky-Header, Smooth-Scroll,
  aktive Navigationshervorhebung, Scroll-Reveal, Anfrage-Funnel (`js/main.js`)
- **Google Fonts** – Manrope (Überschriften) & Inter (Fließtext, Buttons, Navigation)

Keine Frameworks, keine Abhängigkeiten, keine Tracker.

## Projektstruktur

```
.
├── index.html                 # Startseite
├── heizoeltank-ausbau.html    # Leistung 01
├── tankdemontage.html         # Leistung 02
├── entsorgung.html            # Leistung 03
├── erdtankverfuellung.html    # Leistung 04
├── kontakt.html               # Kontaktformular + Kontaktdaten
├── impressum.html             # Impressum (Platzhalter gelb markiert)
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

Header (Sticky) · Hero (mehrschichtige Bildkomposition) · Über uns · Leistungen
(3 Karten) · Warum wir (dunkle Sektion, 4 Vorteile) · Ablauf (4 Schritte) ·
Einsatzgebiet (50-km-Radius) · FAQ (Akkordeon) · Kontakt (Anfrage-Funnel + Kontaktdaten) · Footer.

Alle Navigationspunkte und CTA-Buttons scrollen per Smooth-Scroll (Lenis) zu den
entsprechenden Abschnitten derselben Seite. Es gibt keine toten Links.

## Unterseiten

Alle Unterseiten nutzen dasselbe Design-System (`css/styles.css`) und dasselbe Script.
Header (mit Leistungen-Dropdown) und Footer sind auf allen Seiten identisch –
Änderungen daran bitte in **allen** HTML-Dateien nachziehen.

- **Leistungsseiten:** Seitenkopf mit Breadcrumb · Einleitung (Bild + Checkliste) ·
  Leistungsumfang (6 Karten) · Zahlen · Ablauf · FAQ · weitere Leistungen · CTA.
  „Angebot anfragen“ verlinkt auf `kontakt.html?leistung=<slug>` und wählt die Leistung im Formular vor.
- **Kontakt:** Einseitiges Kontaktformular neben den Kontaktdaten · Tipps für die Anfrage · Einsatzgebiet · Leistungen.
- **Impressum:** Angaben nach § 5 DDG / § 18 Abs. 2 MStV. Fehlende Angaben sind als
  gelbe `[Platzhalter]` markiert, die Seite steht auf `noindex`.

## Anfrage-Funnel und Kontaktformular

Der mehrstufige Anfrage-Funnel bleibt auf `index.html` (#kontakt) und umfasst 7 Schritte mit Fortschrittsbalken. Auf `kontakt.html` befindet sich stattdessen ein einseitiges Kontaktformular:

1. Leistung · 2. Tankart · 3. Größe · 4. Standort des Tanks · 5. Zeitraum · 6. PLZ/Ort · 7. Name, E-Mail, Telefon (+ optionale Nachricht, DSGVO-Einwilligung)

- Auswahlkarten springen nach dem Klick automatisch weiter; „Zurück“ und „Weiter“ sind immer möglich.
- Leistungsseiten verlinken auf `kontakt.html?leistung=<slug>`; die gewünschte Leistung wird im Kontaktformular vorausgewählt.
- Tastatur- und Screenreader-tauglich (echte Radio-Buttons, `fieldset`/`legend`, Fokus-Management), Honeypot gegen Spam.
- Am Ende: Danke-Seite mit Zusammenfassung der Antworten.
- **Fragen/Optionen ändern:** Markup in `index.html` (`<fieldset class="funnel-step">`);
  Styles am Ende von `css/styles.css`, Logik in `js/main.js` („Anfrage-Funnel“).
  Bei neuen/entfernten Schritten funktioniert der Fortschrittsbalken automatisch.
- **Versand:** Der Homepage-Funnel zeigt ohne konfigurierten Endpoint eine Vorschau-Bestätigung. Das Kontaktformular auf `kontakt.html` öffnet eine vorbereitete E-Mail an `info@demand-tankservice.de`; ein serverseitiger Formularversand ist nicht eingerichtet.

## Animation / Technik

- GSAP + ScrollTrigger (lokal unter `js/vendor/`) für Scroll-Reveals, Hero-Einstieg,
  Parallax und Count-up-Statistiken; Lenis für weiches Scrollen.
- Vollständige Degradation: ohne die Libraries bzw. bei `prefers-reduced-motion`
  bleiben alle Inhalte sichtbar und nutzbar.
- Markenfarbe durchgehend als **flaches** `#4A703A` (keine Grün-Verläufe).

## Live-Vorschau (GitHub Pages)

Die Seite wird über `.github/workflows/deploy-pages.yml` bei **jedem Push auf `main`**
automatisch zu GitHub Pages veröffentlicht – die Vorschau-URL spiegelt also immer den
aktuellen Stand wider: `https://shahzadishq.github.io/tankservice/`

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

- [ ] **Homepage-Funnel an ein Backend anbinden** (`data-endpoint` am Formular). Aktuell wird ohne Endpoint nur eine Vorschau-Bestätigung angezeigt. Für serverseitigen Formularversand ist ein Mail-/Form-Handler nötig.
- [ ] **Echte Kontaktdaten** ergänzen (Telefon, E-Mail, ggf. Adresse) –
      wurden bewusst **nicht erfunden**.
- [ ] **Impressum vervollständigen** (gelbe Platzhalter: Rechtsform, USt-IdNr.,
      Kammer, Zertifizierungsstelle) und rechtlich prüfen lassen; danach `noindex` entfernen.
- [ ] **Datenschutzerklärung** erstellen und im Footer sowie an der Formular-Einwilligung verlinken.
- [ ] Inhalte „Über uns“ durch den Kunden **prüfen und freigeben**.
- [ ] Domain `demand-tankservice.de` registrieren/verbinden (sofern gewünscht).
- [ ] Optional: Fotos durch professionelle Aufnahmen ergänzen; `og:image`
      (Social-Sharing-Vorschaubild) ergänzen.
- [ ] Optional: Fonts selbst hosten (Performance/DSGVO), statt Google-Fonts-CDN.
