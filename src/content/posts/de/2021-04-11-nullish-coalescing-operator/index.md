---
title: "Nullish coalescing operator / ES2020-Feature"
description: "Der Nullish coalescing operator ist ein neuer und zusätzlicher JavaScript-Operator, der seit Juni 2020 mit ECMAScript 2020 (ES2020) der Programmiersprache zur Verfügung steht."
author: "Thomas Scharke"
published_at: 2021-04-11T00:00:00.000Z
categories: "react javascript education ES2020 feature"
tutorial_page_order: '1'
header_image: header.jpg
canonical_url: "https://dev.to/tscharke/nullish-coalescing-operator-erklart-german-only-2m6d"
header_source: https://unsplash.com/@scienceinhd
---

Der **Nullish coalescing operator** ist ein neuer und zusätzlicher JavaScript-Operator, der seit Juni 2020 mit ECMAScript 2020 (ES2020) der Programmiersprache zur Verfügung steht.

Er ist neben den (vielleicht) bekannten _binären_ logische Operatoren (_Binary Logical Operators_) `&&` (AND) und `||` (ODER) der dritte Operator **nicht binäre** und hat die Schreibweise `??`.

Zum Einsatz kommt er immer dann, wenn ich explizit prüfen möchte ob der Wert einer Variable vorliegt um diesen zu nutzen oder, wenn der Wert nicht vorliegt, mit einem anderen Wert weiter zu arbeiten.

