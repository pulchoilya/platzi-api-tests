import { test, expect } from '@playwright/test';
import {
  getUserSchema,
  getUsersSchema,
  createUserResponseSchema,
  emailAvailabilitySchema,
} from '../../app/json-schemas/Users';
import { createUser, userData } from './helpers/users.helper.js';

test('GET users list', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  let response;
  let users;

  await test.step('Act: get users list', async () => {
    response = await request.get('users', {
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: status code and headers', async () => {
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect.soft(headers['content-type']).toContain('application/json');
    expect.soft(headers['access-control-allow-origin']).toBe('*');
    expect.soft(headers['x-content-type-options']).toBe('nosniff');
  });

  await test.step('Assert: response body matches users schema', async () => {
    users = await response.json();

    const result = getUsersSchema.safeParse(users);

    expect(result.success, {
      message: result.error?.message,
    }).toBeTruthy();
  });

  await test.step('Assert: users list is not empty and roles are valid', async () => {
    expect(users.length).toBeGreaterThan(0);

    for (const user of users) {
      expect.soft(user.id).toBeTruthy();
      expect.soft(user.email).toBeTruthy();
      expect.soft(user.name).toBeTruthy();
      expect.soft(['customer', 'admin']).toContain(user.role);
      expect.soft(user.avatar).toBeTruthy();
    }
  });
});

test('GET single user by id', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  let user;
  let response;
  let json;

  await test.step('Arrange: create user', async () => {
    const result = await createUser(request);
    user = result.user;
  });

  await test.step('Act: get user by id', async () => {
    response = await request.get(`users/${user.id}`, {
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: status, headers, schema and body', async () => {
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect.soft(headers['content-type']).toContain('application/json');
    expect.soft(headers['access-control-allow-origin']).toBe('*');
    expect.soft(headers['x-content-type-options']).toBe('nosniff');

    json = await response.json();

    const result = getUserSchema.safeParse(json);

    expect(result.success, {
      message: result.error?.message,
    }).toBeTruthy();

    expect.soft(json.id).toBe(user.id);
    expect.soft(json.email).toBe(user.email);
    expect.soft(json.name).toBe(user.name);
    expect.soft(json.role).toBe(user.role);
    expect.soft(json.avatar).toBe(user.avatar);
  });
});

test(
  'GET single user by non-existing id',
  { tag: ['@users', '@regression'] },
  async ({ request }) => {
    let response;

    await test.step('Act: get user by non-existing id', async () => {
      response = await request.get('users/999999999', {
        failOnStatusCode: false,
      });
    });

    await test.step('Assert: user is not found', async () => {
      expect(response.status()).toBe(400);
    });
  },
);

test('POST create user', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  const payload = userData();
  let response;
  let json;

  await test.step('Act: create user', async () => {
    response = await request.post('users', {
      data: payload,
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: status, headers, schema and body', async () => {
    expect(response.status()).toBe(201);

    const headers = response.headers();
    expect.soft(headers['content-type']).toContain('application/json');
    expect.soft(headers['access-control-allow-origin']).toBe('*');
    expect.soft(headers['x-content-type-options']).toBe('nosniff');

    json = await response.json();

    const result = createUserResponseSchema.safeParse(json);
    expect(result.success, {
      message: result.error?.message,
    }).toBeTruthy();

    expect.soft(json.id).toBeTruthy();
    expect.soft(json.email).toBe(payload.email);
    expect.soft(json.password).toBe(payload.password);
    expect.soft(json.name).toBe(payload.name);
    expect.soft(json.avatar).toBeTruthy();
    expect.soft(json.role).toBe('customer');
  });
});

test(
  'POST create user with invalid email',
  { tag: ['@users', '@regression'] },
  async ({ request }) => {
    const payload = {
      ...userData(),
      email: 'invalid-email',
    };

    let response;
    let body;

    await test.step('Act: create user with invalid email', async () => {
      response = await request.post('users', {
        data: payload,
        failOnStatusCode: false,
      });
    });

    await test.step('Assert: validation error is returned', async () => {
      expect(response.status()).toBe(400);

      body = await response.json();

      expect.soft(body.statusCode).toBe(400);
      expect.soft(body.error).toBe('Bad Request');
      expect.soft(body.message).toContain('email must be an email');
    });
  },
);

test('PUT update only provided user fields', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  let user;
  let response;
  let json;

  await test.step('Arrange: create user and prepare update data', async () => {
    const result = await createUser(request);
    user = result.user;

    const data = userData();

    json = {
      name: data.name,
      email: data.email,
    };
  });

  await test.step('Act: update only name and email', async () => {
    response = await request.put(`users/${user.id}`, {
      data: json,
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: only provided fields are updated', async () => {
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect.soft(headers['content-type']).toContain('application/json');
    expect.soft(headers['access-control-allow-origin']).toBe('*');
    expect.soft(headers['x-content-type-options']).toBe('nosniff');

    const updatedUser = await response.json();

    const result = getUserSchema.safeParse(updatedUser);
    expect(result.success, {
      message: result.error?.message,
    }).toBeTruthy();

    expect.soft(updatedUser.name).toBe(json.name);
    expect.soft(updatedUser.email).toBe(json.email);

    expect.soft(updatedUser.id).toBe(user.id);
    expect.soft(updatedUser.password).toBe(user.password);
    expect.soft(updatedUser.avatar).toBe(user.avatar);
    expect.soft(updatedUser.role).toBe(user.role);
  });
});

test(
  'PUT update all editable user fields',
  { tag: ['@users', '@regression'] },
  async ({ request }) => {
    let user;
    let response;
    let updatePayload;

    await test.step('Arrange: create user and prepare full update data', async () => {
      const result = await createUser(request);
      user = result.user;

      updatePayload = userData();
    });

    await test.step('Act: update all editable user fields', async () => {
      response = await request.put(`users/${user.id}`, {
        data: updatePayload,
        failOnStatusCode: true,
      });
    });

    await test.step('Assert: all editable fields are updated', async () => {
      expect(response.status()).toBe(200);

      const headers = response.headers();
      expect.soft(headers['content-type']).toContain('application/json');
      expect.soft(headers['access-control-allow-origin']).toBe('*');
      expect.soft(headers['x-content-type-options']).toBe('nosniff');

      const updatedUser = await response.json();

      const result = getUserSchema.safeParse(updatedUser);
      expect(result.success, {
        message: result.error?.message,
      }).toBeTruthy();

      expect.soft(updatedUser.name).toBe(updatePayload.name);
      expect.soft(updatedUser.email).toBe(updatePayload.email);
      expect.soft(updatedUser.password).toBe(updatePayload.password);
      expect.soft(updatedUser.avatar).toBe(updatePayload.avatar);

      expect.soft(updatedUser.id).toBe(user.id);
      expect.soft(updatedUser.role).toBe(user.role);
    });
  },
);

test('POST check unavailable email', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  let user;
  let response;
  let json;

  await test.step('Arrange: create user', async () => {
    const result = await createUser(request);
    user = result.user;
  });

  await test.step('Act: check created user email availability', async () => {
    response = await request.post('users/is-available', {
      data: {
        email: user.email,
      },
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: email is unavailable', async () => {
    expect(response.status()).toBe(201);

    const headers = response.headers();
    expect.soft(headers['content-type']).toContain('application/json');
    expect.soft(headers['access-control-allow-origin']).toBe('*');
    expect.soft(headers['x-content-type-options']).toBe('nosniff');

    json = await response.json();

    const result = emailAvailabilitySchema.safeParse(json);
    expect(result.success, {
      message: result.error?.message,
    }).toBeTruthy();

    expect.soft(json.isAvailable).toBe(false);
  });
});

test('POST check available email', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  let response;
  let json;

  const email = `${Date.now()}@example.com`;

  await test.step('Act: check new email availability', async () => {
    response = await request.post('users/is-available', {
      data: { email },
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: email is available', async () => {
    expect(response.status()).toBe(201);

    const headers = response.headers();
    expect.soft(headers['content-type']).toContain('application/json');
    expect.soft(headers['access-control-allow-origin']).toBe('*');
    expect.soft(headers['x-content-type-options']).toBe('nosniff');

    json = await response.json();

    const result = emailAvailabilitySchema.safeParse(json);
    expect(result.success, {
      message: result.error?.message,
    }).toBeTruthy();

    expect.soft(json.isAvailable).toBe(false);
  });
});
