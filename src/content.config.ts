import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: 'src/content/blog' }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        publishDate: z.coerce.date(),
        updateDate: z.coerce.date().optional(),
        tags: z.array(z.string()),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.md', base: 'src/content/projects' }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        publishDate: z.coerce.date(),
        updateDate: z.coerce.date().optional(),
        tags: z.array(z.string()),
    }),
});

export const collections = { blog, projects };
