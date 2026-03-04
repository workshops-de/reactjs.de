import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";
import { remarkWorkshopHint } from "./src/plugins/remark-workshop-hint.mjs";
import { parse } from "yaml";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const SITE_URL = "https://reactjs.de";

function getValidTeamPermalinks() {
  const usersDir = "./src/content/users";
  const postsDirs = ["./src/content/posts/de"];

  const userFiles = readdirSync(usersDir).filter((f) => f.endsWith(".yaml"));
  const users = userFiles.map((file) => {
    const content = readFileSync(join(usersDir, file), "utf-8");
    return parse(content);
  });

  const authors = new Set();
  for (const postsDir of postsDirs) {
    try {
      const postFolders = readdirSync(postsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
      for (const folder of postFolders) {
        const indexPath = join(postsDir, folder, "index.md");
        try {
          const content = readFileSync(indexPath, "utf-8");
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatterMatch) {
            const frontmatter = parse(frontmatterMatch[1]);
            if (frontmatter.author) authors.add(frontmatter.author);
            if (frontmatter.co_author) authors.add(frontmatter.co_author);
          }
        } catch {}
      }
    } catch {}
  }

  const validUsers = users.filter(
    (user) => user.team === true || authors.has(user.name)
  );

  return validUsers.map(
    (user) => user.permalink || user.name.toLowerCase().replace(/\s+/g, "-")
  );
}

const validTeamPermalinks = getValidTeamPermalinks();

const codeBlockEnhancer = {
  pre(node) {
    node.properties["data-lang"] = this.options.lang || "";
  },
};

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes("/kategorie/")) return false;
        if (page.includes("/seite/")) return false;
        const teamMatch = page.match(/\/team\/([^/]+)\/?$/);
        if (teamMatch) {
          const permalink = teamMatch[1];
          return validTeamPermalinks.includes(permalink);
        }
        return true;
      },
    }),
    pagefind(),
  ],
  i18n: {
    defaultLocale: "de",
    locales: ["de"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    remarkPlugins: [remarkWorkshopHint],
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
      transformers: [codeBlockEnhancer],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  build: {
    format: "directory",
  },
  redirects: {
    "/discord/": "https://workshops.de/join-discord",
    "/sitemap.xml": "/sitemap-index.xml",
  },
});
