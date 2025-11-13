import { date, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const comedians = pgTable('comedians', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  birthDate: date('birth_date'),
  nationality: varchar('nationality', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Comedian = typeof comedians.$inferSelect;
export type NewComedian = typeof comedians.$inferInsert;

