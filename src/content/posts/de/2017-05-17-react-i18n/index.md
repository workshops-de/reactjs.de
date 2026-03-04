---
title: "Internationalisierung in ReactJS"
description: "Lerne wie du eine ReactJS App richtig internationalisiert"
author: "Preethi Kasireddy"
published_at: 2017-05-17T12:00:00.000Z
header_source: https://unsplash.com/photos/YeO44yVTl20
categories: [react, i18n]
header_image: "header.jpg"
---

Internationalisierung ist ein großes Problem. Wenn du willst, dass deine Anwendung eine weltweite Reichweite hat, dann musst du dich mit Sprachbarrieren beschäftigen.
Leider ist die Reise von „Dein Geld wird bis zum 7. Juli ankommen“ bis „Vos fonds arriveront le 7 Juilet“ alles andere als einfach.

Bevor deine Anwendung außerhalb der englisch-sprachigen Welt erfolgreich sein kann, musst du alle Strings, Daten und Zahlen an die Konventionen der verschiedenen Kulturen anpassen.
Die Entwickler nennen diesen Prozess Internationalisierung (abgekürzt als „i18n“ , weil es 18 Buchstaben zwischen dem „I“ und dem „n“ des englischen Worts Internationalization gibt.)

Ein Grund, warum wir uns mit der Internationalisierung beschäftigten ist ganz einfach deshalb, weil es schwer ist, sie richtig umzusetzen. Jede Sprache hat andere Regeln und Konventionen. Sich an diese Regeln und Konventionen anzupassen kostet Zeit und Mühe.

### Die Lösung: React Intl

Aber die Internationalisierung muss nicht schwierig sein, dank eines neuen ReactJS-Moduls. `React Intl` ist ein open-source Projekt von Yahoo und ein Teil von *Format.js*, einer Sammlung von JavaScript Modulen für Internationalisierung die auf der integrierten Intl API von Javascript aufbaut.

Die *React Intl* Modul macht die Internationalisierung in ReactJS einfach, und zwar mit off-the-shelf Komponenten und einer API, die alles von der Formatierung von Strings, Daten und Zahlen bis hin zur Pluralisierung händeln kann.
Lass uns das ganze mal durchgehen.

### Kernkonzepte
Hier sind die Kernkonzepte, die du brauchst, um das meiste aus React Intl rauszuholen:

## Die Internationalisierung API von JavaScript
JavaScript hat eine *Internationalisierung API* Spezifikation, die das `Intl` Objekt als Standart-integriertes globales Objekt definiert.
React Intl verwendet und baut im Wesentlichen auf diese API auf. Solange der Browser diese APIs unterstützt, wird React Intl weiterhin seine Magie wirken.
*Hinweis: Der einzige Browser, der diese APIs derzeit nicht unterstützt, ist Safari. Wir benutzen ein polyfill, um das Problem im Beispielprojekten unten aus dem Weg zu räumen. *

## Modul-Bündler
React Intl vertreibt sein Paket über ES6-, CommonJS- und UMD-Module. Daher funktioniert das Ganze gut mit Bündlern wie Webpack, Browserify und Rollup.
In dem Beispielprojekt benutzen wir Webpack als unseren Modul-Bündler.
Wenn du nicht planst einen Modul Bündler zu nutzen, um React Intl in deine Anwendung zu laden, dann empfehle ich die Dokumentation für mehr Informationen mit anderen Herangehensweisen (z.B. über Node.js).

## Lokale Daten laden
React Intl stützt sich auf diese lokalen Daten, um die plural und relative-time Formatierung zu unterstützen. Lokale Daten definieren für jedes einzelne Gebietsschema Folgendes:

