# 🍷 Gourmet Archive

Ein klickbarer **Prototyp** einer modernen Rezept-Archiv-Web-App im Stil
**„Dark Gourmet Archive"** – hochwertig, dunkel, warm, mit Bernstein-Akzent,
eleganter Serifenschrift für Überschriften und cleaner Sans-Serif-UI.

Die App sammelt Rezepte aus Kochbüchern, losen Blättern, handschriftlichen
Notizen, Screenshots oder eingefügtem Text, strukturiert sie und verwaltet sie
als digitale Rezepte – mit einer **intelligenten Einkaufsliste** im Zentrum.

> **Hinweis:** Dies ist ein Prototyp mit Demo-Daten.
> Kein Login · keine echte Datenbank · keine echte OCR · keine echte KI-Analyse ·
> kein echter Datei-Upload. Der Zustand wird beim Neuladen zurückgesetzt.

## ✨ Funktionen

- **Dashboard** – Kennzahlen (Rezepte, Favoriten, zu prüfen), zuletzt hinzugefügt, Schnellaktionen
- **Rezepte** – Kartenansicht mit Suche, Filtern (Kategorie, Tags, Favorit, Status) und Mehrfachauswahl
- **Rezept-Detailseite** – Originalfotos, strukturiertes Rezept, Zutaten, Schritte, Notizen, Quelle, Status
- **Rezept hinzufügen** – 3-Schritte-Wizard (Quelle → simulierte Analyse → Bearbeiten & Speichern)
- **Intelligente Einkaufsliste**
  - führt gleiche Zutaten aus mehreren Rezepten zusammen
  - addiert kompatible Mengen sinnvoll (`2 Eier + 3 Eier → 5 Eier`, `200 g + 300 g → 500 g`)
  - hält inkompatible Mengen getrennt und markiert sie als **„bitte prüfen"** (`200 g Mehl` vs. `2 EL Mehl`)
  - sortiert nach Einkaufskategorien, filterbar, abhakbar
  - „habe ich zuhause", manuelles Ergänzen & Entfernen, Quellenanzeige
- **Wochenplan** & **Einstellungen** – Platzhalter-Seiten für spätere Ausbaustufen

## 🛠 Tech-Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [React Router](https://reactrouter.com/) (HashRouter – robust für GitHub Pages & WebView)
- Reines CSS mit Theme-Variablen (keine UI-Framework-Abhängigkeit)
- State im Speicher via React Context (Reset bei Reload – wie gefordert)

Die App ist vollständig **responsive** (Desktop, Laptop, Tablet, Handy) und so
gebaut, dass sie sich später mit **Median** als mobile App verpacken lässt.

## 🚀 Lokal starten

```bash
npm install
npm run dev      # Entwicklungsserver (http://localhost:5173)
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal ansehen
```

## 🌐 Deployment auf GitHub Pages

Das Repository enthält einen GitHub-Actions-Workflow
(`.github/workflows/deploy.yml`), der bei jedem Push auf `main` automatisch
baut und auf GitHub Pages veröffentlicht.

**Einmalig einrichten:**

1. Repository-Einstellungen → **Settings → Pages**
2. Bei **Build and deployment → Source** den Punkt **GitHub Actions** wählen
3. Auf `main` pushen → die App erscheint unter
   `https://<user>.github.io/<repo>/`

Durch `base: './'` in `vite.config.ts` funktioniert der Build unter jedem
Unterpfad – ohne weitere Anpassung.

## 📁 Projektstruktur

```
src/
├── components/   # Layout, RecipeCard
├── context/      # AppContext (Rezepte, Auswahl, Einkaufsliste)
├── data/         # Demo-Rezepte
├── lib/          # Anzeige-Helfer
├── pages/        # Dashboard, Rezepte, Detail, Wizard, Einkaufsliste, …
├── utils/        # Einkaufslisten-Logik & Kategorisierung
└── types.ts      # Domänen-Typen
```
