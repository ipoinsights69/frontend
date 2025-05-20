module.exports = {
  apps: [
    {
      name: 'ipo-hut',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '2G',
      autorestart: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:8000',
        API_BASE_URL: 'http://localhost:8000',
        REVALIDATION_SECRET: 'your-secret-key',
        NEXT_PUBLIC_BETA_MODE: 'true'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://api.ipohut.in',
        API_BASE_URL: 'https://api.ipohut.in',
        REVALIDATION_SECRET: process.env.REVALIDATION_SECRET || 'your-production-secret-key',
        NEXT_PUBLIC_BETA_MODE: 'true'
      },
      env_staging: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_API_URL: 'https://staging-api.ipohut.in',
        API_BASE_URL: 'https://staging-api.ipohut.in',
        REVALIDATION_SECRET: process.env.STAGING_REVALIDATION_SECRET || 'your-staging-secret-key',
        NEXT_PUBLIC_BETA_MODE: 'true'
      }
    }
  ]
}; 