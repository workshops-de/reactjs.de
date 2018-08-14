---
title: "Children in React verstehen"
description: "Lerne wie Children in ReactJS funktionieren"
author: "Max Stoiber"
published_at: 2017-06-08 15:00:00.000000Z
header_source: https://unsplash.com/photos/iWr3xT8C6L4
categories: [react, basics]
---

> Info: Wir haben den Begriff "Children" -Kinder, bewusst nicht übersetzt.

Nehmen wir an, wir haben eine `<Grid />` Komponente, die `<Row />` Komponenten enthalten kann. Diese würdest du so verwenden:

```html
<Grid>
  <Row />
  <Row />
  <Row />
</Grid>
```

Diese drei `Row` Komponenten werden an die `Grid` Komponente als `props.children` übergeben. Mit einem *expression container* (das ist der technische Begriff für diese geschweiften Klammern in JSX) können Parents ihre Children rendern.

```jsx
class Grid extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}
```

Parents können auch entscheiden, keine Children zu rendern oder zu verändern. Diese `<Fullstop />` Komponente zum Beispiel rendert ihre Children überhaupt nicht.

```jsx
class Fullstop extends React.Component {
  render() {
    return <h1>Hello world!</h1>
  }
}
```

Es spielt keine Rolle, welche Children du an diese Komponente übergibst, sie wird immer „Hello world!“ zeigen und nichts anderes.

Hinweis: Das `<h1>` in dem Beispiel oben (ähnlich wie alle HTML-Primitiven) rendert seine Children nicht. In diesem Fall „Hello World!“.

## Alles kann ein Child sein

Children Zum Beispiel können wir unserer <Grid /> Komponente von oben einen Text übergeben und es wird problemlos funktionieren.

```jsx
<Grid>Hello world!</Grid>
```

JSX entfernt automatisch weiße Lücken am Anfang und Ende einer Zeile sowie auch Leerzeilen. Außerdem kürzt es leere Zeilen in die Mitte von Strings.

Das bedeutet, dass folgende Beispiele das Gleiche machen werden:

```html
<Grid>Hello world!</Grid>

<Grid>
  Hello world!
</Grid>

<Grid>
  Hello
  world!
</Grid>

<Grid>

  Hello world!
</Grid>
```

Du kannst auch mehrere Arten von Children ohne Probleme mischen und anpassen:

```html
<Grid>
  Here is a row:
  <Row />
  Here is another row:
  <Row />
</Grid>
```


## Funktion als Child

Wir können jeden JavaScript-Ausdruck als Child ausführen:

```jsx
class Executioner extends React.Component {
  render() {
    // See how we're calling the child as a function?
    //                        ?
    return this.props.children()
  }
}
```

Diese Komponente würdest du dann so verwenden:

```jsx
<Executioner>
  {() => <h1>Hello World!</h1>}
</Executioner>
```

Dieses Beispiel ist nicht sonderlich sinnvoll, aber es zeigt die Idee.

Stell dir vor, du müsstest Daten von einem Server abrufen. Du könntest dies auf viele Arten tun, aber es eben auch mit dem Functin-as-a-child-Muster in folgender Weise:

```jsx
<Fetch url="api.myself.com">
  {(result) => <p>{result}</p>}
</Fetch>
```

Mach dir keine Sorgen, wenn das erstmal zu viel erscheint. Alles was ich will ist, dass du nicht überrascht bist, wenn du dies in fremdem Code siehst. Mit Children ist alles möglich.

## Children manipulieren

Wenn du einen Blick auf die React-Dokumentation wirfst, wirst du sehen, dass „Children eine *intransparente Datenstruktur* sind“. Was sie uns im wesentlichen sagen, ist, dass `props.children` jeder Typ sein kann - eine Funktion, ein Objekt, ein Feld, etc. Da du alles übergeben kannst, weißt du es nie sicher.
React bietet eine Reihe von Helfer-Funktionen, um das Bearbeiten von Children einfach und schmerzfrei zu machen. Diese sind bei `React.Children` erhältlich.

## Über Children iterieren

