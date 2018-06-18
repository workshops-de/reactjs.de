---
header_image: "header.png"
title: "Children in ReactJS"
description: "Lerne wie Children in ReactJS funktionieren"
author: "Max Stoiber"
published_at: 2017-06-08 15:00:00.000000Z
categories:
  - reactjs
---

Nehmen wir an, wir haben eine `<Grid />` Komponente, die `<Row />` Komponenten enthalten kann. Du würdest sie so verwenden:

```javascript
<Grid>
  <Row />
  <Row />
  <Row />
</Grid>
```

Diese drei `Row` Komponenten werden an die `Grid` Komponente als `props.children` übergeben. Mit einem *expression container* (das ist der technische Begriff für diese schnörkeligen Klammern in JSX) können parents Ihre children rendern.

```javascript
class Grid extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}
```

Parents können auch entscheiden, keine children zu rendern oder zu manipulieren. Diese `<Fullstop />` Komponente zum Beispiel rendert ihre children überhaupt nicht.

```javascript
class Fullstop extends React.Component {
  render() {
    return <h1>Hello world!</h1>
  }
}
```

Es spielt keine Rolle welche children du an diese Komponente übergibst, sie wird immer „Hello world!“ zeigen und nichts anderes.

Hinweis: Das `<h1>` in dem Beispiel oben (ähnlich wie alle HTML-Primitiven) rendert seine children nicht, in diesem Fall „Hello World!“.

## Alles kann ein child sein

Children Zum Beispiel können wir unserer <Grid /> Komponente von oben einen Text übergeben und es wird perfekt funktionieren.

```javascript
<Grid>Hello world!</Grid>
```

JSX entfernt automatisch weiße Lücken am Anfang und Ende einer Zeile sowie auch Leerzeilen. Es verdichtet außerdem leere Zeilen in die Mitte von String-Literalen zu in einen Raum.

Das bedeutet, dass alle diese Beispiele das Gleiche machen werden:

```javascript
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

Du kannst auch mehrere Arten von children perfekt mischen und anpassen:

```javascript
<Grid>
  Here is a row:
  <Row />
  Here is another row:
  <Row />
</Grid>
```

## Funktion als ein child
Wir können jede JavaScript Expression als children ausführen:

```javascript
class Executioner extends React.Component {
  render() {
    // See how we're calling the child as a function?
    //                        ?
    return this.props.children()
  }
}
```

Du würdest diese Komponente so verwenden:

```javascript
<Executioner>
  {() => <h1>Hello World!</h1>}
</Executioner>
```

Dieses spezifische Beispiel ist nicht sinnvoll, aber es zeigt die Idee.

Stell dir vor, du müsstest einige Daten von einem Server abholen. Du könntest dies auf viele Arten tun, aber es ist mit diesem Funktion-als-ein-child Muster möglich:

```javascript
<Fetch url="api.myself.com">
  {(result) => <p>{result}</p>}
</Fetch>
```

Verbringe eine Minute, um mit [diesem Behälter](https://www.webpackbin.com/NymfRpcwf) zu spielen und schau mal, ob du herausfinden kannst, wie es funktioniert [(hier ist mein Ansatz)](https://www.webpackbin.com/NkoIz1owG)

Mach dir keine Sorgen, wenn das über erstmals zu viel ist. Alles was ich will ist, dass du nicht überrascht bist, wenn du das da draußen siehst. Mit children ist alles möglich.

## Children manipulieren

Wenn du einen Blick auf die React Docs wirfst, wirst du sehen, dass „children eine *undurchsichtige Datenstruktur* sind“. Was sie uns im wesentlichen sagen, ist, dass `props.children` jeder Typ sein kann, eine Funktion, ein Objekt, ein Feld, etc. Da du alles übergeben kannst, weißt du es nie sicher.
React bietet eine Reihe von Helfer-Funktionen, um das bearbeiten von children einfach und schmerzfrei zu machen. Diese sind bei `React.Children` erhältlich.

## Über children loopen

Die beiden offentsichtlichsten Helfer sind `React.Children.map` und `React.Children.forEach`. Sie arbeiten genau wie Ihre Feld-Counterparts, außer dass sie auch funktionieren, wenn eine Funktion, Objekt oder irgendetwas als children übergeben wird.

```javascript
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

Die `<IgnoreFirstChild />` Komponente katalogisiert alle ihre children, ignoriert das erste child und gibt alle anderen zurück.

```javascript
<IgnoreFirstChild>
  <h1>First</h1>
  <h1>Second</h1> // <- Only this is rendered
</IgnoreFirstChild>
```

In diesem Fall hätten wir auch `this.props.children.map` benutzt. Aber was wäre passiert, wenn jemand eine Funktion als child übergeben hätte? `this.props.children' wäre eine Funktion statt eines Felds gewesen, und wir hätten eine Fehlermeldung!

Mit der `React.Children.map` Funktion allerdings, ist das gar kein Problem:

```javascript
<IgnoreFirstChild>
  {() => <h1>First</h1>} // <- Ignored ?
