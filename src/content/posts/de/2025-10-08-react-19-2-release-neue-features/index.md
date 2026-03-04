---
title: "React 19.2: Die neuesten Features für Anfänger erklärt"
description: "React 19.2 bringt spannende neue Features wie den Activity Component, useEffectEvent Hook, Performance-Tracking in Chrome DevTools und verbesserte Server-Rendering-Funktionen. Erfahre alles über die neuen Möglichkeiten."
author: "Robin Böhm"
published_at: 2025-10-08T10:00:00.000Z
categories: "react release update javascript"
header_image: "header.jpg"
---

Die React-Community kann sich freuen: React 19.2 ist da! Diese Version bringt einige spannende neue Features mit sich, die besonders für Anfänger interessant sind. In diesem Artikel schauen wir uns die wichtigsten Neuerungen genauer an und zeigen dir anhand von praktischen Beispielen, wie du sie in deinen Projekten einsetzen kannst.

## Was ist neu in React 19.2?

React 19.2 ist ein bedeutendes Update, das sich auf Performance-Verbesserungen, bessere Entwickler-Tools und neue Möglichkeiten zur Strukturierung deiner Anwendungen konzentriert. Die neuen Features machen es einfacher, performante und gut strukturierte React-Anwendungen zu entwickeln - auch wenn du noch nicht so viel Erfahrung hast.

## Die Activity-Komponente: Apps besser strukturieren

Eines der spannendsten neuen Features ist die `<Activity />`-Komponente. Aber was macht sie eigentlich?

### Was ist eine Activity-Komponente?

Stell dir vor, du baust eine Anwendung mit mehreren "Bereichen" oder "Aktivitäten" - zum Beispiel eine Dashboard-Ansicht, eine Detailansicht und eine Einstellungsseite. Mit der Activity-Komponente kannst du diese Bereiche besser kontrollieren und verwalten, insbesondere wenn es um Sichtbarkeit und Rendering-Performance geht.

Die Activity-Komponente unterstützt zwei Modi:
- **`visible`**: Die Aktivität ist aktiv und für den Nutzer sichtbar
- **`hidden`**: Die Aktivität ist im Hintergrund, aber bereits vorgerendert

### Praktisches Beispiel

Hier siehst du, wie du die Activity-Komponente in einer einfachen Anwendung verwenden kannst:

```jsx
import { Activity } from 'react';
import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentPage('profile')}>Profil</button>
        <button onClick={() => setCurrentPage('settings')}>Einstellungen</button>
      </nav>

      <Activity mode={currentPage === 'dashboard' ? 'visible' : 'hidden'}>
        <DashboardPage />
      </Activity>

      <Activity mode={currentPage === 'profile' ? 'visible' : 'hidden'}>
        <ProfilePage />
      </Activity>

      <Activity mode={currentPage === 'settings' ? 'visible' : 'hidden'}>
        <SettingsPage />
      </Activity>
    </div>
  );
}
```

### Warum ist das nützlich?

Der große Vorteil: Deine App kann Seiten im Hintergrund vorbereiten (pre-rendern), während der Nutzer noch eine andere Seite betrachtet. Wenn er dann zur nächsten Seite wechselt, ist diese bereits fertig und wird sofort angezeigt - das sorgt für ein flüssigeres Nutzererlebnis.

Das ist besonders praktisch für:
- Tabs in einer Anwendung
- Wizard-ähnliche Formulare mit mehreren Schritten
- Komplexe Dashboards mit verschiedenen Ansichten

## useEffectEvent: Endlich keine Abhängigkeits-Probleme mehr

Wenn du schon einmal mit `useEffect` gearbeitet hast, kennst du wahrscheinlich das Problem mit den Dependencies. Manchmal möchtest du auf Daten zugreifen, ohne dass der Effect bei jeder Änderung dieser Daten neu ausgeführt wird. Genau hier hilft `useEffectEvent`.

### Das klassische Problem

Schauen wir uns ein typisches Problem an:

