---
title: "jQuery Chosen mit React & Webpack"
description: "Lerne, wie du Bibliotheken in Webpack integrierst, die von globalen Variablen abhängen"
author: "Marcin Grzywaczewski"
published_at: 2016-01-13 14:14:43
header_source: ""
categories: [react, webpack, jquery, chosen]
---

Modularisierung ist Teil jeder modernen Sprache mit der komplexe Applikationen gebaut werden. JavaScript nimmt hier eine Sonderstellung ein – Modularisierung ist in der Sprache selber (vor ES2015) nicht vorhanden. Es gibt großartige Standards ([CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1.1) oder [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)) und Tools, um Modularisierung zu realisieren und eines der beliebtesten ist Webpack, ein [_module bundler_](http://reactkungfu.com/2015/07/the-hitchhikers-guide-to-modern-javascript-tooling/), der einige sogenannte loader mit sich bringt, die den Code umwandeln.

Leider gibt es dabei oft Kompatibilitätsprobleme. Es gibt Bibliotheken, die Module nicht verstehen und annehmen, dass Abhängigkeiten global unter vordefinierten Namen verfügbar sind.

Dieses Problem hatte ich heute: ich wollte die großartige [Chosen](https://harvesthq.github.io/chosen/) Bibliothek für multi-select Inputs benutzen. Leider erwartet Chosen, dass `jQuery` im globalen Namespace definiert ist und ignoriert Module. In diesem Artikel möchte ich daher zeigen, wie man solche Bibliotheken in Webpack integriert, ohne globale Variablen festzulegen.

## Ziel und Ausgangssituation

Mein Ziel war es, Chosen zu erlauben, meine `jQuery` Instanz zu erweitern, ohne die jQuery Instanz global verfügbar zu machen. Ich habe jQuery in mein Projekt mithilfe des `npm install --save jQuery` Befehls als Modul installiert. Also muss ich jedes mal, wenn ich jQuery nutzen möchte, dieses manuell importieren (hier in ES2015 Syntax):

```javascript
import $ from 'jquery';
```

Chosen gibt es als Bower Paket oder als eigenständige Javascriptdatei mit zugehörigen CSS-Dateien und Bildern. Ich habe mich für den zweiten Ansatz entschieden und habe es in einen *vendor/* Ordner in meinem Projekt gepackt. Die *chosen.jquery.js* Datei habe ich in den *vendor* Ordner gelegt.

Wie bereits erwähnt, *chosen.jquery.js* versteht keine Module, jQuery muss global mit dem Namen jQuery definiert sein. Bei vielen Bibliotheken ist es außerdem gut wenn *this* auf die *window* Variable weist, die nicht in vielen Umgebungen angenommen wird. Babel.js nimmt beispielsweise an, dass jeder Input, den es aufnimmt, ein ES2015 Modul ist und *this* weist in diesem Fall auf *null* (mehr dazu [hier](https://babeljs.io/docs/faq/#why-is-this-being-remapped-to-undefined-)). Wenn ihr also _babel-loader_ integriert, um ES2015 Syntax zu benutzen, könntet ihr Probleme mit solchen Bibliotheken bekommen.

Da das Problem jetzt beschrieben ist, sollten wir uns nun ansehen, wie wir die perfekte Lösung dazu finden. Perfekt wäre, jQuery als Modul zu behalten ohne es global freizugeben und trotzdem in der Lage zu sein Bibliotheken zu nutzen, die annehmen, dass jQuery global definiert ist.

## Lösung: import-loader

Webpack verfügt über einen speziellen loader, um mit solchen Fällen umzugehen, den [imports-loader](https://github.com/webpack/imports-loader). Dieser muss selber installiert werden – er kommt nicht standardmäßig mit Webpack. Glücklicherweise ist der Installationsprozess ziemlich unkompliziert:

```sh
npm install --save-dev imports-loader
```

Anschließend müsst ihr eure Webpackkonfiguration anpassen. In der _loaders_ Section von eurer config-Datei müsst ihr folgenden Code hinzufügen:

```javascript
{ test: /vendor\/.+\.(jsx|js)$/,
  loader: 'imports?jQuery=jquery,$=jquery,this=>window'
}
```

Betrachten wir die die obenstehende *loader* Definition einmal genauer:
Der erste Teil, _imports_, definiert, dass wir _imports-loader_ benutzen möchten. Nach _?_ kommt eine Liste von Werten, getrennt durch Kommata. _jQuery=jquery_ definiert, dass unter der _jQuery_ Variable im geladenen Code ein Ergebnis des _require('jquery')_ Befehls stehen wird – in unserem Fall die jQuery Bibliothek aus dem Modul. Der nächste Parameter tut das Gleiche, nur der Name ist anders (`$`). Wenn ihr eure Variable genauso wie euer Modul nennen wollt, könnt ihr den Teil nach dem Gleichheitszeichen, sowie das Zeichen selber, überspringen. Nur _jquery_ würde also eine _jquery_ Variable mit dem Wert _require('jquery')_ im geladenen Code kreieren.

Der letzte Wert dient dazu die globale Variable neuzudefinieren. Das globale _this_ verweist also auf _window_ im geladenen Code. Das ist äquivalent zum wrappen des gesamten Inhalts der Datei mit _function(this) { ... }_ und diese Funktion aufzurufen mit _window_ als Argument. Dasselbe könnt ihr auch mit jeder anderen globalen Variable machen und es wird mit einem Pfeil angezeigt (_=>_).

Das war's schon! Jetzt könnt ihr folgendes machen:

```javascript
import $ from 'jquery';
import 'vendor/chosen.jquery';
```

Und schon kann man das _Chosen_ jQuery-Plugin problemlos mit Webpack benutzen!

## Zusammenfassung

Ihr könnt sehen, dass die Integration von Bibliotheken, die Module nicht verstehen, ohne ihre Abhängigkeiten global preiszugeben, eigentlich ganz einfach ist. Auch ich dachte, dass das Ganze etwas schwieriger werden würde, denn ich habe viele Webpack Konfigurationen gesehen, bei denen beliebte Bibliotheken und Frameworks wie jQuery oder Angular.js als globale Variablen exponiert wurden. Ich hoffe, ihr seid jetzt in der Lage eure bevorzugten Bibliotheken zu integrieren, so wie ich es mit Chosen gemacht habe.

## Credits

_Dies ist eine Übersetzung des Artikels [Integrating jQuery Chosen with Webpack using imports-loader](http://reactkungfu.com/2015/10/integrating-jquery-chosen-with-webpack-using-imports-loader/), der ursprünglich am 24. Oktober 2015 auf [React Kung Fu](http://reactkungfu.com) erschienen ist._
