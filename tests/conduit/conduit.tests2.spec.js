import {
  expect,
  request as APIRequest,
} from '@playwright/test';
import { test } from './helpers/fixtures';
import { ArticleController } from '../../apps/conduit/controllers/ArticleController';

test('Get articles', async ({ request }) => {
  const articleController = new ArticleController(request);

  const response = await articleController.getArticles({
    offset: 0,
    limit: 10,
  });

  expect(response.status()).toBe(200);

  const json = await response.json();
  expect(json.articles.length).toBeGreaterThan(0);
});

test('Create article', async ({ request }) => {
  const articleController = new ArticleController(request);

  const response = await articleController.createArticle(
    {
      title: `Test-${Date.now()}`,
      description: 'Desc',
      body: 'Body',
      tagList: [],
    },
    {
      failOnStatusCode: true,
    },
  );

  expect(response.status()).toBe(200);

  const json = await response.json();
  expect(json.article.title).toContain('Test-');
});


test.describe('Unauthorized', () => {
  test.use({ isAuthorized: false });

  test('Create article without authorization', async ({ request }) => {
    const articleController = new ArticleController(request);

    const response = await articleController.createArticle(
      {
        title: 'Test',
        description: 'Description',
        body: 'Body',
        tagList: [],
      },
      {
        failOnStatusCode: false,
      },
    );

    expect(response.status()).toBe(401);
  });
});