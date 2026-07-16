import { z } from 'zod';

const createSaleOfferSchema = z.object({
  harvestId: z.coerce.number({
    required_error: 'harvestId is required',
  }).int().positive(),

  marketId: z.coerce.number({
    required_error: 'marketId is required',
  }).int().positive(),

  quantity: z.coerce.number({
    required_error: 'Quantity is required',
  }).min(0.1, 'Quantity must be at least 0.1'),

  unitPrice: z.coerce.number({
    required_error: 'Unit price is required',
  }).positive('Unit price must be greater than 0'),

  offerDate: z.string({
    required_error: 'Offer date is required',
  }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Offer date must be in YYYY-MM-DD format'),

  status: z.enum(['pending', 'accepted', 'rejected', 'sold'], {
    errorMap: () => ({ message: 'Status must be pending, accepted, rejected, or sold' }),
  }).optional(),
});

const updateSaleOfferSchema = createSaleOfferSchema.partial();

export const createSaleOffer = z.object({ body: createSaleOfferSchema });
export const updateSaleOffer = z.object({ body: updateSaleOfferSchema });

export default {
  createSaleOffer,
  updateSaleOffer,
};
