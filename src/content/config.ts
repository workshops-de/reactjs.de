import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const categoriesSchema = z.preprocess((val) => {
  if (Array.isArray(val)) return val.join(" ");
  return val;
}, z.string().optional());

const postsCollection = defineCollection({
  loader: glob({ pattern: "de/**/index.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      author: z.string(),
      co_author: z.string().optional(),
      published_at: z.coerce.date(),
      categories: categoriesSchema,
      header_image: image().optional(),
      header_source: z.string().optional(),
      toc: z.boolean().optional().default(false),
      language: z.string().optional().default("de"),
      canonical_url: z.string().optional(),
      noindex: z.boolean().optional().default(false),
      tutorial_page_order: z.string().optional(),
      translation_slug: z.string().optional(),
    }),
});

const postsEnCollection = defineCollection({
  loader: glob({ pattern: "en/**/index.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      author: z.string(),
      co_author: z.string().optional(),
      published_at: z.coerce.date(),
      categories: categoriesSchema,
      header_image: image().optional(),
      header_source: z.string().optional(),
      toc: z.boolean().optional().default(false),
      language: z.string().optional().default("en"),
      canonical_url: z.string().optional(),
      noindex: z.boolean().optional().default(false),
      tutorial_page_order: z.string().optional(),
      translation_slug: z.string().optional(),
    }),
});

const usersCollection = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/users" }),
  schema: z.object({
    permalink: z.string().optional().nullable(),
    name: z.string(),
    gravatar_uid: z.string().optional().nullable(),
    avatar_name: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
    discord: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    team: z.boolean().optional().nullable().default(false),
    trainer: z.boolean().optional().nullable().default(false),
    intro: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
  }),
});

export const collections = {
  posts: postsCollection,
  "posts-en": postsEnCollection,
  users: usersCollection,
};
