---
header_image: "header.png"
title: "ReactJS & TypeScript"
description: "Lerne wie du eine ReactJS mit TypeScript nutzt"
author: "Jack Franklin"
published_at: 2017-05-29 15:00:00.000000Z
categories:
  - reactjs
  - tutorial
---

Ich bin neulich auf den Geschmack von TypeScript gekommen und habe darüber in vielen Blogs von [Tom Dale](https://medium.com/@tomdale/glimmer-js-whats-the-deal-with-typescript-f666d1a3aad0)
und anderen gelesen. Heute zeige ich dir wie ich ein TypeScript Projekt von Grund auf mit React und Webpack, um den Build-Process zu verwalten, neu eingerichtet habe. Ich werde dir auch meine ersten Eindrücke von TypeScript geben und insbesondere mit TypeScript und ReactJS arbeiten.

Ich werde nicht zu sehr ins Detail der Besonderheiten der TypeScript Syntax eingehen, aber du kannst entweder das [TypeScript Handbook](https://www.typescriptlang.org/docs/tutorial.html) oder das kostenlose Buch [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/content/docs/getting-started.html), welches dir auch eine großartige Einführung in die Sprache geben wird, lesen.

## TypeScript installieren und konfigurieren

Das erste was zu tun war, ist TypeScript lokal in mein `node_modules` zu installieren, was ich mit `yarn` gemacht habe. Zuerst habe ich also mit `yarn init` ein neues Projekt erstellt:

```javascript
yarn init
yarn add typescript
```

Wenn du TypeScript installierst, bekommst du das `tsc` command line tool, welches TypeScript kompilieren kann und auch einen start `tsconfig.json`, den du bearbeiten kannst. Das kannst du, indem du `tsc --init` ausführst– wenn du TypeScript lokal installiert hast, dann musst du `./node_modules/.bin/tsc --init` ausführen.

**Anmerkung:** Ich habe das Verzeichnis `./node_modules/.bin` auf meinem `$PATH`, [welches du in meinen dotfiles finden kannst](https://github.com/jackfranklin/dotfiles/blob/master/zsh/zshrc#L101). Das ist etwas riskant, da ich versehentlich irgendeine ausführbare Datei aus diesem Verzeichnis ausführen könnte, aber ich gehe das Risiko ein, weil ich weiß was ich lokal installiert habe und das spart mir sehr viel getippe!

`tsc --init` generiert ein `tsconfig.json`, dort sind alle configs der Kompilierer von TypeScript. Es gibt ein paar Änderungen, die ich an der default config vorgenommen habe und diejenige die ich verwende, siehst du unten:

```javascript
{
  "compilerOptions": {
    "module": "es6", // use ES2015 modules
    "target": "es6", // compile to ES2015 (Babel will do the rest)
    "allowSyntheticDefaultImports": true, // see below
    "baseUrl": "src", // enables you to import relative to this folder
    "sourceMap": true, // make TypeScript generate sourcemaps
    "outDir": "ts-build", // output directory to build to (irrelevant because we use Webpack most of the time)
    "jsx": "preserve", // enable JSX mode, but "preserve" tells TypeScript to not transform it (we'll use Babel)
    "strict": true,
  },
  "exclude": [
    "node_modules" // don't run on any code in the node_modules directory
  ]
}
```

### allowSyntheticDefaultImports

Mit dieser Regel kannst du ES2015 style `default imports` benutzen, sogar dann, wenn der Code, den du importierst, keinen ES2015 default export hat.

Das geschieht beim importieren, zum Beispiel wenn du React importierst, dessen Code nicht in ES2015 geschrieben ist (Der source code ist es, aber React liefert eine eingebaute Version). Das bedeutet, technisch gesehen hat er keinen ES2015 `default export`, also wird TypeScript dir sagen, wenn du ihn importierst. Allerdings sind Build-Tools wie Webpack in oder Lage, das richtige zu importieren, also schalte ich die Option an, weil   ich `import React from 'react'` gegenüber `import * as React from'react'`bevorzuge.

### strict: true

[TypeScript version 2.3](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#new---strict-master-option) hat eine neue config Option eingeführt, `strict`. Wenn eingeschaltet, dann konfiguriert der TypeScript-Compiler so streng wie möglich – das ist vielleicht nicht was du willst, wenn du einen JS an TS portierst, aber für neue Projekte ist es sinnvoll so „streng“ wie möglich zu sein. Dies schaltet ein paar verschiedene Einstellungen ein, die erwähnenswertesten sind `noImplicitAny` und `strictNullChecks`:

### noImplicitAny

Oftmals, wenn du TypeScript zu einem vorhandenen Projekt hinzufügen möchtest, macht es dir TypeScript einfach, indem es keine Fehlermeldung auswirft, wenn du die Variablentypen nicht deklarierst. Allerdings möchte ich, dass der Compiler so streng wie möglich ist, wenn ich ein neues TypeScript Projekt aufbaue.

Eines der Dinge, die TypeScript standartmäßig ausführt ist den `any` Typ zu Variablen anfügt. `any` ist eine effektive Methode in TypeScript die sagt „type-checke das nicht, es kann jeder Wert sein“. Das ist nützlich, wenn du JavaScript portierst, aber es ist besser strikt zu sein, wenn du kannst. Mit dieser Einstellung die auf `true` gesetzt ist, kannst du keine Deklarationen verpassen. Zum Beispiel wird dir dieser Code einen Error geben, wenn `noImplicitAny` auf `true` gesetzt ist:

```javascript
function log(thing) {
  console.log('thing', thing)
}
```

Du kannst darüber mehr in [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html) lesen.

### strictNullChecks

Das ist eine weitere Option, um den TypeScript-Compiler strikter zu gestalten. Das TypeScript Deep Dive Buch beinhaltet eine [große Sektion über diese Option](https://basarat.gitbooks.io/typescript/docs/options/strictNullChecks.html).

Mit dieser Option wird TypeScript mehr Fälle erkennen, bei denen du auf einen Wert verweist, der undefiniert sein könnte. Es wird dir, zum Beispiel, ein Fehler zurückgeben:

```javascript
person.age.increment()
```

Mit `strictNullChecks` aktiv, wirft Typescript eine Fehlermeldung aus und stellt sicher, dass du dich darum kümmerst, wenn TypeScript denkt, dass `person` oder `person.age` `undefiniert` ist. Das verhindert runtime Fehler, deshalb scheint es eine ziemlich gute Option zu sein.

## Webpack, Babel und TypeScript einstellen

Ich bin ein großer Fan von Webpack; ich genieße das Ökosystem der verfügbaren Plugins, ich mag den Workflow der Developer und es ist gut bei der Verwaltung komplexer Anwendungen. Deshalb würde ich Webpack hinzufügen, auch wenn wir einfach den TypeScript-Compiler verwenden könnten. Wir brauchen auch Babel, weil der TypeScript Compiler ES2015 + React für uns ausgibt, also lassen wir Babel die Arbeit für uns machen. Lass uns Webpack, Babel und die nötigen Presets installieren, zusammen mit dem [ts-loader](https://github.com/TypeStrong/ts-loader) und dem Webpack Plugin für TypeScript.

Es gibt auch einen [awesome-typeScript-loader](https://github.com/s-panferov/awesome-typescript-loader), aber ich habe `ts-loader` zuerst gefunden und bisher funktioniert der super. Ich würde gerne von irgendjemandem der den `awesome-typescript-loader` benutzt hören, wie die Vergleiche sind.

```javascript
yarn add webpack babel-core babel-loader babel-preset-es2015 babel-preset-react ts-loader webpack-dev-server
```

An dieser Stelle möchte ich Tom Duncalf danken, [Blog-Post zu TypeScript 1.9 + React](http://blog.tomduncalf.com/posts/setting-up-typescript-and-react/) war ein genialer Startpunkt für mich, den ich wärmstens empfehlen kann.

Es gibt nichts Überraschendes in der Webpack-config, ich habe dem Code einige Kommentare beigefügt:

```javascript
const webpack = require('webpack')
const path = require('path')

module.exports = {
  // put sourcemaps inline
  devtool: 'eval',

  // entry point of our application, within the `src` directory (which we add to resolve.modules below):
  entry: [
    'index.tsx'
  ],

  // configure the output directory and publicPath for the devServer
  output: {
    filename: 'app.js',
    publicPath: 'dist',
    path: path.resolve('dist')
  },

  // configure the dev server to run
  devServer: {
    port: 3000,
    historyApiFallback: true,
    inline: true,
  },

  // tell Webpack to load TypeScript files
  resolve: {
    // Look for modules in .ts(x) files first, then .js
    extensions: ['.ts', '.tsx', '.js'],

    // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
    modules: ['src', 'node_modules'],
  },

  module: {
    loaders: [
      // .ts(x) files should first pass through the Typescript loader, and then through babel
      { test: /\.tsx?$/, loaders: ['babel-loader', 'ts-loader'], include: path.resolve('src') }
    ]
  },
}
```

Wir konfigurieren die Loader so dass jede `.ts(x)` Datei zuerst durch den `ts-loader` geht - Dieser kompiliert es mit TypeScript, indem es die Einstellungen in unserer `tsconfig.json` benutzt – und `ES2015` zu emmitieren. Dann benutzen wir Babel um es runter zu ES5 zu konvertieren. Um das zu schaffen, erstelle ich eine `.babelrc` die die Voreinstellungen hat die wir benötigen:

```javascript
{
  "presets": ["es2015", "react"]
}
```

Und damit sind wir jetzt in der Lage unsere TypeScript Anwendung zu schreiben.

## Eine TypeScript React Komponente schreiben

Jetzt sind wir bereit um `src/index.tsx` zu erstellen, das wird der Einstiegspunkt unserer Anwendung.
Jetzt können wir zunächst eine Dummy-Komponente erstellen und rendern, um zu checken, ob alles funktioniert.

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  return (
    <div>
      <p>Hello world!</p>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
```

Wenn du jetzt Webpack laufen lässt, siehst du einige Fehler:

```shell
ERROR in ./src/index.tsx
(1,19): error TS2307: Cannot find module 'react'.

ERROR in ./src/index.tsx
(2,22): error TS2307: Cannot find module 'react-dom'.
```

Das passiert, weil TypeScript versucht den Typ von React herauszufinden. Das gleiche versucht er also für React DOM zu machen. React ist nicht in TypeScript verfasst, deshalb enthält es diese Information nicht. Aber zum Glück hat die Community für diesen Fall [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) erstellt, ein großes Repertoir an Typen und Modulen.

Der Installations-Mechanismus hat sich kürzlich geändert; alle Typen werden unter dem Bereich `@types` gespeichert. Um die Typen für React und ReactDOM zu bekommen, führen wir folgendes aus:

```javascript
yarn add @types/react
yarn add @types/react-dom
```

Und damit verschwinden die Fehler. Immer wenn du eine Abhängigkeit installierst, kannst du immer versuchen das `@types` Packet auch zu installieren, oder wenn du sehen willst ob die Typen verfügbar sind, kannst du die [TypeSearch](https://microsoft.github.io/TypeSearch/) Webseite benutzen.

## Die Anwendung lokal ausführen

Um die Anwendung lokal auszurühren müssen wir einfach nur den `webpack-dev-server` Befehl ausführen.
Ich habe dafür ein Shortcut `start` erstellt:

```javascript
"scripts": {
  "start": "webpack-dev-server"
}
```

Der Dev-Server wird die `webpack.config.json` Datei finden und sie benutzen, um unsere Anwendung zu bauen.

Wenn du `yarn start` ausführst wirst du den Output vom Server sehen, eingeschlossen den Output vom `ts-loader`, der bestätigt, dass alles funktioniert.


```javascript
$ webpack-dev-server
Project is running at http://localhost:3000/
webpack output is served from /dist
404s will fallback to /index.html
ts-loader: Using typescript@2.3.0 and /Users/jackfranklin/git/interactive-react-introduction/tsconfig.json
Version: webpack 2.4.1
Time: 6077ms
 Asset     Size  Chunks                    Chunk Names
app.js  1.14 MB       0  [emitted]  [big]  main
webpack: Compiled successfully.
```

Um es lokal zu sehen, kann ich eine `index.html` Datei erstellen, die unseren kompilierten Code lädt:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Typescript App</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="dist/app.js"></script>
  </body>
</html>
```

Du solltest `Hello world!` auf Port 3000 sehen, dann läuft TypeScript!

## Ein Modul eingeben

Für ein Projekt an dem ich gearbeitet habe, wollte ich das [React Ace Modul](https://github.com/securingsincity/react-ace) verwenden, um einen Code Editor in mein Projekt einzufügen. Allerdings hat das Modul keine Typen dafür zur Verfügung gestellt und es gibt auch kein `@tyoes/react-ace`. In diesem Fall müssen wir Typen zu unserer Anwendung hinzufügen, damit TypeScript weiß, wie man es eingibt. Das mag vielleicht ärgerlich klingen, aber die Vorteile, dass TypeScript zumindest ein bisschen über alle Drittanbieter-Abhängigkeiten weiß, wird dir viel Debugging-Zeit ersparen.

Um eine Datei zu definieren, die gerade Typen hat, hängst du ihr `.d.ts` (das „d“ steht für „declaration“) an. Du kannst darüber mehr auf den [TypeScript docs](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) lesen. TypeScript wird diese Dateien in deinem Projekt automatisch finden. Du musst sie nicht explizit importieren.

Ich habe die Datei `react-ace.d.ts` erstellt, der das Module erstellt und ihren `default expor` als eine React Komponente definiert:

```javascript
declare module 'react-ace' {
    interface ReactAceProps {
      mode: string
      theme: string
      name: string
      editorProps?: {}
      showPrintMargin?: boolean
      minLines?: number
      maxLines?: number
      wrapEnabled?: boolean
      value: string
      highlightActiveLine?: boolean
      width?: string
      fontSize?: number
    }

    const ReactAce: React.ComponentClass<ReactAceProps>
    export = ReactAce
}
```

Zuerst erstelle ich ein TypeScript Interface für die Eigenschaften, welche die Komponente benötigt, dann musst ich nur noch `export = ReactAce` deklarieren. Durch die Eingabe der Eigenschaften wird TypeScript mir sagen, wenn ich eine Eigenschaft falsch geschrieben habe oder vergessen habe, die wichtig ist.

## Testen

Zum Schluss wollte ich auch ein gutes Testing Setup mit TypeScript haben. Ich bin ein großer Fan von Facebooks [Jest](https://facebook.github.io/jest/) und habe ein bisschen gegooglet, um herauszufinden, ob ich es mit TypeScript starten kann. Es hat sich herausgestellt, dass es sehr gut möglich ist, und da gibt es sogar das [ts-jest](https://www.npmjs.com/package/ts-jest) Packet, dass all die schweren Arbeiten erledigt. Darüber hinaus gibt es da noch das `@types/jest` Packet, damit kannst du auch all deine Tests type-checken lassen kannst.

Großes Dankeschön an RJ Zaworski, [dessen Post über TypeScript und Jest](https://rjzaworski.com/2016/12/testing-typescript-with-jest) der mich in dieses Thema eingeführt hat. Sobald du `ts-jest` installiert hast, musst du Jest nur noch konfigurieren, das machst du in `package.json` mit diesen Einstellungen:

```javascript
"jest": {
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "transform": {
    "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "/*.spec.(ts|tsx|js)$"
},
```

Die erste Einstellung macht, dass Jest nach `.ts` und `.tsx` Dateien schaut. Das `transform` sagt, dass Jest jegliche TypeScript Dateien durch den `ts-jest` Präprozessor zum laufen bringt, der sie über den TypeScript-Compiler ausführt und JavaScript erzeugt, das Jest erkennt. Dann schließlich habe ich die `testRegex` Einstellung geupdatet, um nach `*.spec.ts(x)` Dateien zu schauen (meine bevorzugte Namensgebungkonvention für Tests).

Damit kann ich einfach `jest` ausführen und alles läuft wie erwartet.

## Linting mit TSLint

Obwohl TypeScript deinen Code auf viele Arten checkt, wollte ich trotzdem noch einen Linter, um einige weitere Code-Style- und Qualitätschecks zu ermöglichen. Ähnlich wie ESLint in JavaScript ist [TSLint](https://palantir.github.io/tslint/) die beste Option, um TypeScript Dateien zu überprüfen. Es funktioniert auf die gleiche Art wie ESLint – mit einer Reihe von Regeln die du aktivierst oder deaktivierst. Und es gibt auch ein [TSLint-React](https://github.com/palantir/tslint-react) Packet, mit dem du spezifische Regeln hinzufügen kannst.

Du kannst TSLint über eine `tslint.json` Datei konfigurieren. Meine ist unten. Ich benutze beide, die `tslint:latest` und die `tslint-react` Presets, welche eine Reihe von Regeln ermöglichen. Ich bin jedoch mit einigen der Defaults nicht einverstanden, also überschreibe ich sie – du kannst das aber auch anders regeln – das liegt bei dir!

```javascript
{
    "defaultSeverity": "error",
    "extends": ["tslint:latest", "tslint-react"],
    "jsRules": {},
    "rules": {
      // use single quotes, but enforce double quotes in JSX
      "quotemark": [true, "single", "jsx-double"],
      // I prefer no semi colons :)
      "semicolon": [true, "never"],
      // This rule makes each Interface be prefixed with 'I' which I don't like
      "interface-name": [true, "never-prefix"],
      // This rule enforces objects to always have keys in alphabetical order
      "object-literal-sort-keys": false
    },
    "rulesDirectory": []
}
```

Dann kann ich das `tslint --project tsconfig.json` laufen lassen, um mein Projekt zu linten.

#### Credits

Original gepostet von [Jack Franklin](https://twitter.com/jack_franklin) auf [javascriptplayground.com](http://javascriptplayground.com/blog/2017/04/react-typescript/).
