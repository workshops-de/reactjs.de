/**
 * Site configuration - equivalent to Jekyll's _config.yml
 */

interface NavItem {
  href: string;
  label: string;
  pattern: string;
  external?: boolean;
  icon?: string;
}

interface CommunityLink {
  name: string;
  href: string;
}

export type I18nText = { de: string; en: string };
export type Lang = "de" | "en";

export const siteConfig = {
  title: "ReactJS.DE",
  titleShort: "React",
  titleSuffix: "JS.DE",
  description: "Deine deutsche Community zum React Framework",
  topic: "React",
  url: "https://reactjs.de",
  language: "de",

  branding: {
    heroGradientLight:
      "radial-gradient(at 20% 30%, rgba(97, 218, 251, 0.08) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(59, 130, 246, 0.1) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(97, 218, 251, 0.06) 0px, transparent 50%), radial-gradient(at 90% 70%, rgba(59, 130, 246, 0.05) 0px, transparent 50%), linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)",
    heroGradientDark:
      "radial-gradient(at 20% 30%, rgba(97, 218, 251, 0.15) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(59, 130, 246, 0.12) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(97, 218, 251, 0.1) 0px, transparent 50%)",
  },

  twitter_username: "reactjs_de",
  github_username: "workshops-de",
  linkedin_url: "https://www.linkedin.com/company/workshops.de",
  discord_invite: "https://workshops.de/join-discord",

  gtm_property: "GTM-NHL7XVK",
  utm_source: "reactjs_de",

  repository_url: "https://github.com/symetics/reactjs.de",

  og_generator_enabled: true,

  navigation: {
    banner: {
      enabled: true,
      message: {
        de: "Wir bieten Schulungen an! Von Anfänger bis Experte - inklusive Agentic AI Coding!",
        en: "We offer training courses! From beginner to expert - including Agentic AI Coding!",
      },
      href: "https://workshops.de/schulungsthemen/react?utm_source=reactjs_de&utm_campaign=generic_offer&utm_medium=portal&utm_content=banner",
    },
    items: [
      { href: "/artikel/", label: "Artikel", pattern: "/artikel" },
      {
        href: "/artikel/react-tutorial-deutsch/",
        label: "Tutorial",
        pattern: "/artikel/react-tutorial-deutsch/",
      },
      {
        href: "/schulungen/react-intensiv/",
        label: "Schulung",
        pattern: "/schulungen",
      },
    ] as NavItem[],
  },

  footer: {
    copyright: "Symetics GmbH",
    communities: [
      { name: "Angular.DE", href: "https://angular.de" },
      { name: "VueJS.DE", href: "https://vuejs.de" },
      { name: "CloudNative.EU", href: "https://cloudnative.eu" },
      { name: "Workshops.DE", href: "https://workshops.de" },
      {
        name: "AI-Automation-Engineers.de",
        href: "https://ai-automation-engineers.de",
      },
    ] as CommunityLink[],
  },

  training: {
    mainCourse: "react-intensiv",
    provider: "Workshops.DE",
    providerUrl: "https://workshops.de",
    courses: [
      {
        id: "react-modul-1",
        title: {
          de: "React: Modul 1 - Komponenten, Reaktivität & Schnittstellen",
          en: "React: Module 1 - Components, Reactivity & Interfaces",
        },
        description: {
          de: "Intensiv-Schulung für den Einstieg in React v19 und TypeScript. Komponenten, Hooks, Routing und API-Anbindung.",
          en: "Intensive training for getting started with React v19 and TypeScript. Components, Hooks, Routing and API integration.",
        },
        duration: { de: "3 Tage", en: "3 Days" },
        format: { de: "Vor Ort oder Remote", en: "On-Site or Remote" },
        icon: "/assets/img/courses/react-logo.svg",
        url: "/seminare-schulungen-kurse/react-modul-1",
        level: "beginner",
      },
      {
        id: "react-modul-2",
        title: {
          de: "React: Modul 2 - Architektur & Qualität",
          en: "React: Module 2 - Architecture & Quality",
        },
        description: {
          de: "Intensiv-Schulung für fortgeschrittene React-Entwickler:innen. Architektur, Testing, Performance und State Management.",
          en: "Intensive training for advanced React developers. Architecture, Testing, Performance and State Management.",
        },
        duration: { de: "3 Tage", en: "3 Days" },
        format: { de: "Vor Ort oder Remote", en: "On-Site or Remote" },
        icon: "/assets/img/courses/react-logo.svg",
        url: "/seminare-schulungen-kurse/react-modul-2",
        level: "advanced",
      }
    ],
  },
};

export function getLocalizedCourses(lang: Lang = "de") {
  return siteConfig.training.courses.map((course) => ({
    ...course,
    title: course.title[lang],
    description: course.description[lang],
    duration: course.duration[lang],
    format: course.format[lang],
  }));
}

export function buildUtmUrl(
  baseUrl: string,
  campaign: string,
  medium: string = "portal",
  content: string = ""
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", siteConfig.utm_source);
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_medium", medium);
  if (content) url.searchParams.set("utm_content", content);
  return url.toString();
}

export function getCommunityLinks(): CommunityLink[] {
  return siteConfig.footer.communities.map((community) => ({
    ...community,
    href: buildUtmUrl(
      community.href,
      "crossmarketing_permanent",
      "portal",
      "footer_nav"
    ),
  }));
}
