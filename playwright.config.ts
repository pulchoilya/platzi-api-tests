import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  reporter: 'html',

  use: {
    baseURL: 'https://api.escuelajs.co/api/v1/',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'fakeapi.platzi',
      testDir: './tests/fakeapi-platzi',
      use: {
        baseURL: 'https://api.escuelajs.co/api/v1/',
      },
    },
    {
      name: 'newsapi',
      testDir: './tests/newsapi',
      use: {
        baseURL: 'https://newsapi.org/v2/',
      },
    },
    {
      name: 'conduit',
      testDir: './tests/conduit',
      use: {
        baseURL: 'https://conduit-api.learnwebdriverio.com/api/',
      },
    },
  ],
});
