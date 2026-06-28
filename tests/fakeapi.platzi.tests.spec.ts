import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {
  createProductPayload,
} from './helpers/products.helper.js';

test('Get a single product by id', async ({ request }) => {
  let createdProduct: { id: unknown; title: unknown; };

  await test.step('Create product', async () => {
    const createResponse = await request.post('products/', {
      data: createProductPayload(),
      failOnStatusCode: true,
    });

    expect(createResponse.status()).toBe(201);

    createdProduct = await createResponse.json();
  });

  await test.step('Get product by id', async () => {
    const getResponse = await request.get(`products/${createdProduct.id}`);

    expect(getResponse.status()).toBe(200);

    const product = await getResponse.json();

    expect(product.id).toBe(createdProduct.id);
    expect(product.title).toBe(createdProduct.title);
    expect(product.slug).toBeTruthy();

    const headers = getResponse.headers();

    expect(headers['content-type']).toContain('application/json');
    expect(headers['access-control-allow-origin']).toBe('*');
    expect(headers['x-content-type-options']).toBe('nosniff');
  });
});

test('Create a product', async ({ request }) => {
  const payload = createProductPayload();

  const response = await request.post('products/', {
    data: payload,
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(201);

  const product = await response.json();

  expect(product.title).toBe(payload.title);
  expect(product.price).toBe(payload.price);
  expect(product.description).toBe(payload.description);
  expect(product.images).toEqual(payload.images);
  expect(product.id).toBeTruthy();
  expect(product.slug).toBeTruthy();
});

test('Update a product', async ({ request }) => {
  const createResponse = await request.post('products/', {
    data: createProductPayload(),
    failOnStatusCode: true,
  });

  expect(createResponse.status()).toBe(201);

  const createdProduct = await createResponse.json();

  const newTitle = faker.commerce.productName();
  const responsePut = await request.put(
  `products/${createdProduct.id}`,
  {
    data: {
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      price: faker.number.int({ min: 100, max: 1000 }),
      description: createdProduct.description,
      categoryId: createdProduct.category.id,
      images: createdProduct.images,
    },
    failOnStatusCode: true,
  }
);
  expect(responsePut.status()).toBe(200);
});

test('Delete a product', async ({ request }) => {
  const createResponse = await request.post('products/', {
    data: createProductPayload(),
  });

  expect(createResponse.status()).toBe(201);

  const createdProduct = await createResponse.json();

  const deleteResponse = await request.delete(`products/${createdProduct.id}`);

  expect(deleteResponse.status()).toBe(200);

  const result = await deleteResponse.json();

  expect(result).toBe(true);
});

test('Pagination returns 10 products', async ({ request }) => {
  const response = await request.get('products', {
    params: {
      offset: 0,
      limit: 10,
    },
  });

  expect(response.status()).toBe(200);

  const products = await response.json();

  expect(Array.isArray(products)).toBeTruthy();
  expect(products).toHaveLength(10);
  expect(products[0]).toHaveProperty('id');
  expect(products[0]).toHaveProperty('title');
  expect(products[0]).toHaveProperty('price');
});

test('Pagination returns different products for different offsets', async ({ request }) => {
  const firstPageResponse = await request.get('products', {
    params: {
      offset: 0,
      limit: 10,
    },
  });

  const secondPageResponse = await request.get('products', {
    params: {
      offset: 10,
      limit: 10,
    },
  });

  expect(firstPageResponse.status()).toBe(200);
  expect(secondPageResponse.status()).toBe(200);

  const firstPage = await firstPageResponse.json();
  const secondPage = await secondPageResponse.json();

  expect(firstPage).toHaveLength(10);
  expect(secondPage).toHaveLength(10);
  expect(firstPage[0].id).not.toBe(secondPage[0].id);
});

test('Get products related by id', async ({ request }) => {
  const createResponse = await request.post('products/', {
    data: createProductPayload(),
  });

  expect(createResponse.status()).toBe(201);

  const createdProduct = await createResponse.json();

  const relatedResponse = await request.get(`products/${createdProduct.id}/related`);

  expect(relatedResponse.status()).toBe(200);

  const relatedProducts = await relatedResponse.json();

  expect(Array.isArray(relatedProducts)).toBeTruthy();
});

test('Get products related by slug', async ({ request }) => {
  const createResponse = await request.post('products/', {
    data: createProductPayload(),
  });

  expect(createResponse.status()).toBe(201);

  const createdProduct = await createResponse.json();

  const relatedResponse = await request.get(
    `products/slug/${createdProduct.slug}/related`
  );

  expect(relatedResponse.status()).toBe(200);

  const relatedProducts = await relatedResponse.json();

  expect(Array.isArray(relatedProducts)).toBeTruthy();
});