- Lokalspezifische Muster für die Formatierung und Zerlegung der Daten, Zeiten, Zeitzonen, Nummern und Währungswerten
- Übersetzungen von Namen, Währungen, Epochen, Monaten, Wochentagen, etc.
- Sprach-und Scriptinformationen (Mehrzahl, verwendete Zeichen und Buchstaben, Geschlecht auf Listen, Kapitalisierung, Schreibrichtung, etc.
- Länderinformationen (Währung, bevorzugter Kalender, Wochenkonventionen, Telefoncodes, etc.)

Wenn du Browserify, Webpack oder Rollup benutzt, um React Intl für den Browser zu bündeln, dann enthält es die locale data standartmäßig nur für Basis-Englisch. Der Rest von locale data ist NICHT in der Haupt-library enthalten. Deshalb werden wir in diesem Beispielprojekt behandeln, wie man locale data mit der Sprache deiner Wahl importiert, die du für deine App verwenden möchtest.



### Daten formatieren mit ReactJS Komponenten vs. Die API
Das Modul bietet zwei Möglichkeiten, um Strings, Nummern und Daten zu formatieren: `ReactJS Komponenten` oder eine `API`.

## ReactJS Komponente

```javascript
<FormattedMessage
  id="Tooltip.fees"
  defaultMessage="Click here to understand how we calculate fees." />
```

## API

```javascript
const messages = defineMessages({
  feesMessage: {
    id: "Tooltip.fees",
    defaultMessage: “Click here to understand how we calculate fees.”,
  },
});

formatMessage(messages.feesMessage);
```

Wann immer möglich, nehme ich den ersten Ansatz mit deklarativen idiomatisch-React-Komponenten, um Daten über die imperative API zu formatieren.

Der Vorteil dieses Ansatzes ist, dass es

a) ermöglicht, Komponenten mit anderen Komponenten zusammenzustellen,

b) ermöglicht, Texte und Strings optimal zu formatieren,

c) prop type Warnungen für Optionen zur Formatierung bietet, und

d) *shouldComponentUpdate* implementiert, um teure Formatierungsprozesse zu vermeiden.

Natürlich gibt es Fälle, bei denen deine einzige Möglichkeit die Nutzung einer API ist (zum Beispiel: einen String als Stütze, ein Namensattribut eines HTML-Elements, etc.), deshalb ist das auch immer noch praktisch.

#### Beispielprojekt

Ein Live Beispiel zu sehen, ist die beste Art zu lernen. Für diesen Beitrag habe ich ein einfaches ReactJS-Projekt erstellt, das aus einer Haupt Header-Komponente, einer Subheader Komponente und einigen Widged-Komponenten besteht, die jeweils ihre eigenen Header und Body‘s haben.

Als erstes gehen wir den Prozess durch, in dem wir React Intl einstellen. Danach benutzen wir die Komponenten und API um Strings, Nummern, und Daten, die in den Komponenten verwendet werden, zu konvertieren.

#### Einrichten
Nehmen wir an, wir haben eine bestehende ReactJS-Anwendung, von der aus wir arbeiten. Zuerst musst du das React Intl Paket installieren:

```shell
npm install —-save react-intl
```

Als nächstes installieren wir das Babel Plugin für `React Intl`:

```shell
npm install --save-dev babel-plugin-react-intl
```

Um das Babel Plugin seine Magie tatsächlich wirken zu lassen, müssen wir unseren `.babelrc` Datei einrichten, um das Plugin einzufügen. Hier siehst du, wie meine `babelrc`, mit dem React-Intl Plugin dazu angefügt, aussieht (Zeilen 6-11):

 ```javascript
{
  "presets": ["es2015", "react", "stage-0"],
  "plugins": [
    "transform-object-rest-spread",
    "transform-runtime",
    [
      "react-intl", {
        "messagesDir": "./build/messages",
        "enforceDescriptions": false
      }
    ]
  ],
  "env": {
     "development": {
      "presets": ["react-hmre"]
     }
  }
}
```

Dieses Babel Plugin extrahiert alle String Meldungen in deine Anwendung, die entweder mit defineMessages. `<FormattedMessage>`, oder `<FormattedHTMLMessage>` definiert sind.

(Beachte, dass `defineMessages`, `<FormattedMessage>`, und `<FormattedHTMLMessage>` alle Exporte aus dem React Intl Paket sind).

