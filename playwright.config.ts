import { defineConfig } from '@playwright/test';
import 'dotenv/config';


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  reporter: 'html',
  globalSetup: './global.setup.ts',

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
    // Data preparation project
    {
      name: 'conduit-setup',
      testDir: './tests/conduit/setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        baseURL: 'https://conduit-api.learnwebdriverio.com/api/',
      },
    },

    // Main project 
    {
      name: 'conduit',
      testDir: './tests/conduit',
      testIgnore: /.*\.setup\.ts/,
      dependencies: ['conduit-setup'],
      use: {
        baseURL: 'https://conduit-api.learnwebdriverio.com/api/',
      },
    },
  ],
});