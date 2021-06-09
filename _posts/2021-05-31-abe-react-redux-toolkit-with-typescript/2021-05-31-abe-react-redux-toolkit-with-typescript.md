---
title: "SERIES: React Native (Step by Step) - React Redux + Toolkit with Typescript"
description: "Setting up React Redux using the Redux Toolkit with Typescript in Expo "
author: "Konrad Abe (AllBitsEqual)"
published_at: 2021-05-31 10:00:00
header_source: "https://i.imgur.com/egaWeWg.jpg"
header_image: header.jpeg
categories: "react-native typescript redux redux-toolkit best-practices series"
canonical_url: "https://allbitsequal.medium.com/series-react-native-step-by-step-react-redux-toolkit-with-typescript-4818504bba13"
series: "React Native (Step by Step)"
---

# REIHE: React Native (Schritt für Schritt) - React Redux + Toolkit mit Typescript

**In unserer letzten Session haben wir ein neues und cleanes React Native Project mit Typescript und Linting Support aufgesetzt. Heute werden wir React Redux hinzufügen, ein vorhersehbarer state container, mit dem wir den global state an einem zentralen Ort verwalten können.**

_Wie immer findest du den fertigen Code am Ende des Artikels auf GitHub verlinkt._

**Reihe: React Native (Schritt für Schritt)**
1) [Umgang mit Typescript und Linting](https://allbitsequal.medium.com/series-react-native-step-by-step-working-with-typescript-and-linting-3961c4226793)
2) => **du bist hier** <=

