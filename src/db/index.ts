import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as comedianSchema from './schema/comedians';
import * as performanceSchema from './schema/performances';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString);
export const db = drizzle(client, {
  schema: {
    ...comedianSchema,
    ...performanceSchema,
  },
});

// Export schemas for use in other files
export { comedians } from './schema/comedians';
export { performances } from './schema/performances';
