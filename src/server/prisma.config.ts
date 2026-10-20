import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// The CLI (migrate) needs a direct connection; the app uses the pooler (DATABASE_URL).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DIRECT_URL'],
  },
});
