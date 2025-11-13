import { date, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { comedians } from './comedians';

export const performances = pgTable('performances', {
  id: uuid('id').defaultRandom().primaryKey(),
  comedianId: uuid('comedian_id')
    .notNull()
    .references(() => comedians.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  venue: varchar('venue', { length: 255 }),
  date: date('date'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Performance = typeof performances.$inferSelect;
export type NewPerformance = typeof performances.$inferInsert;

