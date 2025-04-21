export const ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
  };
  
  export const CORS_ORIGINS = {
    [ENVIRONMENTS.DEVELOPMENT]: 'http://localhost:5173',
    [ENVIRONMENTS.STAGING]: 'https://staging.legalexpert.com',
  };