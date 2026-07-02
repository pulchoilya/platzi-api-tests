import { defineConfig, devices } from '@playwright/test';

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
    },
  ],
});

