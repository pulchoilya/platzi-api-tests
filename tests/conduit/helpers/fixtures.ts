import {
  test as base,
  request as APIRequest,
  APIRequestContext,
} from '@playwright/test';
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

  await apiRequest.dispose();

  return user;
}

async function login(user: {
  email: string;
  password: string;
  username: string;
}) {
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

  await apiRequest.dispose();

  return json.user.token;
}

type MyFixtures = {
  request: APIRequestContext;
  isAuthorized: boolean;
};

export const test = base.extend<MyFixtures>({
  isAuthorized: [true, { option: true }],

  request: async ({ isAuthorized }, use) => {
    let token: string | undefined;

    if (isAuthorized) {
      const user = await signUp();
      token = await login(user);
    }

    const apiRequest = await APIRequest.newContext({
      baseURL: 'https://conduit-api.learnwebdriverio.com/api/',
      extraHTTPHeaders: token
        ? {
            Authorization: `Token ${token}`,
          }
        : {},
    });

    await use(apiRequest);

    await apiRequest.dispose();
  },
});

export { expect } from '@playwright/test';