import { z } from 'zod';
import { databaseConfigSchema } from './database/database.config';
import { smtpConfigSchema } from './smtp/smtp.config';
import { redisConfigSchema } from './redis/redis.config';
import { jwtConfigSchema } from './jwt/jwt.config';

const baseSchema = z.object({
  APP_PORT: z.coerce.number(),
});

export const configSchema = baseSchema
  .extend(databaseConfigSchema.shape)
  .extend(smtpConfigSchema.shape)
  .extend(redisConfigSchema.shape)
  .extend(jwtConfigSchema.shape);

export type ConfigSchema = z.infer<typeof configSchema>;
