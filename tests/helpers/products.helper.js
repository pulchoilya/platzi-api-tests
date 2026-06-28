import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export function createProductPayload() {
  return {
    title: faker.commerce.productName(),
    price: faker.number.int({ min: 10, max: 1000 }),
    description: faker.commerce.productDescription(),
    categoryId: 1,
    images: ['https://placehold.co/600x400'],
  };
}

export async function createProduct(request) {
  
  const payload = createProductPayload();

  const response = await request.post('products/', {
    data: payload,
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(201);

  const product = await response.json();

  return { payload, product };
}

export async function deleteProduct(request, id) {
  const response = await request.delete(`products/${id}`);

  expect(response.status()).toBe(200);

  expect(await response.json()).toBe(true);
}