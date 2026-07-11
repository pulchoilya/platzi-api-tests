import { test as base, request as APIRequest, APIRequestContext, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

async function signUp() {
  const apiRequest = await APIRequest.newContext({
    baseURL: 'https://conduit-api.learnwebdriverio.com/api/',
  });

  const user = {
  email: faker.internet.email().toLowerCase(),
  password: process.env.CONDUIT_PASSWORD,
  username: `amigo${faker.string.alpha(10).toLowerCase()}`,
};

  await apiRequest.post('users', {
    data: { user },
    failOnStatusCode: true,
  });
  console.log(user);
  return user;
}

async function login(user: any) {
  const apiRequest = await APIRequest.newContext({
    baseURL: 'https://conduit-api.learnwebdriverio.com/api/',
  });

  const response = await apiRequest.post('users/login', {
    data: {
      user: {
        email: user.email,
        password: user.password,
      },
    },
    failOnStatusCode: true,
  });

  const json = await response.json();
  const token = json.user.token;

  expect(token).toBeDefined();
  return token;
}

type MyFixtures = {
  request: APIRequestContext;
};

export const test = base.extend<MyFixtures>({
  request: async ({}, use) => {
    const user = await signUp();
    const token = await login(user);

    const apiRequest = await APIRequest.newContext({
      baseURL: 'https://conduit-api.learnwebdriverio.com/api/',
      extraHTTPHeaders: {
        Authorization: `Token ${token}`,
      },
    });

    await use(apiRequest);
  },
});