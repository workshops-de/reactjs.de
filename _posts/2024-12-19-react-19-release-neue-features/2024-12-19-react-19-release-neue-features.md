---
title: "React 19 ist da: Die wichtigsten neuen Features im Überblick"
description: "React 19 wurde offiziell veröffentlicht! Entdecke die revolutionären neuen Features wie den React Compiler, Actions, neue Hooks und vieles mehr in diesem umfassenden Guide."
author: "Robin Böhm"
published_at: 2025-02-20 09:00:00
categories: "react release update javascript"
header_image: "./header.jpg"
---

Nach fast zwei Jahren Entwicklung ist es endlich soweit: **React 19 ist da!** Die neue Version wurde am 5. Dezember 2024 offiziell als stabil veröffentlicht und bringt einige der größten Veränderungen seit der Einführung von Hooks mit. In diesem Artikel zeige ich dir alle wichtigen neuen Features und wie sie deine React-Entwicklung revolutionieren werden.

## Das Wichtigste auf einen Blick

React 19 konzentriert sich auf drei Hauptziele:
- **Automatische Performance-Optimierung** durch den neuen React Compiler
- **Vereinfachte Datenverwaltung** mit Actions und neuen Hooks
- **Bessere Developer Experience** durch weniger Boilerplate-Code

## Der React Compiler: Das Ende von useMemo und useCallback

Die vielleicht revolutionärste Neuerung ist der **React Compiler** (Codename "React Forget"). Dieser optimiert deinen Code automatisch und macht manuelle Memoization überflüssig.

### Vorher (React 18):
```jsx
function TodoList({ todos, filter }) {
  const filteredTodos = useMemo(
    () => todos.filter(todo => todo.status === filter),
    [todos, filter]
  );

  const handleToggle = useCallback((id) => {
    updateTodo(id);
  }, []);

  return filteredTodos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
  ));
}
```

### Nachher (React 19):
```jsx
function TodoList({ todos, filter }) {
  const filteredTodos = todos.filter(todo => todo.status === filter);

  const handleToggle = (id) => {
    updateTodo(id);
  };

  return filteredTodos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
  ));
}
```

Der Compiler erkennt automatisch, wann Berechnungen gecacht werden sollten. Das Ergebnis: Saubererer Code bei gleicher oder besserer Performance!

## Actions: Die neue Art, mit Formularen zu arbeiten

React 19 führt **Actions** ein - eine elegante Lösung für asynchrone Operationen, besonders bei Formularen.

### Client Actions ersetzen onSubmit:
```jsx
function ContactForm() {
  async function sendMessage(formData) {
    const message = formData.get('message');
    const email = formData.get('email');

    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ message, email })
      });
      // Erfolg!
    } catch (error) {
      // Fehlerbehandlung
    }
  }

  return (
    <form action={sendMessage}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Senden</button>
    </form>
  );
}
```

### Server Actions für direkten Backend-Zugriff:
```jsx
// actions.js
'use server';

export async function createUser(formData) {
  const name = formData.get('name');
  const email = formData.get('email');

  // Direkter Datenbankzugriff möglich!
  const user = await db.user.create({
    data: { name, email }
  });

  return user;
}

// SignupForm.jsx
import { createUser } from './actions';

function SignupForm() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button>Registrieren</button>
    </form>
  );
}
```

## Neue Hooks für bessere User Experience

### useActionState - Formularzustand einfach verwalten
```jsx
import { useActionState } from 'react';

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const username = formData.get('username');
      const password = formData.get('password');

      try {
        await login(username, password);
        return { success: true };
      } catch (error) {
        return { error: error.message };
      }
    },
    { error: null }
  );

  return (
    <form action={formAction}>
      <input name="username" />
      <input name="password" type="password" />
      <button disabled={isPending}>
        {isPending ? 'Anmelden...' : 'Login'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

### useOptimistic - Optimistische UI Updates
```jsx
import { useOptimistic } from 'react';

function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, newTodo]
  );

  async function addTodo(formData) {
    const title = formData.get('title');
    const newTodo = { id: Date.now(), title, pending: true };

    // UI wird sofort aktualisiert
    addOptimisticTodo(newTodo);

    // Server-Request im Hintergrund
    await createTodoOnServer(title);
  }

  return (
    <>
      <form action={addTodo}>
        <input name="title" />
        <button>Hinzufügen</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.title}
          </li>
        ))}
      </ul>
    </>
  );
}
```

### use() - Der universelle Hook
Der neue `use` Hook kann Promises und Context verarbeiten:

```jsx
import { use, Suspense } from 'react';