```jsx
import { useEffect, useState } from 'react';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = connectToChatRoom(roomId);

    connection.on('message', (newMessage) => {
      // Problem: Wenn wir hier auf 'message' zugreifen wollen,
      // müssen wir es zu den Dependencies hinzufügen.
      // Dann wird aber bei jeder Änderung von 'message'
      // die gesamte Connection neu aufgebaut!
      console.log('Aktueller Wert:', message);
    });

    return () => connection.disconnect();
  }, [roomId, message]); // message als Dependency führt zu Problemen

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );
}
```

### Die Lösung mit useEffectEvent

React 19.2 führt `useEffectEvent` ein, um dieses Problem elegant zu lösen:

```jsx
import { useEffect, useEffectEvent, useState } from 'react';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // useEffectEvent: Erstellt eine "Event"-Funktion,
  // die immer die aktuellen Werte sieht, aber keine
  // Re-Renders auslöst
  const onMessage = useEffectEvent((newMessage) => {
    console.log('Aktueller Wert:', message);
    // Du kannst hier auf 'message' zugreifen, ohne dass
    // der Effect neu ausgeführt wird!
  });

  useEffect(() => {
    const connection = connectToChatRoom(roomId);
    connection.on('message', onMessage);

    return () => connection.disconnect();
  }, [roomId]); // Nur roomId ist noch eine Dependency!

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );
}
```

### Wann solltest du useEffectEvent verwenden?

`useEffectEvent` ist ideal für Situationen, in denen du:
- Event-Handler innerhalb von Effects definierst
- Auf Props oder State zugreifen musst, ohne dass der Effect neu läuft
- Mit Callbacks arbeitest, die nicht Teil der reaktiven Abhängigkeiten sein sollen

Ein weiteres praktisches Beispiel ist ein Logger, der bei bestimmten Events ausgelöst wird:

```jsx
function ProductPage({ productId, theme }) {
  const onVisit = useEffectEvent((id) => {
    // Greift auf aktuelles Theme zu, ohne dass der Effect
    // bei Theme-Änderungen neu läuft
    logProductView(id, theme);
  });

  useEffect(() => {
    onVisit(productId);
  }, [productId]); // Theme ist NICHT in den Dependencies!

  // ...
}
```

## Performance-Tracking mit Chrome DevTools

React 19.2 bringt eine verbesserte Integration mit den Chrome Developer Tools. Wenn du die Performance deiner React-App analysieren möchtest, stehen dir jetzt zwei neue Custom Tracks zur Verfügung:

### Die neuen Performance Tracks

1. **Scheduler Track**: Zeigt dir, wie React die Priorisierung von Updates handhabt. Du kannst sehen, welche Updates React als dringend einstuft und welche aufgeschoben werden.

2. **Components Track**: Visualisiert die Arbeit, die React für deine Komponenten leistet - vom Rendering bis zum Commit.

### So nutzt du die Performance Tools

1. Öffne die Chrome DevTools (F12)
2. Wechsle zum "Performance" Tab
3. Starte eine Aufnahme (Punkt-Button oder Strg+E)
4. Interagiere mit deiner React-App
5. Stoppe die Aufnahme
6. Schaue dir die neuen "Scheduler" und "Components" Tracks an

Diese Tracks helfen dir zu verstehen:
- Welche Komponenten am meisten Zeit beim Rendern brauchen
- Wie React Updates priorisiert
- Wo Performance-Bottlenecks in deiner App liegen

### Praktischer Tipp für Anfänger

Wenn deine App langsam läuft, schaue dir besonders die Components Track an. Suche nach Komponenten, die:
- Sehr lange Balken haben (langes Rendering)
- Sehr oft gerendert werden (viele kurze Balken)
- Während der Nutzer-Interaktion aktiv sind (blockieren die UI)

Diese Informationen helfen dir, gezielt Optimierungen vorzunehmen - zum Beispiel durch Memoization oder bessere State-Strukturierung.

## Partial Pre-rendering: Vorrendern und später fortsetzen

Partial Pre-rendering ist ein völlig neues Feature in React 19.2, das besonders für fortgeschrittene Server-Rendering-Szenarien interessant ist. Auch wenn du als Anfänger vielleicht noch nicht damit arbeitest, lohnt es sich zu verstehen, welche Möglichkeiten es bietet.

