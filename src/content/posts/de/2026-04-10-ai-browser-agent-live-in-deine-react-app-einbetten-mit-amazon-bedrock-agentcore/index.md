---
title: "AI-Browser-Agent live in deine React-App einbetten – mit Amazon Bedrock AgentCore"
description: "AI-Browser-Agent live in deine React-App einbetten – mit Amazon Bedrock AgentCore"
author: "Robin Böhm"
published_at: 2026-04-10T12:00:00.000Z
categories: "react javascript frontend"
header_image: "https://images.unsplash.com/photo-1547882230-87a3d4390e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTM4MjZ8MHwxfHNlYXJjaHwyfHxBSUJyb3dzZXJBZ2VudCUyMGxpdmUlMjBpbiUyMGRlaW5lJTIwVExEUiUyMEFXUyUyMGhhdHxlbnwxfDB8fHwxNzc1ODA2ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080"
---

**TL;DR:** AWS hat mit dem `BrowserLiveView`-Component eine neue React-Client-Komponente im Bedrock AgentCore TypeScript SDK veröffentlicht, die es ermöglicht, einen live gestreamten KI-Browser-Agenten direkt in React-Anwendungen einzubetten – in nur drei JSX-Zeilen. Die DCV-Videostream-Verbindung läuft dabei direkt von AWS zum Browser des Nutzers, ohne den App-Server zu belasten.

Am 9. April 2026 hat AWS im Machine Learning Blog ein praxisnahes Tutorial veröffentlicht, das zeigt, wie sich ein Cloud-Browser-Agent in Echtzeit in eine React-Anwendung integrieren lässt. Im Mittelpunkt steht der neue `BrowserLiveView`-Component aus dem Bedrock AgentCore TypeScript SDK – und das Ergebnis ist architektonisch interessant genug, um einen genaueren Blick zu verdienen.

## Die wichtigsten Punkte

- 📅 **Verfügbarkeit**: Seit 9. April 2026 – der AWS Blog-Post und das GitHub-Sample sind öffentlich verfügbar
- 🎯 **Zielgruppe**: React-Entwicklerinnen und Entwickler, die KI-Agenten mit Sichtbarkeit für Endnutzer bauen
- 💡 **Kernfeature**: Einbettung eines Live-Videostreams einer Browser-Session eines AI-Agenten direkt in die eigene React-App
- 🔧 **Tech-Stack**: React + Vite, TypeScript SDK, Amazon DCV, Amazon Bedrock Converse API, Playwright CDP

## Was bedeutet das für React-Entwickler?

Wer schon einmal versucht hat, einem Nutzer live zu zeigen, was ein KI-Agent gerade tut, kennt das Problem: Entweder baut man selbst eine aufwendige Streaming-Infrastruktur, oder man zeigt gar nichts und hofft, dass das Ergebnis erklärt sich selbst. Die neue `BrowserLiveView`-Komponente adressiert genau diesen Gap.

Der Component nimmt eine SigV4-presigned URL entgegen, stellt eine persistente WebSocket-Verbindung her und rendert via Amazon DCV-Protokoll den laufenden Browser-Stream. Das Besondere an der Architektur: Der Video-Stream fließt **direkt** von AWS zu deinem Nutzer – er passiert nicht den eigenen Application-Server. Das minimiert Latenz und spart Infrastrukturkosten.

```jsx
import { BrowserLiveView } from 'bedrock-agentcore/browser/live-view'

<BrowserLiveView
  signedUrl={presignedUrl}
  remoteWidth={1920}
  remoteHeight={1080}
/>
```

Drei Zeilen JSX. Der Rest übernimmt das SDK: WebSocket-Aufbau, DCV-Protokoll-Negotiation, Video-Dekodierung und Frame-Rendering. Der Component skaliert automatisch auf seinen Parent-Container, wobei das Seitenverhältnis erhalten bleibt.

### Die 3-Schritte-Architektur im Detail

Das Tutorial beschreibt einen klaren Dreischritt:

**Schritt 1: Session starten (Server-seitig, Node.js)**

Der Application-Server erzeugt eine Browser-Session via der `Browser`-Klasse und generiert daraus eine presigned URL mit SigV4-Credentials in den Query-Parametern. Diese URL läuft nach 300 Sekunden ab und enthält keine dauerhaften Secrets, die den Weg zum Browser finden.

**Schritt 2: Stream in React rendern (Client-seitig)**

Die presigned URL wird über eine API-Route an den React-Client übergeben. Der `BrowserLiveView`-Component nutzt sie direkt. `remoteWidth` und `remoteHeight` müssen exakt mit dem Viewport aus Schritt 1 übereinstimmen – sonst entstehen Cropping-Artefakte.

**Schritt 3: KI-Agenten einbinden (Server-seitig)**

Der eigentliche Agent läuft über die Amazon Bedrock Converse API (im Tutorial mit Anthropic Claude) und nutzt Playwright-Browser-Tools wie `navigate`, `click`, `type` oder `getText`. Jede Tool-Nutzung des Modells ist sofort im Live-View sichtbar.

