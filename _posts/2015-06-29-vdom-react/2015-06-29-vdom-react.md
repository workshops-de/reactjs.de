---
title: "Virtuelles DOM mit React.js"
description: "Ein Überblick zum virtuellen DOM von React.js für Einsteiger"
author: "Marcin Skirzynski"
published_at: 2015-07-06 15:47:03.580416
categories: [react, vdom]
---

React ist schnell. Soweit das Stereotyp. Ein Grund dafür ist das virtuelle DOM. Soweit die Erklärung. Doch was genau macht diese Technik so schnell und verhalf damit nicht nur React zu schnellen Ruhm, sondern auch zu [einigen Nachahmern in der JavaScript Framework Landschaft](https://github.com/emberjs/rfcs/pull/15)?

## Langsames DOM

Was wir mittlerweile alle wissen: JavaScript ist performant. Über Jahre optimiert von schlauen Köpfen bei Apple, Microsoft, Mozilla und Google. JavaScript ist nicht das Problem, sondern was es am Ende des Tages anfasst und manipuliert: Das [DOM (Document Object Model)](https://de.wikipedia.org/wiki/Document_Object_Model) ist unser Sorgenkind. Jede Änderung an dieser Baumstruktur quittiert der Browser mit teurer Neuberechnung seiner Geometrie, um es dann schließlich zu zeichnen. Je mehr geändert wird, desto länger dauert es. Je weniger wir den DOM des Browsers verändern, desto schneller ist unsere Applikation.

Eine simple Rechnung.

Wir könnten mit unseren bloßen Händen, viel Schweiß, JavaScript und vielleicht noch jQuery eine App schreiben, die mit unseren Daten jongliert, sich genau merkt an welcher Stelle im DOM wo was versteckt liegt, User-Eingaben entgegennimmt und dann mit chirurgischer Präzision einen minimalinvasiven Eingriff im DOM vornimmt. Wenn wir nur genug über die Innereien des Browsers und Renderings-Prozesses wissen, schreiben wir schnellere Software als wir es mit React und jedem anderen Framework schaffen könnten.

Wir könnten aber auch wieder anfangen unsere Web-Server in Assembler zu schreiben.

Die vielen JavaScript-Frameworks suchen also einen Kompromiss. Performance und Verwendung von altbewährten Entwurfsmustern, um diese Komplexität heutiger Apps zu bändigen (Two-way binding, dirty-checking, … etc.). Funktioniert mal mehr und mal weniger gut.

React versucht es mit einem einigermaßen extremen Ansatz, der in erster Linie die Einfachheit und nicht die Performanz in den Fokus stellt: Wir rendern bei jedem Update einfach alles neu.

Auf der einen Seite klingt das für den Entwickler verlockend und einfach – auf der anderen Seite aber auch wahnsinnig. Haben wir nicht gerade jede Änderung am DOM verurteilt?

## Virtueller DOM

An dieser Stelle betritt Reacts virtuelles DOM die Bühne. Solange wir unsere Anwendung mit Reacts Komponenten und JSX schreiben, arbeiten wir nicht direkt mit dem DOM des Browsers, sondern mit einer normalen JavaScript Objekt, das wir schnell lesen und bearbeiten können, ohne damit tatsächliche Änderungen am DOM auszulösen.

Kurz und knapp passiert folgendes: Bei jeder Änderung der Daten erstellt React einen neuen virtuellen DOM. Ein stark optimierter und heuristischer Algorithmus vergleicht diesen neuen Baum mit den vorherigen und spuckt als Ausgabe eine Liste von minimalen Änderungen am richtigen DOM aus. Diese werden gesammelt und nicht direkt, sondern im Batch an den Browser weitergeleitet.

![vdom](vdom.jpg)

## Diff-Algorithmus

Nettes Konzept, aber Facebooks Entwickler standen schon früh einem Problem gegenüber. Obwohl das Aufbauen eines neuen DOMs nicht sehr kostspielig ist, der Vergleich mit dem vorherigen Baum ist nicht trivial. In der Forschung ist dies ein gut behandeltes Thema für das jedoch nur Algorithmen in der Komplexität [O(n^3)](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) zur Verfügung stehen. Bei 1000 Elementen wären das eine Milliarde Vergleiche. Deutlich zu langsam. Keiner möchte eine Sekunden auf ein Update warten. Doch durch ein paar Heuristiken konnte dies auf eine lineare O(n) Komplexität in der Praxis reduziert werden.

Schnell genug.

Dabei sind diese Vereinfachung zur Verkleinerung des Suchraums durchaus simpel und nachvollziehbar. Allen voran der Vergleich von Komponenten und Listen.

### Komponentenvergleich

React überprüft beide Bäume Top-Down – Level für Level, Knoten für Knoten, Komponente für Komponente. Sobald zwei unterschiedliche Komponenten gefunden werden, wird ab da nicht mehr weitergesucht. Obwohl es theoretisch möglich wäre, dass eine Komponente `<User />` einen sehr ähnlichen DOM zu `<Project />` erzeugen könnte, ist dies doch nicht sehr wahrscheinlich. Anstatt diesen ganzen Teilbaum Knoten für Knoten weiter zu vergleichen, wird der ganze Bereich einfach neu gerendert. Würde React keine Komponenten verwenden, sondern nur mit `div`-Repräsentationen arbeiten, wären solche Optimierungen natürlich nicht so einfach möglich.

Problematisch ist dieser Schritt meistens nicht, solange wir nicht ständig Komponenten quer über den Baum verschieben oder oft zwischen unterschiedlichen Komponenten mit ähnlichem DOM wechseln. In der Praxis passiert dies auch eher selten und im Fall des Falles sollte darüber nachgedacht werden, wieso zwei unterschiedliche Komponenten denselben Baum erzeugen und ob es nicht möglich wäre daraus eine Komponente zu machen.

In diesen ganzen Mechanismus kann zudem noch manuell eingegriffen werden. Jede Komponente kann in der Methode `shouldComponentUpdate` React signalisieren, ob sich diese Komponente geändert hat oder nicht. Beachtet werden muss aber, dass wie beim Komponentenvergleich der ganze Teilbaum des Baums ab dieser Komponente wegfällt und nicht nur die isolierte Komponente. Folglich ein mächtiges Werkzeug, um React mit Domänenwissen beim schnellen Diffing zu unterstützen, aber auch um sich ins eigene Bein zu schießen.

### Listenvergleich

Ein weiteres Problem in der Komplexität sind Listen von Elementen. Angenommen eine Komponente erstellt eine innovative ToDo Liste:

```javascript
class TodoList extends React.Component {
  render() {
    var createItem = (itemText, index) => {
      return <li key={index + itemText}>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
};
```

Falls bei einem Update in der Mitte der Liste etwas hinzugefügt wird, ist die Berechnung der minimalen Veränderung von quadratischer Komplexität. Sobald wir Elemente hin und her verschieben wird es sogar noch schlimmer.

An dieser Stelle verweise ich auf die Warnung, die wahrscheinlich jeder, der mit React gespielt hat, schon in der JavaScript Konsole gesehen hat: ‘Each child in an array should have a unique “key” prop.’

Mit genau diesen Keys und Verwendung von Hashing macht sich React das Leben einfacher. Das Hin und Her schieben in einer Liste ist damit kein Problem, da die Position in der Liste schnell und eindeutig ermittelt werden kann – vergleichbar mit einem Index auf einer Datenbank.


## Zeig mir den DOM

Um nicht noch in jedem Framework dieselbe Anwendung schreiben zu müssen, um Unterschiede zu erkennen, bietet [TodoMVC](http://todomvc.com/) mehrere Implementierungen der gleichen ToDo App in allen derzeit relevanten Frameworks.

Zum Vergleich ein simpler Ablauf:

- Erstelle 6 Einträge.
- Markiere den zweiten und den fünften als erledigt.
- Wechsle zwischen der Ansicht “Active”, “Completed” und “All”.

![angular-react-vergleich](angular-react.gif)

Schon der rein visuelle Vergleich zwischen React und Angular zeigt Unterschiede. Während sich das Hinzufügen von Einträgen zwischen React und Angular kaum unterscheidet, führt das Wechseln der Ansichten in Angular zu vielen DOM Manipulationen. Insbesondere der Wechsel zwischen der “Active” und “All” Filterung löst bei React nur zwei Updates von individuellen DOM Elementen aus, während Angular die gesamte Liste neu rendert.

In den nackten Zahlen macht sich dies auch bemerkbar. 41 Events auf dem DOM werden durch diesen Testablauf in React ausgeführt. Angular braucht dafür 212. Selbst die reinen JavaScript Implementierungen (Vanilla JS und mit jQuery) brauchen ohne weitere Optimierungen 81 bzw. 53 Events.

{: .table}
| Framework | DOM-Events |
| --------: | ---------- |
| Angular   | 212        |
| VanillaJS | 81         |
| Ember     | 72         |
| Backbone  | 69         |
| jQuery    | 53         |
| React     | 41         |

## Fazit

Obwohl Reacts Ansatz auf den ersten Blick kontraintuitiv und zu aufwändig aussieht, ist er in der Praxis dank des virtuellen DOM äußerst effizient. Das Mantra ist: DOM Manipulationen sind von Natur aus langsam. Heuristische JavaScript Diff-Berechnung unfassbar schnell.

Viel wichtiger ist jedoch: Als Entwickler brauche ich mir darum kaum Sorgen zu machen. Aus meiner Sicht werden meine Komponenten immer neu gerendert. Zwar kann ich in React ebenfalls Optimierungen vornehmen, aber grundsätzlich ist der Ursprungszustand meiner App schnell. Es ist deutlich schwieriger in React eine langsame Seite zu erstellen als mit anderen Frameworks. Und genau das ist Reacts Stärke.
