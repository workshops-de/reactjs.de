/**
 * Remark plugin to transform [[cta:id]] shortcodes into workshop hint boxes
 */
import { visit } from 'unist-util-visit';

const CTA_TEMPLATES = {
  'training-top': {
    title: 'React Schulung',
    description: 'Du möchtest React professionell einsetzen? Unsere Schulungen machen dich fit!',
    link: '/schulungen/react-intensiv/',
    linkText: 'Zur Schulung',
  },
  'training-bottom': {
    title: 'React Schulung',
    description: 'Du möchtest React professionell einsetzen? Unsere Schulungen machen dich fit!',
    link: '/schulungen/react-intensiv/',
    linkText: 'Zur Schulung',
  },
  'react-intensiv': {
    title: 'React & TypeScript Intensiv-Schulung',
    description: 'Der beste Weg mit React zu starten! Lerne React in einer 3-tägigen Schulung.',
    link: '/schulungen/react-intensiv/',
    linkText: 'Jetzt buchen',
  },
};

export function remarkWorkshopHint() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!node.children || node.children.length !== 1) return;

      const child = node.children[0];
      if (child.type !== 'text') return;

      const match = child.value.match(/^\[\[cta:([a-z0-9-]+)\]\]$/);
      if (!match) return;

      const ctaId = match[1];
      const template = CTA_TEMPLATES[ctaId] || CTA_TEMPLATES['training-top'];

      const html = `
<div class="workshop-hint">
  <strong>${template.title}</strong>
  <p>${template.description}</p>
  <a href="${template.link}?utm_source=reactjs_de&utm_campaign=article_cta&utm_medium=portal&utm_content=${ctaId}" class="btn-gradient inline-block mt-2">${template.linkText} →</a>
</div>`;

      parent.children[index] = {
        type: 'html',
        value: html,
      };
    });
  };
}
