---
title: "JavaScript Module - Bundling (Teil 2)"
description: "Im ersten Teil des Posts habe ich erklärt was Module sind, wieso Entwickler sie benutzen und habe verschiedene Wege gezeigt, sie in Programmen anzuwenden."
author: "Preethi Kasireddy"
published_at: 2016-03-10 12:04:14
header_source: https://unsplash.com/photos/B6yDtYs2IgY
categories: [javascript, module, es6]
---

*Den Artikel im Original von Preethi Kasireddy in Englischer Sprache gibt's [hier](https://medium.freecodecamp.org/javascript-modules-part-2-module-bundling-5020383cf306).*


Im [ersten Teil](/artikel/javascript-module-einleitung/) des Posts habe ich erklärt was Module sind, wieso Entwickler sie benutzen und habe verschiedene Wege gezeigt, sie in Programmen anzuwenden.
In diesem Teil erkläre ich was es heißt Module zu bündeln: wieso wir sie bündeln, die verschiedenen Arten dies zu bewerkstelligen und die Zukunft von Modulen in der Webentwicklung.

## Was ist Module Bundling?
Auf einem fortgeschrittenen Level ist Module Bundling der Prozess, eine Gruppe von Modulen in einer Datei (oder einer Gruppe von Dateien) in der richtigen Reihenfolge zusammenzufügen (inklusive ihrer Abhängigkeiten).
Wie bei allen Aspekten der Webentwicklung liegt auch hier der Teufel im Detail.

## Wieso überhaupt Module bundeln?
Wenn ihr euer Programm in Module aufteilt, organisiert ihr diese Module normalerweise in verschiedenen Dateien und Ordnern. Eventuell habt ihr auch noch eine Gruppe von Modulen für die Bibliothek, die ihr benutzt, wie z.B. Underscore oder React.
Daraus folgt, dass jede dieser Dateien in eurer übergeordneten HTML Datei in einem script Tag integriert werden muss, welches dann vom Browser geladen wird. Wenn ihr viele separate sript tags für jede Datei habt, bedeutet das, dass der Browser jede Datei individuell laden muss: eine. nach. der. anderen.
Und das ist schlecht für die Ladezeit eurer Seite.
Um dieses Problem zu umgehen, bündeln oder „konzentrieren“ wir alle unsere Dateien in eine große Datei (manchmal auch nur wenige, je nachdem), um die Anzahl an requests zu reduzieren. Das ist gemeint, wenn ein Entwickler von „build step“ oder „build process“ spricht.

Ein weiterer beliebter Ansatz das Bundling zu beschleunigen, ist den gebündelten Code zu „minimieren“. Die Minimierung bezeichnet den Prozess unnötige Zeichen aus dem Code (wie z.B. whitespace, Kommentare, etc.) zu entfernen, um den Gesamtumfang des Inhalts zu reduzieren, ohne dessen Funktionalität zu beeinflussen.
Weniger Daten bedeutet weniger Verarbeitungszeit seitens des Browser, was wiederum  die Zeit verringert, Daten herunterzuladen. Wenn ihr mal eine Datei gesehen habt, die eine .min Erweiterung hat (wie underscore-min.js), ist euch vermutlich aufgefallen, dass die minimierte Version ziemlich winzig ist (und unlesbar) verglichen mit der Vollversion.
Task Runners wie Gulp und Grunt machen das Konzentrieren und Minimieren für Entwickler sehr unkompliziert und stellen sicher, dass von Menschen lesbarer Code für Entwickler zugänglich ist während maschinenoptimierter Code für den Browser gebündelt wird.

# Welche unterschiedlichen Methoden gibt es, Module zu bündeln?

Dateien zu konzentrieren und zu minimieren funktioniert gut, wenn ihr eines der Standard Module Pattern benutzt (wie im ersten Teil beschrieben) um eure Module zu definieren. Was ihr dabei im Prinzip mach, ist dass ihr verschiedenen 08/15 JavaScript Code zusammenwerft.
Haltet ihr euch aber an nicht-native Modulsysteme, die von Browsern nicht wie CommonJS oder AMD interpretieren werden können, braucht ihr ein spezielles Tool, um eure Module in vernünftig geordneten, browserfreundlichen Code zu konvertieren. Hier kommen Browserify, RequireJS, Webpack und andere „module bundlers“ oder „module loaders“ in Spiel.
Zusätzlich zum Bündeln und/oder Laden eurer Module, bieten Module Bundlers eine Menge anderer Features wie Auto-Rekompililierung von Code, wenn ihr Änderungen vornehmt oder Source Maps für’s Debugging erstellt.
Lasst uns einige bekannte Modulbündel-Methoden ansehen:

