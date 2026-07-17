import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string({
    required_error: 'Product name is required',
  }).min(2, 'Product name must be at least 2 characters').max(100),

  category: z.string({
    required_error: 'Product category is required',
  }).min(2, 'Category must be at least 2 characters').max(50),

  unit: z.string({
    required_error: 'Measurement unit is required',
  }).min(1, 'Unit cannot be empty').max(20),

  seasonStart: z.coerce.number().int().min(1).max(12).optional(),
  seasonEnd: z.coerce.number().int().min(1).max(12).optional(),
  description: z.string().max(500).optional(),
});

const updateProductSchema = createProductSchema.partial();

export const createProduct = z.object({ body: createProductSchema });
export const updateProduct = z.object({ body: updateProductSchema });

export default {
  createProduct,
  updateProduct,
};