Sobald alles extrahiert ist, werden JSON Dateien generiert, die die String Meldungen enthalten und platziert sie in das Verzeichnis, das du im `messagesDir` Pfad oben definiert hast.

#### Daten laden

Als nächsten laden wir die entsprechenden locale data für die Sprachen, die wie wir benötigen.

Wie oben bereits erwähnt, wenn du Webpack, Browserify oder Rollup benutzt, um den Browser zu bündeln, wird React Intl standartmäßig nur auf English erscheinen. In der root Komponenten-Datei fügen wir die locale Data mit der `addLocaleData` API ein. Die Daten werden dann die Inhalte des locale data Moduls passieren. Dann werden sie in ihrer locale data registry registriert.

Für dieses Beispielprojekt nehme ich an, dass wir 4 Sprachen unterstützen wollen: Englisch, Spanisch, Französisch und Italienisch.

```javascript
import { addLocaleData } from ‘react-intl’;
import en from ‘react-intl/locale-data/en’;
import es from ‘react-intl/locale-data/es’;
import fr from ‘react-intl/locale-data/fr’;
import it from ‘react-intl/locale-data/it’;

addLocaleData([...en, ...es, ...fr, ...it]);
```

_Hinweis: Wenn deine App viel mehr unterstützt, empfiehlt es sich, die locale data basierend auf der Sprache des aktuellen Benutzers dynamisch zu laden. Lies die React Intl docs für weitere Informationen zu diesem Ansatz._

#### Erstelle den i18n Kontext in deiner React Anwendlung
Bisher haben wir das React Intl Paket installiert, unser `.babelrc` Plugin eingestellt und die entsprechenden locale data geladen.

Ein letzter Schritt besteht darin, einen i18n Kontext für alle unsere React-Komponenten zu erstellen, so dass die locale und die Übersetze Nachricht des derzeitigen Nutzers (auf dem Ort des Nutzers basierend) in die React Intl Komponente geladen werden kann, die du in deiner App definierst.

Um dies zu tun, definieren wir zuerst die Nachrichten, die an den `IntlProvider` basierend auf dem Ort des Nutzers gegeben werden (_siehe Zeilen 18-26 unten_). Dann integrieren wir die root React-Komponente mit `IntlProvider`, ein benannter Export von React-Intl (_siehe Zeilen 31-33_):

```javascript
import React from 'react';
import { render } from 'react-dom';
import App from './components/App/index';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import it from 'react-intl/locale-data/it';

// Our translated strings
import localeData from './../../build/locales/data.json';

addLocaleData([...en, ...es, ...fr, ...it]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

// Render our root component into the div with id "root"
// We select the messages to pass to IntlProvider based on the user's locale
render(
  <IntlProvider locale={language} messages={messages}>
    <App />
  </IntlProvider>,
  document.getElementById('root')
);
```

In diesem Setup gehen wir davon aus, dass unsere übersetzten Daten in `build/locales/data.json` sind und dass die Daten nach Sprache gruppiert werden:

```javascript
{
  en: {
    ...English version of strings,
  },
  fr: {
    ...French version of strings,
  },
  es: {
    ...Spanish version of strings,
  }
  ... etc.
}

```

#### Erstelle ein Script für die Übersetzung

Nun da wir alles fertig konfiguriert haben, schauen wir uns mal an, wie wir ein einfaches Script erstellen können, dass alle Strings verwendet, die Babel für uns in mehrere JSON-Dateien extrahiert und kombinieren sie zu einer Datei.

Der Sinn dieses Scripts ist alle Englischen Strings anzusammeln, so dass wir sie dann zu einem Übersetzungsdienst hochladen können, sie in verschiedene Sprachen übersetzen und dann die Ergebnisse in die `build/locales/data.json` Datei platzieren, die wir oben benutzt haben. Dort kann die `IntlProvider` Komponente schließlich unsere root Komponente laden.

