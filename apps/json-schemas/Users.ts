import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  role: z.enum(['customer', 'admin']),
  avatar: z.string(),
});

// GET /users/{id}
export const getUserSchema = userSchema;

// GET /users
export const getUsersSchema = z.array(userSchema).nonempty();

// POST /users
export const createUserResponseSchema = userSchema;

export const emailAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
