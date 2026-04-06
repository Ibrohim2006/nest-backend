import z from 'zod';

export const jwtConfigSchema = z.object({
  JWT_SECRET: z.string(),
  JWT_EXPIRY: z.string(),
});