### Was ist Partial Pre-rendering?

Die Kernidee: Du kannst Teile deiner App **im Voraus rendern** und das Rendering später **fortsetzen**. Das ist besonders nützlich, wenn du statische Teile deiner Seite auf einem CDN cachen möchtest, aber dynamische Teile erst zur Laufzeit (pro Request) rendern willst.

**Was ist neu?** React 19.2 führt drei neue APIs ein:
- `prerender()` - Rendert Teile der App im Voraus
- `resume()` - Setzt das Rendering später fort (für SSR Streaming)
- `resumeAndPrerender()` - Setzt das Rendering fort und generiert statisches HTML

### Wie funktioniert es?

#### Schritt 1: Vorrendern (Pre-render)

Zuerst renderst du deine App und speicherst den "aufgeschobenen" Zustand (postponed state):

```javascript
import { prerender } from 'react-dom/static';

// Während der Build-Zeit oder beim ersten Request
const controller = new AbortController();

const { prelude, postponed } = await prerender(<App />, {
  signal: controller.signal,
});

// Das 'prelude' ist das HTML für die statischen Teile
// Das 'postponed' enthält den Zustand für dynamische Teile

// Speichere den postponed state für später (z.B. auf dem Server)
await savePostponedState(postponed);

// Sende das prelude an den Client (kann gecacht werden!)
return prelude;
```

#### Schritt 2: Fortsetzen (Resume)

Später, wenn ein Request kommt, kannst du das Rendering fortsetzen:

**Option A - Mit SSR Streaming:**

```javascript
import { resume } from 'react-dom/server';

// Bei einem späteren Request
const postponed = await getPostponedState(request);

// Erstelle einen Stream, der das Rendering fortsetzt
const resumeStream = await resume(<App />, postponed, {
  onError(error) {
    console.error('Resume error:', error);
  }
});

// Sende den Stream an den Client
return new Response(resumeStream);
```

**Option B - Als statisches HTML:**

```javascript
import { resumeAndPrerender } from 'react-dom/static';

// Für statische Generierung
const postponedState = await getPostponedState(request);

const { prelude } = await resumeAndPrerender(<App />, postponedState);

// Jetzt hast du vollständiges statisches HTML
return prelude;
```

### Ein praktisches Beispiel

Stell dir eine Blog-Plattform vor. Das Layout ist immer gleich, aber der Content ändert sich:

```jsx
import { Suspense } from 'react';

function BlogApp() {
  return (
    <html>
      <head>
        <title>Mein Blog</title>
      </head>
      <body>
        {/* Diese Teile sind statisch - werden beim prerender() erfasst */}
        <header>
          <h1>Mein Blog</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">Über mich</a>
          </nav>
        </header>

        {/* Dieser Teil ist dynamisch - wird beim resume() gerendert */}
        <main>
          <Suspense fallback={<div>Lädt...</div>}>
            <BlogPost />
          </Suspense>
        </main>

        {/* Statischer Footer */}
        <footer>
          <p>&copy; 2025 Mein Blog</p>
        </footer>
      </body>
    </html>
  );
}

async function BlogPost() {
  // Dieser Code läuft erst beim resume()
  const post = await fetchLatestPost();

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </article>
  );
}
```

**Workflow:**

1. **Build-Zeit:** `prerender(<BlogApp />)` generiert das HTML für Header und Footer → wird auf CDN gespeichert
2. **Request-Zeit:** `resume(<BlogApp />, postponed)` lädt die aktuellen Blog-Daten und rendert nur den dynamischen Teil
3. **Ergebnis:** Schnelle Auslieferung (CDN) + aktuelle Daten (Server)

### Warum ist das nützlich?

#### Vorteile:

1. **CDN-Caching für statische Teile**: Das `prelude` (statische Shell) kann global gecacht werden
2. **Dynamische Teile bleiben frisch**: Nur was sich ändert, wird pro Request gerendert
3. **Bessere Performance**: Nutzer sehen sofort die statische Shell, während dynamischer Content nachgeladen wird
4. **Flexible Deployment-Strategien**: Kombiniere Static Site Generation mit Server-Side Rendering

