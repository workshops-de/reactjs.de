---
title: "React und Babel mit ES6 und ES7"
description: "Mit ES6 und ES7 wird eurer React noch lesbarer"
author: "Oliver Zeigermann"
published_at: 2015-06-30 09:03:56.211567
header_source: "https://unsplash.com/photos/Zpdb7-owcpw"
categories: [reactjs, babel]
---

## Einleitung

React mit seinem JSX-Format erfordert einen Übersetzer in ein vom Browser ausführbares JavaScript.
Dieser Übersetzer nennt sich Babel.
Da Babel _der_ Übersetzer für React ist, können wir neben JSX auch alle tollen neuen Eigenschaften von ECMAScript 2015 (auch bekannt als ES6) nutzen. Es hört aber nicht dort auf, [Babel unterstützt bereits jetzt eine ganze Reihe von ES7-Features](https://babeljs.io/docs/en/plugins#experimental), die gerade für React sehr praktisch sind und sogar [zum Teil von den React-Entwicklern kommen](https://github.com/sebmarkbage/ecmascript-rest-spread).

Diese wollen wir uns hier einmal kurz angucken. Damit du den Artikel ganz verstehen kannst, solltest du zumindest schon einmal ein [Hello-World mit React](https://reactjs.org/docs/hello-world.html) gebaut haben, es reicht aber Kenntnis über die alte ES5-Variante.

Falls ihr noch nichts mit React gemacht habt, guckt euch am besten die [Einführung in React](/artikel/react-tutorial-deutsch/) auf diesem Blog an.

## React-Komponente mit ES6

Moderner React-Code, der mit ES6 geschrieben wird, sieht bereits sehr lesbar aus und nutzt so viele Standard-JavaScript-Muster wie möglich. So ist eine typische React-Komponente einfach nur eine Klasse, die von `React.Component` erbt. Properties für die Komponente werden in den Konstruktor übergeben und Callbacks vom JSX sind einfache Methoden:

```javascript
import React from 'react';

import MessageDisplay from './MessageDisplay';

export default class HelloMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { greeting: this.props.greeting };
    this.updateModel = this.updateModel.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({ greeting: "" });
    React.findDOMNode(this.refs.in).focus();
  }

  updateModel(event) {
    this.setState({ greeting: event.target.value });
  }

  render() {
    return (
      <div>
        <input ref="in"
          onChange={this.updateModel}
          value={this.state.greeting} />
        <MessageDisplay
          greeting={this.state.greeting} />
        <button
          onClick={this.reset}>Clear
                </button>
      </div>);
  }
}
```
Die [Callback-Methoden sind aber leider noch nicht an `this` gebunden, wenn ihr ES6-Klassen schreibt](https://reactjs.org/blog/2015/01/27/react-v0.13.0-beta-1.html). Stattdessen binden wir diese Callbacks einmalig im Konstruktor. Es wäre auch möglich, dies direkt bei der Angabe des Callbacks im JSX zu tun, dann würden wir aber bei jedem Re-Rendering erneut ein Binding durchführen.

React selber wird durch ein ES6-Import eingebunden, und Unterkomponente sind jeweils nur ein weiteres ES6-Modul. In unserem Fall wäre das die Komponente `MessageDisplay` und die sieht so aus:

```javascript
import React from 'react';

export default class MessageDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <p>{this.props.greeting}, World</p>;
  }
}
```

## ES7 functionBind

Obwohl dies schon hübsch aussieht, gibt es immer noch Punkte, die man verbessern könnte. Das erwähnte Binding zum Beispiel ist syntaktisch nicht gerade elegant. Es gibt als einen [Vorschlag für ES7 nun aber eine einfachere Syntax für das Binding](https://github.com/zenparsing/es-function-bind).

Der Vorschlag ist etwas umfangreicher, aber für uns springt eine einfache Ersetzung des Bindungs-Codes heraus. Unser Konstruktor würde damit so aussehen:

```javascript
constructor(props) {
  // ...
  this.updateModel = ::this.updateModel;
  this.reset = ::this.reset;
}
```

 Wir haben also so etwas wie `this.updateModel.bind(this)` durch das einfachere  `::this.updateModel` ersetzt.

## ES7 classProperties

Wer Sprachen wie Java, C++ oder C# kennt, wird in ES6 vielleicht immer noch das direkte Deklarieren und Initialisieren von Properties in Klassen vermissen. Das geht mit [einem weiteren ES7 Vorschlag](https://gist.github.com/jeffmo/054df782c05639da2adb) und sähe bei unserem Beispiel nun so aus:

```javascript
export default class HelloMessage extends React.Component {
  updateModel = ::this.updateModel;
  reset = ::this.reset;
  state = {greeting: this.props.greeting};

  // Kein Konstruktor mehr nötig
  // ...
}
```

Die Zuweisung der gebundenen Methoden ist also vom Konstruktor in die Klassendefinition gerutscht. Das finde ich nun ein bisschen übersichtlicher und auch logischer. Dass der Code vorher im Konstruktor war, lag ja nur daran, dass es bislang (ES6) keine andere Möglichkeit gegeben hatte.

Aber auch der State kann direkt als Feld mit initialisiert werden und rutscht ebenfalls aus dem Konstruktor heraus. Da dieser danach nicht mehr notwendig ist und nur noch den Super-Konstruktor aufrufen würde, haben wir ihn in unserem Beispiel ganz gelöscht.

## ES7 objectRestSpread

Unsere Komponente `MessageDisplay` bekommt von `HelloMessage` das Property `greeting` übergeben:

```xml
<MessageDisplay
       greeting={this.state.greeting} />
```

 Wunderbar. Was nun aber, wenn wir eine ganze Reihe von Properties haben? Dann müssten wir für jedes Property auch ein neues Name-/Wert-Paar übergeben. Das kann für eine große Menge von Properties sehr lästig und lang werden. Manche Entwickler verzichten dafür sogar auf eine Übergabe und nutzen stattdessen lieber den React `Context`, auf den alle Komponenten zugreifen können. Allerdings ist dieser ein etwas fragwürdiges Konzept und bislang auch nirgendwo dokumentiert.

 Stattdessen gibt es nun einen Vorschlag für einen Spread-Operator, der nicht nur für Arrays und andere Iterables, wie in ES6, sondern auch für [ganze Objekte funktioniert](https://github.com/sebmarkbage/ecmascript-rest-spread).

 So, kann ich dann ein komplettes Objekt an eine Unterkomponente übergeben, in unserem Fall übergebe ich einfach den kompletten Zustand:

```xml
 <MessageDisplay
     {...this.state}
     />
```
Das sieht für unseren Fall noch nicht so viel besser aus, aber für viele Properties ist das durchaus eine Option. In der [React-Dokumentation](https://reactjs.org/docs/jsx-in-depth.html) wird ausdrücklich auf diese Option verwiesen und  sie wird auch empfohlen.

Unserer komplett auf ES7 umgebaute Komponente sieht nun so aus:

```javascript
export default class HelloMessage extends React.Component {
  // es7.functionBind, es7.classProperties
  updateModel = ::this.updateModel;
  reset = ::this.reset;
  state = { greeting: this.props.greeting };

  reset() {
    this.setState({ greeting: "" });
    React.findDOMNode(this.refs.in).focus();
  }
  updateModel(event) {
    this.setState({ greeting: event.target.value });
  }
  render() {
    return (
      <div>
        <input ref="in"
          onChange={this.updateModel}
          value={this.state.greeting} />
        <MessageDisplay
          {...this.state} // es7.objectRestSpread
        />
        <button
          onClick={this.reset}>Clear</button>
      </div>);
  }
}
```

## Fazit

Keines der hier gezeigten ES7-Features ist bisher im Draft-Stadium, d.h. ihr müsst diese Features explizit bei Babel anschalten. Ich habe ein kleines [Repo](https://github.com/DJCordhose/react-sandbox/tree/es7)  gebaut, in dem ich das für euch schon vorbereitet habe und das auch das obige Beispiel als lauffähigen Code enthält.

Die Features können sich noch ändern oder überhaupt nicht in den Standard aufgenommen werden. Für langlebige Projekte, solltet ihr euch also überlegen, ob ihr nicht doch lieber auf sie verzichten wollt. Die ES6-Features sind ja auch schon ganz nett. Diese könnt ihr ohne Einschränkung verwenden, da ES6 schon final spezifiziert ist.

Nutzt ihr bereits die hier beschriebenen Features? Gibt es weitere ES6- oder ES7-Features, die ihr mit React nutzt? Hinterlasst doch bitte einen Kommentar oder schreibt mir auf Twitter unter @DJCordhose.
