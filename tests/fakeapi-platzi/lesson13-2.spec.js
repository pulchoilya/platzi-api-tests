import { test, expect } from '@playwright/test';
import {
  getUserSchema,
  getUsersSchema,
  createUserResponseSchema,
  emailAvailabilitySchema,
} from '../../apps/json-schemas/Users';
import { createUser, userData } from './helpers/users.helper.js';
import { expectStandardHeaders, expectValidSchema } from './helpers/assertions.helper.js';

test('GET users list', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  const response = await test.step('Act: get users list', async () => {
    return await request.get('users', {
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: status code and headers', async () => {
    expect(response.status()).toBe(200);
    expectStandardHeaders(response);
  });

  const users = await test.step('Assert: response body matches users schema', async () => {
    const users = await response.json();
    expectValidSchema(getUsersSchema, users);
    return users;
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
  const { user } = await test.step('Arrange: create user', async () => {
    return await createUser(request);
  });

  const response = await test.step('Act: get user by id', async () => {
    return await request.get(`users/${user.id}`, {
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: status, headers, schema and body', async () => {
    expect(response.status()).toBe(200);
    expectStandardHeaders(response);

    const json = await response.json();
    expectValidSchema(getUserSchema, json);

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
    const response = await test.step('Act: get user by non-existing id', async () => {
      return await request.get('users/999999999', {
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

  const response = await test.step('Act: create user', async () => {
    return await request.post('users', {
      data: payload,
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: status, headers, schema and body', async () => {
    expect(response.status()).toBe(201);
    expectStandardHeaders(response);

    const json = await response.json();
    expectValidSchema(createUserResponseSchema, json);

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

    const response = await test.step('Act: create user with invalid email', async () => {
      return await request.post('users', {
        data: payload,
        failOnStatusCode: false,
      });
    });

    await test.step('Assert: validation error is returned', async () => {
      expect(response.status()).toBe(400);

      const body = await response.json();

      expect.soft(body.statusCode).toBe(400);
      expect.soft(body.error).toBe('Bad Request');
      expect.soft(body.message).toContain('email must be an email');
    });
  },
);

test('PUT update only provided user fields', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  const { user, json } =
    await test.step('Arrange: create user and prepare update data', async () => {
      const result = await createUser(request);
      const data = userData();

      return {
        user: result.user,
        json: {
          name: data.name,
          email: data.email,
        },
      };
    });

  const response = await test.step('Act: update only name and email', async () => {
    return await request.put(`users/${user.id}`, {
      data: json,
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: only provided fields are updated', async () => {
    expect(response.status()).toBe(200);
    expectStandardHeaders(response);

    const updatedUser = await response.json();
    expectValidSchema(getUserSchema, updatedUser);

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
    const { user, updatePayload } =
      await test.step('Arrange: create user and prepare full update data', async () => {
        const result = await createUser(request);

        return {
          user: result.user,
          updatePayload: userData(),
        };
      });

    const response = await test.step('Act: update all editable user fields', async () => {
      return await request.put(`users/${user.id}`, {
        data: updatePayload,
        failOnStatusCode: true,
      });
    });

    await test.step('Assert: all editable fields are updated', async () => {
      expect(response.status()).toBe(200);
      expectStandardHeaders(response);

      const updatedUser = await response.json();
      expectValidSchema(getUserSchema, updatedUser);

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
  const { user } = await test.step('Arrange: create user', async () => {
    return await createUser(request);
  });

  const response = await test.step('Act: check created user email availability', async () => {
    return await request.post('users/is-available', {
      data: {
        email: user.email,
      },
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: email is unavailable', async () => {
    expect(response.status()).toBe(201);
    expectStandardHeaders(response);

    const json = await response.json();
    expectValidSchema(emailAvailabilitySchema, json);

    expect.soft(json.isAvailable).toBe(false);
  });
});

test('POST check available email', { tag: ['@users', '@smoke'] }, async ({ request }) => {
  const email = `${Date.now()}@example.com`;

  const response = await test.step('Act: check new email availability', async () => {
    return await request.post('users/is-available', {
      data: { email },
      failOnStatusCode: true,
    });
  });

  await test.step('Assert: email is available', async () => {
    expect(response.status()).toBe(201);
    expectStandardHeaders(response);

    const json = await response.json();
    expectValidSchema(emailAvailabilitySchema, json);

    expect.soft(json.isAvailable).toBe(false);
  });
});
