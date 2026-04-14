export interface JwtConfig {
  accessSecret: string;
  accessExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export const jwtConfig = (): JwtConfig => {
  const accessSecret = process.env.APP_JWT_ACCESS_SECRET;
  const accessExpiresIn = process.env.APP_JWT_ACCESS_EXPIRES_IN;
  const refreshSecret = process.env.APP_JWT_REFRESH_SECRET;
  const refreshExpiresIn = process.env.APP_JWT_REFRESH_EXPIRES_IN;

  if (!accessSecret || !accessExpiresIn || !refreshSecret || !refreshExpiresIn) {
    throw new Error('JWT config is not set in .env');
  }

  return {
    accessSecret,
    accessExpiresIn,
    refreshSecret,
    refreshExpiresIn,
  };
};