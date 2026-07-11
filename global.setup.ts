import { request, expect, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[2].use.baseURL;
  const apiRequest = await request.newContext();

  const response = await apiRequest.get(`${baseURL}tags`, {
  failOnStatusCode: true,
});

  expect(response.ok()).toBeTruthy();
  console.log("globalSetup")

  await apiRequest.dispose();
} 

export default globalSetup;