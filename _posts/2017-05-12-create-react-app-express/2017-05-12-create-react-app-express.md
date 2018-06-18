---
header_image: "header.png"
title: "Erstellen einer React App mit einem Express Backend"
description: "Lerne wie du eine React App mit einem Express Backend erstellst"
author: "Dave Ceddia"
published_at: 2017-05-12 16:00:00.000000Z
categories:
  - reactjs
  - tutorial
---

Wenn du noch nicht davon gehört hast, [Create React App](https://github.com/facebookincubator/create-react-app) ist ein unglaublicher Weg um mit ReactJS zu starten. Es wird eine Projekt-Struktur für dich erstellt, komplett vorbereitet und bereit zum starten. Du kannst die Konfiguration von Webpack und Babel auslassen und direkt mit dem Schreiben deiner App beginnen.

Aber was ist, wenn deine App nicht nur aus Frontend besteht? Was, wenn du dich zu einem Backend Server verbinden musst? Auch dafür hat [Create React App](https://github.com/facebookincubator/create-react-app) eine Lösung.

In diesem Beitrag bauen wir eine ReactJS App mit einem [Express](http://expressjs.com/de/) Backend App und verkabeln die Benutzeroberfläche, um einige Daten aus dem Backend zu holen.

Und falls dein Backend nicht mit Express geschrieben ist, keine Sorge! Der gleiche Prozess wird auch für dich funktionieren (überspringen um zur Konfiguration der Proxy zu gehen.

<!--more-->

## Erstelle die Express App

Wir benötigen zuerst eine Express App. Wenn du bereits eine hast, kannst du diesen Schritt überspringen.

Für diesen Beitrag werden wir eine mit dem [Express-Generator](https://expressjs.com/en/starter/generator.html) erzeugen. Installiere den Generator:

```shell
$ npm install -g express-generator
# oder:  yarn global add express-generator
```

Dann starte es, um die Express App zu erstellen:

```shell
$ express react-backend
```

Es wird ein `react-backend` Ordner entstehen. Dann stelle sicher, dass du die Abhängigkeiten installierst:

```shell
$ cd react-backend
$ npm install # or yarn
```

Wir können die meisten der generierten Daten ignorieren, aber wir bearbeiten  `react-backend/routes/users.js`. Hier ist die Änderung, die wir machen.

```javascript
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Kommentiere diese Zeile aus
  //res.send('respond with a resource');

  // Und füge soetwas ein
  res.json([{
    id: 1,
    username: "samsepi0l"
  }, {
    id: 2,
    username: "D0loresH4ze"
  }]);
});

module.exports = router;
```

Das ist alles was wir machen um die Express App zu erstellen. Starte die App, in dem du folgendes ausführst:

```shell
$ PORT=3001 node bin/www
```

Lass es laufen und öffne einen neuen Terminal. Beachte die `PORT` Variable: Diese Express App wird standardmäßig auf Port 3000 gesetzt und Create App ebenfalls Port 3000. Um einen Fehler zu vermeiden, starte Express auf 3001.

## Erstelle die ReactJS App

Du kannst die ReactJS App überall hinpacken, wo du willst. Es muss kein Unterordner der Express App sein, aber das sehen wir jetzt, um alles organisiert zu behalten.

Zuerst einmal, stelle sicher, dass du `create-react-app` installierst, falls es nicht schon installiert ist:

```shell
$ npm install -g create-react-app
```

Dann erstelle die React App innerhalb des `react-backend` Ordners:

```shell
$ create-react-app client
```

## Konfiguriere den Proxy

Das ist die Hauptänderung, welche es der ReactJS App ermöglicht mit dem Express Backend zu kommunizieren (oder jedem Backend).

Innerhalb des Ordners der ReactJS App (`client`), öffne `package.json` (gehe sicher, dass es nicht Express’ `package.json` ist - es sollte Teile wie “react” und “react-scripts” haben). Unter der “scripts” Sektion füge `proxy` wie folgt ein:

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test --env=jsdom",
  "eject": "react-scripts eject"
},
"proxy": "http://localhost:3001"
```

Der Port (3001) in der “proxy” muss der gleiche Port sein, auf dem dein Express Server läuft.

Beachte, das kann auf jeden Server verweisen. Es kann ein anderes lokales Backend in Java oder Python sein, oder es könnte ein echter Server im Internet sein. Spielt keine Rolle.

So funktionierts, jedes Mal wenn deine ReactJS App eine Anfrage auf etwas das kein statisches Asset ist (kein Bild oder CSS oder `index.html`)  anfordert, dann wird es die Anfrage an den Server, der in `“proxy”` spezifiziert ist, weiterleiten.

![Wie der Proxy funktioniert](/artikel/create-reactjs-app-express/how-proxy-works.png)

Wenn das erledigt ist, starte den ReactJS Entwicklungs-Server, in dem du `npm start` (oder `yarn start`) startest.

Rufe die Daten von ReactJS ab.

Zu diesem Zeitpunkt laufen zwei Server. Express (auf Port 2001) und Create ReactJS App’s Webpacket dev Server (auf Port 3000).

Lass uns `/users` aufrufen und sicherstellen, dass alles funktioniert.

Öffne `client.src/App.js` und sorge dafür, dass es so aussieht:

```javascript
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {users: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
      </div>
    );
  }
}

export default App;
```

Die Änderungen hier sind:

- Einen Anfangszustand oben setzen: ein leerer Users Array wird verhindern, dass `this.state.users.map` hochgeht, bevor die Benutzer geladen sind
- Veränderter `render` um die Liste der Benutzer zu rendern
- Hinzugefügter `componentDidMount` um die Daten zu bekommen mit `fetch`, und sie so zu speichern

Create ReactJS App [beinhaltet](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#supported-language-features-and-polyfills) das `fetch` Polyfill eingebaut, so dass du immer bereit bist, auch wenn dein Browser es noch nicht natürlicherweise unterstützt.

## Schlusswort

Jetzt bist du ein Profi beim Anschließen einer CRA-generierten App an jegliche Backends. Hast du mehr Fragen? Willst du noch mehr über etwas anderes erfahren? Melde dich gerne für unseren Newsletter an.

#### Credits

[Original gepostet](https://daveceddia.com/create-react-app-express-backend/) von [Dave Ceddia](https://twitter.com/dceddia) auf [seinem Blog](https://daveceddia.com).
