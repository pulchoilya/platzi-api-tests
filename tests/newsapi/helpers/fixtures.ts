import { test as base, request as APIRequest, APIRequestContext } from '@playwright/test';

type MyFixtures = {
  newsRequest: APIRequestContext;
};

export const test = base.extend<MyFixtures>({
  newsRequest: async ({}, use) => {
    const apiRequest = await APIRequest.newContext({
      baseURL: 'https://newsapi.org/v2/',
      extraHTTPHeaders: {
        'X-Api-Key': '18de84ca984f4442b4355a882bd37bf3',
      },
    });

    await use(apiRequest);
  },
});
