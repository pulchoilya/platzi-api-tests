import { z } from 'zod';

export const sourceSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
});

export const articleSchema = z.object({
  source: sourceSchema,
  author: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  urlToImage: z.string().nullable(),
  publishedAt: z.string(),
  content: z.string().nullable(),
});

export const searchNewsResponseSchema = z.object({
  status: z.literal('ok'),
  totalResults: z.number(),
  articles: z.array(articleSchema),
});

export const errorResponseSchema = z.object({
  status: z.literal('error'),
  code: z.string(),
  message: z.string(),
});