![](https://i.imgur.com/egaWeWg.jpg)


## Redux - WARUM?
Ich gehe davon aus, dass du über Grundkenntnisse in React Native und Redux verfügst. [Solltest du eine kleine Auffrischung deines Wissens benötigen, habe ich hier genau den richtigen Artikel für dich!](https://allbitsequal.medium.com/straightforward-redux-no-strings-attached-e1b5f111bf00) Wir fahren nun mit dem setup aus unserer letzten Session fort und arbeiten weiterhin mit Expo, um unser React Native Build und bundling zu verwalten.

Schnapp dir das [aktuelle Projekt auf GitHub](https://github.com/AllBitsEqual/expo-ts-starter/tree/v0.1.0).


Ich weiß, dass es momentan einen großen Hype darum gibt, Redux und andere dependencies vollständig aus allen Projekten zu entfernen und mit React Hooks zu ersetzen. Ich glaube aber immer noch fest an die Ideen hinter Redux und besonders mit der neuesten Version (5.x zur Zeit des Schreibens dieses Artikels) wurde die Integration von Redux im Navigator verbessert. Davon werden wir in späteren Sessions noch profitieren, wenn wir React Navigation in unser Projekt einfügen.

> Bitte denk aber daran, dass nicht jedes Projekt Redux BRAUCHT, viele davon aber profitieren KÖNNEN.


### Redux Toolkit - WARUM?
In der Vergangenheit hatte ich mich dazu entschieden, nicht mit Redux Toolkit zu arbeiten. Ich bevorzugte damals die hands-on-Herangehensweise, doch Redux ist gar nicht so angsteinflößend und kompliziert, sobald du die grundlegenden Prinzipien verstanden hast. Ich konnte damals nichts gegen das Boilerplate-Argument einwenden, aber letztendlich ist es nicht so schlecht und du verbringst am Ende gar nicht SO VIEL Zeit damit, redux code zu schreiben.

Das war mein „altes Ich“. Das „heutige Ich“ hat dem toolset eine zweite Chance gegeben und einige Prototypen damit erstellt, die in einem größeren Projekt verwendet wurden. Jetzt muss das „heutige Ich“ leicht schmunzeln, wenn es an das „alte Ich“ denkt, das sich vehement gegen die Verwendung des toolsets gesträubt hat. Im Endeffekt schreibst du mit dem toolset nämlich die gleiche Logik und mehr oder weniger den gleichen Code, aber du schreibst wesentlich weniger Code und deine files sind viel kompakter und einfacher zu lesen.


## Redux - WIE?

Wir müssen die packages für redux, react-redux und toolkit in unseren production dependencies installieren und zusätzlich die react-redux types (die im react-redux-package fehlen) für das development hinzufügen.

```sh
# prod packages
npm install redux react-redux @reduxjs/toolkit
# dev package
npm install -D @types/react-redux
```

Als Erstes bauen wir ein Haus, um all unsere wertvollen Daten zu sichern. Dafür erstellen wir einfach einen neuen index.ts unter einem neuen Ordner src/redux/ and fangen mit dem coden an.

Wir müssen einen store mit der praktischen Funktion des Toolkits erstellen, unseren rootReducer hinzufügen (wo wir alle unsere reducers an einem zentralen Ort sammeln) und dann den erstellten store exportieren.

```js=
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'

const store = configureStore({
    reducer: rootReducer,
})

export default store
```

Bevor wir damit fortfahren, den fehlenden rootReducer zu schreiben, sollten wir erst DEN tutorial reducer erstellen, den alle nutzen. Den COUNTER, aber mit deutlich weniger Code dank des Redux Toolkits. Ich lege das unter src/redux/demo, weil ich es später löschen werden, aber für den Moment erstellen wir erst mal ein counter.ts file.

Dank des Toolkits sparen wir uns die ganze schwere Arbeit beim Erstellen des boilerplate Codes für actions, reducers, types und ähnliche. Das redux-toolkit bietet mehrere Wege an, um diesen Schritt zu machen (darunter `createAction` und `createReducer`), aber der einfachste Weg ist es, `createSlice` zu benutzen, was in den meisten Fällen ausreichend sein sollte, außer vielleicht bei async stuff.

```js=
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const counterSlice = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {
        increment: (state, action: PayloadAction<number>) => state + action.payload,
        decrement: (state, action: PayloadAction<number>) => state - action.payload,
    },
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer
```

Wenn wir uns den counterSlide nun genau angucken, geben wir unserem reducer (counter) einen Namen, definieren seinen initial state und schreiben unsere zwei benötigten reducers, um den state des counters um den payload, den wir mit dem dispatch senden, zu erhöhen oder zu verringern. Falls dein Code sehr komplex ist, könntest du das auch ein bisschen weiter aufteilen, indem du die reducers zuerst definierst und hier referenzierst. Für uns reicht die einfachere Herangehensweise aber erst mal aus.

Die createSlice Funktion spuckt ein object aus, das die actions und reducer beinhaltet (aber nicht limitiert), die wir exportieren müssen, um sie in unserer App verwenden zu können. Dadurch können wir jetzt endlich den fehlenden rootReducer hinzufügen, in dem wir all unsere reducer registrieren.

```js=
import { combineReducers } from '@reduxjs/toolkit'
import counterReducer from './demo/counter'

const rootReducer = combineReducers({
    counter: counterReducer,
})

export default rootReducer
```

Ähnlich wie beim normalen redux bündeln wir alle unsere reducer in unserem state, indem wir die combineReducers Funktion verwenden und ihm ein object mit all unseren reducers und ihren gewünschten Namen im state object geben.

Wir haben jetzt einen funktionierenden, aber immer noch nutzlosen redux store. Alles, was wir bis zu diesem Zeitpunkt gemacht haben, ist typed, weil die meisten types sicher von unserem typescript compiler erschlossen werden können und sowohl redux als auch das toolkit mit allen Funktionen aufwarten, die sofort ordnungsgemäß eingegeben wurden. Glückwunsch.

Um unserer App ein bisschen mehr Funktionalität hinzuzufügen, müssen wir eine Komponente erschaffen, um den stored state und die dispatch actions, die den state verändern, aufzunehmen. In der Vergangenheit hätten wir unsere component in einer übergeordneten Funktion namens connect() verpackt, um Zugriff auf den store zu erhalten und actions auslösen zu können. Dank React Hooks können wir uns jetzt aber einfach auf useSelector() und useDispatch() verlassen, um mit redux via react-redux zu interagieren.

Erstelle jetzt eine neue Komponente in der Datei Counter.tsx unter src/components/demo (wir werden diesen demo code zu einem späteren Zeitpunkt unserer Reihe los) und hol dir die grundlegenden Dinge, um sie anzuzeigen und mit dem counter zu interagieren.

```js=
import { Button, Text } from 'react-native'
import React from 'react'

const Counter = (): React.ReactElement => {
    return (
        <>
            <Text>0</Text>
            <Button title="increment" onPress={() => {}}>
                +1
            </Button>
            <Button title="decrement" onPress={() => {}}>
                -1
            </Button>
        </>
    )
}

export default Counter
```

Bevor wir die neuen Hooks mit Typescript benutzen können, müssen wir erneut an unseren redux store. Lasst uns also für einen Moment zurück zu src/redux/index.ts gehen.

Wir erstellen ein alias für useDispatch und useSelector, fügen typing hinzu, exportieren diese aliases, damit wir das nicht jedes Mal machen müssen, wenn wir sie verwenden wollen. Ich habe mich entschieden, die aliases useReduxDispatch und useReduxSelector zu nennen, um sie in erster Linie unterscheiden zu können. Du kannst natürlich einen beliebigen Namen wählen. Ich empfehle dir nur, sie nicht useDispatch oder useSelector zu nennen, um dein „zukünftiges Ich“ vor Kopfschmerzen zu bewahren, sobald Dinge durcheinandergeraten.

```js=
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import rootReducer from './rootReducer'

export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({
    reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch
export const useReduxDispatch = (): AppDispatch => useDispatch<AppDispatch>()
export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector
export default store

```

Wir haben line 5 und 12-14 hinzugefügt, wo wir unseren AppDispatch type definieren und unsere typed aliases erschaffen. Jetzt können wir das Counter.tsx file fertigstellen.

Importiere den neuen useReduxDispatch und useReduxSelector und verwende sie, um actions per Knopfdruck auszulösen und den counter mit dem aktuellen counter state zu verlinken.

```jsx=
import { Button, Text } from 'react-native'
import React from 'react'
import { decrement, increment } from '../../redux/demo/counter'
import { useReduxDispatch, useReduxSelector } from '../../redux'

const Counter = (): React.ReactElement => {
    const value = useReduxSelector(state => state.counter)
    const dispatch = useReduxDispatch()

    return (
        <>
            <Text>{value}</Text>
            <Button title="increment" onPress={() => dispatch(increment(1))}>
                +1
            </Button>
            <Button title="decrement" onPress={() => dispatch(decrement(1))}>
                -1
            </Button>
        </>
    )
}

export default Counter
```

Jetzt ist alles an Ort und Stelle. Gehe jetzt zurück zu App.tsx, das wir seit dem letzten Tutorial nicht mehr angerührt haben, und füge anstatt des Platzhalters-Texts unseren neuen Counter component und natürlich den Provider component hinzu, um unsere App zu verpacken und Zugriff auf unseren store zu gewähren.

```jsx=
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Provider } from 'react-redux'
import store from './src/redux'
import Counter from './src/components/demo/Counter'

export default function App(): React.ReactElement {
    return (
        <Provider store={store}>
            <View style={styles.container}>
                <Counter />
                <StatusBar style="auto" />
            </View>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
```

Das war's. Wenn du die App mit `npm start` ausführst und die Buttons klickst, geht der counter hoch und runter.

Stell sicher, dass du `npm run fix` ausführst, um kleinere code style errors zu beheben und zu bestätigen, dass wir alles gemäß unserer linting und rules gemacht haben. Fertig!


## Zusammenfassung
Wir haben unser React Native Typescript Projekt vom letzten Mal fortgesetzt und einen voll funktionsfähigen und komplett typisierten Redux Store in ungefähr 30 Zeilen redux code (imports ausgeschlossen) und einige lines tsx hinzugefügt. Das bedeutet wohl, dass ich meinen ursprünglichen redux Artikel umschreiben sollte und die neue Version deutlich kürzer sein wird...

![](https://i.imgur.com/qy76I16.png)

Kleine Bemerkung am Rande: Wenn du deine redux config ganz einfach testen möchtest, nutze die Browser-Version des Expo Web Interfaces und öffne deine dev tools. Wenn du die richtigen Erweiterungen installiert hast (react + redux), kannst du dir alle components und store/state mit einem einfach nutzbaren Interface angucken.

![](https://i.imgur.com/5my0HKg.png)

Es ist nicht viel und es nicht hübsch, aber es funktioniert und ist typisiert und skalierbar.

In den kommenden Sessions werden wir uns angucken, wie wir unseren redux store dauerhaft bestehend machen. Außerdem sehen wir uns ein paar grundlegende Lösungen für die Navigation und die Dateistruktur des Projekts an.

Hier ist der versprochene [Link zum (Pre-)Release tag auf Github](https://github.com/AllBitsEqual/expo-ts-starter/tree/v0.2.0).