</IgnoreFirstChild>
```


## Children zählen

Da `this.props.children` jeder Typ sein kann, ist es relativ hard zu überprüfen, *wie viele* children eine Komponente hat! Naiv `this.props.children.length` auszuführen würde auseinanderfallen, wenn ein String oder eine Funktion übergeben würde. Wir hätten ein child, `“Hello World!“`, aber die `length` würde stattdessen als `12` gemeldet.

```javascript
class ChildrenCounter extends React.Component {
  render() {
    return <p>React.Children.count(this.props.children)</p>
  }
}
```

Es gibt die Anzahl der children wieder, egal welcher Art sie sind:

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

Das Beispiel oben rendert die Strings, aber sortiert:

## Children für jeden Bereich konvertieren

Als letzten Ausweg, falls keine der oben gezeigten Methoden für dein Anliegen passend, kannst du children zu einem Array mit `React.Children.toArray` konvertieren. Das wäre nützlich, wenn du z.B. sortieren müsstest:


## Ein einzelnes children durchsetzen

Wenn du an unsere `<Executioner />`  Komponente oben denkst, wird nur ein einziges child erwartet, das eine Funktion sein muss.

```javascript
class Executioner extends React.Component {
  render() {
    return this.props.children()
  }
}
```


Wir könnten versuchen das mit `propTypes` zu erzwingen, das würde ungefähr so aussehen:

```javascript
Executioner.propTypes = {
  children: React.PropTypes.func.isRequired,
}
```

Das würde eine Nachricht an die Konsole protokollieren, was Entwickler ignorieren
können. Stattdessen können wir `React.Children.only` in unserer `render` Methode zu nutzen!

```javascript
class Executioner extends React.Component {
  render() {
    return React.Children.only(this.props.children)()
  }
}
```


Das gibt dann ein einziges child in `this.props.children` zurück. Wenn es mehr als ein child gibt, spuckt es einen Error aus, also die Anwendung zu einem halt bring – perfekt, um zu verhindern, dass faule devs versuchen Unsinn mit unserer Komponente zu treiben.

## Children editieren

Wir können beliebige Komponenten als children rendern, aber sie immer noch sie immer noch von dem parent kontrollieren, anstelle von der Komponente von der wir sie gerendert haben. Um dies zu verdeutlichen, sagen wir mal wir haben eine `RadioGroup` Komponente, die eine Anzahl von `RadioButton` Komponenten beinhalten kann. (die eine `<input type="radio">` eine in ein `<label>` rendern

Die `RadioButton` s werden nicht von der `RadioGroup` selbst gerendert, sie werden als children benutzt. Das bedeutet irgendwo in unserer Anwendung haben wir diesen Code:

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

Es gibt jedoch ein Problem mit diesem Code. Die `input` s sind nicht gruppiert, was hierzu führt:

Um input Tags zu gruppieren, brauchen sie alle das gleiche `name` Attribut. Wir könnten natürlich fortfahren und jedem einzelnen `RadioButton` einen `name` zuordnen:

```javascript
<RadioGroup>
  <RadioButton name="g1" value="first">First</RadioButton>
  <RadioButton name="g1" value="second">Second</RadioButton>
  <RadioButton name="g1" value="third">Third</RadioButton>
</RadioGroup>
```

Aber das ist a) langweilig und b) fehleranfällig. Wir haben die ganze Macht von JavaScript in unseren Händen!  Können wir das nutzen, um unserer `RadioGroup` den `name` zu sagen, den alle children bekommen sollen und das ganze automatisch geschehen lassen?

## Children Gerüst ändern

In unserer `RadioGroup` fügen wir eine neue Methode namens `renderChildren` hinzu, wo wir die children props editieren:

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

Beginnen wir mit dem Mapping über die children, um jedes individuelles child zu bekommen:

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

Hier kommt die letzte Helfer-Methode von heute ins Spiel. Wie der Name schon sagt, `React.cloneElement`  klont ein Element. Wir gebe ihm das Element, das wir als erstes klonen wollen als das erste Argument, und als zweites Argument können wir dann ein Objekt von props übergeben, das wir auf das geklonte Element setzen wollen:

```javascript
const cloned = React.cloneElement(element, {
  new: 'yes!'
})
```

Das `cloned` Element wird jetzt die `new` prop auf `"yes!"` gesetzt haben.

Das ist genau was wir brauchen, um unsere `RadioGroup` zu beenden. Wir klonen jedes child und setzen die `name` prop des geklonten childs auf `this.props.name`:

```javascript
renderChildren() {
  return React.Children.map(this.props.children, child => {
    return React.cloneElement(child, {
      name: this.props.name
    })
  })
}
```

Der letzte Schritt ist es, einen eindeutigen `name` an unsere `RadioGroup` zu übergeben:

```javascript
<RadioGroup name="g1">
  <RadioButton value="first">First</RadioButton>
  <RadioButton value="second">Second</RadioButton>
  <RadioButton value="third">Third</RadioButton>
</RadioGroup>
```


Es funktioniert! Anstatt manuell jedes `name` Attribut auf jeden `RadioButton` zu setzen, sagen wir einfach unserer `Radiogroup`, welchen Namen wir wollen und es wird sich drum gekümmert.


#### Credits

Original gepostet von [Max Stoiber](https://twitter.com/mxstbr) auf [mxstbr.blog](http://mxstbr.blog/2017/02/react-children-deepdive/).
