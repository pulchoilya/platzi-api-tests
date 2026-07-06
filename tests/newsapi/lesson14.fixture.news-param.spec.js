import { expect } from '@playwright/test';
import { test } from './helpers/fixtures';
import { newsTestData } from './data/news.data';
import { searchNewsResponseSchema } from '../../app/json-schemas/News';

for (const { id, q, from, sortBy } of newsTestData) {
  test(`${id}. Search "${q}" news`, async ({ request }) => {
    const response = await request.get('everything', {
      params: {
        q,
        from,
        sortBy,
      },
      failOnStatusCode: true,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    searchNewsResponseSchema.parse(body);

    expect(body.status).toBe('ok');
    expect(body.totalResults).toBeGreaterThan(0);
    expect(body.articles.length).toBeGreaterThan(0);
  });
}