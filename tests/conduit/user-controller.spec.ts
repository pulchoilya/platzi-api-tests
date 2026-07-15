import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LegacyUserController } from '../../apps/conduit/Controllers/LegacyUserController';

test('working with UserController', async ({ request }) => {
  const userController = new LegacyUserController(request);

  const user = {
    email: faker.internet.email().toLowerCase(),
    password: process.env.CONDUIT_PASSWORD!,
    username: `amigo${faker.string.alpha(10).toLowerCase()}`,
  };

  const registerResponse = await request.post('users', {
    data: { user },
    failOnStatusCode: true,
  });

  expect(registerResponse.ok()).toBeTruthy();

  const loginResponse = await userController.login(
    user.email,
    user.password,
  );

  const loginJson = await loginResponse.json();
  const token = loginJson.user.token;

  expect(loginResponse.ok()).toBeTruthy();
  expect(token).toBeDefined();

  const currentUserResponse =
    await userController.getCurrentUser(token);

  const currentUserJson = await currentUserResponse.json();

  expect(currentUserResponse.ok()).toBeTruthy();
  expect(currentUserJson.user.email).toBe(user.email);

  const updatedData = {
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
  };

  const updateResponse = await userController.updateUser(
    token,
    updatedData,
  );

  const updateJson = await updateResponse.json();

  expect(updateResponse.ok()).toBeTruthy();
  expect(updateJson.user.bio).toBe(updatedData.bio);
  expect(updateJson.user.image).toBe(updatedData.image);
});


test('update user without token returns 401', async ({ request }) => {
  const response = await request.put('user', {
    data: {
      user: {
        bio: 'Unauthorized update',
      },
    },
  });

  expect(response.status()).toBe(401);

  const json = await response.json();
  expect(json.errors).toBeDefined();
});