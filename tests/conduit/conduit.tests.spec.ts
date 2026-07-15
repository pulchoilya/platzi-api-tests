import { test, expect } from './helpers/api-fixtures';


test('Get articles', async ({ articleController }) => {


  const response = await articleController.getArticles({
    offset: 0,
    limit: 10,
  });

  expect(response.status()).toBe(200);

  const json = await response.json();
  expect(json.articles.length).toBeGreaterThan(0);
});



test('Create article', async ({ articleController }) => {

  const title = `Test-${Date.now()}`;

  const response = await articleController.createArticle(
    {
      title,
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
  expect(json.article.title).toBe(title);
});

test.describe('Unauthorized', () => {
  test.use({ isAuthorized: false });

  test('Create article without authorization', async ({ articleController }) => {


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

test('Get current user', async ({ userController }) => {

  const response = await userController.getCurrentUser();

  expect(response.status()).toBe(200);

  const json = await response.json();
  expect(json.user).toBeDefined();
});

test('Create user', async ({ userController }) => {


  const response = await userController.createUser({
    email: `test-${Date.now()}@example.com`,
    password: 'qwer1234',
    username: `user${Date.now()}`,
  });

  expect(response.status()).toBe(200);
});

test('Update current user', async ({ userController }) => {


  const response = await userController.updateUser({
    bio: 'Updated bio',
  });

  expect(response.status()).toBe(200);

  const json = await response.json();
  expect(json.user.bio).toBe('Updated bio');
});

test('Work through ApiController', async ({ apiController }) => {
  const articleResponse =
    await apiController.articleController.createArticle({
      title: `Test-${Date.now()}`,
      description: 'Desc',
      body: 'Body',
      tagList: [],
    });

  expect(articleResponse.status()).toBe(200);

  const userResponse =
    await apiController.userController.getCurrentUser();

  expect(userResponse.status()).toBe(200);
});


test.describe('Negative tests', () => {
  test('Create article without title', async ({
    articleController,
  }) => {
    const response = await articleController.createArticle(
      {
        description: 'Description',
        body: 'Body',
        tagList: [],
      },
      {
        failOnStatusCode: false,
      },
    );
    expect(response.status()).toBe(500);
  });

  test('Update user with invalid email', async ({
    userController,
  }) => {
    const response = await userController.updateUser(
      {
        email: 'invalid-email',
      },
      {
        failOnStatusCode: false,
      },
    );

    expect(response.status()).toBe(422);
  });
});