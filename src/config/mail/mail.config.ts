export interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export const mailConfig = (): MailConfig => {
  const host = process.env.MAIL_HOST;
  const port = process.env.MAIL_PORT;
  const user = process.env.MAIL_USER;
  const password = process.env.MAIL_PASSWORD;
  const from = process.env.MAIL_FROM;

  if (!host || !port || !user || !password || !from) {
    throw new Error('Mail config is not set in .env');
  }

  return {
    host,
    port: parseInt(port, 10),
    user,
    password,
    from,
  };
};
