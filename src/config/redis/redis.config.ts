export interface RedisConfig {
  url: string;
}

export const redisConfig = (): RedisConfig => {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL is not set in .env');
  }
  return { url };
};
