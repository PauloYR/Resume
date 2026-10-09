import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const period = z.object({
  start: z.string(),
  end: z.string().nullable(),
});

const experience = defineCollection({
  loader: file('src/content/experience.json'),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    client: z.string().optional(),
    period,
    location: z.string(),
    summary: z.string(),
    bullets: z.array(z.string()),
    stack: z.array(z.string()),
  }),
});

const cases = defineCollection({
  loader: file('src/content/cases.json'),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    summary: z.string(),
    context: z.string(),
    action: z.string(),
    result: z.string(),
    metrics: z.array(
      z.object({
        label: z.string(),
        before: z.string().optional(),
        after: z.string(),
      }),
    ),
    stack: z.array(z.string()),
  }),
});

const clients = defineCollection({
  loader: file('src/content/clients.json'),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    via: z.string().optional(),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.json'),
  schema: z.object({
    order: z.number(),
    label: z.string(),
    items: z.array(z.string()),
  }),
});

const education = defineCollection({
  loader: file('src/content/education.json'),
  schema: z.object({
    title: z.string(),
    school: z.string(),
    years: z.string(),
  }),
});

const certifications = defineCollection({
  loader: file('src/content/certifications.json'),
  schema: z.object({
    title: z.string(),
    issuer: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const collections = {
  experience,
  cases,
  skills,
  education,
  certifications,
  clients,
};