Da wir die Übersetzungen in diesem Beitrag nicht ganz machen müssen, überspringen wir diesen Schritt und erstellen einfach nur ein Script, welches alles in eine Datei bringt. Denke nur daran, in einen Übersetzungsdienst Anbieter in Echt-Welt-Anwendungen 😊

Alle Gutschriften gehen an das React Intl Modul Autoren für das Generieren von diesem Script unten:

```javascript
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const filePattern = './build/messages/**/*.json';
const outputDir = './build/locales/';

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
let defaultMessages = globSync(filePattern)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({id, defaultMessage}) => {
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }
      collection[id] = defaultMessage;
    });

    return collection;
  }, {});
// Create a new directory that we want to write the aggregate messages to
mkdirpSync(outputDir);

// Write the messages to this directory
fs.writeFileSync(outputDir + 'data.json', `{ "en": ${JSON.stringify(defaultMessages, null, 2)} }`);

```
#### Schritte um Daten, Nummern und Strings in React Intl zu konvertieren
Okay – wir sind endlich bereit, um ein bisschen zu formatieren!
Die Beispiel-App hat ein einfaches Layout mit einem`header`, `subheader`, und `widgets`, die jeweils Strings, Nummern und/oder Daten enthalten:
[FOTO]
Nichts Anspruchsvolles, aber es ist genug, um loszulegen.

## Header
Zuerst schauen wir uns den Header an, in dem steht: *“Willkommen in deinem dashboard, Preethi!“*
Um das zu konvertieren, benutzen wir die `FormattedMessage` Komponente:
```javascript
<FormattedMessage
  id={ 'Header.greeting' }
  defaultMessage={ 'Welcome to your dashboard, {name}!' }
  values={{ name: this.props.name }}
/>
```

Die `FormattedMessage` Komponente verfügt über Requisiten, die mit einem „`Message Descriptor`“ in React Intl korrespondieren.

Der `Message Descriptor` ist das Format, das verwendet wird, um Standartzeichen / Strings zu definieren und das ist nützlich für die Bereitstellung der Daten, die erforderlich sind, damit die Zeichenfolgen / Nachrichten übersetzt werden. Es enthält folgende Eigenschaften:

- `id`: ein spezieller, stabiler Identifizierer für die Nachricht/Zeichen
- `description`: Kontext für den Übersetzer darüber, wie es in dem UserInterface verwendet wird (optional)
- `defaultMessage` Die default message (auf Englisch)

Die `id` muss für jede in deiner App definierte Nachricht eindeutig sein.

Es ist super, dass die `defaultMessage` Daten von den props übermitteln kann, wie in dem Fall für `name` oben (beachte, dass die Werte, die als Daten übrgeben werden, nicht übersetzt werden – sie werden einfach in die endgültig übersetzte Zeichenfolge eingefügt.)

## Subheader

Lass uns als nächstes den Subheader betrachten, der etwas stärker beteiligt ist:

```javascript
<FormattedMessage
  id={ 'SubHeader.unreadCount' }
  defaultMessage={ 'You have {unreadCount} new {notifications}' }
  values={{
    unreadCount: (
      <b>
        <FormattedNumber
          value={ unreadCount }
        />
      </b>
    ),
    notifications: (
      <FormattedPlural
        value={ unreadCount }
        one="notification"
        other="notifications"
      />
    ),
  }}
/>

```

Die Fähigkeit, Komponenten in andere Komponenten zu komponieren (d.H. `Formatted` Elemente innerhalb eines anderen `Formatted` Elements haben) ist ein starkes Feature von React Intl.


Du kannst in dem obigen Beispiel sehen, dass `unreadCount` eine `FormattedNumber` und `notifications` ein `FormattedPlural` ist, und dass beides Werte sind, die in `FormattedMessages`‘s `defaultMessage` übertragen wurden. Schön!


Eine weitere super Funktion ist `FormattedRelative`, welche die formatierte relative Zeit rendert.

```javascript
<FormattedMessage
  id={ 'SubHeader.lastLogin' }
  defaultMessage={ 'You last logged in {time}!' }
  values={{ time: <FormattedRelative value={ this.props.lastLogin } /> }}
/>
```

