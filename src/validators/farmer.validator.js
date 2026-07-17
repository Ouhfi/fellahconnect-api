import { z } from 'zod';

const updateFarmerSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  phone: z.string().regex(/^(\+212|0)[5-7][0-9]{8}$/, 'Phone must be a valid Moroccan phone number').optional(),
  city: z.string().min(2).max(50).optional(),
  region: z.string().min(2).max(50).optional(),
});

const verifyFarmerSchema = z.object({
  verificationStatus: z.enum(['pending', 'verified', 'rejected'], {
    required_error: 'Verification status is required and must be pending, verified, or rejected',
  }),
});

export const updateFarmer = z.object({ body: updateFarmerSchema });
export const verifyFarmer = z.object({ body: verifyFarmerSchema });

export default {
  updateFarmer,
  verifyFarmer,
};
