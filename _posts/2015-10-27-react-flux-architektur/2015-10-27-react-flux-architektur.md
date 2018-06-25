---
title: "Die Flux-Architektur und React"
description: "Grundlegende Beschreibung der Flux-Architektur."
author: "Sebastian Deutsch"
published_at: 2015-11-17 14:43:48
header_source: "https://unsplash.com/photos/RTGdBD7kQkM"
categories: [react, flux, architektur]
---

Flux ist eine Architektur die erstmalig 2013 von Facebook im Zusammenhang mit React beschrieben wurde. React-Komponenten sind der perfekte Weg, um in einer UI eine Komponenten-Architektur umzusetzen. Man muss dafür einige gelernte Dinge aufgeben, wie z.B. die strikte Trennung zwischen Markup und JavaScript Code. Eine React-Komponente besteht nämlich sowohl aus JavaScript Code, als auch aus HTML - und manchmal auch aus CSS. React-Komponenten sind in sich abgeschlossen und lassen sich über Properties steuern. Da React-Komponenten in klassischer MVC-Denkweise nur den View Teil abbilden, stellt sich die Frage, wie man den restlichen State, oder schöner formuliert, den globalen State verwaltet. An dieser Stelle gab es lange ein großes Vakuum. Was ist nun der beste Weg, um komplexe Applikationen zu entwickeln?

Facebook hat sich dazu zwei fundamentale Konzepte überlegt: Zum einen sollte es nur eine Quelle der Wahrheit geben. Wichtig dabei ist es, den globalen State nicht mit dem internen State einer React-Komponente zu verwechseln. Zum anderen sollten die Veränderungen dieser Datenquellen niemals direkt geschehen, sondern nur über so genannte „Actions“.

Aus diesen Konzepten ergibt sich die [Flux-Architektur](https://facebook.github.io/flux/):

![Flux Architektur](flux-architecture.png)

## Actions

Eine Action ist ein ganz normales JavaScript-Objekt, welches von einem ActionCreator erstellt wird. Eine Action besteht mindestens aus einem „type“-Attribut. Dadurch können Stores erkennen, ob die Action für sie relevant ist. In der Regel ist das „type“-Attribut eine String Konstante, die meist aus gründen der Wiederverwendbarkeit in ein anderes Modul ausgelagert wird (hier: ActionTypes). Die restlichen Attribute werden als Payload betrachtet und dazu benutzt, um die Stores zu verändern. Die ActionCreator werden in der Regel aus den Views (React-Komponenten) aufgerufen. Das Action-Objekt wird dann an den Dispatcher weitergereicht, der es an die Stores verteilt und bei Veränderung die React-Komponenten neu rendert, welche wiederum auf die entsprechenden Stores lauschen.

Hier kommt ein Beispiel, damit das Konzept nicht so abstrakt erscheint. Zunächst ein Event, um einen Todo-Listen Store zu füllen:

```javascript
{
   type: ActionTypes.ADD_TODO,
   name: "aufräumen"
}
```

der ActionCreator sieht dann inklusive Action folgendermaßen aus:

```javascript
export function addTodo(title) {
  return {
    type: ActionTypes.ADD_TODO,
     name: title
  };
}
```

## Dispatcher

Wie bereits erwähnt, nimmt der Dispatcher eine Action entgegen und verteilt diese an die Stores. Eine wichtige Eigenschaft des Dispatchers ist es, dass er zu jedem Zeitpunkt nur je eine Action verarbeitet. Das macht das Debugging von Applikationen deutlich leichter, da die Möglichkeit besteht, den Dispatcher anzuhalten um den Event-Fluss einzusehen und zu kontrollieren.

## Stores

In Stores wird die Applikationslogik verwaltet. Sie werden als Datenquellen für React-Komponenten genutzt. Stores hören auf Actions aus dem Dispatcher. Wird eine Action erkannt, so kann diese den Store verändern. Ein geänderter Store benachrichtigt seine React-Komponenten und die Änderung wird für den Benutzer sichtbar. Es gilt die Faustregel: Für jede Entität im Backend sollte es einen Store geben.

```javascript
switch(action.actionType) {
  case ActionTypes.ADD_TODO:
    text = action.name.trim();
    if (text !== '') {
      create(text);
      TodoStore.emitChange();
    }
    break;
}
```


## Views

React-Komponenten können nun auf Änderungen eines Stores hören und sich gegebenenfalls neu rendern. Viele Flux-Implementierungen unterscheiden dabei zwischen zwei Arten von React-Komponenten: Den “vereinfachten” und den “smarten”. Die so genannten „vereinfachten“ React-Komponenten erhalten ihre Daten mittels Properties. Lösen sie selbst eine Action aus, so erhalten sie diese ebenfalls als Property. Die so genannten "smarten" React-Komponenten, in manchen Implementierungen auch Container genannt, haben Mechanismen, um auf Stores zu hören und Actions zu dispatchen. Als Faustregel gilt hier: „vereinfachte“ Komponenten sind die, die man eventuell zwischen mehreren Projekten teilen möchte. Sie sind abstrakter als "smarte" Komponenten.

Da der Datenfluß von Views über Actions durch den Dispatcher in die Stores wandert wird dieses Pattern wird auch "Single-Directional-Dataflow" genannt.


## Fazit

Wen der konkrete Code aus Facebooks vanilla Flux-Implementierung interessiert, der kann sich den Beispielcode für das TodoMVC-Beispiel [auf GitHub](https://github.com/facebook/flux/tree/master/examples/flux-todomvc) anschauen. Die Flux-Architektur ist keine neue Erfindung. Wer alt genug ist, der kennt möglicherweise noch [WndProc aus der Windows Programmierung](http://bitquabit.com/post/the-more-things-change/).
Flux ist ebenso kein Allheilmittel: Komplexe Anwendungen erfordern auch eine komplexe Strukturierung der Aktionen - dabei kann man schnell die Übersicht verlieren, da sich das ganze anfangs gerne wie ein Overkill anfühlt. Ganz gleich wie gut ein Framework auch sein mag, komplexe Software ist und bleibt leider komplex.
Allerdings gibt es unserer Meinung nach auch bisher keine bessere Architektur. Die Vorteile überwiegen deutlich:
Die sehr gute Strukturierung des Codes, insbesondere durch eine klare Modularisierung der Anwendung, die sehr gut testbar sind und auch mit einem größeren Team bearbeitet werden kann, ist in anderen Frameworks nicht gegeben.

Wer mehr über das Flux-Pattern wissen möchte, der sollte sich das Einführungsvideo von Facebook [anschauen](https://facebook.github.io/flux/).
Die Wahl einer Flux-Implementierung wird in einem [separaten Post](/artikel/flux-implementierung-auswaehlen/) behandelt.

