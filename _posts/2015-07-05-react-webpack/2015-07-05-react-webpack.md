---
title: "React Anwendungen mit Webpack entwickeln"
description: "React Anwendungen mit Webpack und React Hot Loader entwickeln"
author: "Nils Hartmann"
published_at: 2015-07-05 11:10:22
header_source: https://unsplash.com/photos/WJsbDXqBkZE
categories: [react, webpack]
---

## Einleitung

Wenn ihr mit React Anwendungen bauen wollt, müsst ihr zur Ausführung der Anwendung Euren JSX-Code nach ECMAScript 5 übersetzen, damit der Browser den Code versteht. Gleiches gilt ebenfalls für ECMAScript 2015 (ES6) Features, die ihr in Eurer Anwendung verwendet, da auch diese noch nicht vollständig von allen Browsern unterstützt werden.

In der Vergangenheit gab es dafür im Wesentlichen zwei Tools, die ihr zur Verfügung hattet: den JSTransformer, der Bestandteil von React war, und [Babel](http://babeljs.io), einen Transformer, der nicht nur JSX sondern auch [ECMAScript 2015](http://babeljs.io/docs/learn-es2015/) und schon einige [experimentelle ES7-Features](http://babeljs.io/docs/usage/experimental/]) übersetzen kann. Ab [Version 0.14](https://reactjs.org/blog/2015/07/03/react-v0.14-beta-1.html) von React wird der eigene [JSTransformer eingestellt](https://reactjs.org/blog/2015/06/12/deprecating-jstransform-and-react-tools.html), so dass künftig Babel das Tool der Wahl wird.

Babel könnt ihr entweder von der Kommandozeile aus starten oder in ein Build-Tool einbinden. Hier werden häufig **gulp** oder **grunt** verwendet. Darüber hinaus kommt in der Regel **Webpack** oder **Browserify** zum Einsatz.

Allerdings kann die Kombination dieser diversen Tools (Build, Bundler, Babel, ...) für verschiedene Einsatzszenarien (Entwicklung, Deployment in Produktion) schnell unübersichtlich werden.

Daher erhaltet ihr an dieser Stelle einen Einstieg, wie ihr ohne Build-Tool und stattdessen ausschließlich mit Webpack (und Babel) Anwendungen für React bauen könnt.

## Was ist Webpack?

[Webpack](http://webpack.github.io/) ist ein "Bundler", der aus einer Reihe von JavaScript-Dateien bzw -Modulen eine einzige "vollständige" JavaScript-Datei (ein "Bundle") erzeugt.

Für die **Entwicklungszeit** stellt Webpack außerdem den sog. [Webpack Dev Server](http://webpack.github.io/docs/webpack-dev-server.html) zur Verfügung. Dabei handelt es sich um einen einfachen Webserver, über den ihr Eure Anwendung zum Testen ausliefern könnt. Ein großer Mehrwert dieses Tools kommt durch den "Hot"-Mode des Servers: in diesem Modus erkennt der Server Änderungen an Euren Quelldateien (sei es JavaScript, CSS, ...), transformiert diese automatisch und lädt Eure Webseite neu. Das geht zum einen sehr schnell, weil Webpack nicht die ganze Anwendung, sondern nur die veränderten Dateien neu übersetzt. Zum anderen wird damit das manuelle "Aktualisieren" der Anwendung im Browser obsolet. Ihr seht also unmittelbar beim Code schreiben, was das für Auswirkungen hat :-).

Für die **Entwicklung von React-Anwendungen** bringt Webpack noch einen weiteren Vorteil mit: den spezialisierten "React Hot Loader". Dieser Loader sorgt dafür, dass der React State Eurer Anwendung auch über das Neuladen der veränderten Ressourcen hinaus erhalten bleibt. Ihr müsst also beispielsweise Formular-Eingaben, die ihr zum Testen gemacht habt und die in Eurem State abgelegt sind, nicht erneut eingeben, wenn ihr eine Formular-Komponente ändert. Das kann viel Zeit ersparen. Mit [`redux`](https://github.com/gaearon/redux) gibt es mittlerweile auch ein Flux-Framework, das expliziten Support für Hotloading auch von Flux-Komponenten (mittels des React Hot Loaders) verspricht.

## Ein Beispielprojekt

Lasst uns nun an Hand eines kleines Beispiels ansehen, wie ihr Webpack für eine React-Anwendung installieren und einrichten könnt.

Das Beispiel findet ihr im GitHub-Projekt https://github.com/nilshartmann/react-webpack. Es handelt sich dabei um eine einfache React-Anwendung, die "Grußkarten" anzeigt, die sich der Reihe nach durch klicken lassen. Der meiste Code ist dabei mit ECMAScript 2015-Code geschrieben, es gibt jedoch auch einige Stellen, in denen experimenteller ES7-Code zum Einsatz kommt, um die Konfigurationsmöglichkeiten von Babel zu demonstrieren. Außerdem werden natürlich CSS und Bilder für das Styling verwendet.

[![Die Beispiel Anwendung](screenshot2.png)](https://nilshartmann.github.io/react-webpack-example/)

(Ihr könnt Euch das laufende Beispiel hier ansehen: https://nilshartmann.github.io/react-webpack-example/)

In dem Projekt befinden sich die folgenden drei Branche:

* [`01_initial:`](https://github.com/nilshartmann/react-webpack-example/tree/01_initial)  Dieser initiale Stand enthält noch kein Webpack. Die Ausgangssituation für die folgenden Schritte.

* [`02_webpack:`](https://github.com/nilshartmann/react-webpack-example/tree/02_webpack) Auf diesem Branch befindet sich das Projekt mit fertiger Webpack Konfiguration, aber noch ohne Development Server und React Hot Loader.

* [`03_webpack_react_hotloader:`](https://github.com/nilshartmann/react-webpack-example/tree/03_webpack_react_hotloader) Dies ist der finale Stand, auf dem auch der Webpack Development Server und der React Hot Loader hinzugefügt sind.

In den folgenden Schritten werden wir den initialen Stand zunächst um Webpack erweitern. Danach sehen wir uns dann an, wie wir den Webpack Development Server und den React Hot Loader einrichten.

Gucken wir uns zunächst die Struktur des Beispiel-Projektes an:

* ```public:``` Hierin liegt unsere `index.html`-Datei, in der wir die grundlegende Struktur unserer Seite festlegen. Gegenüber einer "normalen" index.html-Seite, die ihr für Eure React-Anwendung verwenden würdet, fallen hier zwei Dinge auf: zum einem enthält sie keine Referenzen auf CSS-Stylesheets (diese werden wir später von Webpack einfügen lassen). Zum anderen wird genau eine JavaScript-Datei referenziert werden, nämlich das von Webpack erzeugt Bundle (`main.js`). Da auch die externen Bibliotheken, wie z.B. react, von Webpack in diese Datei geschrieben werden, ist es nicht notwendig, weitere JavaScript-Dateien zu referenzieren.

* ```public/dist:``` In dieses Verzeichnis wird Webpack die generierten Artefakte schreiben.

* ```src:``` Hier liegen alle unsere Source-Dateien. Dazu zählen nicht nur JavaScript-Files sondern auch z.B. Stylesheets oder Bilder.

* ```src/main.js```: Die Einstiegsdatei unserer Anwendung. Von dieser Datei ausgehend analysiert Webpack unsere Abhängigkeiten.


### Installation von Webpack

Ausgehend von dem `01_initial`-Branch, auf dem das Projekt "fertig", aber noch ohne Webpack vorhanden ist, wollen wir nun zunächst Webpack installieren. Wir werden das Tool als lokales Modul in Eurem Projekt installieren, damit es nicht zu Kollisionen mit einer anderen Version von Webpack kommt, die ihr möglicherweise global installiert habt:

* `npm install --save-dev webpack`

Das installierte Webpack lässt sich danach mit `./node_modules/.bin/webpack` starten. Allerdings müssen wir das Tool zuvor noch konfigurieren!

### Anpassen der index.html-Datei

Im ersten Schritt fügen wir über einen `script`-Tag den Namen des Bundle-Scriptes (`main.js`) hinzu, das wir später mit Webpack erzeugen wollen. Unsere index.html-Datei sieht dann wie folgt aus:

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
  . . .
  </head>

  <body>
    <!-- Mount-Point for React GreetingCardApp -->
    <div id="mount"></div>
  </body>

  <!-- dist/main is generated by Webpack -->
  <script src="dist/main.js"></script>
</html>
```


### Konfiguration von Webpack

Die Konfiguration von Webpack erfolgt in einer JavaScript-Datei, die ein Objekt mit den gewünschten Einstellungen exportiert. Dazu gehört z.B. wo unsere Einstiegsdatei (```entry```) liegt, und das Ausgabeverzeichnis. Die Datei liegt üblicherweise im Root-Verzeichnis des Projektes und heißt `webpack.config.js`:

```javascript
// webpack.config.js:

var path = require('path');
var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry:  [
    path.resolve(__dirname, 'src/main.js')
  ],
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'main.js',
    publicPath: 'dist/'
  },
  devtool: 'source-map'
}
```

Mit `entry` und `output` legen wir den Pfad zu unserer Einstiegsdatei fest und wohin Webpack die generierten Artefakte schreiben soll sowie den Namen der bundle-Datei.

Die Eigenschaft `publicPath` wird von Webpack verwendet, wenn Webpack URLs in Eurem
Code (z.B. in Stylesheets) findet.

Mit der Eigenschaft `resolve.extensions` könnt ihr Dateiendungen angeben, die Webpack implizit hinzufügt, wenn es in Eurem Code eine Referenz auf eine Datei findet, bei der keine Dateiendung angegeben wurde.
Sehr euch dazu das folgende exemplarische `import`-Statement an:

```javascript
import MyComponent from './MyComponent';
```

Mit der oben gezeigten Konfiguration würde Webpack nun nach einer Datei mit dem Namen 'MyComponent', 'MyComponent.js' und schließlich 'MyComponent.jsx' suchen. Erst wenn keine der drei Dateien gefunden werden konnte, schlägt Webpack fehlt.

Die `devtool`-Angabe schließlich veranlasst Webpack, Source Maps für das erzeugte Bundle-File zu erzeugen.

Weitere Informationen zu den verwendeten Parametern findet ihr in der Webpack-Dokumentation:

* [`entry`](http://webpack.github.io/docs/configuration.html#entry)

* [`output`](http://webpack.github.io/docs/configuration.html#output)

* [`resolve.extensions`](http://webpack.github.io/docs/configuration.html#resolve-extensions)

* [`devtool`](http://webpack.github.io/docs/configuration.html#devtool)


### Konfiguration der Webpack Loader

Mit der oben gezeigten Konfigurationsdatei haben wir aber noch nicht viel gewonnen. Es fehlen nämlich noch die Angaben, wie Webpack unsere unterschiedlichen Datei-Typen verarbeiten soll, also die Konfiguration der [Webpack Loader](http://webpack.github.io/docs/loaders.html).

Bevor ihr einen Loader verwenden könnt, müsst ihr diesen zunächst installieren. Dies geschieht wie gewohnt über die entsprechenden npm Pakete. Für unser Beispiel-Projekt sind die folgenden Loader installiert worden:

* `npm install --save-dev babel-loader url-loader style-loader css-loader json-loader`

(Hinweis: Wenn ihr die Loader später in der webpack.config.js-Datei angebt, könnt ihr den Suffix `-loader` weglassen.)

Für jeden Loader, der verwendet werden soll, wird mit einem regulären Ausdruck eine Menge an Dateien ausgewählt. Auf diesen Dateien führt Webpack dann den Loader aus. Es lassen sich mehrere Loader durch `!` getrennt hintereinander schalten. So werden für die Verarbeitung von CSS-Dateien beispielsweise zwei Loader benötigt, die wie folgt konfiguriert werden können:

```javascript
module.exports = {
  // ...
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
}
```

Um einem Loader Parameter zu übergeben, könnt ihr diese als "Query-Parameter", getrennt mit einem `?`, dem Loader-Namen anhängen. Auf diese Weise schalten wir in unserem Projekt für den `babel-loader` das für ES7 vorgeschlagene `functionBind`-Feature ein.
Mit der `exclude`-Angabe könnt ihr einen regulären Ausdruck angeben, der Dateien selektiert, die von dem Loader **nicht** verarbeitet werden sollen. Für den `babel-loader` wollen wir das `node_modules` Verzeichnis ausschließen, da die darin enthaltenen JavaScript-Dateien nicht von Babel verarbeitet werden sollen. Die vollständige `babel-loader`-Konfiguration für unser Beispiel-Projekt sieht dann so aus:

```javascript
module.exports = {
  // . . .
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?optional[]=es7.functionBind'},
    ]
  }
}
```

Alternativ ließe sich der "Query" zur Konfiguration übrigens auch mit einem eigenen `query` Element konfigurieren. Das sähe dann so aus:

```javascript
module.exports = {
  // . . .
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          optional: ['es7.functionBind'],
        }
      },
    ]
  }
}
```

Die konkrete Konfiguration aller von uns verwendeten Loader sieht nun wie folgt aus:

```javascript
module.exports = {
  // . . .
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?optional[]=es7.functionBind'},
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(png|jpg)$/,  loader: 'url?limit=25000'  },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
}
```

Das bis zu dieser Stelle konfigurierte Beispiel-Projekt findet ihr auf dem Branch [`02_webpack`](https://github.com/nilshartmann/react-webpack-example/tree/02_webpack).

### Ausführen von Webpack

Die erste Konfiguration unseres Projektes ist damit abgeschlossen und wir können Webpack  aus dem Root-Verzeichnis unseres Projektes mit `./node_modules/bin/webpack` ausführen:

![Starten von Webpack](run_webpack.png)

Nach der Ausführung von Webpack findet ihr im `public/dist`-Verzeichnis die von Webpack erzeugten Dateien. Um die Beispiel-Anwendung auszuprobieren, könnt ihr die Datei `public/index.html` in Eurem Browser öffnen.

### Verwenden von Webpack Development Server und React Hot Loader

Wir haben jetzt eine Webpack Konfiguration, mit der ihr ein fertiges Bundle für Eure Anwendung erzeugen könnt. Für die Entwicklungszeit wollen wir jetzt noch den Webpack Development Server und den React Hot Loader einrichten, damit ihr nicht bei jeder Änderung Eure gesamte Anwendung neu übersetzen müsst. Der React Hot Loader sorgt dafür, dass der React State unserer Anwendung dabei nicht verloren geht.

Sowohl der Development Server als auch der React Hot Loader stehen als npm Packages zur Verfügung, die wir zunächst installieren:

* ```npm install --save-dev webpack-dev-server react-hot-loader```

Die Einrichtung der beiden Tools ist ebenfalls sehr einfach.

Zunächst müssen wir den `entry` unserer Anwendung erweitern, damit Webpack beim Erzeugen unseres Bundles den für den Server benötigten Client-seitigen Code hinzufügt:

```javascript
module.exports = {
  // . . .
  entry:  [
    // Webpack Development Server mit Hot Reloading
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',

    path.resolve(__dirname, 'src/main.js')
  ]
  // . . .
}
```

Als nächstes fügen wir zwei Webpack [Plug-ins](https://webpack.github.io/docs/plugins.html) hinzu. Zum einen verwenden wir das `HotModuleReplacementPlugin`, mit dem das Reload-Feature aktiviert wird. Außerdem verwenden wir das `webpack.NoErrorsPlugin`. Dieses Plug-in sorgt dafür, das der Development Server keinen Code auf den Client pusht, der sich zuvor nicht übersetzen ließ. Wenn es beim Übersetzen Eures Codes also zu Fehlern kommt, seht ihr diese in der Terminal-Console aber nicht in Form einer kaputten Seite in Eurem Browser. Stattdessen wird Euer Browser erst dann aktualisiert, wenn ihr den Code repariert habt, so dass er erfolgreich übersetzt werden kann.

```javascript
module.exports = {
  // ...
  module: {
    // ...
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}
```

Bitte beachtet das es eine Reihe weiterer nützlicher Plug-ins gibt (z.B. für Uglify). Eine Aufstellung findet ihr hier: https://github.com/webpack/docs/wiki/list-of-plugins.

Den **React Hot Loader** binden wir als weiteren Loader für unsere JavaScript/JSX-Dateien ein. Der besseren Übersicht wegen konfigurieren wir die beiden Loader in einem Array und nicht durch `!` getrennt. Das Ergebnis ist aber die selbe, die Loader werden nacheinander von rechts nach links ausgeführt, wobei der jeweils folgende Loader das Ergebnis des ersten Loaders übergeben bekommt:

```javascript
module.exports = {
  // ...
  module: {
    loaders: [
      {  test: /\.js$/, exclude: /node_modules/, loaders: ['react-hot', 'babel?optional[]=es7.functionBind']},
      // . . .
    ]
  }
}
```

Damit ist die Konfiguration von Server und Hot Loader abgeschlossen. Ihr könnt den Server wie folgt starten:

* `./node_modules/.bin/webpack-dev-server --progress --colors --hot --content-base public`

Mit `--hot` schaltet ihr das Hot-Loading-Feature des Servers ein. Mit dem Parameter `--content-base public` setzt ihr das Root-Verzeichnis aus dem der Server die Dateien ausliefern soll.

Die beiden Parameter `--progress` und `--colors` sorgen dafür, der Server Euch auf der Console (gefärbte) Fortschrittsmeldungen ausgibt. Für die eigentliche Funktionalität werden die beiden Parameter nicht benötigt.

Wenn Euch der Aufruf zu lang ist und ihr das nicht jedes Mal eintippen möchtet, könnt ihr den Aufruf als `script` in Eure `package.json`-Datei schreiben:

```javascript
// package.json
{
  // . . .
  "scripts": {
    "devserver":
      "./node_modules/.bin/webpack-dev-server --progress --colors --hot --content-base public"
  }
}
```

Danach könnt ihr den Server dann mit `npm run devserver` starten.

Nach dem Start des Servers steht die Anwendung jetzt über die URL `http://localhost:8080` zur Verfügung. Wenn ihr nun Änderungen an Eurem Code macht (sei es JavaScript oder CSS), werden diese Änderungen vom Development Server erkannt und automatisch im Browser aktualisiert. Das geht dann auch sehr schnell, weil Webpack nicht Eure gesamt Anwendung neu übersetzen muss, sondern lediglich die veränderten Dateien.

Dank des React Hot Loaders geht dabei auch der aktuelle React State Eurer Anwendung nicht verloren. Dieses Feature könnt ihr ausprobieren, in dem ihr eine der hinteren "Grußkarten" aufruft, und dann in der Datei `GreetingCard.js` im `<h1>`-Element einen Text eingebt (z.B. `<h1 className="GreetingCardTitle">Hello, {this.props.card.message}</h1>`). Nach dem Speichern der Datei wird Webpack nur diese Datei neu übersetzen und Eure Änderung wird sofort automatisch im Browser sichtbar. Dabei wird weiterhin die von Euch zuvor ausgewählte Grußkarte, die im React State abgelegt ist, angezeigt.

## Fazit

Der Einsatz von Webpack insbesondere in der Kombination mit Development Server und React Hotloader bietet eine sehr elegante Möglichkeit, auch ohne "echtes" Build-Tool effizient Webanwendungen mit React zu bauen. Dadurch das Webpack nur veränderte Dateien neu übersetzt und der React Hot Loader den State der Anwendung behält, ist die Turn-Around-Zeit auch bei größeren Anwendungen sehr kurz.

In vielen Beiträgen auf der vergangenen [React Europe-Konferenz](https://www.react-europe.org/) Anfang Juli ist die "Developer Experience" (DX) neben der "User Experience" (UX) immer wieder als wichtiges Thema für das React Universum herausgestellt worden. Es ist also zu erwarten, dass die Entwicklung in diesem Bereich noch lange nicht abgeschlossen ist und wir weitere Vereinfachungen erwarten dürfen. Einen kleinen Ausblick darauf gab unter anderem  Dan Abramov in seinem sehr guten Talk [Live React: Hot Reloading with Time Travel](https://www.youtube.com/watch?v=xsSnOQynTHs).

Was sind Eure bevorzugten Tools für die Entwicklung mit React? Was fehlt Euch bei der Arbeit, wo seht ihr noch große Probleme (bzw Potentiale ;-) )? Wir freuen uns über Euer Feedback über die Kommentar-Funktion auf dieser Seite.
