---
title: "Wie wählt man die beste Flux Implementierung?"
description: "Flux Implementierungen gibt es wie Sand am Meer, doch wie wählt man die beste aus?"
author: "Sebastian Deutsch"
header: light
published_at: 2015-11-17 14:43:48
header_source: "https://unsplash.com/photos/W72t0b-bmb0"
categories: [react, flux]
---

In einem [vorherigen Post](/artikel/react-flux-architektur/) bin ich auf die, von Facebook vorgestellte, Flux Architektur eingegangen. Als Facebook Flux vorgestellt hat, haben sie zuerst leider nur die Architektur beschrieben und erst eine Weile später eine konkrete Implementierung abgeliefert. Da viele Entwickler die Spannung nicht aushielten, haben sie sich einfach eine eigene Flux Implementierung programmiert. Deshalb gibt es inzwischen so viele Flux Implementierungen, wie es in den 90ern CM-Systeme gab.

## Liste mit Flux Implementationen

{: .table}
| Name           | Universal | React-Native                   | Container | NPM |
| -----------------| ------------  | -------------------------------- | ------------- |------------------------------------------------------------------------------------ |
| Flux              | nein         | keine expliziten bindings | nein          | [flux](https://www.npmjs.com/package/flux)   |
| Redux          | ja             | ja                                      | ja              | [redux](https://www.npmjs.com/package/redux)   |
|  Alt.js            | ja             | ja                                     | ja              | [alt](https://www.npmjs.com/package/alt) |
| Marty.js        | ja             | ja                                     | ja              | [marty](https://www.npmjs.com/package/marty) |
| Fluxible        | ja             | nein                                 | ja              | [fluxible](https://www.npmjs.com/package/fluxible) |
| RefluxJS      | ja             | ja                                     | Mixin         | [reflux](https://www.npmjs.com/package/reflux) |
| McFly           | nein         | keine expliziten bindings | nein          | [mcfly](https://www.npmjs.com/package/mcfly) |
| Flummox      | ja             | nein                                 | nein          | [flummox](https://www.npmjs.com/package/flummox) |
| Lux               | nein         | nein                                 | ja              | [lux](https://www.npmjs.com/package/lux) |
| Material Flux | nein        | nein                                 | ja              | [material-flux](https://www.npmjs.com/package/material-flux) |
| Flambeau      | nein        | nein                                 | ja             | [flambeau](https://www.npmjs.com/package/flambeau) |

Doch wie wählt man die richtige Implementierung für sich aus? Es gibt viele Kriterien nach denen man auswählen kann:

- Die Implementierung sollte möglichst einfach sein
- Die Implementierung sollte möglichst allumfassend sein und den kompletten Frontend Worflow abbilden
- Sie sollte keine Singletons enthalten, damit man seine App gut automatisiert testen kann
- Sie sollte in der Lage sein States auf dem Server zu rendern
- Die Implementierung soll von einem großen Unternehmer unterstützt werden, damit man Support und Weiterentwicklung auch noch in einem Jahr erwarten darf
- Wie viel Sterne hat die Implementierung auf GitHub?

Viele dieser Kriterien sind Geschmackssache oder sogar fraglicher Natur (siehe letzter Punkt), jedoch tauchen in der [Reactiflux Discord Community](http://www.reactiflux.com/) bei den meisten Implementierungen immer wieder die gleichen Fragen auf:

- Wie kann ich Daten von einer API in einen Store laden?
- Wie modelliert man Beziehungen zwischen Stores?
- Wie kann ich von einem Store auf Daten eines anderen Stores zugreifen?
- Wie kann ich sicherstellen, dass Daten in der richtigen zeitlichen Reihenfolge in Stores abgelegt werden?
- Wie stelle ich die Verbindung zwischen meinem globalen State und meinen React-Komponenten her?
- Wie realisiert man Routing?
- Wie realisiert man Middlewares z.B. für Fehlerbehandlung oder Logging?
- Wo speichert man den globalen State einer Applikation ab, der sich Entitäten nicht direkt zuordnen lässt?

## Wie kann ich Daten von einer API in einen Store laden?

In den meisten Flux-Beispielen wird die Abhandlung von AJAX dezent verschwiegen. Viele Anfänger tun sich deshalb schwer API-Zugriffe innerhalb der Code-Basis zu verorten. In den einfach gehaltenen Implementierungen werden AJAX Zugriffe innerhalb der ActionCreators durchgeführt. Bei Alt.JS oder Redux dispatched ein ActionCreator dann mehrere Events. Er startet z.B. mit dem  ```API_REQUEST_STARTED``` Event und für den Fall, dass der Request durchgeführt werden kann wird ein ```API_REQUEST_SUCCESS``` dispatched, zusammen mit den Daten, die von der API gekommen sind. In komplexeren Implementierungen wie z.B. [Marty.JS](http://martyjs.org/) gibt es dedizierte StateSources die den State aus verschiedenen Quellen speisen. Für einen API Zugriff via http würde man dann einen [HttpStateSource](http://martyjs.org/api/state-sources/http.html) implementieren.

## Wie modelliert man Beziehungen zwischen Stores? Oder: Wie kann ich sicherstellen, dass Daten in der richtigen zeitlichen Reihenfolge in Stores abgelegt werden?

Ein Beispiel: Im klassischen TodoMVC gibt es folgende Beziehungen zwischen den Entitäten:

```javascript
Users.hasMany(TodoLists)
TodoLists.hasMany(Todos)
```

Aus performance-technischen Gründen wäre es Unsinn diese Stores mit drei verschiedenen http-Requests (einen für den User, einen für die TodoLists und einen für die Todos) zu füllen. Oft geben viele APIs die Ressourcen inklusive der entsprechenden Relationen zurück. Bei Flux ist nun der Trick, nicht aus Sicht des Stores zu denken, sondern ein Event zu erstellen und alle drei Stores darauf lauschen zu lassen. Betrachten wir einmal folgendes JSON, das als Payload an den Store übergeben wird:

```javascript
{
  id: 1,
  username: "9elements",
  todolists: [
    {
      id: 1,
      name: "work",
      todos: [
        {
           id: 1,
           name: "Blogpost über Flux zu Ende schreiben"
        }
      ]
    },
    {
      id: 2,
      name: "private",
      todos: [
        {
           id: 2,
           name: "Blumen für Freundin"
        },
        {
           id: 3,
           name: "Game of Thrones anschauen"
        },
      ]
    }
  ]
}
```

Insgesamt würde das Event drei mal (jeweils von einem der Stores) konsumiert.

- Der UserStore würde sich nur alle User relevanten Attribute aus der Payload entnehmen.
- Der TodoListsStore würde lediglich das TodoLists Attribut auswerten
- und der TodoStore würde die einzelnen Todos auslesen.

Bei diesem Vorgehen ist es wichtig, dass die Stores in der richtigen Reihenfolge befüllt werden. Gerade wenn man statt IDs richtige JavaScript Objekte verknüpfen möchte muss natürlich der UserStore das Event verarbeitet haben, bevor der TodoListsStore oder der TodoStore auf den User zugreifen kann. Um solche Beziehungen abzubilden gibt es die Möglichkeit in Flux mit waitFor auf einen bestimmten Store zu warten.

## Wie kann ich von einem Store auf Daten eines anderen Stores zugreifen?

Zu dieser Frage gibt es in jeder Flux Implementierung verschiedene Ansätze: Bei der originalen Implementerung von Facebook kann man direkt auf die Stores zugreifen und mittels waitFor sicherstellen, dass sie mit sinnvollen Daten gefüllt sind. [Marty.js](http://martyjs.org/) versucht solche Beziehungen zu vermeiden, indem die Beziehung in den React Komponenten modelliert wird. [Redux](http://redux.js.org/) geht den elegantesten Weg und versucht das Konzept von verschiedenen Stores zu vermeiden, indem es nur ein großes State-Objekt gibt, das alle States und Beziehungen kennt. React-Komponenten sehen dann allerdings von diesem großen State-Objekt via Reducer nur den Ausschnitt, der für die Darstellung der Daten relevant ist.

## Wie kann man seine Applikation nahezu Singletonfrei halten?

Die Original-Implementierung von Facebook ist leider voller Singletons. Daher eignet sie sich nicht besonders gut für Unittests oder Server Side Rendering. Die ersten Implementierungen die dieses Problem gelöst haben waren [Flummox](https://github.com/acdlite/flummox) (inzwischen vom Autor selbst deprecated) und [Alt.js](http://alt.js.org/). Am elegantesten ist auch hier die Lösung von [Redux](http://redux.js.org/), die sehr sparsam mit Singletons umgeht. Des Weiteren sind die meisten Komponenten von Redux lediglich pure Funktionen, was das Unit-Testing extrem vereinfacht.

## Wie stelle ich die Verbindung zwischen meinem globalen State und meinen React-Komponenten her?

Es gibt zwei Möglichkeiten den globalen State in die React-Komponenten einfließen zu lassen:

Über Properties: Dies eignet sich besonders gut für abstrakte Komponenten. Der Vorteil dieser Methode ist, dass man die Komponenten zwischen Projekten leicht wiederverwenden kann, da diese nicht von konkreten Datenstrukturen abhängen. Der Nachteil der Methode ist, dass gerade wenn man abstrakte Komponenten verschachtelt, jede Änderung an der Datenstruktur eine explizite Änderung in den Properties nach sich zieht.
Über ein Publish-Subscribe-Model auf den States. Manche der Frameworks wie z.B. Marty.js oder Alt.js bieten dafür explizite Datenstrukturen ([Marty.createContainer](http://martyjs.org/guides/containers/index.html), [AltContainer](http://alt.js.org/docs/components/altContainer/)). Redux bietet eine ähnliche Möglichkeit, mittels [connect](http://redux.js.org/docs/basics/ExampleTodoList.html#container-components) können React-Komponenten auf Teile des State-Trees subscribed werden. Der Vorteil: Man kann komplexe Datenstrukturen schnell auf Komponenten verteilen. Änderungen der Datenstrukturen müssen nicht explizit implementiert werden. Nachteil: Die Komponenten sind dann stark auf die Applikationslogik zugeschnitten, d.h. sie können nicht gut zwischen Projekten geteilt werden.

Alles in allem hat auch hier Redux gefühlt die Nase vorn, da sie einen Weg favorisieren mit dem man eine Komponente sowohl als “dumme”-Komponente, als auch als “smarte”-Komponente exportieren kann. Die “dummen”-Komponenten eignen sich dann besonders gut in Unit-Tests, während die “smarten”-Komponenten im ganzen Applikations-Kontext verwendet werden können.

## Wie realisiert man Middlewares z.B. für Fehlerbehandlung oder Logging?

Bis auf Redux gibt es hier keine standardisierten Mechanismen. Redux hat diese Mechanismen direkt mit in das Framework eingebaut und macht selbst ebenfalls bei Teilkomponenten wie z.B. asynchronen Aktionen davon Gebrauch. Wer mehr über Redux Middlewares erfahren möchte, dem sei diese [Dokumentation](https://github.com/rackt/redux/blob/master/docs/advanced/Middleware.md) ans Herz gelegt.

## Wo speichert man den globalen State einer Applikation ab, der sich nicht direkt Entitäten zuordnen lässt?

Manchmal muss man Informationen speichern, die sich nicht irgendwelchen Entitäten in der Applikation zuordnen lassen. Z.B. wenn man Entitäten von einer API lädt, dann sollte irgendwo ein Lade-Indikator angezeigt werden, der dem User zeigt, dass gerade Daten geladen werden. Wir empfehlen deshalb immer einen ApplicationStore zu verwalten, indem solche globalen Information abgelegt werden können.

## Ist Flux das richtige Architekturpattern für meine Applikation?

Diese Frage lässt sich leider nicht pauschal beantworten. Auf den ersten Blick erscheint die Aufteilung der Applikationslogik in verschiedene Stores und das auftrennen der Aktionen in Events die dispatched werden als Overkill. Aber gerade, wenn man mit einem größeren Team an einer komplexen React Applikation arbeitet, helfen einem solche Strukturen dabei Arbeitspakete voneinander getrennt zu entwickeln. Ein weiterer Aspekt von Redux ist der Zwang den State als “immutable”-Datenstruktur zu betrachten. Viele Features wie z.B. “Timetravel” oder “Undo/Redo” können dadurch sehr leicht realisiert werden. Es gibt allerdings auch kritische Stimmen, so hat z.B. André Staltz die [Flux-Challenge](https://github.com/staltz/flux-challenge) ins Leben gerufen. In dieser Challenge geht es darum ein Problem mit einer Flux-Implementierung möglichst elegant zu lösen. Seine Prämisse: Es würde keine elegante Lösung geben und man solle ihn vom Gegenteil überzeugen.

Wir bei [9elements](https://9elements.com/) haben bereits ein paar Projekte mit der Kombination Redux/React durchgeführt und glauben: Es ist der beste Frontend Stack der verfügbar ist. Wer gerne mal ein paar Frameworks in Aktion sehen möchte, dem sei [dieses Github Repository](https://github.com/voronianski/flux-comparison) nahegelegt, denn es zeigt von sehr vielen Implementationen den Code an einem konkretem Beispiel.

In einem folgenden Artikel werden wir bald noch ausführlich auf das Redux Framework eingehen. Wenn ihr Feedback zu diesem Artikel habt, dann schreibt es in die Kommentare oder [schickt mir einen Tweet](https://twitter.com/sippndipp).


