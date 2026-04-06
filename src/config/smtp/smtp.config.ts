import z from 'zod';

export const smtpConfigSchema = z.object({
  SMTP_HOST: z.hostname(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_USE_TLS: z.stringbool(),
  SMTP_USE_SSL: z.stringbool(),
  SMTP_EMAIL: z.string(),
  ADMIN_EMAIL: z.string().optional(),
});
