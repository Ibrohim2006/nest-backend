import z from 'zod';

export const databaseConfigSchema = z.object({
  DATABASE_URL: z.url({ protocol: /postgresql/ }),
});
