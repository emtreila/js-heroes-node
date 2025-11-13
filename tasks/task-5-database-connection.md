# Task 5: Database Connection & Drizzle Setup

## Learning Objectives

- Understand database connections
- Set up Drizzle ORM
- Create database schemas
- Generate and run migrations
- Connect Express app to PostgreSQL

## Overview

In this task, you'll learn how to connect your Express application to a PostgreSQL database using Drizzle ORM. You'll create schemas, generate migrations, and establish the database connection.

## Instructions

### Step 1: Install Dependencies

Install Drizzle ORM and PostgreSQL driver:

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Step 2: Configure Database Connection

Create a database connection file that uses environment variables.

### Step 3: Define Database Schema

Create schema files for your tables using Drizzle's schema definition.

### Step 4: Configure Drizzle Kit

Set up `drizzle.config.ts` for migrations.

### Step 5: Generate Migrations

Use Drizzle Kit to generate migration files from your schemas.

### Step 6: Run Migrations

Create a script to run migrations against your database.

## Key Concepts

- **ORM**: Object-Relational Mapping - maps database tables to code objects
- **Schema**: Definition of database table structure
- **Migration**: Scripts that modify database structure
- **Connection Pool**: Reusable database connections

## Manual Testing (Gherkin Format)

### Feature: Database Connection

```gherkin
Scenario: Successfully connect to database
  Given PostgreSQL is running
    And database credentials are configured
  When the application starts
  Then the database connection should be established
    And no connection errors should occur

Scenario: Handle connection failure
  Given PostgreSQL is not running
  When the application tries to connect
  Then a connection error should be logged
    And the application should handle the error gracefully
```

**Expected Behavior:**
- Application starts without errors
- Database connection is established
- Connection pool is created

### Feature: Schema Definition

```gherkin
Scenario: Define comedian table schema
  Given a comedian schema is defined
  When I generate migrations
  Then a migration file should be created
    And the migration should include CREATE TABLE statement for comedians

Scenario: Define table with relationships
  Given a performance schema references comedian schema
  When I generate migrations
  Then the migration should include foreign key constraints
```

**Expected Migration File:**
```sql
CREATE TABLE IF NOT EXISTS "comedians" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) NOT NULL,
  "bio" text,
  "birth_date" date,
  "nationality" varchar(100),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

### Feature: Run Migrations

```gherkin
Scenario: Successfully run migrations
  Given migration files exist
    And database is accessible
  When I run the migration command
  Then all tables should be created in the database
    And no errors should occur

Scenario: Handle migration errors
  Given a migration with invalid SQL
  When I try to run the migration
  Then an error should be returned
    And the migration should not be applied
```

**Expected Output:**
```
Running migrations...
Migration comedians_001 created
Migration performances_001 created
Migrations completed successfully
```

### Feature: Database Queries

```gherkin
Scenario: Query database using Drizzle
  Given tables exist in the database
  When I query comedians table
  Then I should receive comedian data
    And the data should match the schema structure
```

**Expected Query Result:**
```json
[
  {
    "id": "abc-123",
    "name": "Dave Chappelle",
    "bio": "American comedian...",
    "nationality": "US",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

## Code Examples

### Database Connection

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);
export const db = drizzle(client);
```

### Schema Definition

```typescript
// src/db/schema/comedians.ts
import { pgTable, uuid, varchar, text, date, timestamp } from 'drizzle-orm/pg-core';

export const comedians = pgTable('comedians', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  birthDate: date('birth_date'),
  nationality: varchar('nationality', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Drizzle Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/*.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Running Migrations

```typescript
// src/db/migrate.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function runMigrations() {
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  await client.end();
}

runMigrations();
```

## Testing Examples

### Using npm scripts

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Check database connection
# Start app and verify no connection errors
npm run dev
```

### Verify Database

```sql
-- Connect to PostgreSQL
psql -U postgres -d comedian_catalog

-- List tables
\dt

-- Describe comedians table
\d comedians

-- Check data
SELECT * FROM comedians;
```

## Important Notes

1. **Environment Variables**: Always use environment variables for database credentials
2. **Connection Pooling**: Drizzle uses connection pooling automatically
3. **Migrations**: Always generate migrations, don't modify database directly
4. **Schema Changes**: Update schema files, then regenerate migrations
5. **Type Safety**: Drizzle provides TypeScript types based on your schemas

## Next Steps

After completing this task, you'll move on to Task 6: CRUD Operations with Drizzle, where you'll learn to perform Create, Read, Update, and Delete operations using Drizzle ORM.

