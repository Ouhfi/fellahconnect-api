import { z } from 'zod';

const createMarketPriceSchema = z.object({
  marketId: z.coerce.number({
    required_error: 'marketId is required and must be an integer',
  }).int().positive(),

  productId: z.coerce.number({
    required_error: 'productId is required and must be an integer',
  }).int().positive(),

  quality: z.enum(['A', 'B', 'C'], {
    errorMap: () => ({ message: 'Quality must be A, B, or C' }),
  }),

  price: z.coerce.number({
    required_error: 'Price is required',
  }).positive('Price must be greater than 0'),

  priceDate: z.string({
    required_error: 'Price date is required',
  }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Price date must be in YYYY-MM-DD format'),
});

const updateMarketPriceSchema = z.object({
  price: z.coerce.number().positive('Price must be greater than 0').optional(),
  quality: z.enum(['A', 'B', 'C']).optional(),
  priceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Price date must be in YYYY-MM-DD format').optional(),
});

export const createMarketPrice = z.object({ body: createMarketPriceSchema });
export const updateMarketPrice = z.object({ body: updateMarketPriceSchema });

export default {
  createMarketPrice,
  updateMarketPrice,
};
