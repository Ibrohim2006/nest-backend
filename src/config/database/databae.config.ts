export interface DatabaseConfig {
  url: string;
}

export const databaseConfig = (): DatabaseConfig => {
  const url = process.env.DATABASE_URL;
  console.log(url)
  if (!url) {
    throw new Error('DATABASE_URL is not set in .env');
  }
  return { url };
};