Die beiden offentsichtlichsten Helfer sind `React.Children.map` und `React.Children.forEach`. Sie arbeiten genau wie Ihre Feld-Counterparts, außer dass sie auch funktionieren, wenn eine Funktion, Objekt oder irgendetwas als Children übergeben wird.

```jsx
class IgnoreFirstChild extends React.Component {
  render() {
    const children = this.props.children
    return (
      <div>
        {React.Children.map(children, (child, i) => {
          // Ignore the first child
          if (i < 1) return
          return child
        })}
      </div>
    )
  }
}
```

Die `<IgnoreFirstChild />` Komponente katalogisiert alle ihre Children, ignoriert das erste child und gibt alle anderen zurück.

```javascript
<IgnoreFirstChild>
  <h1>First</h1>
  <h1>Second</h1> // <- Only this is rendered
</IgnoreFirstChild>
```

In diesem Fall hätten wir auch `this.props.children.map` benutzt. Aber was wäre passiert, wenn jemand eine Funktion als Child übergeben hätte? `this.props.children' wäre eine Funktion statt eines Felds gewesen, und wir hätten eine Fehlermeldung!

Mit der `React.Children.map` Funktion allerdings, ist das gar kein Problem:

```javascript
<IgnoreFirstChild>
  {() => <h1>First</h1>} // <- Ignored ?
</IgnoreFirstChild>
```


## Children zählen

Da `this.props.children` jeder Typ sein kann, ist es relativ schwer zu überprüfen, *wie viele* Children eine Komponente hat! Naiv `this.props.children.length` auszuführen würde nicht funktionieren, wenn ein String oder eine Funktion übergeben würde. Wir hätten nur ein Child, `“Hello World!“`, aber die Anzahl würde stattdessen `12` zeigen.

```javascript
class ChildrenCounter extends React.Component {
  render() {
    return <p>React.Children.count(this.props.children)</p>
  }
}
```

Es gibt die Anzahl der Children wieder, egal welcher Art sie sind:

```javascript
// Renders "1"
<ChildrenCounter>
  Second!
</ChildrenCounter>

// Renders "2"
<ChildrenCounter>
  <p>First</p>
  <ChildComponent />
</ChildrenCounter>

// Renders "3"
<ChildrenCounter>
  {() => <h1>First!</h1>}
  Second!
  <p>Third!</p>
</ChildrenCounter>
```


## Children für jeden Bereich konvertieren

Als letzten Ausweg, falls keine der oben gezeigten Methoden für dich passt, kannst du Children zu einem Array mit `React.Children.toArray` konvertieren. Das wäre nützlich, wenn du z.B. sortieren müsstest:

```javascript
class Sort extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children)
    // Sort and render the children
    return <p>{children.sort().join(' ')}</p>
  }
}
```

```javascript
<Sort>
  // We use expression containers to make sure our strings
  // are passed as three children, not as one string
  {'bananas'}{'oranges'}{'apples'}