function UserProfile({ userPromise }) {
  // use() wartet auf die Promise
  const user = use(userPromise);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  const userPromise = fetchUser();

  return (
    <Suspense fallback={<div>Lade Benutzerdaten...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

## Server Components: Die Zukunft des Renderings

Server Components sind jetzt stabil und ermöglichen es, Komponenten auf dem Server zu rendern:

```jsx
// UserList.jsx - Server Component
async function UserList() {
  // Direkter Datenbankzugriff ohne API
  const users = await db.user.findMany();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  );
}

// UserCard.jsx - Client Component
'use client';

import { useState } from 'react';

function UserCard({ user }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div onClick={() => setExpanded(!expanded)}>
      <h3>{user.name}</h3>
      {expanded && <p>{user.bio}</p>}
    </div>
  );
}
```

## Document Metadata direkt in Komponenten

Keine externen Bibliotheken mehr für SEO-Metadaten nötig:

```jsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title} | Mein Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.image} />

      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

## ref als normale Prop

`forwardRef` wird nicht mehr benötigt:

```jsx
// Alt (React 18)
const Input = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

// Neu (React 19)
function Input({ ref, ...props }) {
  return <input {...props} ref={ref} />;
}
```

## Web Components Integration

React 19 unterstützt Web Components vollständig:

```jsx
function App() {
  return (
    <div>
      <h1>Meine React App</h1>
      <my-custom-calendar
        date="2024-12-19"
        onDateChange={(e) => console.log(e.detail)}
      />
    </div>
  );
}
```

## Bessere Fehlerbehandlung

React 19 verbessert die Fehlerbehandlung erheblich:

```jsx
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    console.error('Fehler von Error Boundary gefangen:', error);
    logErrorToService(error, errorInfo);
  },
  onUncaughtError: (error, errorInfo) => {
    console.error('Nicht gefangener Fehler:', error);
    // Kritischer Fehler - informiere Monitoring
  }
});
```

## Preloading APIs für bessere Performance

Neue APIs zum Vorladen von Ressourcen:

```jsx
import { preload, prefetchDNS, preconnect } from 'react-dom';

function App() {
  // DNS vorab auflösen
  prefetchDNS('https://api.example.com');

  // Verbindung vorab aufbauen
  preconnect('https://fonts.googleapis.com');

  // Ressourcen vorladen
  preload('/api/data', { as: 'fetch' });
  preload('/fonts/inter.woff2', { as: 'font' });

  return <MyApp />;
}
```

## Migration zu React 19

Die Migration ist in den meisten Fällen unkompliziert:

### 1. Installation
```bash
npm install react@19 react-dom@19
```

### 2. TypeScript-Types aktualisieren
```bash
npm install @types/react@19 @types/react-dom@19
```

### 3. Codemods ausführen
```bash
npx react-codemod@latest react-19/migration-recipe
```

## Wichtige Breaking Changes

- **UMD-Builds entfernt**: Nutze ESM-basierte CDNs
- **PropTypes entfernt**: Wechsle zu TypeScript
- **Legacy Context API entfernt**: Nutze die moderne Context API
- **String Refs entfernt**: Verwende Callback Refs oder useRef

## Performance-Verbesserungen

React 19 bringt signifikante Performance-Verbesserungen:
- Automatisches Batching von Updates
- Verbesserte Hydration mit weniger Fehlern
- Optimierte Bundle-Größe durch neue Compiler-Optimierungen
- Schnelleres Initial Rendering durch Server Components

## Fazit

React 19 ist ein Meilenstein in der Entwicklung des Frameworks. Mit dem React Compiler, Actions, neuen Hooks und Server Components wird die Entwicklung einfacher, performanter und macht mehr Spaß. Die automatischen Optimierungen reduzieren Boilerplate-Code erheblich, während neue Features wie Actions und Server Components moderne Patterns für Full-Stack-Anwendungen ermöglichen.

Die gute Nachricht: Die Migration ist in den meisten Fällen unkompliziert, und die Vorteile überwiegen bei weitem den Aufwand. Es ist Zeit, auf React 19 zu upgraden!

## Weiterführende Links

- [Offizielle React 19 Dokumentation](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React Compiler Playground](https://playground.react.dev/)

---

<div class="workshop-hint text-center">
  <div class="h3">React 19 professionell lernen?</div>
  <div class="row mb-2">
    <div class="col-xs-12 col-md-6">
      <p>
        In unseren <a target="_blank" href="https://workshops.de/seminare-schulungen-kurse/react-typescript?utm_source=reactjs_de&utm_campaign=react19&utm_medium=article">React und TypeScript Schulungen</a> zeigen wir dir alle neuen Features von React 19 im Detail. Lerne von erfahrenen Trainern und stelle deine Fragen direkt!
      </p>
      <p class="text-center">
        <a target="_blank" href="https://workshops.de/seminare-schulungen-kurse/react-typescript?utm_source=reactjs_de&utm_campaign=react19&utm_medium=article">
          <button class="btn btn-danger">Mehr zur React Schulung</button>
        </a>
      </p>
    </div>
    <div class="col-xs-12 col-md-6">
      <img class="lazy img-fluid img-rounded" src="/shared/assets/img/placeholder-image.svg" alt="React 19 Workshop" data-src="/assets/img/courses/react-logo.svg" />
    </div>
  </div>
</div>