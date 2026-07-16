import { z } from 'zod';

const registerSchema = z.object({
  username: z.string({
    required_error: 'Username is required',
  }).min(3, 'Username must be at least 3 characters'),
  email: z.string({
    required_error: 'Email is required',
  }).email('Invalid email address'),
  password: z.string({
    required_error: 'Password is required',
  }).min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'farmer']).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }).email('Invalid email address'),
  password: z.string({
    required_error: 'Password is required',
  }).min(1, 'Password cannot be empty'),
});

export const register = z.object({ body: registerSchema });
export const login = z.object({ body: loginSchema });

export default {
  register,
  login,
};
