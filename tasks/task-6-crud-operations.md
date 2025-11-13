# Task 6: CRUD Operations with Drizzle

## Learning Objectives

- Perform Create operations with Drizzle
- Perform Read operations with Drizzle
- Perform Update operations with Drizzle
- Perform Delete operations with Drizzle
- Handle database errors
- Use Drizzle query builder

## Overview

In this task, you'll learn how to perform all CRUD (Create, Read, Update, Delete) operations using Drizzle ORM. You'll interact with the database from your Express route handlers.

## Instructions

### Step 1: Create Records

Learn to insert new records using `db.insert()`.

### Step 2: Read Records

Learn to query records using `db.select()` with various filters.

### Step 3: Update Records

Learn to update existing records using `db.update()`.

### Step 4: Delete Records

Learn to delete records using `db.delete()`.

### Step 5: Handle Relationships

Learn to work with foreign keys and relationships.

## Key Concepts

- **Insert**: Adding new records to the database
- **Select**: Querying records from the database
- **Update**: Modifying existing records
- **Delete**: Removing records from the database
- **Query Builder**: Drizzle's type-safe query API

## Manual Testing (Gherkin Format)

### Feature: Create Operations

```gherkin
Scenario: Create a new comedian
  Given the database is accessible
  When I send a POST request to /api/comedians
    And the request body contains valid comedian data
  Then a new comedian should be created in the database
    And I should receive a 201 status code
    And the response should contain the created comedian with an ID

Scenario: Fail to create with invalid data
  Given the database is accessible
  When I send a POST request to /api/comedians
    And the request body is missing required fields
  Then no comedian should be created
    And I should receive a 400 status code
    And the response should contain validation errors
```

**Expected Request:**
```bash
POST http://localhost:3000/api/comedians
Content-Type: application/json

{
  "name": "New Comedian",
  "bio": "A funny person",
  "nationality": "US"
}
```

**Expected Response (Success):**
```json
{
  "message": "Comedian created successfully",
  "data": {
    "id": "generated-uuid",
    "name": "New Comedian",
    "bio": "A funny person",
    "nationality": "US",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Expected Response (Error):**
```json
{
  "error": {
    "message": "Validation error",
    "details": [
      {
        "path": ["name"],
        "message": "Required"
      }
    ]
  }
}
```

### Feature: Read Operations

```gherkin
Scenario: Retrieve all comedians
  Given there are comedians in the database
  When I send a GET request to /api/comedians
  Then I should receive a 200 status code
    And the response should contain an array of comedians
    And each comedian should have all required fields

Scenario: Retrieve comedian by ID
  Given a comedian exists with id "abc-123"
  When I send a GET request to /api/comedians/abc-123
  Then I should receive a 200 status code
    And the response should contain the comedian with id "abc-123"

Scenario: Retrieve non-existent comedian
  Given no comedian exists with id "non-existent"
  When I send a GET request to /api/comedians/non-existent
  Then I should receive a 404 status code
    And the response should contain an error message
```

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "abc-123",
      "name": "Dave Chappelle",
      "nationality": "US"
    },
    {
      "id": "def-456",
      "name": "Bo Burnham",
      "nationality": "US"
    }
  ],
  "count": 2
}
```

**Expected Request (by ID):**
```bash
GET http://localhost:3000/api/comedians/abc-123
```

**Expected Response:**
```json
{
  "data": {
    "id": "abc-123",
    "name": "Dave Chappelle",
    "bio": "American comedian...",
    "nationality": "US"
  }
}
```

### Feature: Update Operations

```gherkin
Scenario: Update existing comedian
  Given a comedian exists with id "abc-123"
  When I send a PUT request to /api/comedians/abc-123
    And the request body contains updated data
  Then the comedian should be updated in the database
    And I should receive a 200 status code
    And the response should contain the updated comedian

Scenario: Update non-existent comedian
  Given no comedian exists with id "non-existent"
  When I send a PUT request to /api/comedians/non-existent
  Then I should receive a 404 status code
    And no changes should be made to the database
```

**Expected Request:**
```bash
PUT http://localhost:3000/api/comedians/abc-123
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "Updated bio"
}
```

**Expected Response:**
```json
{
  "message": "Comedian updated successfully",
  "data": {
    "id": "abc-123",
    "name": "Updated Name",
    "bio": "Updated bio",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### Feature: Delete Operations

```gherkin
Scenario: Delete existing comedian
  Given a comedian exists with id "abc-123"
  When I send a DELETE request to /api/comedians/abc-123
  Then the comedian should be removed from the database
    And I should receive a 204 status code
    And the response body should be empty

Scenario: Delete non-existent comedian
  Given no comedian exists with id "non-existent"
  When I send a DELETE request to /api/comedians/non-existent
  Then I should receive a 404 status code
    And no changes should be made to the database
```

**Expected Request:**
```bash
DELETE http://localhost:3000/api/comedians/abc-123
```

**Expected Response:**
- Status: 204 No Content
- Body: (empty)

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
const [comedian] = await db
  .select()
  .from(comedians)
  .where(eq(comedians.id, id))
  .limit(1);

// Get with filter
const usComedians = await db
  .select()
  .from(comedians)
  .where(eq(comedians.nationality, 'US'));
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

### With Relationships

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

// Query with join
const performancesWithComedian = await db
  .select()
  .from(performances)
  .innerJoin(comedians, eq(performances.comedianId, comedians.id));
```

## Testing Examples

### Using cURL

```bash
# Create
curl -X POST http://localhost:3000/api/comedians \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Comedian","nationality":"US"}'

# Read all
curl http://localhost:3000/api/comedians

# Read by ID
curl http://localhost:3000/api/comedians/abc-123

# Update
curl -X PUT http://localhost:3000/api/comedians/abc-123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Delete
curl -X DELETE http://localhost:3000/api/comedians/abc-123
```

## Important Notes

1. **Returning Clause**: Use `.returning()` to get the created/updated record
2. **Error Handling**: Always wrap database operations in try-catch
3. **Type Safety**: Drizzle provides TypeScript types based on your schema
4. **Transactions**: Use transactions for multiple related operations
5. **Validation**: Validate data before database operations

## Next Steps

After completing this task, you'll move on to Task 7: Authentication Setup, where you'll learn to implement JWT authentication with Passport.js.

