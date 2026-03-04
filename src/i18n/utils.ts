/**
 * i18n Utility Functions for reactjs.de
 */

import { ui, defaultLang, showDefaultLang, routes, type Lang } from "./ui";

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: Lang = lang): string {
    const pathParts = path.replace(/^\//, "").split("/");

    const translatedParts = pathParts.map((part) => {
      if (l !== defaultLang && routes[l] && part in routes[l]) {
        return routes[l][part as keyof (typeof routes)[typeof l]];
      }
      return part;
    });

    const translatedPath = "/" + translatedParts.join("/");

    if (!showDefaultLang && l === defaultLang) {
      return translatedPath;
    }
    return `/${l}${translatedPath}`;
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean);

  const lang = getLangFromUrl(url);
  if (lang !== defaultLang && parts[0] === lang) {
    parts.shift();
  }

  const path = parts[0];
  if (!path) return undefined;

  if (lang !== defaultLang && routes[lang]) {
    const routeEntries = Object.entries(routes[lang]);
    const found = routeEntries.find(([, translated]) => translated === path);
    if (found) return found[0];
  }

  return path;
}

export function getAlternateUrls(
  url: URL,
  siteUrl: string,
  currentSlug?: string,
  translationSlug?: string
): { lang: Lang; url: string }[] {
  const currentLang = getLangFromUrl(url);
  const route = getRouteFromUrl(url);
  const restOfPath = url.pathname
    .split("/")
    .filter(Boolean)
    .slice(currentLang !== defaultLang ? 2 : 1)
    .join("/");

  return (Object.keys(ui) as Lang[]).map((lang) => {
    if (
      currentSlug &&
      translationSlug &&
      (route === "artikel" || route === "articles")
    ) {
      if (lang === "de") {
        const slug = currentLang === "de" ? currentSlug : translationSlug;
        return { lang, url: `${siteUrl}/artikel/${slug}/` };
      } else {
        const slug = currentLang === "en" ? currentSlug : translationSlug;
        return { lang, url: `${siteUrl}/en/articles/${slug}/` };
      }
    }

    const translatePath = useTranslatedPath(lang);
    const basePath = route ? translatePath(`/${route}/`) : translatePath("/");
    const fullPath = restOfPath ? `${basePath}${restOfPath}` : basePath;
    return {
      lang,
      url: `${siteUrl}${fullPath}`.replace(/\/$/, "") + "/",
    };
  });
}

export function isLang(url: URL, lang: Lang): boolean {
  return getLangFromUrl(url) === lang;
}
