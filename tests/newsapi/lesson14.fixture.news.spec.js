import { test } from './helpers/fixtures';
import { expect } from '@playwright/test';
import { newsTestData, invalidNewsTestData } from './data/news.data';
import { searchNewsResponseSchema, errorResponseSchema } from '../../app/json-schemas/News';

test('Search Apple news Two Days Ago', async ({ request }) => {
  const data = newsTestData[0];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
  });

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await response.json();

  expect(body.status).toBe('ok');
  expect(body.totalResults).toBeGreaterThan(0);

  expect(Array.isArray(body.articles)).toBeTruthy();
  expect(body.articles.length).toBeGreaterThan(0);

  const firstArticle = body.articles[0];

  expect(firstArticle).toHaveProperty('source');
  expect(firstArticle).toHaveProperty('author');
  expect(firstArticle).toHaveProperty('title');
  expect(firstArticle).toHaveProperty('description');
  expect(firstArticle).toHaveProperty('url');
  expect(firstArticle).toHaveProperty('publishedAt');

  expect(typeof firstArticle.title).toBe('string');
  expect(typeof firstArticle.url).toBe('string');
  expect(typeof firstArticle.source).toBe('object');
});

test('Search Apple news', async ({ request }) => {
  const data = newsTestData[1];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  searchNewsResponseSchema.parse(body);

  expect(body.totalResults).toBeGreaterThan(0);
  expect(body.articles.length).toBeGreaterThan(0);
});

test('Tesla news for yesterday', async ({ request }) => {
  const data = newsTestData[2];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  searchNewsResponseSchema.parse(body);

  expect(body.totalResults).toBeGreaterThan(0);
  expect(body.articles.length).toBeGreaterThan(0);
});

test('AI news for yesterday', async ({ request }) => {
  const data = newsTestData[3];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  searchNewsResponseSchema.parse(body);

  expect(body.totalResults).toBeGreaterThan(0);
  expect(body.articles.length).toBeGreaterThan(0);
});

test('Google news for two days ago', async ({ request }) => {
  const data = newsTestData[4];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  searchNewsResponseSchema.parse(body);

  expect(body.totalResults).toBeGreaterThan(0);
  expect(body.articles.length).toBeGreaterThan(0);
});

test('Amazon news for yesterday', async ({ request }) => {
  const data = newsTestData[5];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  searchNewsResponseSchema.parse(body);

  expect(body.totalResults).toBeGreaterThan(0);
  expect(body.articles.length).toBeGreaterThan(0);
});

test('Nvidia news for yesterday', async ({ request }) => {
  const data = newsTestData[6];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  searchNewsResponseSchema.parse(body);

  expect(body.totalResults).toBeGreaterThan(0);
  expect(body.articles.length).toBeGreaterThan(0);
});

test('Search Microsoft news', async ({ request }) => {
  const data = newsTestData[7];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  searchNewsResponseSchema.parse(body);

  expect(body.status).toBe('ok');
  expect(Array.isArray(body.articles)).toBe(true);
});

test('Bitcoin news for yesterday', async ({ request }) => {
  const data = newsTestData[8];

  const response = await request.get('everything', {
    params: {
      q: data.q,
      from: data.from,
      sortBy: data.sortBy,
    },
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  searchNewsResponseSchema.parse(body);

  expect(body.totalResults).toBeGreaterThan(0);
  expect(body.articles.length).toBeGreaterThan(0);
});

test('Missing q should return error', async ({ request }) => {
  const response = await request.get('everything', {
    params: {
      q: invalidNewsTestData.q,
      from: invalidNewsTestData.from,
      sortBy: invalidNewsTestData.sortBy,
    },
    failOnStatusCode: false,
  });

  expect(response.status()).toBe(400);

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const body = await response.json();

  errorResponseSchema.parse(body);

  expect(body.status).toBe('error');
  expect(body.code).toBeTruthy();
  expect(body.message).toBeTruthy();
});