Sobald es übersetzt und formatiert ist, lautet es: *”You last logged in 4 hours ago!”* (oder wann auch immer der letzte Login war.)

#### Übergeben von formatierten Strings als Komponenten

In den obigen zwei Snippets haben wir gesehen, wie wir die `Formatted`* Komponenten benutzen, um Strings, Nummern, Daten und Pluralisierung zu definieren.

Allerdings gibt es viele Beispiele, wo es nötig ist formatierte Strings als Requisiten zu übergeben oder formatierte Strings zu verwenden, um eine HTML-Komponente zu bennenen. Die `FormattedMessage` Komponente funktioniert in solchen Fällen nicht gut.

Glücklicherweise lässt uns React Intl’s `defineMessages` API alle Komponenten der Strings definieren und dann als props zur Komponente übergeben.

Lass uns diesen Ansatz für die Widget-Header und Body ausprobieren. Zuerst nutzen wir `defineMessages`, um unsere Strings zu definieren.

```javascript

const messages = defineMessages({
  widget1Header: {
    id: 'Widgets.widget1.header',
    defaultMessage: 'Creative header',
  },
  widget1Body: {
    id: 'Widgets.widget1.body',
    defaultMessage: 'Mark todays date: {date}',
  },
  widget2Header: {
    id: 'Widgets.widget2.header',
    defaultMessage: 'Here is another widget',
  },
  widget2Body: {
    id: 'Widgets.widget2.body',
    defaultMessage: 'Hello. How is your day going?',
  },
  widget3Header: {
    id: 'Widgets.widget3.header',
    defaultMessage: 'Yet another widget',
  },
  widget3Body: {
    id: 'Widgets.widget3.body',
    defaultMessage: 'What is the meaning of life, my friend?',
  },
  widget4Header: {
    id: 'Widgets.widget4.header',
    defaultMessage: 'This is the last widget',
  },
  widget4Body: {
    id: 'Widgets.widget4.body',
    defaultMessage: 'I love React so much!',
  },
});

```
Dann, vorrausgesetzt wir habe eine Widget Komponente, die Kopf und Body Requisiten erwartet, können wir so weitermachen:

```javascript
<Widget
  header={ formatMessage(messages.widget1Header) }
  body={ formatMessage(messages.widget1Body, {
    date: formatDate(this.props.currentDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }) }
/>

<Widget
  header={ formatMessage(messages.widget2Header) }
  body={ formatMessage(messages.widget2Body) }
/>

<Widget
  header={ formatMessage(messages.widget3Header) }
  body={ formatMessage(messages.widget3Body) }
/>

<Widget
  header={ formatMessage(messages.widget4Header) }
  body={ formatMessage(messages.widget4Body) }
/>

```

Eine Sache, die du vielleicht beim ersten Widget bemerkt hast, ist, dass wir auch Daten an die in `defineMessages` definierten Strings übergeben können. Hier haben wir das aktuell formatierte Datum als den Wert `date` übergeben. Ziemlich nett, oder?

Die API funktioniert auch gut für die Formatierung von Zahlen, Zeiten, relativen Zeiten und Pluralisierung (sieh dir ihre docs für mehr dazu an)

#### Wie man es in Safari zum funktionieren bringt

Jetzt, da wir fast fertig sind, haue ich nochmal ein paar Informationen hierzu raus.
Das aktuelle Setup funktioniert nicht für Safari Browser 🙃.

Wie oben erwähnt, liegt das daran, dass Safari zur Zeit keine Unterstützung für Javascript’s Internationalisierung API hat.

Glücklicherweise gibt es trotzdem einen Weg, damit das auch für Safari Nutzer klappt. Was wir tun müssen, ist den `Intl Polyfill` zu benutzen. Es gibt einige Möglichkeiten, um das zu laden. Lass uns für dieses Beispiel weiterhin Webpack benutzen:


Zuerst installieren wir das intl Paket von npm:

```shell
npm install --save intl
```

