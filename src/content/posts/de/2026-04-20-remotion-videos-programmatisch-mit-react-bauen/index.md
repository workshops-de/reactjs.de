---
title: "Remotion: Videos programmatisch mit React bauen"
description: "Remotion: Videos programmatisch mit React bauen"
author: "Robin Böhm"
published_at: 2026-04-20T12:00:00.000Z
categories: "react javascript frontend"
header_image: "https://images.unsplash.com/photo-1764557175375-9e2bea91530e?fm=jpg&q=80&w=1800&auto=format&fit=crop"
header_source: "https://unsplash.com/photos/video-editing-software-interface-with-color-grading-tools-NqPUto5vS10"
---

**TL;DR:** Remotion ist ein Open-Source-Framework, das React-Komponenten als Bausteine für Videos nutzt. Statt Videoschnitt-Software setzt du CSS, SVG, Canvas, WebGL und TypeScript ein – und renderst daraus serverseitig echte MP4-Dateien. Mit über 42.000 GitHub-Stars und aktiver Entwicklung bis Version 4.0.448 ist Remotion längst kein Nischen-Experiment mehr.

Wer als React-Entwickler Videos erstellen muss – etwa für automatisierte Social-Media-Clips, personalisierte Inhalte oder KI-gestützte Pipelines – stößt früher oder später auf Remotion. Das Framework von Jonny Burger dreht den klassischen Videoproduktionsprozess komplett um: Anstatt Footage in einer Timeline zu schneiden, schreibst du React-Komponenten, die Frame für Frame gerendert werden.

## Die wichtigsten Punkte

- 📅 **Aktuelle Version**: v4.0.448 (Stand: April 2026), aktiv entwickelt mit über 600 Releases
- 🎯 **Zielgruppe**: React- und TypeScript-Entwickler, die programmatische Videoproduktion benötigen
- 💡 **Kernprinzip**: Jede Video-Sequenz ist eine React-Komponente – wiederverwendbar, versionierbar, testbar
- 🔧 **Tech-Stack**: React, TypeScript, Rust-Renderer (seit v4), FFmpeg, GSAP, Three.js, WebGL

## Was bedeutet das für React-Entwickler?

Im React-Ökosystem bringt Remotion etwas Ungewöhnliches mit: der `useCurrentFrame()`-Hook gibt dir den aktuellen Frame-Index zurück, und darauf basierend steuerst du alle Animationen deterministisch. Das bedeutet: keine Callbacks, keine Timelines, keine asynchronen Animationsschleifen – nur pure Komponenten-Logik.

Das fühlt sich für React-Entwickler sofort vertraut an. Du kannst deine existierenden Komponenten-Bibliotheken, CSS-Variablen, Tailwind-Klassen und Animationslogiken direkt wiederverwenden. Auch Next.js-Projekte können Remotion-Kompositionen per Lambda-Rendering in CI/CD-Pipelines einbinden.

### Technische Details

**Kern-APIs, die du kennen solltest:**

- `useCurrentFrame()` – gibt den aktuellen Frame zurück (0-basiert)
- `useVideoConfig()` – liefert fps, durationInFrames, width, height
- `<Sequence>` – zeitliches Einblenden von Kindkomponenten
- `<Series>` – aufeinanderfolgende Sequenzen ohne Überlappung
- `interpolate()` – wertemäßige Interpolation zwischen Frames, analog zu CSS `animation`
- `spring()` – physikbasierte Spring-Animationen

**Seit Remotion 4.0 (Rust-Architektur):**

- `<OffthreadVideo>` rendert bis zu 2× schneller durch FFmpeg C API direkt in Rust
- `calculateMetadata()` erlaubt dynamische Video-Dimensionen und -Dauer zur Laufzeit
- Zod-Schema-Integration für interaktives visuelles Editing im Remotion Studio
- `getStaticFiles()` für den Zugriff auf lokale Assets

**Render-Ziele:**

Das Rendering läuft serverseitig (Node.js + Puppeteer/Chrome), kann aber auch über AWS Lambda skaliert werden. Das bedeutet: SSR-Ansätze wie in Next.js sind möglich, das eigentliche Video-Compositing findet jedoch immer im Headless-Browser-Kontext statt – kein direktes Server Component Rendering für das Video selbst, wohl aber für die Daten-Fetching-Schicht davor.

## Konkrete Anwendungsfälle im React-Umfeld

**Datengetriebene Videos** sind der Sweet Spot: Du übergibst Props an deine Video-Komposition (z. B. Nutzerdaten, Charts, Kennzahlen), und Remotion rendert daraus für jeden Datensatz ein individuelles Video. GitHub Unwrapped – das personalisierte Jahresrückblick-Video von GitHub – ist eines der bekanntesten Showcase-Projekte, quelloffen auf GitHub verfügbar.

**GSAP-Animationen** funktionieren nahtlos: Da Remotion den Frame deterministisch rendert, kannst du GreenSock-Timelines einfach auf den Frame-Wert scrubben. Das ist ein etabliertes Pattern in der Community.

**KI-Agenten-Workflows** sind ein stark wachsender Use Case: Systeme wie Claude Code oder n8n generieren Remotion-Kompositionen programmatisch – etwa für automatisierte Video-Zusammenfassungen, Untertitelung oder Social-Media-Clips aus langen Inhalten. Das Remotion-Repository enthält inzwischen sogar eine `CLAUDE.md` und eine `AGENTS.md`, was zeigt, dass das Team aktiv auf AI-Driven Development setzt.

