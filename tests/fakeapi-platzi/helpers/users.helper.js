import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export function userData() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.string.alphanumeric(12),
    avatar: faker.image.avatar(),
  };
}

export async function createUser(request) {
  const payload = userData();

  const response = await request.post('users/', {
    data: payload,
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(201);

  const user = await response.json();

  return { payload, user };
}
