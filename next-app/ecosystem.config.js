module.exports = {
  apps: [
    {
      name: 'ipo-hut',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:5000',
        API_BASE_URL: 'http://localhost:5000',
        REVALIDATION_SECRET: 'your-secret-key'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:5000',
        API_BASE_URL: 'http://localhost:8000',
        REVALIDATION_SECRET: 'your-secret-key'
      }
    }
  ]
}; 