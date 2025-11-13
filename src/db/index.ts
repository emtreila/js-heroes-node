import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as comedianSchema from './schema/comedians';
import * as favoriteSchema from './schema/favorites';
import * as performanceSchema from './schema/performances';
import * as userSchema from './schema/users';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString);
export const db = drizzle(client, {
  schema: {
    ...userSchema,
    ...comedianSchema,
    ...performanceSchema,
    ...favoriteSchema,
  },
});

// Export schemas for use in other files
export { comedians } from './schema/comedians';
export { favorites } from './schema/favorites';
export { performances } from './schema/performances';
export { users } from './schema/users';

