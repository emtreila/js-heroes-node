import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { comedians } from './comedians';
import { users } from './users';

export const favorites = pgTable(
  'favorites',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    comedianId: uuid('comedian_id')
      .notNull()
      .references(() => comedians.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.comedianId] }),
  })
);

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;

