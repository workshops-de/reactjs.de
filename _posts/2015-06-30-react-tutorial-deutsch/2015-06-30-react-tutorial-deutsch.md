---
title: "React Einsteiger Tutorial"
description: "Die Ideen hinter React anhand von Beispielen vorgestellt."
author: "Paul Kögel"
published_at: 2015-06-30 18:12:14
header_source: https://unsplash.com/photos/JfOT-WwO1Ig
categories: [react, tutorial]
---

## Einführung in React für Einsteiger

*Dieses Tutorial soll React vorstellen und anhand kleiner Beispiele erste Schritte damit zeigen. Wir beginnen mit der Frage, was React ist und was die Motivation war es zu schreiben.
Danach schauen wir uns die beiden wichtigsten Ideen hinter React an &ndash; die Komponentenarchitektur und den virtuellen DOM. Schließlich werden wir im Fazit Vor- und Nachteile von React betrachten und Kriterien bestimmen, wann sein Einsatz besonders sinnvoll ist.*

<hr>
<div class="workshop-hint">
  <div class="h3">Keine Lust zu Lesen?</div>
  <div class="row mb-2">
    <div class="col-xs-12 col-md-6">
      <p>
        Nicht jeder lernt am besten aus Büchern und Artikeln. Lernen darf interaktiv sein und Spaß machen. Wir bieten euch auch
        <a target="_blank" href="https://workshops.de/seminare-schulungen-kurse/react?utm_source=reactjs.de&utm_campaign=tutorial&utm_medium=link&utm_content=text-top">React Intensiv Schulungen</a> an, falls Ihr tiefer in die Thematik einsteigen wollt.
      </p>
      <p class="">
        <a target="_blank" href="https://workshops.de/seminare-schulungen-kurse/react?utm_source=reactjs.de&utm_campaign=tutorial&utm_medium=button&utm_content=text-top">
          <button class="btn btn-danger">Mehr Informationen zur Schulung</button>
        </a>
      </p>
    </div>
    <div class="col-xs-12 col-md-6">
      <img class="img-fluid img-rounded" src="workshops-attendees.png" alt="Teilnehmer in der Veranstaltung React Intensiv Workshop/Schulung">
    </div>
  </div>
</div>
<hr>

## Was ist React?