Hier für mich der "Klassiker": Einmal mit einem `if`-Block, dann in einer "vereinfachten" Schreibweise mit dem [ODER-Operator](#oder-operator--or) und zu guter letzt in der Schreibweise mit dem neuen **Nullish coalescing operator**.

```ts
// Long version
let secondValue = "DEFAULT_VALUE";
if (firstValue !== null && firstValue !== undefined && firstValue !== "") {
  secondValue = firstValue;
}

// Shorthand with OR-Operator
secondValue = firstValue || "DEFAULT_VALUE";

// With Nullish-Operator
secondValue = firstValue ?? "DEFAULT_VALUE";
```

Die erste Vereinfachung, mit dem [ODER-Operator](#oder-operator), funktioniert in den meisten Fällen, deckt jedoch **nicht** den Fall ab mit bool‘schen Werten zu arbeiten.

Doch gehen wir es Schritt für Schritt durch und schauen erstmal warum die Varianten mit dem [ODER-Operator](#oder-operator) funktioniert um dann auf den meist "besseren" **Nullish coalescing operator** auszuweichen.

## ODER-Operator

Der binäre logische Operator (_Binary Logical Operator_) `||` (ODER) ist wie folgt definiert:

> {Ausdruck linke Seite} **||** {Ausdruck rechte Seite}

D.h. liefert der Ausdruck auf der linken Seite den Wert `false` wird der Ausdruck auf der rechten Seite interpretiert, ansonsten wird der Ausdruck der linken Seite interpretiert.

Für unsere "Vereinfachung" von oben…

```ts
let secondValue = firstValue || "DEFAULT_VALUE";
```

bedeutet es, dass wenn die Variable `firstValue` den Wert `true` liefert, wird dieser Wert zurückgegeben (und in diesem Fall der Variablen `secondValue` zugewiesen). Liefert die Variable `firstValue` allerdings `false` wird der Wert der rechten Seite der Variable `secondValue` zugewiesen - in meinem Fall also der Wert `DEFAULT_VALUE`.

## Schritt für Schritt

Gehen wir mein obiges Beispiel Schritt für Schritt durch und schauen was ich meine mit…

> Die erste Vereinfachung, mit dem [ODER-Operator](#oder-operator), funktioniert in den meisten Fällen, deckt jedoch **nicht** den Fall ab mit bool‘schen Werten zu arbeiten.

und wie uns der **Nullish coalescing operator** hier hilft.

Dazu packe ich mein Beispiel in eine Funktion und führe diese anschließend aus:

```ts
function doSomethingAmazing(firstValue) {
  let secondValue = "DEFAULT_VALUE";
  if (firstValue !== null && firstValue !== undefined && firstValue !== "") {
    // Do somthing greate
    secondValue = firstValue;
  }

  return secondValue;
}

doSomethingAmazing(1); // 1 ✅
doSomethingAmazing(42); // 42 ✅
doSomethingAmazing(null); // DEFAULT_VALUE ✅
doSomethingAmazing(""); // DEFAULT_VALUE ✅
doSomethingAmazing(/* No value means `undefined` as value */);
// DEFAULT_VALUE ✅
doSomethingAmazing(true); // true ✅
doSomethingAmazing(false); // false ✅
```

🥳 Alles wunderbar und der Code funktioniert auch mit bool'schen Werten. 🥳

Reflexartig setzt bei mir das Gefühl ein diesen Code zu "vereinfachen" und die Möglichkeiten von JavaScript für mich zu nutzen. Denn dass ein Wert vorhanden ist kann ich mit einem `if (firstValue)` ermitteln, was zu dieser Version meines Codes führt:

```ts
function doSomethingAmazing(firstValue) {
  let secondValue = "DEFAULT_VALUE";
  if (firstValue) {
    secondValue = firstValue;
  }

  return secondValue;
}

doSomethingAmazing(1); // 1 ✅
doSomethingAmazing(42); // 42 ✅
doSomethingAmazing(null); // DEFAULT_VALUE ✅
doSomethingAmazing(""); // DEFAULT_VALUE ✅
doSomethingAmazing(/* No value means `undefined` as value */);
// DEFAULT_VALUE ✅
doSomethingAmazing(true); // true ✅
doSomethingAmazing(false); // DEFAULT_VALUE ❌ 😮
```

😮 Upps…Wenn ich ein `false` an die Funktion übergebe erhalte ich den Wert `DEFAULT_VALUE` zurück und nicht wie erwartet den Wert `false` 🤔

Ich gehe noch einen Schritt weiter und "vereinfachen" meinen Code noch einmal; und dieses mal nutze ich den [ODER-Operator](#oder-operator):

```ts
function doSomethingAmazing(firstValue) {
  // Executes the right operand ("DEFAULT_VALUE")
  // only if the left operand (firstValue) is falsy

  // Dieser Einzeiler wird auch short-circuiting operator genannt 😃
  let secondValue = firstValue || "DEFAULT_VALUE";

  return secondValue;
}

doSomethingAmazing(1); // 1 ✅
doSomethingAmazing(42); // 42 ✅
doSomethingAmazing(null); // DEFAULT_VALUE ✅
doSomethingAmazing(""); // DEFAULT_VALUE ✅
doSomethingAmazing(/* No value means `undefined` as value */);
// DEFAULT_VALUE ✅
doSomethingAmazing(true); // true ✅
doSomethingAmazing(false); // DEFAULT_VALUE ❌ 😮
```

Die letzte "Vereinfachung" meines Codes finde ich noch besser. Diese nimmt mir den `if`-Block und macht den Code einfacher zu lesen und übersichtlicher.

Doch beide "Vereinfachung" führen zu dem selben unerwarteten Ergebnis, wenn ich die Funktion mit dem Wert `false` aufrufe.

Was habe ich kaputt gemacht? 🤔

Ich habe nichts wirklich _kaputt gemacht_. Ich habe lediglich, in beiden Vereinfachungen, Funktionalität von JavaScript genutzt die davon ausgeht dass ein Wert falsch (`false`) sein muss - also _falsy_ ist. Im konkret Fall, mit meinem `if`-Block und dem [ODER-Operator](#oder-operator), prüfe ich ob der Wert `firstValue` falsch ist um dann den Wert `DEFAULT_VALUE` zu nutzen.

### Wann ist ein Wert "falsy"

In JavaScript ist ein Wert genau dann falsch (`false`) oder _falsy_ wenn dieser `null`, `undefined`, `0` oder `false` ist.

Und da dieses in JavaScript nunmal so ist, habe ich mit meiner "Vereinfachung" des Codes auch gleich das _Verhalten meiner Implementierung_ verändert 🤷‍

Rufe doch die letzten beiden Codebeispiele mal mit `0` (Zero) auf:

```ts
doSomethingAmazing(0);
```

Auch hier möchte ich dass mir der Wert `0` (Zero) zurückgegeben wird, doch ich erhalte - logischerweise - den Wert `DEFAULT_VALUE` 🤷‍

Doch kommen wir zurück zur eigentlich Implementierung mit folgendem Ausdruck im `if`-Block:

```ts
firstValue !== null && firstValue !== undefined && firstValue !== "")
```

Daraus leitet sich meine Anforderung ab dass ich prüfen möchte ob ein Wert [**nullish**](#was-heisst-nullish) ist und **nicht** ob ein Wert _falsy_ ist, wie ich es durch meine "Vereinfachungen" (unwissentlich) gemacht habe.

### Was heisst _nullish_

Mit _nullish_ ist gemeint dass ein Ausdruck die Werte `null` oder `undefined` haben muss, nur dann ist er **nullish**.

Und genau dieses ist und war es, was ich mit meiner ersten Implementierung haben wollte und umgesetzt habe.

Kann ich jetzt meine einleitendes Beipiels nicht "vereinfachen"? Muss ich, von Hand, alle _nullish_-Werte in JavaScript selber abfragen?

😱😱😱 **N E I N** 😱😱😱

## Der Neue - Nullish coalescing operator (`??`)

Hier kommt _der Neue_ ins Spiel - der dritten logische Operatoren in JavaScript.

Meine Damen und Herren der **Nullish coalescing operator** 🚀🚀🚀, der in JavaScript als `??` geschrieben wird und wie folgt definiert ist:

> {Ausdruck linke Seite} **??** {Ausdruck rechte Seite}

Dieser Operator verhält sich ähnlich wie der [ODER-Operator](#oder-operator), doch mit dem entscheidenden Unterschied…

> **Es wird geprüft ob der Ausdruck auf der linken Seite ["nullish"](#was-heisst-nullish) ist.**

Und nicht wie beim [ODER-Operator](#oder-operator), ob der Ausdruck `false` ist.

Ein paar _Beispiele_ zum **Nullish coalescing operator**:

```js
1 ?? "DEFAULT VALUE"; // Result is: 1 ✅
42 ?? "DEFAULT VALUE"; // Result is: 42 ✅
null ?? "DEFAULT VALUE"; // Result is: DEFAULT VALUE ✅
undefined ?? "DEFAULT VALUE"; // Result is: DEFAULT VALUE ✅
true ?? "DEFAULT VALUE"; // Result is: true ✅
false ?? "DEFAULT VALUE"; // Result is: false ✅
0 ?? "DEFAULT VALUE"; // Result is: 0 ✅
"" ?? "DEFAULT VALUE"; // Result is: "" ❓
```

Und mit diesem Wissen kann ich mein Codebeispiel auch wieder "vereinfachen" - und zwar so…

```ts
function doSomethingAmazing(firstValue) {
  // Executes the right operand ("DEFAULT_VALUE")
  // only if the left operand (firstValue) is nullish
  let secondValue = firstValue ?? "DEFAULT_VALUE";

  return secondValue;
}

doSomethingAmazing(1); // 1 ✅
doSomethingAmazing(42); // 42 ✅
doSomethingAmazing(null); // DEFAULT_VALUE ✅
doSomethingAmazing(/* No value means `undefined` as value */);
// DEFAULT_VALUE ✅
doSomethingAmazing(true); // true ✅
doSomethingAmazing(false); // false ✅
doSomethingAmazing(""); // "" ❓
```

## Einen habe ich noch…

Bei meinen Beispielen mit dem **Nullish coalescing operator** wird Euch aufgefallen sein, dass der Aufruf meiner "vereinfachten" Funktionen mit einem leeren String (`""`) nicht dazu führt das mir `DEFAULT_VALUE` zurückgegeben wird.

Das ist für die Funktionsweise meines Beispiels nicht relevant, doch ich möchte Euch nicht verschweigen warum es dazu kommt.

Die Antwort liegt eigentlich klar vor uns: Der _Nullish coalescing operator_ (`??`) prüft ob ein Wert _[nullish](#was-heisst-nullish)_ ist, also `null` oder `undefined` ist. Und ein leerer String (`""`) ist in JavaScript ein leerer String und damit weder `null` noch `undefined` - aber [_falsy_](#wann-ist-ein-wert-falsy) 🤣

## Ein weiteres Beispiel

Gehen wir noch einen Schritt weiter und wollen dieses mal tatsächlich mit bool‘schen Werten wie `true` und `false` arbeiten. Sagen wir, im Rahmen einer Konfiguration die genau dann einen Lebenszeichen von sich geben soll wenn wir online sind und voraussetzt dass wir (immer) online sind (per default):

```ts
function doSomethingAmazingWithAConfiguration({ online }) {
  // We use the OR operator
  let sendKeepAlive = online || true;

  return sendKeepAlive;
}

// We say explicit that we're online
doSomethingAmazingWithAConfiguration({ online: true }); // true ✅

// We use the default-state
doSomethingAmazingWithAConfiguration({}); // true ✅

// We say explicit that we're offline ⚠️
doSomethingAmazingWithAConfiguration({ online: false }); // true ❌ 😮
```

An dieser Stelle des Textes habe ich jetzt mit dem "falschen" Rückgabewert des letzten Aufrufes der Funktion gerechnet, doch es ist nicht das was ich wollte.

Ich möchte das der Rückgabewert der Funktion mir `false` liefert, wenn wir offline sind, also wenn wir im übergebenem Objekt den key `online` auf `false` setzen (`{ online: false }`).

### Das bekannte Problem

Mit dem gelernten macht dieses falsche Ergebnis meines Funktionsaufrufes Sinn. Denn `online || true` hat mit dem letzten Aufruf folgende Werte: `false || true`.

Und wenn die linke Seite des [ODER-Operators](#oder-operator) `false` liefert wird der Wert des Ausdrucks auf der rechten Seite genutzt (der Wert der linken Seite ist _falsy_) - in unserem Fall `true` 🤷‍.

Der Code funktioniert genau wie geschrieben, doch nicht wie erwartet.

### Mögliche Lösungen

Für meine Funktion, die ein Konfigurationsobjekt erwartet, könnte ich mit [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment){:target="_blank"} arbeiten und einen Defaultwert definieren:

```ts
function doSomethingAmazingWithAConfiguration({ online } = { online: false }) {
  return online;
}
```

Oder ich nutze, statt eines Konfigurationsobjekts, ein `boolean` und prüfe diese mit dem _strict inequality operator_ (`!==`):

```ts
function doSomethingAmazingWithAConfiguration({ online }) {
  let sendKeepAlive = online !== false;

  return sendKeepAlive;
}
```

Doch in diesem Artikel ist der **Nullish coalescing operator** der Star 🤩 und für meine Konfigurationsfunktion auch eine Lösung:

```ts
function doSomethingAmazingWithAConfiguration({ online }) {
  // We use the Nullish coalescing operator
  let sendKeepAlive = online ?? true;

  return sendKeepAlive;
}

// We say explicit that we're online
doSomethingAmazingWithAConfiguration({ online: true }); // true ✅

// We use the default-state
doSomethingAmazingWithAConfiguration({}); // true ✅

// We say explicit that we're offline
doSomethingAmazingWithAConfiguration({ online: false }); // false ✅
```

## Anmerkung

- Dieser Artikel ist am 29.03.2021 zuerst bei [Dev.to](http://bit.ly/tscharke-nullish-coalescing-operator){:target="_blank"} erschienen.
- Das Hintergrundbild stammt von [Science in HD](https://unsplash.com/@scienceinhd){:target="_blank"} auf [Unsplash](https://unsplash.com){:target="_blank"}