## Performance-technisch: Was bedeutet die Architektur?

Der Direct-Stream-Ansatz ist eine der interessanteren Designentscheidungen. Im Vergleich zu naheliegenden Alternativen – z.B. Screenshots per Polling oder Server-seitige Aggregation – bietet DCV als Protokoll einige Vorteile:

- **Keine Serverkosten für den Video-Traffic**: Der Stream geht direkt AWS → Browser
- **Echte Real-Time-Darstellung**: Kein Screenshot-Polling mit künstlicher Latenz
- **Automatisches Skalieren**: Der Component passt sich dem Container an, ohne eigene CSS-Tricks

**Vite-Konfiguration als notwendiger Schritt**: Das DCV Web Client SDK wird als vendorierte Datei im npm-Paket mitgeliefert. Für die Einbindung braucht man drei Vite-Konfigurationsanpassungen:
- `resolve.alias` für die `dcv`- und `dcv-ui`-Imports
- `resolve.dedupe` für React-Deduplication
- `viteStaticCopy` für WASM-Decoder und Web Workers

Das Sample-Repository enthält eine fertige `vite.config.ts`, die direkt verwendbar ist. Wer mit Webpack statt Vite arbeitet, muss diese Konfiguration selbst portieren – dazu gibt es bisher keine offizielle Dokumentation.

## Im React-Ökosystem

**Was ist mit Next.js?** Das Tutorial nutzt Vite als Bundler. Der Server-seitige Code (Session-Start, Agent-Logik) läuft in Node.js/Fastify. Next.js-Nutzer können die API-Routen problemlos dafür verwenden – aber die `BrowserLiveView`-Komponente selbst ist ein reiner Client-Component, muss also mit `'use client'` deklariert werden.

⚠️ **Wichtig**: `BrowserLiveView` kann nicht als React Server Component verwendet werden, da sie WebSocket-Verbindungen, Video-Dekodierung und kontinuierliches Frame-Rendering benötigt – alles client-seitige Operationen. Server Components rendern nur einmal auf dem Server und können keine Browser-APIs nutzen.

**Multiple Instances**: Der Component unterstützt mehrere Instanzen pro Seite, jede mit eigenem Stream. Das eröffnet interessante Use Cases für Monitoring-Dashboards, bei denen mehrere Agenten parallel beobachtet werden.

**Model-Agnostisch**: Live View ist unabhängig vom AI-Modell. Das Tutorial nutzt Claude, aber Amazon Nova oder jedes andere Bedrock-Modell mit Tool-Use-Unterstützung funktioniert genauso. Das Vercel AI SDK hat sogar eine fertige `BrowserTools`-Integration.

## Sicherheitsaspekte nicht vergessen

Das Tutorial macht einen klaren Hinweis, den man ernst nehmen sollte: Das Sample ist für lokale Entwicklung und Demos gedacht. Für Production-Deployments sind notwendig:
- Authentifizierung für API-Endpunkte
- HTTPS und CORS-Einschränkungen
- Rate Limiting
- Temporäre AWS-Credentials (kein Long-Lived Access Keys)

Amazon Bedrock AgentCore Browser-Sessions laufen auf Stundenbasis ab – eine laufende Session verursacht Kosten, also immer `browser.stopSession()` aufrufen oder den Stop-Button im UI implementieren.

## Praktische nächste Schritte

1. **Sample-App klonen und lokal testen**: Das [GitHub Repository](https://github.com/awslabs/bedrock-agentcore-samples-typescript/tree/main/use-cases/browser-live-view-agent) enthält ein voll funktionsfähiges Beispiel mit React-Dashboard, Activity-Log und Fastify-Server.
2. **Eigenes Bedrock-Modell wählen**: Über `BEDROCK_MODEL_ID` lässt sich das Modell einfach wechseln
3. **Eigene Browser-Tools definieren**: Die Playwright-Tooling-API lässt sich erweitern – Custom-Tools für spezifische Workflows sind möglich

## Quellen & Weiterführende Links

- 📰 [AWS Blog: Embed a live AI browser agent in your React app with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/embed-a-live-ai-browser-agent-in-your-react-app-with-amazon-bedrock-agentcore/)
- 📚 [Amazon Bedrock AgentCore Browser Dokumentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html)
- 🔗 [Bedrock AgentCore TypeScript SDK auf GitHub](https://github.com/aws/bedrock-agentcore-sdk-typescript)
- 🔗 [Sample-App Repository](https://github.com/awslabs/bedrock-agentcore-samples-typescript/tree/main/use-cases/browser-live-view-agent)
- 🎓 **Workshops & Kurse**:
  - [React: Modul 1 – Komponenten, Reaktivität & Schnittstellen](https://workshops.de/kurse/react-modul-1) — Fundament für moderne React-Entwicklung
  - [React: Modul 2 – Architektur & Qualität](https://workshops.de/kurse/react-modul-2) — Fortgeschrittene Patterns für anspruchsvolle Projekte

---