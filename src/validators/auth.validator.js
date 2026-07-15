const { z } = require('zod');

const registerSchema = z.object({
  username: z.string({
    required_error: 'Username is required',
  }).min(3, 'Username must be at least 3 characters').max(50),

  email: z.string({
    required_error: 'Email is required',
  }).email('Invalid email address'),

  password: z.string({
    required_error: 'Password is required',
  }).min(6, 'Password must be at least 6 characters'),

  role: z.enum(['admin', 'farmer']).default('farmer'),

  // Optional farmer fields (validated conditionally in controller or here)
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
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

module.exports = {
  register: z.object({ body: registerSchema }),
  login: z.object({ body: loginSchema }),
};
