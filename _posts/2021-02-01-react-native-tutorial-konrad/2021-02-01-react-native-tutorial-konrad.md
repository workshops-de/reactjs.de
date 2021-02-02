---
title: "SERIES: React Native (Step by Step) - Working with Typescript and Linting"
description: "In the first part of our React Native (Step by Step) series, we will look at how to start a new project with Expo and Typescript, configure our linter and talk a bit about the how and why. Grab your coffee, relax and strap in for a fascinating journey."
author: "Konrad Abe (AllBitsEqual)"
published_at: 2021-02-01 10:00:00
header_source: "https://i.imgur.com/UYSyTVN.jpg"
categories: "react-native typescript linting expo best-practise series"
canonical_url: "https://allbitsequal.medium.com/series-react-native-step-by-step-working-with-typescript-and-linting-3961c4226793"
series: "React Native (Step by Step)"
---

# Reihe: React Native (Schritt für Schritt) - Umgang mit Typescript und Linting

**Im ersten Teil unserer *React Native (Schritt für Schritt)*-Reihe, gucken wir uns an, wie wir ein neues Projekt mit Expo und Typescript starten und wie wir unseren Linter konfigurieren. Außerdem reden wir über das „Wie“ und „Warum.“ Schnapp dir einen Kaffee, lehn dich zurück und mach dich bereit für eine faszinierende Reise.**

_Wie immer findest du den fertigen Code am Ende des Artikels auf GitHub verlinkt._

