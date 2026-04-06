import z from 'zod';

export const redisConfigSchema = z.object({
  REDIS_URL: z.string().default('redis://localhost:6379'),
});
