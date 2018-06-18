---
title: "Backbone / Chaplin und React"
description: "Backbone oder Chaplin View mit React."
author: "Sebastian Deutsch"
published_at: 2015-06-27 15:06:30.486476
categories: ""
---

I9elements hat viele Single Page Applikationen (kurz SPA) mit Backbone entwickelt z.B. [MoviePilot](http://moviepilot.com/), [Innspec](http://innspec.com/) oder das noch in der Beta befindliche [OptimusTime](http://optimustime.com/). Backbone ist ein relativ schlankes Framework und sein Autor Jeremy Ashkenas hat sich auch explizit dagegen ausgesprochen, das Framework mit mehr Features leistungsfähiger zu machen. Da wir gesehen haben, dass man viele Dinge in Backbone immer wieder auf die gleiche Art und Weise programmieren muss, haben wir Chaplin entwickelt. Chaplin abstrahiert z.B. CollectionViews oder stellt einem über den Mediator einen Event-Bus zur Verfügung. Doch auch Chaplin hat inzwischen ein paar Jahre auf dem Buckel und es gibt moderne Frameworks wie z.B. [AngularJS](https://angularjs.de/) oder [Ember](http://emberjs.com/) mit weit mehr Features (wie z.B. Two-Way Data Binding).

Wenn man seine SPA allerdings auf Angular oder Ember umschreiben möchte, kommt das einem kompletten Rewrite gleich. Aus produkttechnischer und ökonomischer Sicht ist ein kompletter Rewrite eine ziemlich gefährliche Angelegenheit. Oft bleiben Features auf der Strecke, oder es werden Bugs eingeführt, so dass das Produkt gerne bei der Gelegenheit zur völligen Unbenutzbarkeit "verbessert" wird.

Facebook hat die Bibliothek [React.js](http://facebook.github.io/react/) veröffentlicht. Im Gegensatz zu einem Framework, welches sich clientseitig um den kompletten Stack kümmert, bildet React.js lediglich den View-Teil ab. Man könnte React.js am ehesten mit den Directives von Angular.js vergleichen. Ziel dieses Blogposts ist das Refactoring einer Backbone / Chaplin View mittels React.js.

## Refactoring der Backbone Views mit React.js

Um eine typische Backbone View durch React zu ersetzen ist der einfachste Weg, die ```render``` Methode zu überschreiben
und dort explizit die React-Komponente in ```this.el``` zu rendern. Etwaige Parameter werden als Objekt übergeben.

```javascript
var IndexView = React.createFactory(IndexViewComponent);
var TimerView = Backbone.View.extend({
  ...

  render: function() {
    React.render(IndexView({
      collection:                   collection,
      projects:                     mediator.projects.models,
      tags:                         mediator.tags.models,
      editTrackingClicked:          editTrackingClicked.bind(this),
      resumeTrackingClicked:        resumeTrackingClicked.bind(this),
      splitTrackingClicked:         splitTrackingClicked.bind(this),
      changeProjectForTracking:     changeProjectForTracking.bind(this),
      changeDescriptionForTracking: changeDescriptionForTracking.bind(this)
    }), this.el);
  }
});
```

Der Vorteil ist, dass wir ab dann direkt mit React-Komponten weiterarbeiten können. Ein wichtiger Hinweis: Es ist sinnvoll React-Komponenten anhand einer angemessenen Hierachie zu verschachteln. Zusätzlich nutzen wir ein [Mixin bei GitHub](https://github.com/magalhas/backbone-react-component), welches die render Methode bei Veränderung des Models oder Collection erneut aufruft.

Folgendermaßen kann das Mixin mit einem Model benutzt werden...

```javascript
var MyComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  render: function () {
    return <div>{this.state.model.foo}</div>;
  }
});

var model = new Backbone.Model({foo: 'bar'});

React.render(<MyComponent model={model} />, document.body);
// Update the UI
model.set('foo', 'Hello world!');
```

... und so mit einer Collection:

```javascript
var MyComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  createEntry: function (entry) {
    return <div key={entry.id}>{entry.helloWorld}</div>;
  },
  render: function () {
    return <div>{this.state.collection.map(this.createEntry)}</div>;
  }
});
var collection = new Backbone.Collection([
  {id: 0, helloWorld: 'Hello world!'},
  {id: 1, helloWorld: 'Hello world!'}
]);

React.render(<MyComponent collection={collection} />, document.body);
```

## Vorteile

Wer mit komplexeren Views bei Backbone arbeitet, wird die Problematik kennen, dass man Events
von Subviews selbst managen muss. Ein Beispiel: Bei unserem TimeTracking gibt es die TrackingView, auf der viele Trackings in einer Liste angezeigt werden:

![Tracking View](http://reactjs.de/uploads/image/file/1/width_650_ot-1.png "Tracking View")

Jedes Tracking kann mit dem Button "Split" in den SplitView-Modus geschaltet werden. Im SplitView-Modus wird aus dem Tracking ein Scheren-Widget, welches interaktiv den Aufteilungspunkt für ein neues Tracking visualisiert:

![SplitView](http://reactjs.de/uploads/image/file/2/width_650_ot-2.png "Split View")

In der alten Backbone-View musste dafür eine Subview erstellt werden. Auf dieser Subview mussten dann dynamisch viele Mouse-Events aufgefangen werden. Beim Verlassen der SplitView mussten diese Events wieder sauber abgeräumt werden.

Das ist etwas, bei dem React richtig glänzen kann. Der komplette Code für das Splitting wurde aus der Komponente extrahiert und in eine eigene React-Komponente ausgelagert, die so benutzt werden kann:

```javascript
<CircleSplitView
  onClick={this.splitOverlayClicked}
  onChange={this.splitOverlayChanged}
/>
```

Diese Komponte wird nur angezeigt, wenn sich das Tracking im Splitmodus befindet. Während wir mit Backbone/Chaplin uns selbst um den Aufbau des DOMs und das Anhängen der Events kümmern mussten, wird diese Aufgabe nun von React übernommen.

## Nachteile

Wenn man anfängt, komplexere Komponentenarchitekturen zu bauen, dann kann die Event-Delegation mitunter sehr komplex werden. Ziel sollte es sein, dass Daten erst in der Backbone / Chaplin-Controllerschicht verändert werden. Angenommen ein Edit-Input ist unter mehreren Schichten von React-Komponenten vergraben, dann hat man zwei Möglichkeiten die Veränderung der Daten zu realisieren:

### Delegationskette

Die erste Möglichkeit besteht darin, die Delegate-Funktion explizit als Parameter zu übergeben:

```xml
<Haupkomponenten onChange={this.onChange}>
<SubKomponente1 onChange={this.props.onChange}>
<SubKomponente2 onChange={this.props.onChange}>
<SubKomponente3 onChange={this.props.onChange}>
<EditInput onChange={this.props.onChange}>
```

### Mediator-Pattern

Eine andere Möglichkeit besteht darin, via Publish / Subscribe ein Event zu erzeugen und mittels Event-Bus zu propagieren...

```javascript
function onChange(payload) {
  Mediator.publish('onChange', payload);
}
```

...und dann an der entsprechenden Stelle zu fangen und zu verarbeiten:

```javascript
  this.listenTo(Mediator, 'onChange', this.onChange);
```

Das Mediator-Pattern dient also der Entkopplung - bringt allerdings eine schwierigere Testbarkeit mit sich.

## Fazit

Wir haben dieses Refactoring bei [OptimusTime](http://optimustime.com) erfolgreich durchgeführt und konnten den Code stellenweise drastisch vereinfachen.
Viele Bugs die sich aus z.B. dem sauberen Abräumen von Events ergeben haben gehören nun der Vergangenheit an. Wenn euch dieser Artikel gefallen hat, dann folgt uns doch auf [Twitter](http://twitter.com/reactjs_de). Wie hat euch React.js geholfen euern Code verbessern - wir freuen auf eine Dikussion in den Kommentaren.



