const WHITELIST = [
  'angular.de',
  'vuejs.de',
  'reactjs.de',
  'workshops.de',
  'webdave.de',
  'ng-de.org',
  'conf.vuejs.de'
];

export function processExternalLinks(html: string): string {
  return html.replace(
    /<a\s+([^>]*href=["']https?:\/\/[^"']+["'][^>]*)>/gi,
    (match, attributes) => {
      const hrefMatch = attributes.match(/href=["']([^"']+)["']/);
      if (hrefMatch) {
        const href = hrefMatch[1];
        const isWhitelisted = WHITELIST.some(domain => href.includes(domain));

        if (attributes.includes('rel=')) {
          return match;
        }

        let newAttributes = attributes;
        if (!attributes.includes('target=')) {
          newAttributes += ' target="_blank"';
        }

        if (!isWhitelisted) {
          newAttributes += ' rel="noopener noreferrer"';
        }

        return `<a ${newAttributes}>`;
      }

      return match;
    }
  );
}

export function extlinks(content: string): string {
  return processExternalLinks(content);
}