#### Use Cases:

- **E-Commerce**: Statisches Layout + dynamische Produktdaten
- **Dashboards**: Statische Navigation + aktuelle Metriken
- **Content-Sites**: Statisches Design + frischer Content
- **Personalisierung**: Statische Basis + personalisierte Widgets

### Der Unterschied zu Suspense

**Wichtig zu verstehen:** Das ist nicht einfach nur Suspense! Suspense gibt es schon lange für Client-Side Rendering und Server-Streaming.

**Partial Pre-rendering ist neu**, weil es erlaubt:
- Rendering-Arbeit aufzuteilen zwischen Build-Zeit und Request-Zeit
- Den Zustand zwischen beiden Phasen zu speichern
- Verschiedene Deployment-Strategien zu kombinieren

### Für Framework-Entwickler

Diese APIs sind hauptsächlich für **Framework-Autoren** gedacht (Next.js, Remix, etc.). Als normaler React-Entwickler wirst du vermutlich höhere Abstraktionen verwenden, die dein Framework anbietet.

Beispiel Next.js:
```javascript
// Next.js könnte in Zukunft etwas wie PPR so unterstützen:
export const config = {
  runtime: 'partial-prerender'
};
```

### Zusammenfassung

Partial Pre-rendering ist ein mächtiges Tool für hybride Rendering-Strategien. Es erlaubt dir, das Beste aus Static Site Generation (Geschwindigkeit, CDN-Caching) und Server-Side Rendering (Aktualität, Personalisierung) zu kombinieren - mit drei neuen APIs: `prerender()`, `resume()`, und `resumeAndPrerender()`.

## Server-Side Rendering Verbesserungen

React 19.2 bringt auch Verbesserungen für Server-Side Rendering, die deine App schneller und zuverlässiger machen.

### Batching von Suspense Boundaries

React kann jetzt mehrere Suspense Boundaries intelligenter zusammenfassen. Was bedeutet das konkret?

Früher wurde jede Suspense Boundary einzeln verarbeitet. Wenn du 10 verschiedene Bereiche hattest, die Daten laden, mussten 10 separate Chunks vom Server zum Client gesendet werden. Jetzt kann React diese intelligent bündeln und in weniger Chunks senden - das reduziert die Ladezeit.

### Web Streams Support für Node.js

React 19.2 unterstützt jetzt Web Streams auch in Node.js-Umgebungen besser. Das macht SSR effizienter und ermöglicht es, Daten schneller zu streamen.

Für dich als Entwickler bedeutet das einfach: Bessere Performance ohne zusätzlichen Code!

## Weitere wichtige Änderungen

### Aktualisierte ESLint Plugin

Der `eslint-plugin-react-hooks` wurde auf Version 6 aktualisiert. Dieses Plugin hilft dir, Fehler bei der Verwendung von Hooks zu vermeiden. Wenn du ESLint in deinem Projekt verwendest, solltest du das Plugin aktualisieren:

```bash
npm install eslint-plugin-react-hooks@6 --save-dev
```

### Neues useId Präfix

Der `useId` Hook (der eindeutige IDs für Accessibility generiert) verwendet jetzt standardmäßig das Präfix `_r_` statt `:R:`. Das ist nur eine interne Änderung - dein Code funktioniert weiterhin wie gewohnt.

## Solltest du auf React 19.2 upgraden?

Als Anfänger fragst du dich vielleicht: Lohnt sich das Upgrade?

### Vorteile:
- **Bessere Performance**: Deine Apps laufen schneller, ohne dass du Code ändern musst
- **Bessere Developer Tools**: Die neuen Performance Tracks helfen beim Lernen und Optimieren
- **Neue Möglichkeiten**: Features wie Activity und useEffectEvent lösen häufige Probleme elegant

### Überlegungen:
- Wenn du gerade erst mit React anfängst, kannst du direkt mit 19.2 starten
- Für bestehende Projekte: Das Upgrade ist meist unkompliziert, aber teste gut!
- Die neuen Features sind optional - dein bestehender Code funktioniert weiter

### So führst du das Upgrade durch