## CommonJS bündeln
Wie ihr schon im ersten Teil gelernt habt, lädt CommonJS Module synchron, was in Ordnung ist – bis auf die Tatsache, dass es für Browser nicht sehr praktikabel ist. Ich habe erwähnt, dass es dafür Lösungen gibt. Eine davon heißt Browserify. Dieses Tool kompiliert Module für den Browser.
Ihr habt z.B. diese main.js Datei, die ein Modul importiert, um den Mittelwert eines Arrays von Zahlen zu berechnen:

<script src="https://gist.github.com/iam-peekay/cab5c5a0250291b55fc3.js"></script>

<br>
In diesem Fall haben wir eine Abhängigkeit (myDependency). Mit dem unten gezeigten Befehl bündelt Browserfy rekursiv alle benötigten Module, beginnend mit main.js, in eine einzelne Datei, die bundle.js heißt:

<script src="https://gist.github.com/iam-peekay/7a4b8f735bddfc06de9e.js"></script>

<br>
Das macht Browserfy, indem es den AST (abstract syntax tree) für jeden ‚require’ Befehl analysiert und so die gesamte Abhängigkeitsstruktur des Projekts durchläuft. Sobald es festgestellt hat, wie eure Abhängigkeiten strukturiert sind, bündelt es alle in der richtigen Reihenfolge in eine einzige Datei. An diesem Punkt müsst ihr nur ein einzelnes script tag mit eurer bundle.js Datei in euer HTML einfügen, damit euer gesamter Code in einem HTTP request heruntergeladen wird. Bam! Fertig gebündelt und einsatzbereit.
Habt ihr verschiedenen Dateien mit vielen Abhängigkeiten, müsst ihr Browserfy nur sagen, was euer entry file ist und könnt euch zurücklehnen, während Browserify zaubert.
Das Endprodukt sind gebündelte Dateien, fertig vorbereitet und bereit für Tools wie Minify-JS, um den gebündelten Code zu minimieren.

## AMD bündeln

