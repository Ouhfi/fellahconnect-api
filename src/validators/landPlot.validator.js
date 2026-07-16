import { z } from 'zod';

const createLandPlotSchema = z.object({
  farmerId: z.coerce.number().int().positive().optional(), // optional because we get it from req.user for farmers
  name: z.string({
    required_error: 'Plot name is required',
  }).min(2, 'Plot name must be at least 2 characters').max(100),

  area: z.coerce.number({
    required_error: 'Area is required',
  }).min(0.1, 'Area must be at least 0.1 hectares'),

  location: z.string({
    required_error: 'Location description is required',
  }).min(3, 'Location description must be at least 3 characters'),

  soilType: z.enum(['Clay', 'Sandy', 'Loamy', 'Rocky'], {
    errorMap: () => ({ message: 'Soil type must be Clay, Sandy, Loamy, or Rocky' }),
  }),

  isActive: z.boolean().optional(),
});

const updateLandPlotSchema = createLandPlotSchema.partial();

export const createLandPlot = z.object({ body: createLandPlotSchema });
export const updateLandPlot = z.object({ body: updateLandPlotSchema });

export default {
  createLandPlot,
  updateLandPlot,
};