Als nächstes schreiben wir eine einfache if-Anweisung, um nur den Polyfill zu laden, wenn es keine Browserunterstützung für `Intl` gibt (siehe Zeilen 30-57). Das wird getan, um das Laden des Moduls und aller locale Daten in die App zu verhindern, wenn es nicht gebraucht wird.

```javascript
import React from 'react';
import { render } from 'react-dom';
import App from './components/App/index';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import it from 'react-intl/locale-data/it';
import localeData from './../../build/locales/data.json';

addLocaleData([...en, ...es, ...fr, ...it]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, fallback to locale without region code, fallback to en
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

// Render our root component into the div with id "root"

// If browser doesn't support Intl (i.e. Safari), then we manually import
// the intl polyfill and locale data.
if (!window.intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js',
    'intl/locale-data/jsonp/es.js',
    'intl/locale-data/jsonp/fr.js',
    'intl/locale-data/jsonp/it.js',
  ], (require) => {
    require('intl');
    require('intl/locale-data/jsonp/en.js');
    require('intl/locale-data/jsonp/es.js');
    require('intl/locale-data/jsonp/fr.js');
    require('intl/locale-data/jsonp/it.js');
    render(
      <IntlProvider locale={language} messages={messages}>
        <App />
      </IntlProvider>,
      document.getElementById('root')
    );
  });
} else {
  render(
    <IntlProvider locale={language} messages={messages}>
      <App />
    </IntlProvider>,
    document.getElementById('root')
  );
}
```

Wie du sehen kannst, ist das erste, was zu überprüfen ist, ob die `intl` global *nicht* im Fenster verfügbar ist. Wenn nicht, dann laden wir die intl polyfill und zugehörige locale data und rendern dann die Komponente. Ansonsten rendern wir einfach die Komponente.

Und nun ist unsere vorübersetzte App (natürlich noch immer auf Englisch) endlich da. Ich werde dir noch einen finalen Schritt zeigen, der beinhaltet einen translation provider zu finden und diese Strings übersetzen zu lassen.

#### Andere Tipps

Ich hoffe, dieser Beitrag ist genug, um deine React Anwendung in eine solche zu verwandeln, die für andere Kulturen und Sprachen zugänglich ist.

Bevor ich mich für heute abmelde, hier sind ein paar weitere Tipps, die zu beachten sind, wenn man seine App internationalisiert.

- Flexible Komponennten: Baue deine Komponenten so ein, dass sie flexibel sind und eine Textausweitung bzw. Schrumpfung ermöglichen. Manche Sprachen können sich viel größer erweitern oder kleiner schrumpfen als Englisch.

- Angemessene Schriftgröße: Verwende eine Schriftgröße, die mit allen Sprachen, die du unterstützen willst, gut funktioniert. Manche Sprachen, wie Japanische oder Chinesisch, brauchen eine größere Schrift.

- UTF-8: Benutze UTF-8 überall. Dies beinhaltet auch deine HTML, server-side language, Datenbank, etc. Im Gegensatz zu anderen Codierungen, kann UTF-8 fast alle Sprachen sehr gut händeln.

- Kein Text in Bildern: Vermeide es, Text in Bildern zu verwenden, weil die Übersetzung von Text in Bildern extrem schwierig ist und den ganzen Aufwand nicht wert ist.

- Teile deine Strings nicht auf: Zum Beispiel, wenn du „Your funds will arrive by July 7th“ hast, vermeide es sie aufzuteilen wie „Your funds will arrive by“ und „July 7th“. Diese Kombination mag aufgrund von Wortordnungsvariationen anderer Sprachen, vielleicht nur auf Englisch funktionieren.

#### Fazit

Fühl dich wie immer frei mit Fragen oder Anregungen zu kommentieren. Ich würde mich freuen diese zu beantworten 😊

#### Credits

Original gepostet von [Preethi Kasireddy](https://twitter.com/iam_preethi) auf [FreeCodeCamp – Medium](https://www.freecodecamp.org/news/internationalization-in-react-7264738274a0/).


