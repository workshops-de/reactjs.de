/**
 * i18n UI Strings for reactjs.de
 */

export const languages = {
  de: "Deutsch",
  en: "English",
} as const;

export const defaultLang = "de" as const;
export const showDefaultLang = false;

export type Lang = keyof typeof languages;

export const ui = {
  de: {
    "nav.articles": "Artikel",
    "nav.tutorial": "Tutorial",
    "nav.training": "Schulung",
    "nav.search": "Suche",
    "nav.meetups": "Meetups",
    "nav.team": "Team",
    "nav.tutorials": "Tutorials",

    "footer.navigation": "Navigation",
    "footer.communities": "Communities",
    "footer.followUs": "Folge uns",
    "footer.poweredBy": "Powered by",
    "footer.imprint": "Impressum",
    "footer.privacy": "Datenschutz",

    "search.title": "Suche",
    "search.placeholder": "Artikel durchsuchen...",
    "search.noResults": "Keine Ergebnisse für [SEARCH_TERM] gefunden",
    "search.manyResults": "[COUNT] Ergebnisse für [SEARCH_TERM]",
    "search.oneResult": "1 Ergebnis für [SEARCH_TERM]",
    "search.searching": "Suche nach [SEARCH_TERM]...",
    "search.clear": "Suche leeren",
    "search.loadMore": "Mehr laden",
    "search.browseAll": "Oder durchstöbere alle Artikel",

    "articles.title": "Artikel",
    "articles.description":
      "Alle Artikel rund um React, TypeScript und moderne Webentwicklung",

    "home.hero.title": "React lernen",

    "common.learnMore": "Mehr erfahren",
    "common.backToHome": "Zurück zur Startseite",
    "common.page": "Seite",
    "common.of": "von",
    "common.previous": "Zurück",
    "common.next": "Weiter",

    "banner.training":
      "Wir bieten Schulungen an! Von Anfänger bis Experte - inklusive Agentic AI Coding!",

    "darkMode.toggle": "Dark Mode umschalten",
    "language.switchTo": "Sprache wechseln",
  },
  en: {
    "nav.articles": "Articles",
    "nav.tutorial": "Tutorial",
    "nav.training": "Training",
    "nav.search": "Search",
    "nav.meetups": "Meetups",
    "nav.team": "Team",
    "nav.tutorials": "Tutorials",

    "footer.navigation": "Navigation",
    "footer.communities": "Communities",
    "footer.followUs": "Follow us",
    "footer.poweredBy": "Powered by",
    "footer.imprint": "Imprint",
    "footer.privacy": "Privacy Policy",

    "search.title": "Search",
    "search.placeholder": "Search articles...",
    "search.noResults": "No results found for [SEARCH_TERM]",
    "search.manyResults": "[COUNT] results for [SEARCH_TERM]",
    "search.oneResult": "1 result for [SEARCH_TERM]",
    "search.searching": "Searching for [SEARCH_TERM]...",
    "search.clear": "Clear search",
    "search.loadMore": "Load more",
    "search.browseAll": "Or browse all articles",

    "articles.title": "Articles",
    "articles.description":
      "All articles about React, TypeScript and modern web development",

    "home.hero.title": "Learn React",

    "common.learnMore": "Learn more",
    "common.backToHome": "Back to Home",
    "common.page": "Page",
    "common.of": "of",
    "common.previous": "Previous",
    "common.next": "Next",

    "banner.training":
      "We offer training courses! From beginner to expert - including Agentic AI Coding!",

    "darkMode.toggle": "Toggle Dark Mode",
    "language.switchTo": "Switch language",
  },
} as const;

export const routes = {
  en: {
    artikel: "articles",
    schulungen: "training",
    impressum: "imprint",
    datenschutz: "privacy",
    suche: "search",
    meetups: "meetups",
    team: "team",
    tutorials: "tutorials",
    kategorie: "category",
  },
} as const;
