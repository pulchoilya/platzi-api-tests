import { expect } from '@playwright/test';

export function expectStandardHeaders(response) {
  const headers = response.headers();
  expect.soft(headers['content-type']).toContain('application/json');
  expect.soft(headers['access-control-allow-origin']).toBe('*');
  expect.soft(headers['x-content-type-options']).toBe('nosniff');
}

export function expectValidSchema(schema, data) {
  const result = schema.safeParse(data);
  expect(result.success, {
    message: result.error?.message,
  }).toBeTruthy();
}