Verwendet ihr AMD, solltet ihr einen AMD *loader* wie RequireJS oder Curl benutzen. Ein module loader (vs. module bundler) lädt dynamisch Module, die euer Programm zum Laufen benötigt.
Zur Erinnerung: Einer der Hauptunterschiede zwischen AMD und CommonJS ist, dass AMD Module asynchron lädt. In diesem Sinne braucht man mit AMD eigentlich keinen Schritt, in dem man Module in einer Datei bündelt, denn man lädt die Module ja asynchron – also ladet ihr nacheinander nur die Dateien, die wirklich notwendig sind um das Programm auszuführen, statt alle Dateien auf einmal herunterzuladen, sobald der User die Seite besucht.
In der Praxis aber macht ein Mehraufwand durch eine riesige Anzahl einzelner Anfragen für jede Aktion durch den Nutzer auch wenig Sinn. Die Meisten Entwickler nutzen Tools (wie RequireJS optimizer oder r.js) um ihre AMD Module für eine optimale Performance zu bündeln und zu minimieren.
Insgesamt ist der Unterschied zwischen AMD und CommonJS, wenn es ums bündeln geht folgendes: während des Entwickelns können AMD Apps ohne *Build Step* auskommen – wenigstens bis der Code live geht, von wo aus Optimizer wie r.js helfen können.
Eine interessante Diskussion zu CommonJS vs. AMD git es in diesem Post auf [Tom Dale’s Blog](http://tomdale.net/2012/01/amd-is-not-the-answer/).

## Webpack

Webpack wurde designed um unabhängig von dem Modulsystem sein zu können, das ihr nutzt. Somit können Entwickler je nach Anspruch CommonJS, AMD oder ES6 nutzen.
Ihr fragt euch vielleicht, wieso wir Webpack brauchen, wenn wir schon andere Bundler wie Browserify und RequireJS haben, die den Job ziemlich gut erledigen. Zum einen hat Webpack einige coole Features wie „code splitting“ – eine Möglichkeit euren Code in Teile zu splitten, die bei Bedarf geladen werden.
Habt ihr bspw. eine Web App mit Codeabschnitten, die nur unter bestimmten Bedingungen benötigt werden, ist es unter Umständen nicht effizient, die gesamte Codebase in eine einzige große, gebündelte Datei zu packen. In dem Fall könnt ihr code splitting nutzen, um Code in kleinere gebündelte Teile aufzuteilen, die bei Bedarf geladen werden und somit Schwierigkeiten durch das Laden großer Datenmengen vermeiden.
Codesplitting ist nur eines der vielen schönen Features von Webpack und im Netz kursieren viele Meinungen dazu, ob nun Webpack oder Browserify besser ist. Hier gibt es einige informative und fundierte Diskussionen zum Thema, die ich sehr hilfreich fand, um mir eine Meinung zu dem Thema zu bilden:

- https://gist.github.com/substack/68f8d502be42d5cd4942
- http://mattdesl.svbtle.com/browserify-vs-webpack
- http://blog.namangoel.com/browserify-vs-webpack-js-drama

##  ES6 Module

Seid ihr wieder da? Sehr gut, denn als nächstes möchte ich über ES6 Module sprechen, die eventuell in Zukunft den Bedarf an Bundlern reduzieren könnten. Dafür sollten wir uns zuerst ansehen, wie ES6 Module geladen werden.

Der wichtigste Unterschied zwischen aktuellen JS Modulformaten (CommonJS, AMD) und ES6 Modulen ist, dass letztere auf einer statischen Analyse basieren. Dies bedeutet, dass, wenn ihr Module importiert, der Import mit der Compilezeit abgeschlossen ist – also bevor das Script ausgeführt wird. So können wir Exporte, die von anderen Modulen nicht gebraucht werden, vor dem Ausführen des Programms entfernen. Das Beseitigen von nicht gebrauchten Exporten kann zu deutlichen Platzeinsparungen im Code führen, was die Belastung für den Browser verringert.
Eine Frage, die dabei oft aufkommt ist: Was daran ist anders als das Entfernen von „totem“ Code beim Minimieren mit bspw. UglifyJS. Die Antwort darauf lautet: kommt drauf an.

(Wichtig: toten Code zu eliminieren ist ein Optimierungsschritt, der nicht gebrauchten Code und Variablen entfernt. Stellt es euch wie nutzlosen Ballast vor, den das Programm nicht benötigt um zu laufen, *nachdem* es gebündelt wurde)

Manchmal funktioniert das Entfernen toten Codes bei UglifyJS und ES6 Modulen genau gleich, manchmal aber auch nicht. Es gibt ein schönes Beispiel bei [Rollup’s Wiki](https://github.com/rollup/rollup), falls ihr es euch näher ansehen wollt.

Was ES6 Module besonders macht, ist der unterschiedliche Ansatz, um toten Code zu eliminieren – „tree shaking“. Tree shaking ist eigentlich ein umgekehrtes Eliminieren von totem Code. Es bezieht nur den Code ein, den euer Bundle zum Laufen benötigt, anstatt den Code zu rauszuwerfen, den es nicht braucht. Wir können uns mal ansehen, wie man „am Baum rüttelt“:

Sagen wir einfach, wir haben eine utils.js Datei mit den untenstehenden Funktionen, von denen wir jede mithilfe der Es6 Syntax exportieren:

<script src="https://gist.github.com/iam-peekay/057a1488c2e3edfb520f.js"></script>

<br>
Als nächstes nehmen wir an, wir wüssten nicht, welche utils Funktionen wir in unserem Programm benutzen wollen. Also importieren wir alle unserer Module in main.js:

<script src="https://gist.github.com/iam-peekay/bd0b2bdb6ac2e24e459d.js"></script>

<br>
Und später nutzen wir nur noch die *each* Funktion:

<script src="https://gist.github.com/iam-peekay/5c0cc9f267e0b43a004d.js"></script>

<br>
Die „tree shake“ Version unserer main.js Datei würde in etwa so aussehen, nachdem die Module geladen wurden:

<script src="https://gist.github.com/iam-peekay/7d563a54c2311d3719df.js"></script>

<br>
Beachtet, dass die einzigen inbegriffenen Exporte, diejenigen sind, die wir benutzen: **each**.
Falls wir uns dazu entschieden die *filter* Funktion statt der *each* Funktion zu benutzen, werden wir so etwas in der Art sehen:

<script src="https://gist.github.com/iam-peekay/5b9b7050c3df22a53902.js"></script>

<br>
Die „tree shake“ Version sieht so aus:

<script src="https://gist.github.com/iam-peekay/0e810f26cfe50973866f.js"></script>

<br>
Achtet darauf, wie dieses mal sowohl *each* als auch *filter* mit dabei sind. Das ist so, weil *filter* so definiert ist, dass es *each* benutzt. Also brauchen wir beide Exporte, damit das Modul funktioniert. Clever, oder?
Spielt ein bisschen damit herum und rüttelt ein bisschen am Baum in Rollup.js’s [live demo and editor](http://rollupjs.org/#%7B%22options%22%3A%7B%22format%22%3A%22cjs%22%2C%22moduleName%22%3A%22myBundle%22%2C%22globals%22%3A%7B%7D%7D%2C%22modules%22%3A%5B%7B%22name%22%3A%22main.js%22%2C%22code%22%3A%22import%20%7B%20cube%20%7D%20from%20'.%2Fmaths.js'%3B%5Cnconsole.log%28%20cube%28%205%20%29%20%29%3B%20%2F%2F%20125%22%7D%2C%7B%22name%22%3A%22maths.js%22%2C%22code%22%3A%22%2F%2F%20This%20function%20isn't%20used%20anywhere%2C%20so%5Cn%2F%2F%20Rollup%20excludes%20it%20from%20the%20bundle...%5Cnexport%20function%20square%20%28%20x%20%29%20%7B%5Cn%5Ctreturn%20x%20*%20x%3B%5Cn%7D%5Cn%5Cn%2F%2F%20This%20function%20gets%20included%5Cnexport%20function%20cube%20%28%20x%20%29%20%7B%5Cn%5Ct%2F%2F%20rewrite%20this%20as%20%60square%28%20x%20%29%20*%20x%60%5Cn%5Ct%2F%2F%20and%20see%20what%20happens!%5Cn%5Ctreturn%20x%20*%20x%20*%20x%3B%5Cn%7D%22%7D%5D%7D)

## ES6 Module bauen

Wir wissen jetzt, dass ES6 Module anders geladen werden, als andere Modulformate, haben aber noch immer nicht über die nötigen Schritte gesprochen, wenn man ES6 Module verwenden will.
Leider erfordert das ein wenig Fleißarbeit, da es keine native Implementierung dafür gibt, wie Browser ES6 Module laden.
Hier sind ein paar Optionen um ES6 Module zu bauen/konvertieren, damit sie im Browser laufen. Dabei ist #1 der am häufigsten verwendete Ansatz:

1. Benutzt einen Transpiler (z.B. Babel oder Traceur), um den ES6 Code in ES5 Code (im CommonJS, AMD oder UMD Format) umzuwandeln. Dann gebt ihr den „transpilierten“ Code durch einen Module Bundler wie Browserify oder Webpack um eine oder mehrere gebündelte Dateien zu erhalten. (*Anm. d. Redaktion: Den Unterschied zwischen transpiling & compiling könnt ihr euch [hier](https://www.stevefenton.co.uk/2012/11/compiling-vs-transpiling/) anschauen*.)

2. Nutzt Rollup.js. Diese Möglichkeit ist ganz ähnlich wie #1. Außer, dass Rollup abhängig von der Fähigkeit von ES6 Modulen ist, den ES6 Code und die Abhängigkeiten statisch zu analysieren, bevor gebündelt wird. Es nutzt „tree shaking“, um nur das absolute Minimum eures Bundles zu inkludieren. Insgesamt ist der große Vorteil von Rollup.js gegenüber Browserify und Webpack, dass tree shaking eure Bundles (wenn ihr ES6 Module benutzt) kleiner machen kann. Dabei bietet Rollup verschiedene Formate an, zu denen es den Code bündelt, unter anderem ES6, CommonJS, AMD, UMD oder IIFE. IIFE und UMD Bundles funktionieren in eurem Browser, aber entscheidet ihr euch für AMD, CommonJS oder ES6, müsst ihr euch nach einer anderen Möglichkeit umsehen, um den Code in ein Format zu konvertieren, den der Browser versteht (z.B. mit Browserify, Webpack, RequireJS, usw.).

## Ein bisschen zaubern…

Als Webentwickler muss man hin und wieder ein bisschen in die Trickkiste greifen. Es ist nicht immer so einfach unsere wunderschönen ES6 Module in etwas zu konvertieren, das der Browser versteht.
Die Frage ist: Wann laufen ES6 Module endlich im Browser, ohne diesen ganzen Aufwand?
Glücklicherweise ist das wohl eher früher als später der Fall…

ECMAScript arbeitet an einer Losung, die sich [ECMAScript 6 module loader API](https://github.com/ModuleLoader/es6-module-loader) nennt. Zusammengefasst ist es eine API, die eure Module dynamisch laden und im Cache speichern soll, sodass darauf folgende Importe keine neue Version des Moduls laden müssen.
Das sieht dann ungefähr so aus:

**myModule.js**

<script src="https://gist.github.com/iam-peekay/acb7941d3db821ece7ce.js"></script>

<br>
**main.js**

<script src="https://gist.github.com/iam-peekay/a532573e2f86e754a1f4.js"></script>

<br>
Alternativ dazu könnte man Module definieren, indem man „type=module“ direkt im script tag spezifiziert:

<script src="https://gist.github.com/iam-peekay/6715e4a0ee2ff0d4b341.js"></script>

<br>
Schaut euch dieses Repo an: [Polyfill for the ES6 Module Loader](https://github.com/ModuleLoader/es6-module-loader).
Außerdem könnt ihr euch das darauf aufgebaute [SystemJS](https://github.com/systemjs/systemjs) ansehen, um diesen Ansatz mal auszuprobieren. SystemJS lädt dynamisch jedes Modulformat in den Browser und in Node. Es verzeichnet alle geladenen Module in einem „Modulregister“, damit keine bereits geladenen Module nochmals geladen werden. Es „transpiliert“ außerdem ES6 Module und kann noch einiges mehr!

## Brauchen wir noch immer Bundler, wenn wir jetzt native ES6 Module haben?

Die steigende Beliebtheit von ES6 Modulen hat einige interessante Konsequenzen:

### Macht HTTP/2 die Module Bundler obsolet?

Bei HTTP/1 ist nur ein Request pro TCP Verbindung erlaubt – deswegen braucht man viele Requests um viele Ressourcen zu laden. Bei HTTP/2 ist alles anders. HTTP/2 erlaubt mehrere Requests parallel, sodass wir verschiedene Requests simultan mit einer Verbindung bedienen können.
Der Aufwand pro HTTP Request ist wesentlich geringer als bei HTTP/1, weshalb das Laden von einem Haufen Module auf Dauer keine großen Performanceprobleme bereitet. Es wird oft behauptet, dass das Bündeln von Modulen deshalb nicht mehr notwendig sein wird. Das ist mit Sicherheit möglich, hängt aber auch von der Situation ab.
Module Bundling bringt Vorteile mit sich, die HTTP/2 nicht bieten kann, wie z.B. das Entfernen von ungenutzten Exports um Platz zu sparen. Baut man eine Website, wo es auf das kleinste bisschen Performance ankommt, kann das Bündeln einem auf Dauer große Vorteile verschaffen. Sind die Anforderungen an die Performance allerdings nicht so groß, könnte man sich einiges an Zeit sparen, indem man sich das bündeln komplett spart.
Wir sind insgesamt aber noch weit davon entfernt, dass der Großteil der Websites-Codes über HTTP/2 läuft.

PS: Es gibt noch andere Unterschiede zwischen HTTP/1 und HTTP/2. Wenn ihr neugierig seid, lest euch [diese super Quelle](https://http2.github.io/faq/#what-are-the-key-differences-to-http1x) durch.

### Werden CommonJS, AMD und UMD überflüssig?
Sobald ES6 *der* Modulstandard wird, brauchen wir dann wirklich noch andere, nicht-native Modulformate?
Ich bezweifle es.
Die Webentwicklung kann sehr von einer einzigen standardisierten Methode ohne Zwischenschritte für den Export und Import von Modulen in JavasCript profitieren. Wie lange wird es dauern, bis ES6 der Standard für Module ist?
Wahrscheinlich eine ganze Weile ;)
Außerdem gibt es viele Entwickler, die gerne verschiedene Methoden zur Auswahl haben. Der *einzig wahre* Ansatz muss also nicht zwingend Realität werden.

## Fazit
Ich hoffe dieser Zweiteiler hat euch geholfen einiges aus dem Jargon zu erklären, das Entwickler benutzen, wenn sie von Modulen und Module Bundling, also dem bündeln von Modulen, sprechen.

Viel Spaß beim bundeln :)
