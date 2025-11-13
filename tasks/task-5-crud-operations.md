# Task 5: CRUD Operations with Drizzle

## Learning Objectives

- Perform Create operations with Drizzle
- Perform Read operations with Drizzle
- Perform Update operations with Drizzle
- Perform Delete operations with Drizzle
- Handle database errors
- Use Drizzle query builder

## Why This Matters

Moving from hardcoded data to a database provides:

- **Persistence**: Data survives server restarts
- **Scalability**: Can handle large amounts of data
- **Relationships**: Can link data between tables (comedians ↔ performances)
- **Querying**: Can filter, sort, and paginate efficiently
- **Data Integrity**: Database enforces constraints and relationships

This is a fundamental step in building production-ready APIs.

## Overview

In this task, you'll learn how to perform all CRUD (Create, Read, Update, Delete) operations using Drizzle ORM. You'll replace the hardcoded mock data with real database queries.

**Important**: The database is **fully configured** in the starter branch. You don't need to set up the database - it's already done! You just need to replace mock data with database queries.

**Scope**: In this task, we'll work with **comedians and performances only**. Users and favorites will be added in Task 6.

## Starter Branch

This task starts with:

- All code from Task 4 completion (routers, controllers, middleware)
- **Complete database setup** (provided for you):
  - `src/db/index.ts` - database connection (already working)
  - `src/db/schema/comedians.ts` - comedian schema (already defined)
  - `src/db/schema/performances.ts` - performance schema (already defined)
  - `drizzle.config.ts` - Drizzle configuration (already set up)
  - `src/db/migrations/` - migration files (already run)
  - `src/db/init.ts` - database initialization (already configured)
  - Database connection established and working
  - Migrations already applied
  - Database seeded with sample data
- Controllers still using `mockData.ts` (hardcoded data)
- Ready to replace mock data with database queries

## Important Notes

1. **Database is Provided**: The database setup is complete - you just need to use it
2. **Returning Clause**: Use `.returning()` to get the created/updated record
3. **Error Handling**: Always wrap database operations in try-catch and use `next(error)`
4. **Type Safety**: Drizzle provides TypeScript types based on your schema
5. **Async/Await**: All database operations are async - use `async/await`
6. **Scope**: This task covers comedians and performances only - users/favorites come in Task 6
7. **Swagger Documentation**: Document all CRUD endpoints in Swagger! Include all possible status codes (200, 201, 400, 404, 500) in your annotations.

## Instructions

### Step 1: Understand the Provided Database Setup

The starter branch includes a complete database setup. Here's what's available:

- **Database Connection**: `src/db/index.ts` exports a `db` object you can import
- **Schemas**: `src/db/schema/comedians.ts` and `src/db/schema/performances.ts` define your tables
- **Database**: PostgreSQL is running in Docker (via docker-compose) and is already connected

You can import and use these:

```typescript
import { db } from '../db';
import { comedians, performances } from '../db/schema/comedians';
```

### Step 2: Replace Mock Data Imports

Update your controllers to import from the database instead of mock data:

**Before:**

```typescript
import { mockComedians } from '../data/mockData';
```

**After:**

```typescript
import { db } from '../db';
import { comedians } from '../db/schema/comedians';
```

### Step 3: Update GET Endpoints to Use `db.select()`

Replace hardcoded data with database queries:

**Before:**

```typescript
export const getAllComedians = (req: Request, res: Response) => {
  res.status(200).json({
    data: mockComedians,
    count: mockComedians.length,
  });
};
```

**After:**

```typescript
export const getAllComedians = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nationality, limit, offset } = req.query;

    let query = db.select().from(comedians);

    if (nationality) {
      query = query.where(eq(comedians.nationality, nationality as string)) as any;
    }

    if (limit) {
      query = query.limit(Number(limit)) as any;
    }

    if (offset) {
      query = query.offset(Number(offset)) as any;
    }

    const allComedians = await query;

    res.json({
      data: allComedians,
      count: allComedians.length,
    });
  } catch (error) {
    next(error);
  }
};
```

