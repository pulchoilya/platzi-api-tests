import { test, expect, APIResponse } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createProduct, createProductPayload, deleteProduct } from './helpers/products.helper.js';
import { tags } from './helpers/tags.js';

type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: { id: number };
  images: string[];
};

let createdProduct: Product;

test.describe('Products API tests', () => {
  test.beforeEach(async ({ request }) => {
    await test.step('Create test product', async () => {
      const { product } = await createProduct(request);
      createdProduct = product;
    });
  });

  test.afterEach(async ({ request }) => {
    await test.step('Delete created product', async () => {
      await deleteProduct(request, createdProduct.id);
    });
  });

  test(`Get a single product by id ${tags.smoke} ${tags.products}`, async ({ request }) => {
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

  test(`Get a single product by slug ${tags.smoke} ${tags.products}`, async ({ request }) => {
    await test.step('Get a single product by slug', async () => {
      const getResponse = await request.get(`products/slug/${createdProduct.slug}`);

      expect(getResponse.status()).toBe(200);

      const product = await getResponse.json();

      expect(product.slug).toBe(createdProduct.slug);
      expect(product.id).toBe(createdProduct.id);
    });
  });

  test(`Update a product ${tags.smoke} ${tags.update}`, async ({ request }) => {
    await test.step('Update a product created product', async () => {
      const newTitle = faker.commerce.productName();
      const responsePut = await request.put(`products/${createdProduct.id}`, {
        data: {
          title: newTitle,
          slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
          price: faker.number.int({ min: 100, max: 1000 }),
          description: createdProduct.description,
          categoryId: createdProduct.category.id,
          images: createdProduct.images,
        },
        failOnStatusCode: true,
      });
      expect(responsePut.status()).toBe(200);
    });
  });

  test(`Pagination returns 10 products ${tags.pagination}`, async ({ request }) => {
    await test.step('Pagination returns 10 products', async () => {
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
  });

  test(`Pagination returns different products for different offsets ${tags.pagination}`, async ({
    request,
  }) => {
    let firstPageResponse: APIResponse;
    let secondPageResponse: APIResponse;

    await test.step('Pagination returns 10 products', async () => {
      firstPageResponse = await request.get('products', {
        params: {
          offset: 0,
          limit: 10,
        },
      });
    });

    await test.step('Pagination returns next 10 products', async () => {
      secondPageResponse = await request.get('products', {
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
  });

  test(`Get products related by id ${tags.smoke} ${tags.products}`, async ({ request }) => {
    await test.step('Get products related by id', async () => {
      const relatedResponse = await request.get(`products/${createdProduct.id}/related`);

      expect(relatedResponse.status()).toBe(200);

      const relatedProducts = await relatedResponse.json();

      expect(Array.isArray(relatedProducts)).toBeTruthy();
    });
  });

  test(`Get products related by slug ${tags.smoke} ${tags.products}`, async ({ request }) => {
    await test.step('Get products related by slug', async () => {
      const relatedResponse = await request.get(`products/slug/${createdProduct.slug}/related`);

      expect(relatedResponse.status()).toBe(200);

      const relatedProducts = await relatedResponse.json();

      expect(Array.isArray(relatedProducts)).toBeTruthy();
    });
  });

  test(`Create a product ${tags.smoke} ${tags.products}`, async ({ request }) => {
    await test.step('Get products related by slug', async () => {
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
      await deleteProduct(request, product.id);
    });
  });

  test(`Delete a product ${tags.smoke} ${tags.delete}`, async ({ request }) => {
    const { product } = await createProduct(request);

    await test.step('Delete a product', async () => {
      const deleteResponse = await request.delete(`products/${product.id}`);

      expect(deleteResponse.status()).toBe(200);

      const result = await deleteResponse.json();

      expect(result).toBe(true);
    });
  });
});

test.describe('Annotations examples', () => {
  test.skip('Skip example - get products is temporarily skipped', async ({ request }) => {
    const response = await request.get('products');

    expect(response.status()).toBe(200);
  });

  test.fixme('Fixme example - known bug with users endpoint', async ({ request }) => {
    const response = await request.get('users');

    expect(response.status()).toBe(200);
  });

  test.fail('Fail example - product should return 404 for wrong id', async ({ request }) => {
    const response = await request.get('products/000000abc');

    expect(response.status()).toBe(200);
  });

  test('Slow example - get products with pagination', async ({ request }) => {
    test.slow();
    const response = await request.get('products', {
      params: {
        offset: 0,
        limit: 10,
      },
    });

    expect(response.status()).toBe(200);
  });

  // test.only('Only example - run only this product test', async ({ request }) => {
  //   const response = await request.get('products');

  //   expect(response.status()).toBe(200);
  // });
});