**Reihe: React Native (Schritt für Schritt)**  
1) => **du bist hier** <=
2) [React Redux + Toolkit mit Typescript](https://allbitsequal.medium.com/series-react-native-step-by-step-react-redux-toolkit-with-typescript-4818504bba13)

![](https://i.imgur.com/UYSyTVN.jpg)

## Typescript - WARUM?
Es gibt viele verschiedene Meinungen zum Thema Typescript. Die eingefleischten Fans schwören darauf, dass ihr Code dank Typescript weniger fehlerhaft, stabiler, leichter zu handhaben und einfacher zu erweitern, besser zu teilen und geeigneter für die Zusammenarbeit ist. Auf der anderen Seite gibt es Menschen, die Typescript als störend empfinden, weil es viel unnötigen Overhead und in einigen Fällen sogar Duplizierungen verursache, während Fehler zur Runtime nicht behoben werden würden.

Ich werde hier jetzt keine umfassende Diskussion über die Pros und Kontras von Typescript starten. Ich habe mich nämlich aus vielen verschiedenen Gründen dazu entschieden, in meinen privaten Projekten mit Typescript zu arbeiten.

* Ich arbeite in meinem 9-to-5 Job regelmäßig mit Typescript
* Mir gefallen die zusätzlichen Informationen, die meine IDE aus dem strong typing Code ziehen kann
* Viele meiner wiederverwendbaren Code Bits werden irgendwann in getrennten Repositories abgelegt und via NPM verteilt

Ich habe auch immer wieder meine „Duh“-Momente, wenn ich auf Probleme stoße, die mein Compiler/Linter nicht mag, weil ich zu vage war oder einfach gar nichts typisiert habe, weil es mich während des Schreibens gestört hat oder mir zu komplex vorkam. Ich habe mir deshalb eine Routine geschaffen, die mir erlaubt, etwas Bestehendes zu `// @ts-ignorieren` und dann meine Veränderungen zu überprüfen, bevor ich sie commite. Dadurch denke ich immer zwei Mal darüber nach, ob das Stück Code, das ich in mein Repository aufnehmen will, nicht doch noch ungeprüft ist.

Es gibt Momente, in denen du dir vielleicht darüber Gedanken machst, WARUM der Typescript Compiler einen bestimmten Code nicht zulassen oder einen Typ akzeptieren möchte, der eigentlich ok aussieht, und ich bin zu der Erkenntnis gekommen, dass ich in den meisten Fällen etwas getan hätte, dass in der Zukunft für Probleme gesorgt haben KÖNNTE.  *Ja klar, ich als Entwickler weiß ganz genau, dass ich eine Funktion zu einem Zeitpunkt, an dem meine Props noch nicht definiert sind, niemals gecallt hätte...oder hätte ich das doch gemacht?* Das Hinzufügen von Null Checks (und anderen Schutzmaßnahmen) ist mittlerweile eine Angewohnheit geworden, mit der ich gut leben kann. Ich habe genug Situationen in Projekten miterlebt, bei denen etwas kaputt geht, weil aus unvorhergesehenen Gründen die Antwort des Servers leer war oder einen fehlenden oder falschen Typ hatte. Es war nicht unser Code, der falsch war, sondern das blinde Vertrauen in die API-contracts und der fehlende Doppel-Check an beiden Enden. Dadurch können unerwartete Dinge passieren, die manchmal zu unschönen und nur schwer zu findenden Fehlern führen.

**Kurzfassung:** Ich habe gelernt, mir keine Sorgen mehr zu machen und liebe den Compiler. Ich habe viel gelernt, indem ich versucht habe zu verstehen, WAS Typescript mir sagen will und ich glaube, das hat mich zu einem besseren Programmierer gemacht, der aber trotzdem nicht erwartet, dass der Typescript Compiler immer alle Fehler verhindert.



## Typescript - WIE?
### Los geht's mit React Native und Typescript
Ein neues Projekt zu starten könnte gar nicht einfacher sein. Wie schon in früheren Projekten, starten wir wieder mit Expo und bleiben im „managed workflow“, um die Dinge schön einfach zu halten.

Ich gehe davon aus, dass du bereits mit NPM und GitHub gearbeitet hast und die Basics verstehst. Um mit React Native in EXPO loszulegen, musst du das Befehlszeilentool expo-cli installieren. Es wird emfpohlen, dass Tool global zu installieren und die -g flag zu verwenden.
Während des Schreibens nutze ich expo-cli@4.0.17. Für denn Fall, dass du diesen Artikel in der Zukunft lesen solltest: Bei der Verwendung von Versionen, die älter als Version 4.x sind, sollte es trotzdem keine großartigen Probleme geben.

```bash
npm install -g expo-cli
```

Mit Expo zur Initialisierung unseres Projekts müssen wir Templates typescripten, aus denen wir dann wählen können. In unserem Fall bauen wir alles Schritt für Schritt von Grund auf neu. Dafür wählen wir das leere Typescript Template aus dem [managed workflow](https://docs.expo.io/introduction/managed-vs-bare/). Der folgende Befehl erstellt, wenn er von deinem gewünschten Ort über die Befehlszeile eingegeben wird, einen neuen Ordner mit dem Namen, den du in der Init angegeben hast, und füllt ihn mit den Template-Dateien, die du aus dem folgenden Menü auswählst.

```bash
expo init yourProjectName
```

![](https://i.imgur.com/ZY4lyX1.png "test")

Es kann einen Moment dauern, bis die expo-cli alle dependencies von npm heruntergeladen und installiert hat. Sobald dies erledigt ist, kannst du einfach mit `cd yourProjectName` in den neuen Ordner wechseln und mit der Arbeit beginnen.

Das war's, du hast es geschafft. Du hast erfolgreich ein React Native-Projekt über Expo gestartet und konfiguriert, das mit Typescript ausgeführt wird.


### GitHub - synchronisiere deinen Fortschritt
Es mag sich vielleicht so anfühlen, als hätten wir bis hier noch nicht viel geschafft. Ich empfehle dir trotzdem sehr, deine bisherige Arbeit mit einem versionierten Repository-Service wie GitHub oder GitLab zu synchronisieren. Ich persönlich nutze GitLab bei der Arbeit und GitHub für open source und private Projekte.

[Dieser Artikel auf docs.github.com](https://docs.github.com/en/free-pro-team@latest/github/importing-your-projects-to-github/adding-an-existing-project-to-github-using-the-command-line) zeigt den gesamten Prozess auf sehr simple Art und Weise und macht es leicht, den Erklärungen zu folgen.


### Hat es funktioniert?
Wenn du auf Nummer sicher gehen willst, dass bisher alles so funktioniert, wie es soll, dann gib einfach die folgende Zeile in dein Befehlszeilen-Tool ein, während du im root Verzeichnis des Projektes bist. Nun sollte sich die folgende Seite in deinem Standard-Browser öffnen. Um die Mobile-App zu überprüfen, kannst du einen Emulator im linken Menü starten. Für Mac User mit Xcode sollte der iOS Simulator am besten funktionieren.

```bash
npm start
```

Expo Web Interface 
![](https://i.imgur.com/jcM8df5.png)



## Typescript - Zusätzliches Setup
Natürlich möchtest du dein Projekt jetzt noch ein bisschen individualisieren. Das basic setup ist schon ganz nett, aber vielleicht können wir ja noch ein paar sinnvolle Presets importieren, ein paar weitere Regeln zu unserem Linting hinzufügen und eine Editor-Konfigurationsdatei einfügen.


### Editor Config
Das ist in der Regel das erste, was ich aus meinen anderen Projekten herauskopiere und das die Arbeit in den meisten IDEs sehr viel einfacher macht. Eine `.editorconfig` Datei am Root Level deines Projektordners kann von den meisten IDEs standardmäßig gelesen werden. Andere Konfigurationsdateien können mit der Installation eines kleinen Plugins lesbar gemacht werden. Die IDE hilft dir dann automatisch mit den richtigen indentations, markiert die maximale Zeilenlänge und vieles mehr.

[Geh auf diese Seite](https://editorconfig.org/), wenn du mehr erfahren möchtest oder deine eigene IDE auf Plugins prüfen willst. Lass dich dabei vom 90er Jahre Comic-Stil der Webseite nicht abschrecken, der Inhalt ist aktuell.

Dies ist meine derzeitige config, die du gerne zu deinen eigenen Projekten hinzufügen darfst.

**File:** /.editorconfig

```json
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
max_line_length = 100
trim_trailing_whitespace = true

[*.{json,yml,*rc}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

### Linting und Prettier
Um mit dem linting anzufangen, müssen wir eslint und ein paar weitere Presets installieren, die wir für unser development nutzen werden.  
Wir werden außerdem Prettier benutzen, um die einfachereren Formatierungsprozesse automatisch reparieren zu lassen. Somit müssen wir nicht alle Einrückungen und Semikolons aus kopierten Code-Schnipseln aus dem Web anpassen.

#### eslint
Wir werden das Airbnb ESLint setup verwenden, für das mehrere packages notwendig sind. Glücklicherweise gibt es eslint-config-airbnb. Du musst nur das hier ausführen:

```bash
npx install-peerdeps --dev eslint-config-airbnb
```

Damit installierst du alle folgenden packages in deine projects dev dependencies: 
+ eslint@7.2.0
+ eslint-config-airbnb@18.2.1
+ eslint-plugin-react@7.22.0
+ eslint-plugin-import@2.22.1
+ eslint-plugin-react-hooks@4.0.0
+ eslint-plugin-jsx-a11y@6.4.1

#### linting typescript
Um mit Typescript zu arbeiten, müssen wir die libraries installieren, die uns erlauben, auch Typescript-Code zu linten.

```bash
npm i --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### prettier linting
Die Installation von Prettier ist so einfach wie die von Typescript. Wir brauchen eine config und ein Plugin.

```bash
npm i --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```


### Konfiguration


Um dich durch die Basics zu führen, ist eslint der eigentliche Linter, den wir verwenden werden. Um den Linter um zusätzliche Funktionen zu erweitern, benutzen wir außerdem den eslint Plugin Import. Der Typescript-Parser wird benötigt, um unseren Typescript Code zu analysieren. Somit kann eslint seinen Job machen und prettier erlaubt uns dadurch, gemäß unserer vordefinierten Regeln, einige Codeprobleme automatisch zu reparieren und zu verändern.


Um ein Basis-Setup zu bekommen, kannst du einfach eslint installieren und `eslint --init` ausführen, um einen guided init Prozess zu starten. Wir werden diesen Vorgang aber selber machen und fügen unsere eigene .eslintrc config Datei zum root level des Projekts hinzu.

Lass uns einen Blick auf die fertige config Datei werfen.

**File:** /.eslintrc

```json
{
  "extends": [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "react", "prettier"],
  "rules": {
    "func-names": 0,
    "import/extensions": ["error", "never"],
    "import/no-unresolved": 0,
    "import/prefer-default-export": 0,
    "jsx-a11y/accessible-emoji": 0,
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "trailingComma": "all",
        "arrowParens": "avoid",
        "endOfLine": "auto"
      }
    ],
    "react/jsx-filename-extension": [1, {
      "extensions": [
        ".ts",
        ".tsx"
      ]
    }],
    "react/jsx-one-expression-per-line": "warn",
    "react/prop-types": 0,
    "react/require-default-props": 0,
    "react/style-prop-object": 0,
    "semi": ["error", "never"],
    "no-plusplus": ["error", {"allowForLoopAfterthoughts": true}],
    "no-shadow": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-use-before-define": ["error", {
      "functions": true,
      "classes": true,
      "variables": false
    }],
    "@typescript-eslint/no-var-requires": 0
  }
}
```

Lass uns jetzt einen kurzen Blick auf die unterschiedlichen Teile der config Datei werfen:
* **"extends"** => unsere Presets der Regeln
* **"parser"** => zeigt auf unseren Typescript-Parser
* **"parserOptions"** => wie der Name schon sagt
* **"plugins"** => einige Plugins für unsere Bequemlichkeit
* **"rules"** => hier fügen wir unsere eigenen Regeln ein und überschreiben Presets aus dem **"extends"** Bereich, mit denen wir nicht einverstanden sind

Zuletzt müssen wir jetzt noch unsere .prettierrc config Datei hinzufügen. Es gibt nur wenige geringfügige Anpassungen, die wir hier vornehmen müssen, da die meisten Dinge, die wir reparieren möchten, bereits durch unsere eslint Regeln abgedeckt sind. Füge einfach eine neue .prettierrc Datei am root level mit diesen fünf Zeilen hinzu.


**File:** /.prettierrc

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": false
}
```

Wenn du es mit sauberem Code in deinem Repository ganz genau nehmen willst,  kannst du noch einen Schritt weiter gehen und den Linter ausführen, bevor du neuen Code als Commit akzeptierst. Ich arbeite nicht mit einem Pre-Commit hook, der es komplett verhindert, Code mit Linting Fehlern ins Repository zu pushen. Für dich könnte dieses Vorgehen aber das Richtige sein und ich kann dir  nur empfehlen, dafür einen Blick auf Husky zu werfen. Da ich in meinen Projekten aber viel Prototyping durchführe und mein Workflow Codeüberprüfungen enthält, bevor ich etwas in meine Entwicklung oder in main branches einfüge, schränke ich mich diesbezüglich nicht ein.

Um den Linter auszuführen und Gebrauch von den Prettier Autokorrekturen machen zu können, müssen wir zwei neue Skripte zu unserem package.json hinzufügen.

```json
"scripts": {
  ...
  "lint": "tsc --noEmit && eslint --ext .js,.jsx,.ts,.tsx ./ || true",
  "fix": "tsc --noEmit && eslint --fix --ext .js,.jsx,.ts,.tsx ./ || true",
  ...
}
```

Beide Befehle führen den Typescript Compiler aus, ohne dabei Veränderungen am Code zu machen (tsc --noEmit) und führen dann eslint auf allen passenden Dateien aus, beginnend am root level.

Noch eine kurze Warnung, beziehungsweise ein Ratschlag zu meinen Skripten: Ich leite allen fehlerhaften Output weg (|| true), da das Skript beim Ausführen und Finden von Linting Errors einen Fehler aufzeigt. Das ist das erwartete Verhalten und sehr nützlich, wenn du deine Befehle aneinanderreihst. Füge am Ende nicht "|| true" hinzu, wenn du diese Skripte später einmal in Kombination mit anderen Skripten verwenden möchtest.  
Ich persönlich habe es nicht so gerne, jedes mal 10 Linien nutzlose "npm ERR!" zu sehen, wenn ich meinen Linter ausführe. Ich möchte meine Linting Errors in meinem Terminal untersuchen und feststellen, wo ich Probleme beheben muss. Deshalb hat dieser console output in diesem Szenario keinen Wert für mich.

![](https://i.imgur.com/8alvUed.png)


## Zusammenfassung
Wenn du jetzt die Linter Skripte ausführst, wirst du zwei Dinge beobachten.  
Das Ausführen von `npm run lint` wird dir eine lange Liste kleinerer Probleme zeigen. Dies liegt nicht daran, dass das basic template Fehler enthält, sondern dass unsere selbst definierten Regeln unterschiedliche Paradigmen aufweisen (wie meine Präferenz, keine Semikolons zu verwenden, trailing comma zu erzwingen und einen Einzug von 4 zu verwenden).

![](https://i.imgur.com/QzKirSj.png)

Das Ausführen von `npm run fix` lässt die meisten dieser Fehler auf magische Weise verschwinden. Fühlt sich gut an, oder?

![](https://i.imgur.com/d4lTTfv.png)

Der verbleibende Fehler ist ein fehlender return type, also lasst uns diesen Fehler schnell beheben und nach Hause gehen. App() returned ein React Element an, also können wir einfach auf React.ReactElement tippen und das als return type unserer App Component hinzufügen.

![](https://i.imgur.com/1sVdJ9B.png)


## Fazit
Wir haben ein neues Projekt mit einem Typescript Template gestartet, haben linting und eslint Typescript Support hinzugefügt und unsere Regeln so angepasst, dass sie passend erschienen. Außerdem haben wir Prettier's Autokorrektur-Fähigkeit mit einbezogen und damit das Ziel der heutigen Reise erreicht.

In unserer nächsten Session werden wir einen Blick auf grundlegende Lösungen für die Navigation, das state management und die Struktur der Projektdateien werfen.

Hier ist der versprochene [Link zum (Pre-)Release tag auf Github](https://github.com/AllBitsEqual/expo-ts-starter/tree/v0.1.0).