### Step 4: Update POST Endpoints to Use `db.insert()`

**Before:**

```typescript
export const createComedian = (req: Request, res: Response) => {
  const newComedian = { id: Date.now().toString(), ...req.body };
  mockComedians.push(newComedian);
  res.status(201).json({ data: newComedian });
};
```

**After:**

```typescript
export const createComedian = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, bio, birthDate, nationality } = req.body;

    const [newComedian] = await db
      .insert(comedians)
      .values({
        name,
        bio,
        birthDate,
        nationality,
      })
      .returning();

    res.status(201).json({
      message: 'Comedian created successfully',
      data: newComedian,
    });
  } catch (error) {
    next(error);
  }
};
```

### Step 5: Update PUT Endpoints to Use `db.update()`

```typescript
export const updateComedian = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, bio, birthDate, nationality } = req.body;

    // Check if comedian exists
    const [existing] = await db.select().from(comedians).where(eq(comedians.id, id)).limit(1);

    if (!existing) {
      throw new CustomError('Comedian not found', 404);
    }

    const [updated] = await db
      .update(comedians)
      .set({
        name: name || existing.name,
        bio: bio !== undefined ? bio : existing.bio,
        birthDate: birthDate || existing.birthDate,
        nationality: nationality || existing.nationality,
        updatedAt: new Date(),
      })
      .where(eq(comedians.id, id))
      .returning();

    res.json({
      message: 'Comedian updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
```

### Step 6: Update DELETE Endpoints to Use `db.delete()`

```typescript
export const deleteComedian = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if comedian exists
    const [existing] = await db.select().from(comedians).where(eq(comedians.id, id)).limit(1);

    if (!existing) {
      throw new CustomError('Comedian not found', 404);
    }

    await db.delete(comedians).where(eq(comedians.id, id));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
```

### Step 7: Remove Mock Data Files

Once all controllers are updated, you can remove:

- `src/data/mockData.ts` (no longer needed)

### Step 8: Update Performances Controller

Apply the same pattern to the performances controller - update all CRUD operations to use the database.

## Key Concepts

- **Insert**: Adding new records to the database
- **Select**: Querying records from the database
- **Update**: Modifying existing records
- **Delete**: Removing records from the database
- **Query Builder**: Drizzle's type-safe query API

## Code Examples

### Create Operation

```typescript
// Create a new comedian
const [newComedian] = await db
  .insert(comedians)
  .values({
    name: 'Dave Chappelle',
    bio: 'American comedian',
    nationality: 'US',
  })
  .returning();
```

### Read Operations

```typescript
// Get all comedians
const allComedians = await db.select().from(comedians);

// Get by ID
const [comedian] = await db.select().from(comedians).where(eq(comedians.id, id)).limit(1);

// Get with filter
const usComedians = await db.select().from(comedians).where(eq(comedians.nationality, 'US'));
```

### Update Operation

```typescript
// Update comedian
const [updated] = await db
  .update(comedians)
  .set({
    name: 'Updated Name',
    updatedAt: new Date(),
  })
  .where(eq(comedians.id, id))
  .returning();
```

### Delete Operation

```typescript
// Delete comedian
await db.delete(comedians).where(eq(comedians.id, id));
```

### With Relationships (Performances)

```typescript
// Create performance with comedian relationship
const [performance] = await db
  .insert(performances)
  .values({
    comedianId: comedian.id,
    title: 'Special Show',
    venue: 'Theater',
  })
  .returning();

// Query performances filtered by comedianId
const comedianPerformances = await db
  .select()
  .from(performances)
  .where(eq(performances.comedianId, comedianId));
```

**Note**: In this task, we focus on comedians and performances. Users and favorites (with their relationships) will be added in Task 6.

## Next Steps

After completing this task, you'll move on to Task 6: Authentication & Protected Routes, where you'll add user authentication and protect certain routes. The user schema is already provided in the starter branch.