```bash
# React und React DOM updaten
npm install react@19.2 react-dom@19.2

# TypeScript Types updaten (falls du TypeScript verwendest)
npm install @types/react@19.2 @types/react-dom@19.2 --save-dev
```

Nach dem Update: Führe deine Tests aus und prüfe, ob alles funktioniert. In den meisten Fällen sollte das Upgrade ohne Probleme verlaufen.

## Praktische Tipps für den Einstieg

### 1. Experimentiere mit Activity-Komponenten

Wenn du eine App mit mehreren Views hast (z.B. Tabs), probiere die Activity-Komponente aus:

```jsx
function TabApp() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <>
      <div className="tabs">
        <button onClick={() => setActiveTab('tab1')}>Tab 1</button>
        <button onClick={() => setActiveTab('tab2')}>Tab 2</button>
        <button onClick={() => setActiveTab('tab3')}>Tab 3</button>
      </div>

      <Activity mode={activeTab === 'tab1' ? 'visible' : 'hidden'}>
        <Tab1Content />
      </Activity>

      <Activity mode={activeTab === 'tab2' ? 'visible' : 'hidden'}>
        <Tab2Content />
      </Activity>

      <Activity mode={activeTab === 'tab3' ? 'visible' : 'hidden'}>
        <Tab3Content />
      </Activity>
    </>
  );
}
```

### 2. Nutze useEffectEvent für Event-Handler

Wenn du merkst, dass deine Effects zu oft ausgeführt werden, schaue dir `useEffectEvent` an. Besonders nützlich für:
- WebSocket-Verbindungen
- Event-Listener
- Logging und Analytics

### 3. Lerne die Performance Tools kennen

Auch wenn du noch Anfänger bist: Mach dich mit den Chrome DevTools vertraut. Die neuen React-Tracks zeigen dir visuell, was in deiner App passiert - das ist super zum Lernen!

Kleine Übung:
1. Baue eine einfache Counter-App
2. Öffne die Performance Tools
3. Klicke mehrmals auf den Counter-Button
4. Schaue dir in den DevTools an, was passiert
5. Du wirst sehen, wie React die Updates verarbeitet!

## Zusammenfassung

React 19.2 ist ein solides Update mit praktischen neuen Features:

- **Activity-Komponente**: Bessere Kontrolle über verschiedene App-Bereiche
- **useEffectEvent**: Löst das Dependency-Problem in useEffect
- **Performance Tracking**: Neue DevTools-Integration für bessere Einblicke
- **Partial Pre-rendering**: Schnellere Ladezeiten für SSR-Apps
- **Allgemeine Verbesserungen**: Bessere Performance und Developer Experience

Für Anfänger ist besonders wichtig: Du musst nicht alle Features sofort verstehen oder nutzen. React 19.2 macht vieles automatisch besser, auch wenn du nichts änderst. Die neuen Features sind da, wenn du sie brauchst - aber sie sind optional.

## Deine nächsten Schritte

Bist du bereit, React 19.2 auszuprobieren? Hier sind konkrete Empfehlungen:

1. **Erstelle ein neues Projekt** mit React 19.2 und experimentiere mit den neuen Features
2. **Schaue dir die Activity-Komponente** genauer an, wenn du mit Tabs oder mehreren Views arbeitest
3. **Probiere useEffectEvent** aus, wenn du das nächste Mal Probleme mit useEffect-Dependencies hast
4. **Öffne die Chrome DevTools** und erkunde die neuen Performance Tracks
5. **Lies die offizielle Dokumentation** für noch mehr Details

## Weiterführende Ressourcen

- [Offizielle React 19.2 Ankündigung](https://react.dev/blog/2025/10/01/react-19-2)
- [React DevTools Anleitung](https://react.dev/learn/react-developer-tools)
- [useEffectEvent RFC](https://github.com/reactjs/rfcs/pull/220)
- [Activity Component Dokumentation](https://react.dev/reference/react/Activity)

Viel Spaß beim Entwickeln mit React 19.2! Die Zukunft von React wird immer spannender, und es ist eine großartige Zeit, um dabei zu sein. 🚀
