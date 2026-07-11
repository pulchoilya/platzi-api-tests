import { expect } from '@playwright/test';
import { test } from '../helpers/fixtures';
import { faker } from '@faker-js/faker';

const articles = [
  {
    name: 'article 1',
    description: 'desc 1',
    body: 'body 1',
    tagList: ['setup'],
  },
  {
    name: 'article 2',
    description: 'desc 2',
    body: 'body 2',
    tagList: ['setup'],
  },
  {
    name: 'article 3',
    description: 'desc 3',
    body: 'body 3',
    tagList: ['setup'],
  },
];

for (const article of articles) {
  test(`create ${article.name}`, async ({ request }) => {
    const title = `Setup ${article.name} ${faker.string.uuid()}`;

    const response = await request.post('articles', {
      data: {
        article: {
          title,
          description: article.description,
          body: article.body,
          tagList: article.tagList,
        },
      },
      failOnStatusCode: true,
    });

    expect(response.ok()).toBeTruthy();

    const json = await response.json();

    expect(json.article.title).toBe(title);
    expect(json.article.description).toBe(article.description);
    expect(json.article.body).toBe(article.body);
    expect(json.article.tagList).toEqual(article.tagList);
  });
}