React ist eine JavaScript-Bibliothek zum Erstellen von Benutzeroberflächen. Es wurde 2013 von Facebook unter [BSD-Lizenz](https://de.wikipedia.org/wiki/BSD-Lizenz) veröffentlicht und schlägt seitdem immer größere Wellen und beeinflusst nachhaltig die gesamte JavaScript-Frontendlandschaft. Es wird verwendet von Facebook, Instagram, Whatsapp, Yahoo, AirBnB, dem Atom-Editor und [vielen anderen mehr](https://github.com/facebook/react/wiki/Sites-Using-React).

React machte schnell vor allem wegen seines virtuellen DOMs und der hervorragenden Renderingperformanz von sich reden. Daneben bietet es eine modulare Komponentenarchitektur, die als Basis für modularen und leicht nachzuvollziehenden Frontendcode dient.

Diese Neuerungen bringen auch Nichtvertrautes mit sich. Der Einstieg in React gelingt am besten, wenn man bereit ist, sich auf unkonventionelle Ideen einzulassen und alte Überzeugungen abzulegen.
Wir sind immer noch dabei klarer zu begreifen, welche Vorteile die neuen Wege mit sich bringen, die React uns beschreiten lässt. Das Netz wimmelt vor begeisterten Erfahrungsberichten und Bibliotheken, die auf React aufbauen und immer mehr React-Anwendungen sprießen aus dem Boden. Höchste Zeit, dass wir uns React näher anschauen!

### Motivation hinter React
Facebooks Motivation hinter React war es, seinen Frontendcode leichter verstehbar und besser wartbar zu machen. Vor React dauerte es lange, um sich das Verhalten von bestehendem Code zu vergegenwärtigen. Es gab Teile des Codes, die so komplex waren, dass niemand außer ein bestimmter Mitarbeiter sie anfassen wollte. Bugs wie unsynchronisierte Zähler ungelesener Nachrichten traten immer wieder auf. Allgemein gilt, dass je stärker gewachsener Code miteinander verwoben ist, desto schwieriger wird er zu warten.

Das Ziel von React ist es, _einfacheren_ Code schreiben zu können, dessen Bestandteile weniger miteinander verschränkt oder verwoben sind (der Wortursprung von [komplex](https://de.wiktionary.org/wiki/komplex)). Um das zu erreichen, war es nötig, nicht immer dem _leichtesten_ und vertrautesten Weg zu folgen (vgl. ["Simplicity Matters"](https://www.youtube.com/watch?v=rI8tNMsozo0) &ndash; [Rich Hickey](https://twitter.com/richhickey); vor allem zur Unterscheidung zwischen _einfach_ (simple) und _leicht_ (easy)).

### Eine Bibliothek, kein Framework
React tritt als Bewerber im sogenannten [Javascript MV\*-Feld](http://todomvc.com) an, folgt jedoch weder der populärsten Ausprägung MVC, noch besteht es aus viel mehr als dem was der View in MV\* entspräche.

React ist als Bibliothek konzipiert und möchte kein mächtiges Framework sein. So bleibt es ein flexibles Werkzeug, dass es erlaubt Anwendungen in der Sprache ihrer eigenen Problemdomäne &ndash; und nicht der Sprache eines Frameworks &ndash; zu modellieren.

Da React einem nicht die Grundstruktur seiner Anwendung vorschreibt (vgl. ["Architecture the Lost Years"](https://www.youtube.com/watch?v=WpkDN78P884) &ndash; [Robert Martin](https://twitter.com/unclebobmartin)), schränkt es einen weniger ein und lässt sich hervorragend in bestehende Codebasen integrieren, ohne dass dort alles umgestrickt werden müsste.

### Reacts Bauteile
Im wesentlichen hat React folgende Bestandteile:

1. Komponentenarchitektur
2. Virtueller DOM
3. Browserkompatibilität:
synthetische Events, um jQuery-artig Browserunterschiede wegzuabstrahieren

Auf die ersten beiden Punkte möchte ich nun genauer eingehen. Der dritte Punkt sei an dieser Stelle nur der Vollständigkeit halber erwähnt und muss uns für diese Einführung nicht weiter interessieren.

## Komponentenarchitektur
Reacts zentraler und einziger Baustein sind Komponenten. React-Komponenten ähneln Web Components oder Angular Directives.

### 1. Beispiel: eine einfache Komponente

Unsere erste Komponente macht nicht viel mehr als einen Klick auf einen Button abzufangen. Interaktive Demo (auch auf [JSBin](http://jsbin.com/zaqimu/1/edit?html,js,console,output)):

<iframe src="code/beispiel1.html" width="100%" height="250"></iframe>

```javascript
var ButtonCounter = React.createClass({ // (1)
  add: function() { // (3)
    console.log('add 1!');
  },

  render: function() { // (2)
    return <div> // (4)
      <h1>Counter</h1>
      <button onClick={this.add}>
        +
      </button>
    </div>
  }
});
```

Komponenten werden mit `React.createClass` (1) erzeugt. Die wichtigste Funktion einer Komponente ist `render` (2), wo das Markup für die DOM-Repräsentation der Komponente definiert wird. Die `add`-Funktion (3) im Beispiel ist eine von uns ausgedachte, die gerade nicht viel mehr macht als Klickevents in die JavaScript Konsole des Browsers zu schreiben. Zu bemerken ist noch, dass React den ganz normalen `onClick`-Handler des Browsers verwendet, der als Attribut auf dem `<button>` gesetzt wird, statt beispielsweise durch CSS-Selektoren. Durch geschweifte Klammern (`{}`) können in JSX JavaScript-Ausdrücke eingebettet werden.

### JSX
Wie kommt es, dass wir mitten in der `render`-Funktion (4) auf einmal HTML schreiben können? React verwendet dazu [JSX](https://facebook.github.io/jsx/), eine schlanke Syntaxerweiterung für JavaScript, mit der es leichter ist Markup zu schreiben.
Die Verwendung von JSX ist optional, hat sich aber als Standard Templating-Lösung in React etabliert. JSX macht nichts weiter als die spitzen Klammern oben in folgende JavaScript-Funktionsaufrufe umzuwandeln ([JSBin](http://jsbin.com/qezomi/edit?html,js,console,output)):

```javascript
React.DOM.div({},
  React.DOM.h1({}, 'Counter'),
  React.DOM.button({onClick: this.add}, '+'));
```

Dieser Code dient uns nur zur Illustration und wir können `React.DOM` zugunsten von JSX direkt wieder vergessen. Wir werden nachfolgend und in allen anderen Artikeln auf ReactJS.de JSX verwenden. Wichtig ist es, im Hinterkopf zu behalten, dass es unter der Haube zu reinem JavaScript umgewandelt wird. <a href='#footnote-1' id='footnote-1-anchor'>[1]</a>

Um JSX schreiben zu können, wird es in der Regel mit [Babel](https://babeljs.io) in einem Kompilierungsschritt in JavaScript übersetzt. Zum Entwickeln kann man auch den [JSX Transformer](https://reactjs.org/docs/try-react.html#in-browser-jsx-transform) benutzen, so dass JSX innerhalb von `<script type='text/jsx'>`-Tags verwendet werden kann. Bei JSBin kann man für den JavaScript-Tab ein Babel-Plugin aktivieren.

#### Bewertung
> "If you're going to hate on React for some reason, make it something other than JSX"
  &mdash; [Alex Matchneer](https://twitter.com/machty), Mitglied des Ember.js Core Teams. [Quelle](https://docs.google.com/presentation/d/1afMLTCpRxhJpurQ97VBHCZkLbR1TEsRnd3yyxuSQ5YY/preview?usp=sharing&sle=true#slide=id.g380053cce\_1205).

JSX war mit dem Erscheinen von React für viele der erste Stein des Anstoßes. Warum keine schlankere Templating-Sprache wie HAML statt XML-artiger Syntax? Warum inline Eventhandler setzen? Und vor allem, warum bitte sollen wir auf einmal unser Markup in einer JavaScript-Datei schreiben, wo wir uns doch jahrelang die Trennung von HTML, CSS und JavaScript eingebläut haben?

Die Macher von React halten die Aufteilung nach Technologien für kein gutes Kriterium für eine sinnvolle _separation of concerns_. Sie argumentieren stattdessen, dass wir zur Trennung der Aspekte unseres Frontendcodes besser Komponenten als Grundlage benutzen sollten. Daher ist es nur konsequent, wenn man allen Code, der zu einer Komponente gehört auch in eine Datei schreibt - egal ob HTML, JavaScript, oder CSS. Mehr hierzu in ["React: Rethinking best practices"](https://www.youtube.com/watch?v=x7cQ3mrcKaY) von [Pete Hunt](https://twitter.com/floydophone) und unter <a href='#footnote-2' id='footnote-2-anchor'>[2]</a>.

Ein weiterer Vorteil dieses Ansatzes ist es, dass React-Programmierer keine neue Templating-Sprache lernen müssen. JSX ist, wie angemerkt, nur eine sehr dünne syntaktische Abstraktion über normale JavaScript Funktionsaufrufe.
Statt _logicless templates_ à la Handlebars, die einen schnell unnötig einschränken, wählt React genau den umgekehrten Ansatz und lässt uns zum Bauen unserer Templates den vollen Funktionsumfang von JavaScript nutzen.


### 2. Beispiel: eine einfache Komponente mit State

Es wird Zeit, dass unser `<button>` etwas Sinnvolleres macht ([JSBin](https://jsbin.com/wezupunego/1/edit?html,js,output)):

<iframe src="code/beispiel2.html" width="100%" height="250"></iframe>

```javascript
var ButtonCounter = React.createClass({
  getInitialState: function() { // (1)
    return({count: 0});
  },

  add: function() {
    this.setState(
      {count: this.state.count + 1}); // (2)
  },

  render: function() {
    return(
      <div>
        <button onClick={this.add}>
          +
        </button>
        <p>Count: {this.state.count}</p>
      </div>
    );
  }
});
```

React Komponenten haben ein besonderes Attribut, den State, der Daten beinhaltet, die nur diese Komponente verwaltet und verändern kann. Der State unseres Buttons wird in getInitialState (1) mit einem JavaScript-Objekt initialisiert, das in seinem `count`-Attribut den Zählerstand festhält. `getInitialState` wird einmalig, beim Erstellen von Komponenteninstanzen aufgerufen.
In der `add`-Funktion setzen wir dann mit `setState` einen neuen State: `count` wird um 1 erhöht. Durch den expliziten Aufruf von `setState` benötigt React kein dirty checking. React ruft nach Änderungen des States einer Komponente automatisch ihre `render`-Funktion auf - so wird der neue Zählerstand direkt angezeigt.

### 3. Beispiel: drei farbige Buttons mit Props
Neben State, der von einer Komponente verändert werden kann, gibt es noch Props, die von außen an Komponenten übergeben werden und innerhalb der Komponente nicht veränderlich sind. Die explizite Unterscheidung zwischen veränderlichem State und unveränderlichen Props macht es leichter das Verhalten von Komponenten nachzuvollziehen. Sie ist ein wichtiges Merkmal der Komponentenarchitektur und dient Facebooks ursprünglichem Ziel Code nachvollziehbarer zu machen. Fehlerhafte Änderungen am Zustand meiner Anwendung können nur von Stateänderungen, nie jedoch von Props herrühren.

Ein einfaches Beispiel für Props können wir sehen, wenn wir mehrere farbige Buttons haben:

```jsx
var ButtonCounter = React.createClass({
  // `getInitialState` und `add` wie gehabt

  style: function() { // (4)
    return {backgroundColor: this.props.colour};
  },

  render: function() {
    return(
      <div>
        <h1>{this.props.colour} counter</h1> // (3)
        <button style={this.style()}
                onClick={this.add}>+</button>

        <p>Current count:
          <span>{this.state.count}</span>
        </p>
        <hr />
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {colours: ['red', 'green', 'blue']};
  },

  buttons: function() {
    return this.state.colours.map(function(colour) { // (2)
      return(<ButtonCounter colour={colour} />); // (1)
    });
  },

  render: function() {
    return(
      <div>{this.buttons()}</div>
    );
  }
});

React.render(<App />,
  document.querySelector('#react-container')); // (5)
```

[Interaktive Demo bei JSBin](http://jsbin.com/yesaka/edit?js,output)

Zunächst haben wir hier erstmalig eine Komponentenverschachtelung (1). Die neue `App`-Komponente ruft in ihrer `render`-Funktion die `ButtonCounter`-Komponente auf - und zwar für jede ihrer drei Farben (2).
Die `colour`-Prop wird von `App` wie ein HTML-Attribut an die `ButtonCounter` übergeben (1). Innerhalb der `ButtonCounter` ist die jeweilige `colour` über `this.props.colour` verfügbar (3). Props sind in Komponenten nur les-, nicht schreibbar. Das heißt jedoch nicht, dass der Farbwert eines Buttons in unserer Anwendung _absolut_ unveränderlich ist. Die `ButtonCounter`-Komponente selbst kann ihre Farbe nicht verändern, aber die umgebende `App`-Komponente setzt ja von außen die Farbe der `ButtonCounter`. Da die Farben in `App` Teil des States sind, können wir sie auch verändern:

```jsx
App = React.createClass({

  // Rest wie gehabt

  componentDidMount: function() { // (1)
    var that = this
    window.setInterval(function() { // (2)
      that.setState({colours: [ // (3)
                        that.state.colours[1],
                        that.state.colours[2],
                        that.state.colours[0]]});
    }, 500);
  }
});
```

`componentDidMount` (1) ist eine von Reacts Lifecycle-Hook-Funktionen. Sie wird einmalig ausgeführt, wenn eine Komponente in den DOM gerendert wird. Um zu veranschaulichen, dass die `colour` Prop der `ButtonCounter` von _außen_ verändert werden kann, tauschen wir sie alle 500ms (2) indem wir mit `setState` den State der `App`-Komponente verändern (3).
Props sind immer nur _für die jeweilige Komponente_, aber nicht absolut unveränderlich, denn die Eltern der Komponente setzen ja die Props und können dynamisch neue Werte an eine Unterkomponente geben. Sobald sich der State auf `App` ändert, wird automatisch ihre `render`-Methode neu aufgerufen. Die Unterkomponenten bekommen dabei neue Props übergeben und rendern ebenfalls neu.

### 4. Beispiel: State aus Komponenten herausgezogen in Mutterkomponente
Die Verschachtelung von Komponenten wird interessant, wenn der Zustand einer Komponente den Zustand einer anderen beeinflusst oder wir den Zustand mehrerer Komponenten auf einmal von außen steuern wollen. Die einfachste Art solche State-Abhängigkeiten abzubilden ist den State in die Mutterkomponente umzuziehen und die Unterkomponenten nur noch Props empfangen zu lassen. Wenn eine Unterkomponente eine Userinteraktion empfängt fertigt sie diese dann nicht mehr selbst ab, sondern ruft einen Callback auf der Mutterkomponenten aus.

Ein simples Beispiel hierfür sind aufklappbare Textblöcke. Durch Klicken auf die Überschrift wird ein Fließtext ein- oder ausgeblendet. Soweit ließe sich alles noch über State innerhalb der `CollapsibleBlock`-Komponente regeln. Spannend wird es, wenn wir außerhalb der Komponenten einen "Toggle all"-Knopf hinzufügen, der den Zustand aller `CollapsibleBlocks` umkehrt. Neben dem Knopf können nach wie vor noch über die Überschriften Texte auf- und zugeklappt werden.

```jsx
var BOOKS = { // (1)
  ulysses: {
    slug: 'ulysses',
    title: 'Ulysses',
    body: 'YES BECAUSE HE NEVER DID...'
  },
  seizeTheDay: {
    slug: 'seizeTheDay',
    title: 'Seize the Day',
    body: 'Seize the Day, first published in 1956...'
  }
};

var CollapsibleBlock = React.createClass({ // (6)
  render: function() {
    return(
      <div className=
        {this.props.toggleState ? 'open' :
                                  'closed'}>
        <h3 onClick=
          {this.props
                .toggleHandler
                .bind(null, this.props.book.slug)}> // (6)
          {this.props.book.title}
        </h3>
        <p>{this.props.book.body}</p>
      </div>
    );
  }
});

var App = React.createClass({

  getInitialState: function() { // (3)
    return {
      ulysses: true,
      seizeTheDay: false
    }
  },

  toggleAll: function() {
    this.setState({ulysses: !this.state.ulysses, seizeTheDay: !this.state.seizeTheDay});
  },

  toggleHandler: function(slug) {
    var newState = {};
    newState[slug] = !this.state[slug];
    this.setState(newState);
  },

  toggableBooks: function(data) { // (5)
    var that = this;
    return Object.keys(data).map(function(el) {
      var slug = data[el].slug;
      return(
        <CollapsibleBlock key={slug} book={that.props.books[slug]}
                          toggleHandler={that.toggleHandler}
                          toggleState={that.state[slug]} />
    });
  },

  render: function() {
    return(
      <div>
        <h1>Toggable Content</h1>
        <button onClick={this.toggleAll}>Toggle all</button> {/* (4) */}
        <div>
          {this.toggableBooks(this.props.books)}
        </div>
      </div>
    )
  }
});

React.render(<App books={BOOKS} />, document.getElementById('react-main')); // (2)
```

Wir beginnen mit der Definition einer Datenstruktur mit Buchdaten (1), die am Ende des Codebeispiels als Prop an `App` übergeben werden (2). Zu Beginn ist "Ulysses" aufgeklappt und "Seize the Day" zugeklappt (3).
In `Apps` `render`-Funktion wird der "Toggle all"-Button erstellt (4). Die klappbaren Textblöcke werden mit `CollapsibleBlock`-Komponenten erstellt, die in der `toggableBooks`-Funktion (5) mit Props aus dem State der `App`-Komponente initialisiert werden.
Die `CollapsibleBlock`-Komponente hat nun gar keinen State mehr (6). Wenn ihre Überschrift geklickt wird ruft sie die `toggleHandler`-Funktion der `App` als Callback auf. Damit wir dort noch wissen auf was geklickt wurde übergeben wir den Slug des Buches and `toggleHandler`.
`toggleHandler` und `toggleAll` in `App` sind die einzigen Funktionen, die State modifizieren. Nach jedem Aufruf von `setState` wird automatisch neu gerendert.

Einen ähnlichen Ansatz würde man wählen, wenn Komponenten-State voneinander abhängig ist - etwa wenn man nur ein Element aus einer Liste auswählen darf. Sobald eine Komponente einen Klick empfängt muss sie ggf. eine zuvor ausgewählte Schwesternkomponente deaktivieren. Auch hier würde man am besten in der Mutterkomponente nachhalten welches Unterelement gerade ausgewählt ist und in einem Klickhandler der Mutterkomponente entscheiden welches Kind de-/aktiviert werden muss.

### Zwischenfazit
Anhand einfacher Beispiele haben wir einen ersten Einblick in das Arbeiten mit React Komponenten bekommen und gesehen wie React mit JSX und JavaScript Benutzeroberflächen modelliert. Im letzten Beispiel haben wir gelernt wie man einfach Komponenten-Zustände koordinieren kann. Der gezeigte Lösungsweg ist jedoch immer weniger geeignet je weiter die zu koordinierenden Komponenten in unserer Komponentenhierarchie voneinander entfernt liegen. Einen Clickhandler von Kind- zu Mutterkomponente zu reichen ist leicht, aber was machen wir wenn es über 3 Hierarchieebenen passieren soll? React bietet hierfür keine Lösung mehr, da es sich auf das Bauen von UI-Elementen beschränkt und für komplexere Koordinationen keinen Weg vorgeben möchte. Facebooks Lösung dazu heißt Flux, verfolgt die gleichen Ziele und hält sich an die gleichen Ideale wie React. Flux stellen wir euch in einem kommenden Artikel vor, man kann React aber schon heute als Renderingschicht in eine bestehende Backbone-Architektur integrieren. [Hier]() zeigen wir euch wie das geht.

## Virtueller DOM
Wir hatten an verschiedenen Stellen in den Beispielen gesehen, dass React nach Aufruf von `setState` automatisch den DOM neu rendert und unsere Datenänderungen wie von Geisterhand in unserer Benutzeroberfläche zu sehen sind. In diesem Abschnitt möchten wir verstehen, wie genau das vonstatten geht.

Den DOM synchron zu halten ist eine der großen Herausforderungen für "JavaScript-MV\*"-Lösungen. In der Regel wird dazu auf die ein oder andere Form von Data Binding gesetzt, was zwar zunächst _leicht_ einzubauen ist, unter der Haube aber alles andere als _einfach_ ist und bei komplexen Anwendungen oft zu schwer nachzuvollziehenden Bugs oder Performanceproblemen führen kann.

Hier ein Beispiel aus Prismatic: [Prismatic DOM Updates](https://raw.githubusercontent.com/paulwittmann/blog-posts/master/images/davis-prismatic-example-02-after-cropped.png)
(Quelle: ["The challenges and benefits of a functional reactive frontend"](https://www.youtube.com/watch?v=TihhFQjtiZU) &ndash; [Ian Davis](https://twitter.com/jungziege)).

Zu sehen ist eine Liste von zwei Artikeln unter der Rubrik "Urban Exploration". Beide Artikel haben in ihrer oberen rechten Ecke ihre Tags angezeigt. Wenn ich nun auf "Urban Exploration" beim oberen Artikel klicke, muss der DOM an vier Stellen verändert werden.
Zum einen muss beim oberen Artikel selbst ein Häkchen neben dem "Urban Exploration"-Tag erscheinen. Das gleiche muss beim unteren Artikel und ganz oben unter der Rubriküberschrift geschehen. Außerdem muss noch die Zahl der Follower für "Urban Exploration" um eins erhöht werden.

Das React Entwicklungsteam wollte das Problem der DOM-Synchronisierung ein für alle mal lösen, nahm einen Schritt Abstand, und fragte sich ganz unvoreingenommen, was denn die aller _einfachste_ Lösung sei. Die Antwort ist denkbar einfach: wie in den guten alten Zeiten von rein serverseitigen Anwendungen bei jeder Änderung _alles_ neu rendern. So kann garantiert keine Stelle im DOM vergessen werden.

Nur wie soll man das jemals bauen können ohne sich von akzeptabler Renderingperformanz zu verabschieden? Die ersten Schritt waren in der Tat ernüchternd. In Prototypen bei denen Komponenten in festen Zeitintervallen neu gerendert wurden flackerten, verloren die Scrollposition, oder den Zustand von Eingabefeldern. Zum Glück ließ sich das Team davon nicht abschrecken. Der Vorteil nicht mehr über Rendering nachdenken zu müssen war zu verlockend, um vorschnell die Flinte ins Korn zu werfen.

Der Schlüssel zum Erfolg war die Adaptierung einer Idee aus der Spieleindustrie, die dort schon lange eingesetzt wird. Hier ein Diagramm der Doom 3 Renderingengine (in scharz-weiß) mit den React-Entsprechungen darüber (blau-weiß).

[Diagramm der Doom 3 Renderingengine](https://raw.githubusercontent.com/paulwittmann/blog-posts/master/images/doom3-react.png)

Mit React kann ich so arbeiten als würde die `render`-Funktion aller Komponenten aufgerufen werden &ndash; bei jedem Aufruf von `setState` an irgend einer Stelle meines Codes. Ich muss mir um DOM-Anpassungen keine Gedanken mehr machen.
Aber wie kann das gut gehen? Das Geheimnis heißt virtueller DOM. Die `render`-Funktionen von React-Komponenten modifizieren nicht den tatsächlichen DOM, sondern erzeugen lediglich eine Repräsentation des DOMs.
Ein Aufruf von `React.DOM.div` beziehungsweise dem JSX `<div>` allein führt zu keiner Änderung im DOM. Beides sind reine Funktionen, die lediglich eine Repräsentation des DOMs zurückgeben &ndash; z.B. ein Buttonelement mit einer bestimmten Farbe, abhängig von den Datenstrukturen (State und Props) mit denen wir den Zustand unserer Anwendung modellieren.

Diese Repräsentationen sind nichts weiter als normale JavaScript-Objekte, die z.B. so aussehen (Demo wie man diese Objekte sehen kann [hier](http://jsbin.com/lugudu/edit?html,js,console)):

```jsx
{
  "type": "div",
  [...]
  "_store": {
    "props": {
      "children": [
        {
          "type": "h1",
          [...]
          "_store": {
            "props": {
              "className": "mainHeadline",
              "children": "Hallo ReactJS.de"
            }
            [...]
          }
        },
        {
          "type": "p",
          [...]
          "_store": {
            "props": {
              "children": "Lorem ipsum"
            }
            [...]
          }
        }
      ]
    }
    [...]
  }
}
```

Echte DOM-Anpassungen sind meist _der_ Flaschenhals bei der Renderingperformanz und _können_ derzeit nicht bei jeder Datenänderung ausgelöst werden, wenn man eine nutzbare Seite haben möchte. Was jedoch dank performanten JavaScript-Engines heutzutage geht, ist es die Repräsentation des DOMs mit einer früheren zu vergleichen, um so minimale Änderungen zu bestimmen, die auf dem echten DOM vorgenommen werden.

Das Problem bei Rendering ohne einen virtuellen DOM ist auch, dass sich nicht gut sagen lässt welche Stelle eines UI-Elements sich geändert hat. Muss ich nur ein Häkchen hinzufügen, oder doch noch eine Zahl verändern? Da sich hier ohne viel unwartbaren Aufwand nicht gut Buch führen lässt, rendern bestehende Lösungen zumindest ihre Bausteine (Views etc.) komplett neu.
React ist vor allem performanter da sie präzise DOM-Updates nutzt, obwohl ich sogar davon ausgehen kann, dass die ganze Anwendung neu gerendert wird. Schön :)

Hier ein Beispiel bei dem links React und rechts Backbone auf eine Texteingabe reagieren. Am Ende des Eingabefelds stehen mathematische Formeln, die mit [KaTeX](https://github.com/Khan/KaTeX) TeX-artig gerendert werden &ndash; eine teure Renderingoperation, wie man am Flackern auf der rechten Seite sieht. React brilliert hier, da die KaTeX-Formeln nur einmal in den DOM geschrieben werden &ndash; danach ändern sie sich nicht mehr. In Backbone wird ständig die ganze View neu in den DOM geschrieben und entsprechend flackert es dort.

[React -vs- Backbone Performanzdemo](https://raw.githubusercontent.com/paulwittmann/blog-posts/master/images/monkeys-slow.gif)
(Quelle: ["Hack Reactor"](http://joelburget.com/backbone-to-react/) &ndash; [Joel Burget](https://twitter.com/dino_joel))

Mehr zur Implementierung des virtuellen DOMs in unserem Artikel [Virtuelles DOM mit React.js](/artikel/vdom-react/).

## Die Leute hinter React
+ [Jordan Walke](https://twitter.com/jordwalke)
+ [Pete Hunt](https://twitter.com/floydophone)
+ [Christopher Chedeau](https://twitter.com/vjeux)
+ [Jing Chen](https://twitter.com/jingc?lang=en)

<hr>
<div class="workshop-hint text-center">
  <div class="h3">Hat dir das Tutorial geholfen?</div>
  <div class="row mb-2">
    <div class="col-xs-12 col-md-6">
      <p> Wir bieten auch <a target="_blank" href="https://workshops.de/seminare-schulungen-kurse/react?utm_source=reactjs.de&utm_campaign=tutorial&utm_medium=link&utm_content=text-buttom">React Intesiv Schulungen</a>        an um dich möglichst effektiv in das Thema React zu begleiten. Im Kurs kannst Du die Fragen stellen, die Du nur
        schlecht googlen kannst, z.B. “Besserer Weg, um meine Applikation zu strukturieren”. Wir können sie Dir beantworten.
      </p>
      <p class="text-center">
        <a target="_blank" href="https://workshops.de/seminare-schulungen-kurse/react?utm_source=reactjs.de&utm_campaign=tutorial&utm_medium=button&utm_content=text-buttom">
          <button class="btn btn-danger">Jetzt weiter lernen</button>
        </a>
      </p>
    </div>
    <div class="col-xs-12 col-md-6">
      <img class="img-fluid img-rounded" src="workshops-attendees.png" alt="Teilnehmer in der Veranstaltung React Intensiv Workshop/Schulung">
    </div>
  </div>
</div>
<hr>


## Anhang

### Fußnoten
**<span id='footnote-1'>[1]</span>** [zurück zum Text](#footnote-1-anchor)
Da JSX in JavaScript umgewandelt wird kann man z.B. folgendes Markup nicht damit erzeugen:

```jsx
render: function() {
  // invalides JSX!
  return(
    <h1>Hallo</h1>
    <h2>Wie geht es dir?</h2>
  );
```

Das resultierende Javascript würde versuchen aus `render` die Ausgabe von _zwei_ verschiedenen `React.DOM`-Aufrufen zurückzugeben. Da JavaScript-Funktionen aber nur einen Wert zurückgeben können, muss man in JSX immer noch ein umschließendes Element, wie ein `<div>`, hinzufügen.

**<span id='footnote-2'>[2]</span>** [zurück zum Text](#footnote-2-anchor)
Die Bestrebungen gehen hier sogar so weit, dass man optional CSS direkt in der Komponente schreiben kann, das dann per Inline-Styles (!) eingebunden wird. Die Vorteile dieses Ansatzes zeigt [Christopher Chedeau](https://twitter.com/vjeux) in ["React: CSS in your JS"](https://vimeo.com/116209150). Unterstützung für einige CSS Features wie Media Queries oder `:before`- und `:after`-Elemente sind mit Inline-Styles nicht möglich, hierfür gibt es aber Webpack-Plugins.
Wenn CSS in JavaScript geschrieben wird, wird kein CSS-Präprozessor wie SASS oder LESS mehr benötigt.

### Links
* ["Legal"-Datei zur Lizenz](https://engineering.fb.com/open-source/updating-our-open-source-patent-grant/)
