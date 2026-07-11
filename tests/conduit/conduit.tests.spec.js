import { test } from './helpers/fixtures';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('update user', async ({ request }) => {
  const updatedUser = {
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
  };

  const response = await request.put('user', {
    data: {
      user: updatedUser,
    },
    failOnStatusCode: true,
  });

  expect(response.ok()).toBeTruthy();

  const json = await response.json();

  expect(json.user.bio).toBe(updatedUser.bio);
  expect(json.user.image).toBe(updatedUser.image);
  console.log(json)
});




test('add articles', async ({ request }) => {
  const response = await request.post('articles', {
    data: {
      article: {
        title: 'Test Art1',
        description: 'WHAT1',
        body: 'TEX2',
        tagList: [],
      },
    },
    failOnStatusCode: true,
  });

  const json = await response.json();

    expect(json.article.title).toBe('Test Art1');
    expect(json.article.description).toBe('WHAT1');
    expect(json.article.body).toBe('TEX2');
});
