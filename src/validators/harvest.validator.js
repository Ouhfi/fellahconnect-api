const { z } = require('zod');

const createHarvestSchema = z.object({
  productId: z.coerce.number({
    required_error: 'productId is required',
  }).int().positive(),

  landPlotId: z.coerce.number({
    required_error: 'landPlotId is required',
  }).int().positive(),

  quantity: z.coerce.number({
    required_error: 'Quantity is required',
  }).min(0.1, 'Quantity must be at least 0.1'),

  unit: z.enum(['kg', 'ton'], {
    errorMap: () => ({ message: 'Unit must be kg or ton' }),
  }).optional(),

  harvestDate: z.string({
    required_error: 'Harvest date is required',
  }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Harvest date must be in YYYY-MM-DD format'),

  status: z.enum(['planned', 'ready', 'sold'], {
    errorMap: () => ({ message: 'Status must be planned, ready, or sold' }),
  }).optional(),
});

const updateHarvestSchema = createHarvestSchema.partial();

module.exports = {
  createHarvest: z.object({ body: createHarvestSchema }),
  updateHarvest: z.object({ body: updateHarvestSchema }),
};
