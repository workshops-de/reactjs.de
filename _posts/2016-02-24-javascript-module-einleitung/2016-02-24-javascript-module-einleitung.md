---
title: "JavaScript Module - Eine Einleitung"
description: "Als JavaScript–Neuling kann man schnell überfordert sein von Wörtern wie „Webpack vs. Browserify“ oder „AMD vs. CommonJS“. Ich erkläre diese für euch."
author: "Preethi Kasireddy"
published_at: 2016-02-24 15:12:23
header_source: https://unsplash.com/photos/o8cViW56BZQ
categories: [javascript, module, es6]
---

Eine Übersetzung aus dem Englischen. Der Artikel im Original ist [HIER](https://medium.com/@preethikasireddy) zu finden.

*Anmerkung: Der Artikel ist in zwei Teile aufgeteilt: Teil 1 beschäftigt sich damit, was Module sind und wieso wir sie benutzen. Teil 2 erklärt euch, was es bedeutet Module zu bündeln und zeigt verschiedene Wege auf, wie dies geschehen kann.*


## Teil 1: „Kann bitte noch mal jemand erklären, was Module sind?“

**Gute Autoren teilen ihre Bücher in Kapitel ein; gute Programmierer teilen ihre Anwendungen in Module ein**.

Wie ein Buchkapitel sind Module nur Sammlungen von Wörtern (hier natürlich eher Code).
Gute Module sind dabei in sich geschlossen und haben eine distinktive Funktion, was es erlaubt, sie zu verschieben, zu entfernen oder hinzuzufügen – ohne dabei das bestehende System zu gefährden.

## Wieso Module verwenden?

Es gibt eine ganze Menge Gründe Module statt ausuferndem, verflochtenem Code zu benutzen. Meiner Meinung nach sind die Wichtigsten:

**1. Wartungsfreundlichkeit:** Per Definition ist ein Modul in sich geschlossen. Ein gut designtes Modul zielt darauf ab, die Abhängigkeit von Teilen der Codebase so weit wie möglich zu verringern, um unabhängig erweitert und verbessert werden zu können. Ein einzelnes Modul zu aktualisieren ist wesentlich einfacher, wenn es vom restlichen Code abgekoppelt ist.
Kommen wir auf das Buch-Beispiel zurück: Wenn man ein Kapitel seines Buches überarbeiten möchte, wäre es ein Alptraum, wenn eine Änderung in einem Kapitel nötige Änderungen in zig anderen Kapiteln nach sich zöge. Stattdessen wäre es besser, jedes Kapitel so zu verfassen, dass Verbesserungen in einem die anderen nicht beträfe.

**2. Namespacing:** In JavaScript sind Funktionen, die außerhalb einer Top-Level Funktion stehen, global (auf sie kann also von überall und jedem zugegriffen werden). Aus diesem Grund ergibt sich oft eine Namespace-Pollution, also komplett zusammenhanglose Teile des Codes, die sich globale Variablen  teilen.
Dieser Zustand ist ein absolutes ‚no-go‘ in der Entwicklung!
Wie wir später sehen werden, erlauben uns Module Namespace-Pollution zu vermeiden, indem sie einen eigenen Platz für unsere Variablen schaffen.

**3. Wiederverwendbarkeit:** Seien wir mal ehrlich: wir haben alle schon Code, den wir für etwas anderes geschrieben haben, in ein neues Projekt kopiert.
Das ist auch absolut in Ordnung, aber wenn ihr einen besseren Weg findet, um einen Teil dieses Codes zu schreiben, müsstet ihr  euch erinnern, wo ihr ihn überall verwendet habt und ihn dort auch aktualisieren.
Offensichtlich ist das eine riesige Zeitverschwendung. Wäre es nicht viel besser ein – jetzt kommt’s – Modul zu haben, das man immer und immer wieder verwenden kann?

## Wie kann man Module integrieren?

Es gibt viele Arten, wie man Module in Programme integrieren kann. Lasst uns einige davon betrachten:

### Module Pattern
Das Module Pattern wird genutzt, um das Konzept von Klassen (da JavaScript von natur aus keine Klassen unterstützt) nachzuahmen, sodass wir sowohl öffentliche als auch nichtöffentliche Methoden und Variablen innerhalb eines einzigen Objekts lagern können – ebenso wie Klassen in anderen Sprachen wie Python oder Java genutzt werden. Dadurch können wir eine öffentliche API entwerfen für Methoden die wir exponieren wollen, während wir die nichtöffentlichen Variablen und Methoden in einem abgeschlossenen Bereich behalten.
Es gibt viele Arten Modul Pattern zu verwenden. Im ersten Beispiel benutze ich eine anonyme Funktion. Das hilft uns, indem es unseren gesamten Code in eine anonyme Funktion steckt. Erinnert euch: in JavaScript sind Funktionen die einzige Möglichkeit einen neuen Geltungsbereich zu erstellen.

### Beispiel 1: Anonyme Funktion

<script src="https://gist.github.com/iam-peekay/088d6b37781c54a95b22.js"></script>

Mit dieser Konstruktion hat unsere anonyme Funktion ihre eigene Auswertungsumgebung oder „closure“ und wir können sie sofort auswerten. Dadurch können wir Variablen vor dem globalen Namespace verstecken.
Das Schöne daran ist, dass man lokale Variablen innerhalb der Funktion benutzen kann, ohne dass man versehentlich globale Variablen überschreibt, sie aber dennoch nutzen kann – wie hier:

<script src="https://gist.github.com/iam-peekay/e29fa76b94ff56163446.js"></script>

Beachtet, dass die Klammern um die anonyme Funktion notwendig sind, denn Statements, die mit dem Keyword *function* beginnen werden immer als Funktionen einleitend angenommen (in JavaScript gibt es keine unbenannten Funktionsdeklarationen). Entsprechend erzeugen die umgebenden Klammern stattdessen eine Funktion. Wenn ihr neugierig seid, könnt ihr [hier](http://stackoverflow.com/questions/1634268/explain-javascripts-encapsulated-anonymous-function-syntax) mehr dazu lesen.

### Beispiel 2: Globaler Import
Ein anderer beliebter Ansatz der von Bibliotheken wie jQuery genutzt wird ist der globale Import. Er ist der anonymen Funktion ähnlich, die wir eben betrachtet haben, nur dass wir jetzt globale  Variablen als Parameter eingeben:

<script src="https://gist.github.com/iam-peekay/d04164e52be05f8cb107.js"></script>

In diesem Beispiel ist **_globalVariable_** die einzige globale Variable. Der Vorteil dieser Methode gegenüber der anonymen Funktion ist, dass die globale Variable im Vorhinein deklariert wird und sie dadurch für Leute, die den Code betrachten, glasklar heraussticht.

### Beispiel 3: Objekt Interface
Noch ein weiterer Ansatz ist, Module zu anzulegen, indem man ein in sich geschlosseneres Objekt Interface benutzt:

<script src="https://gist.github.com/iam-peekay/43b161aafe7df6218118.js"></script>

Ihr könnte sehen, dass uns dieser Ansatz die Möglichkeit bietet zu entscheiden, welche Variablen/Methoden wir nicht öffentlich (**_myGrades_**) und welche Variablen/Methoden wir öffentlich exponieren wollen, indem wir sie in das *return* Statement geben (**_average & failing_**).

### Beispiel 4: Offenlegen des Module Pattern
Dieser Ansatz ist dem hierüber stehenden sehr ähnlich, bis auf die Tatsache, dass er sicherstellt, dass alle Methoden und Variablen nichtöffentlich bleiben, bis sie exponiert werden:

<script src="https://gist.github.com/iam-peekay/3d29068bd0097c53af41.js"></script>

Das alles wirkt jetzt zwar recht umfangreich, es ist jedoch nur die Spitze des Eisbergs, wenn wir über Module Pattern sprechen. Hier sind einige Ressourcen, die ich beim Experimentieren damit hilfreich fand:

[Learning JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) von Addy Ostani: eine beeindruckend kurz und bündig formulierte Schatzkiste voller Details.

[Adequately Good](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html) von Ben Cherry: eine nützliche Übersicht mit Beispielen fortgeschrittener Anwendung von Modulen.


## CommonJS und AMD
Die oben beschriebenen Ansätze haben eines gemeinsam: Die Nutzung einer einzigen globalen Variable, um ihren Code mit einer Funktion zu verpacken. Dadurch erschaffen sie einen globalen Namespace für sich selbst.
Während jeder der Ansätze auf seine eigene Weise effektiv ist, haben sie auch alle ihre Schattenseiten.

Zum einen muss man als Entwickler die richtige Reihenfolge von Abhängigkeiten kennen in der man seine Dateien lädt. Beispielsweise nehmen wir an, dass ihr Backbone in eurem Projekt benutzt. Also bindet ihr das script tag für den Backbone Quellcode in eure Datei ein.
Da Backbone aber stark Abhängig von Underscore.js ist, kann das script tag für Backbone nicht vor der Underscore.js Datei platziert werden. Als Entwickler kann es einem Kopfschmerzen bereiten, Abhängigkeiten zu beachten und solche Dinge nicht zu vernachlässigen.
Ein anderer Nachteil ist, dass es dennoch zu Namespace Problemen kommen kann. Was, wenn beispielsweise zwei euer Module denselben Namen haben? Oder, wenn ihr zwei Versionen eines Moduls habt, aber beide braucht? Ihr fragt euch vielleicht: gibt es denn einen Weg, das Interface eines Moduls anzufragen, ohne den globalen Bereich abzusuchen?
Glücklicherweise lautet die Antwort: ja.
Es gibt zwei beliebte und gut funktionierende Methoden: CommonJS und AMD.

### CommonJS
CommonJS ist eine Arbeitsgruppe, die ehrenamtlich JavaScript APIs zum deklarieren von Modulen designen und implementiert.
Ein CommonJS Modul ist im Prinzip ein wiederverwendbares Stück JavaScript, das bestimmte Objekte exportiert und sie dadurch verfügbar macht für andere Module, die sie in Programmen per *require* importieren. Falls ihr schon mal mit Node.js programmiert habt, kennt ihr so etwas.
Bei CommonJS speichert jede JavaScript Datei Module in ihrem eigenen Modulkontext. In diesem Bereich benutzen wir das *module.exports* Objekt um Module zu exponieren und *require* um sie zu importieren.
Wenn ihr ein CommonJS Modul definiert, könnte das in etwa so aussehen:

<script src="https://gist.github.com/iam-peekay/733a701afb55a2c083fe.js"></script>

Wir benutzen spezielle Objekt Module und platzieren eine Referenz unserer Funktion in *module.exports*. Dadurch weiß das CommonJS Modul, was wir exponieren wollen, sodass andere Dateien diese Elemente nutzen können.
Wenn dann jemand *myModule* nutzen möchte, kann derjenige es folgendermaßen in seine Datei importieren:

<script src="https://gist.github.com/iam-peekay/454feafd7f735581dbf8.js"></script>

Das hat zwei offensichtliche Vorteile:
1. Es gibt keine „Verschmutzung“ (Pollution) des öffentlichen Namespace
2. Die Abhängigkeiten werden klar.

Außerdem ist die Syntax sehr kompakt, was mir persönlich sehr gut gefällt.
Eine weitere Sache, die angemerkt werden sollte ist, dass CommonJS einen ‚server-first’ Ansatz verfolgt und synchron Module lädt. Das ist wichtig, denn wenn wir drei verschiedene Module haben, die wir *requiren*, dann lädt es sie nacheinander.
Das funktioniert super bei Servern, macht es aber leider schwieriger, wenn man JavaScript für den Browser schreibt. Man braucht nicht extra zu erwähnen, dass es viel länger dauert, ein Modul aus dem Netz zu laden, als direkt von der Platte. Solange das Script zum Laden eines Moduls läuft, verhindert es, dass der Browser irgendetwas anders ausführt, bis es fertig geladen hat. Das macht es, weil die JavaScript Ausführung pausiert, solange der Code lädt (ich zeige euch im zweiten Teil, wie man dieses Problem umgehen kann, wenn wir weiter über Bundling sprechen. Bis hierhin genügt dies).

### AMD
CommonJS ist gut und schön, aber was, wenn wir Module asynchron laden wollen? Die Antwort heißt *asynchrone Modul Definition*, oder kurz AMD.
Module mit AMD zu laden sieht in etwa so aus:

<script src="https://gist.github.com/iam-peekay/fb7125ab71ff83f75f3b.js"></script>

Was hier passiert ist, dass die *define* Funktion als ihr erstes Argument ein Array der Abhängigkeiten jeweiligen Module bekommt.  Diese Abhängigkeiten werden im Hintergrund geladen und, sobald sie geladen sind, ruft *define* die callback Funktion auf, die ihr zugewiesen wurde.

Als nächstes bekommt die callback Funktion als Argumente die Abhängigkeiten, die geladen wurden –  in unserem Fall *myModule* und *myOtherModule* – und kann diese somit nutzen. Als letztes müssen die Abhängigkeiten selber mithilfe des *define* Keywords definiert werden.
*myModule* könnte beispielsweise so aussehen:

<script src="https://gist.github.com/iam-peekay/9fc70bb2629bca39df7b.js"></script>

Anders als CommonJS, nutzt AMD einen browser-first Ansatz und asynchrones Verhalten um ans Ziel zu gelangen (beachtet, dass es nicht unbedingt ratsam ist am Anfang seiner Coderkarriere Dateien dynamisch, Stück für Stück, laden zu wollen – darüber sprechen wir später auch).
Neben Asynchronität ist ein weiterer Vorteil von AMD, dass unserer Module auch Objekte, Funktionen, Konstruktoren, Strings, JSON und vieles Anderes sein können, während CommonJS nur Objekte als Module unterstützt.
AMD ist nicht kompatibel mit io, filesystem und anderen Server-orientierten Features die via CommonJS verfügbar sind. Außerdem ist die Funktions-wrappende Syntax ein wenig wortreicher als das einfache *require* Statement.

### UMD
Für Projekte, bei denen sowohl AMD als auch CommonJS Features benötigt werden, gibt es noch ein weiteres Format: die Universelle Modul Definition, UMD.
UMD erschafft im Prinzip einen Weg, beide zu nutzen, während außerdem die globale Definition von Variablen unterstützt wird. Daher sind UMD Module in der Lage sowohl auf Servern als auch auf Clients zu laufen.
Hier ist ein kurzer Vorgeschmack darauf, wie UMD funktioniert:

<script src="https://gist.github.com/iam-peekay/12a2d7c172d98daee641.js"></script>

Für mehr Beispiele von UMD Formaten, schaut euch dieses [tolle Repo](https://github.com/umdjs/umd) auf Github an.

### Native JS
Puh! Seid ihr noch da? Ich hoffe, ich habe euch unterwegs nicht irgendwo verloren. Denn es gibt noch **einen** weiteren Modultyp, den wir uns ansehen müssen, bevor wir fertig sind.
Ihr habt bestimmt bemerkt, dass keines der Module bisher natives JavaScript war. Wir haben immer Wege gefunden, die Module zu emulieren; entweder über das Module Pattern, CommonJS oder AMD.
Glücklicherweise haben die schlauen Köpfe von TC39 mit *ECMAScript 6* (ES6) eingebaute Module eingeführt.
ES6 bietet einige Möglichkeiten Module zu im- und exportieren, was schon von anderen sehr schön erklärt wurde:
- [jsmodules.io](http://jsmodules.io/cjs.html)
- [exploringjs.com](http://exploringjs.com/es6/ch_modules.html)

Das Großartige an ES6 Modulen im Vergleich zu CommonJS und AMD ist, wie es das Beste aus beiden Welten vereint: kompakte und deklarative Syntax *und* asynchrones Laden. Zusätzlich gibt es Vorteile wie bessere Unterstützung von zyklischen Abhängigkeiten.
Mein Lieblingsfeature von ES6 Modulen ist, dass Importe *live read-only* Ansichten der Exporte sind (verglichen mit CommonJS, wo Importe Kopien der Exporte sind).
Hier seht ihr, wie es funktioniert:

<script src="https://gist.github.com/iam-peekay/a81faaae9c5937bb155e.js"></script>

In diesem Beispiel legen wir im Prinzip zwei Kopien des Moduls an: eine beim Exportieren und eine wenn wir sie anfordern.
Außerdem ist die Kopie in main.js jetzt losgekoppelt vom ursprünglichen Modul. Deshalb gibt unser Counter als return immer 1 – auch, wenn wir ihn inkrementieren. Das ist so, weil die Counter Variable, die wir importiert haben eine abgekoppelte Kopie der Counter Variable des Moduls ist.
Den Counter also zu inkrementieren lässt ihn im Modul hochzählen, nicht aber in der kopierten Version. Die einzige Möglichkeit, die Kopie zu beeinflussen, ist dies manuell zu tun:

<script src="https://gist.github.com/iam-peekay/ba38c912dea33a0404ad.js"></script>

Auf der anderen Seite kreiert ES6 eine live read-only Ansicht der Module, die wir importieren:

<script src="https://gist.github.com/iam-peekay/b9ba699744052196c254.js"></script>

Coole Sache, oder? Was ich wirklich ansprechend an live read-only Ansichten finde ist, dass sie uns erlauben die Module in kleinere Teile zu splitten, ohne an Funktionalität zu verlieren.
Und man kann es wieder umkehren und sie wieder zusammenführen – kein Problem. Es funktioniert einfach.

## Ausblick: Module bündeln
Wow, wie die Zeit vergeht! Das war eine wilde Fahrt, aber ich hoffe wirklich, dass es euch ein besseres Verständnis von Modulen in JavaScript vermittelt hat.
Nächstes Mal erkläre ich euch das Module Bundling, unter anderem sprechen wir hierüber:

- Wieso Module bündeln?
- Verschiedene Ansätze zum Bündeln
- ECMASript’s Module Loader API
- …und einiges mehr :)

 NOTE: Um alles so simpel wie möglich zu halten, habe ich einige fiese Details im Post ausgelassen. Falls dabei etwas Wichtiges und/oder Faszinierendes war, kommentiert bitte auf https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#.5m9z5hjhq – dort bitte in Englisch. Danke!