</Sort>
```

Das Beispiel oben rendert die Strings, aber sortiert.


## Ein einzelnes Children durchsetzen

Wenn du an unsere `<Executioner />`  Komponente oben denkst, wird nur ein einziges Child erwartet, das eine Funktion sein muss.

```javascript
class Executioner extends React.Component {
  render() {
    return this.props.children()
  }
}
```

Wir könnten versuchen das mit `propTypes` zu erzwingen, das würde so aussehen:

```javascript
Executioner.propTypes = {
  children: React.PropTypes.func.isRequired,
}
```

Das würde eine Nachricht an die Konsole im Browser ausgeben, was Entwickler ignorieren können. Stattdessen könnten wir auch `React.Children.only` in unserer `render` Methode zu nutzen!

```javascript
class Executioner extends React.Component {
  render() {
    return React.Children.only(this.props.children)()
  }
}
```


Das gibt dann ein einziges Child in `this.props.children` zurück. Wenn es mehr als ein child gibt, gibt es einen Fehler aus - die Anwendung bricht ab. Dies hindert faule Entwickler daran, Unsinn mit unserer Komponente zu treiben.

## Children editieren

Wir können beliebige Komponenten als Children rendern, aber sie immer noch von dem Parent kontrollieren lassen, anstelle von der Komponente von der wir sie gerendert haben. Um dies zu verdeutlichen, nehmen wir eine `RadioGroup` Komponente, die eine Anzahl von `RadioButton` Komponenten beinhalten kann. (die eine `<input type="radio">` eine in ein `<label>` rendern

Die `RadioButton` s werden nicht von der `RadioGroup` selbst gerendert, sie werden als Children benutzt. Das bedeutet irgendwo in unserer Anwendung haben wir diesen Code:

```javascript
render() {
  return(
    <RadioGroup>
      <RadioButton value="first">First</RadioButton>
      <RadioButton value="second">Second</RadioButton>
      <RadioButton value="third">Third</RadioButton>
    </RadioGroup>
  )
}
```

Es gibt jedoch ein Problem mit diesem Code. Die Eingabefelder sind nicht gruppiert. Um input Tags zu gruppieren, brauchen sie alle das gleiche `name`-Attribut. Wir könnten natürlich fortfahren und jedem einzelnen `RadioButton` ein `name`-Attribut zuordnen:

```javascript
<RadioGroup>
  <RadioButton name="g1" value="first">First</RadioButton>
  <RadioButton name="g1" value="second">Second</RadioButton>
  <RadioButton name="g1" value="third">Third</RadioButton>
</RadioGroup>
```

Aber das ist a) langweilig und b) fehleranfällig. Wir haben doch die ganze Macht von JavaScript in unseren Händen! Können wir das nutzen, um unserer `RadioGroup` das `name`-Attribut zuzuweisen, das allen Children übergeben wird?

## Children-Gerüst ändern

In unserer `RadioGroup` fügen wir eine neue Methode namens `renderChildren` hinzu, wo wir die Children-props editieren:

```javascript
class RadioGroup extends React.Component {
  constructor() {
    super()
    // Bind the method to the component context
    this.renderChildren = this.renderChildren.bind(this)
  }

  renderChildren() {
    // TODO: Change the name prop of all children
    // to this.props.name
    return this.props.children
  }

  render() {
    return (
      <div className="group">
        {this.renderChildren()}
      </div>
    )
  }
}
```

Beginnen wir mit einem `.map()` über die children, um jedes individuelles Child zu bekommen:

```javascript
renderChildren() {
  return React.Children.map(this.props.children, child => {
    // TODO: Change the name prop to this.props.name
    return child
  })
}
```

Wie können wir ihre Eigenschaften bearbeiten?

## Unveränderbare klonende Elemente

Hier kommt die letzte Hilfs-Methode von heute ins Spiel. Wie der Name schon sagt - `React.cloneElement` klont ein Element. Wir geben ihm das Element, das wir als erstes klonen wollen als erstes Argument. Als zweites Argument können wir dann ein Objekt von props übergeben, das wir auf das geklonte Element setzen wollen:

```javascript
const cloned = React.cloneElement(element, {
  new: 'yes!'
})
```

Das `cloned`-Element wird jetzt die `new` prop auf `"yes!"` gesetzt haben.

Das ist genau was wir brauchen, um unsere `RadioGroup` zu vollenden. Wir klonen jedes Child und setzen das `name`-Prop des geklonten childs auf `this.props.name`:

```javascript
renderChildren() {
  return React.Children.map(this.props.children, child => {
    return React.cloneElement(child, {
      name: this.props.name
    })
  })
}
```

Der letzte Schritt ist es, einen eindeutiges `name`-Attribut an unsere `RadioGroup` zu übergeben:

```javascript
<RadioGroup name="g1">
  <RadioButton value="first">First</RadioButton>
  <RadioButton value="second">Second</RadioButton>
  <RadioButton value="third">Third</RadioButton>
</RadioGroup>
```

Es funktioniert! Anstatt manuell jedes `name`-Attribut auf jeden `RadioButton` zu setzen, sagen wir einfach unserer `Radiogroup`, welchen Namen wir wollen und es wird sich drum gekümmert.


#### Credits

Original gepostet von [Max Stoiber](https://twitter.com/mxstbr) auf [mxstbr.blog](http://mxstbr.blog/2017/02/react-children-deepdive/).