**3D-Inhalte** via Three.js oder React Three Fiber lassen sich direkt in Kompositionen einbetten, da Remotion im Browserkontext rendert und somit WebGL voll unterstützt.

## Performance-technisch im Griff behalten

Der Render-Prozess erzeugt pro Frame einen Screenshot via Puppeteer. Performance-Optimierungen konzentrieren sich daher auf:

- **Bundle-Size**: Remotion rendert in einer isolierten Browserumgebung – dein Video-Bundle sollte schlank bleiben, um das Startup-Throttling zu minimieren
- **`<OffthreadVideo>`** statt `<Video>` für Video-in-Video-Szenarien (v4+ empfohlen)
- **Lambda-Parallelisierung**: Remotion Lambda rendert Chunks parallel in AWS, was bei langen Videos erhebliche Zeitersparnisse bringt
- **Caching**: Das Webpack-Setup von Remotion persistiert seinen Cache, sodass erneute Builds deutlich schneller sind

## Einstieg in das Projekt

```bash
npx create-video@latest
```

Das CLI richtet eine vollständige TypeScript-Projekt-Struktur ein. Die Grundstruktur ist schnell verständlich für jeden, der React kennt. Die offizielle Dokumentation unter [remotion.dev/docs](https://www.remotion.dev/docs) ist exzellent gepflegt.

## Praktische Nächste Schritte

1. **Ausprobieren**: `npx create-video@latest` startet ein vollständiges TypeScript-Projekt in unter einer Minute
2. **Showcase erkunden**: [remotion.dev/showcase](https://remotion.dev/showcase) zeigt eine beeindruckende Bandbreite realer Projekte – von Musik-Visualizern bis zu News-Clips
3. **Weiterlernen**: Mit solidem React- und TypeScript-Know-how profitierst du am meisten von Remotion – die Workshops von ReactJS.de legen genau dieses Fundament

## Quellen & Weiterführende Links

- 📰 [Remotion GitHub Repository](https://github.com/remotion-dev/remotion)
- 📚 [Offizielle Dokumentation](https://www.remotion.dev/docs)
- 🎬 [Remotion 4.0 Changelog](https://www.remotion.dev/blog/4-0)
- 🎓 **Workshops & Kurse** (via API verifiziert):
  - [React: Modul 1 - Komponenten, Reaktivität & Schnittstellen](https://workshops.de/seminare-schulungen-kurse/react-modul-1) — Solides React-Fundament als Basis für Remotion-Projekte
  - [React: Modul 2 - Architektur & Qualität](https://workshops.de/seminare-schulungen-kurse/react-modul-2) — Fortgeschrittene React-Patterns, die sich direkt auf komplexe Remotion-Kompositionen übertragen lassen

---

## Technical Review vom 2026-04-20

**Review-Status**: PASSED_WITH_CHANGES

### Vorgenommene Änderungen:
1. **Kurs-Links korrigiert**: workshops.de URLs von `/kurse/` zu `/seminare-schulungen-kurse/` aktualisiert (2 Vorkommen)
2. **GitHub Stars aktualisiert**: 44.000 → 42.000 (basierend auf aktueller Verifikation April 2026)

### Verifizierte Fakten:
- ✅ Version 4.0.448 korrekt (verifiziert via Remotion Docs & GitHub Releases)
- ✅ Rust-Architektur in v4.0 bestätigt (Rust binary für FFmpeg C API, OffthreadVideo, Performance-Layer)
- ✅ Alle technischen APIs korrekt: useCurrentFrame(), useVideoConfig(), interpolate(), spring(), calculateMetadata(), getStaticFiles()
- ✅ OffthreadVideo mit FFmpeg C API Integration bestätigt
- ✅ Rendering via Puppeteer/Chrome korrekt
- ✅ AWS Lambda Support bestätigt
- ✅ GitHub Stars: ~42.000 (41.600-43.854 je nach Quelle, Stand April 2026)

### Link-Verifikation:
- ✅ 6 externe Links geprüft und verifiziert:
  - https://github.com/remotion-dev/remotion (aktiv)
  - https://www.remotion.dev/docs (aktiv)
  - https://www.remotion.dev/blog/4-0 (aktiv)
  - https://remotion.dev/showcase (aktiv)
  - workshops.de React Modul 1 (korrigiert & verifiziert)
  - workshops.de React Modul 2 (korrigiert & verifiziert)
- 🔧 2 Kurs-Links korrigiert (falsche URL-Struktur)

### Code-Beispiel Verifikation:
- ✅ Bash-Command `npx create-video@latest` korrekt und aktuell

### Technische Korrektheit:
- Alle beschriebenen Features existieren und sind korrekt dargestellt
- Rust-Architektur-Beschreibung präzise (Rust für Performance-Layer, nicht komplettes Rendering)
- API-Beschreibungen akkurat
- Anwendungsfälle plausibel und realitätsnah

**Reviewed by**: Technical Review Agent  
**Verification Sources**: 
- Remotion Official Docs (remotion.dev)
- GitHub Repository (remotion-dev/remotion)
- Remotion 4.0 Release Blog & Changelog
- workshops.de API verification
- Perplexity AI Research (3 Queries)

**Konfidenz-Level**: HIGH

---