import { z } from 'zod';

const createMarketSchema = z.object({
  name: z.string({
    required_error: 'Market name is required',
  }).min(2, 'Market name must be at least 2 characters').max(100),

  city: z.string({
    required_error: 'City is required',
  }).min(2, 'City name must be at least 2 characters').max(50),

  region: z.string({
    required_error: 'Region is required',
  }).min(2, 'Region name must be at least 2 characters').max(50),

  type: z.enum(['Wholesale', 'Retail', 'Local'], {
    errorMap: () => ({ message: 'Market type must be Wholesale, Retail, or Local' }),
  }),

  address: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
});

const updateMarketSchema = createMarketSchema.partial();

export const createMarket = z.object({ body: createMarketSchema });
export const updateMarket = z.object({ body: updateMarketSchema });

export default {
  createMarket,
  updateMarket,
};
