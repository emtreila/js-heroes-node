# Task 4: Middleware Pipeline

## Learning Objectives

- Understand the Express middleware concept
- Learn how the request/response pipeline works
- Create custom middleware functions
- Understand middleware execution order
- Modify request and response objects

## Overview

Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the next middleware function in the application's request-response cycle. They can execute code, make changes to the request and response objects, end the request-response cycle, and call the next middleware.

## Instructions

### Step 1: Understand Middleware Signature

Learn the standard middleware function signature:

```typescript
(req: Request, res: Response, next: NextFunction) => void
```

### Step 2: Create Logging Middleware

Create a middleware that logs request details (method, URL, timestamp).

### Step 3: Create Request Modification Middleware

Create middleware that adds custom properties to the request object.

### Step 4: Understand Middleware Order

Learn that middleware executes in the order it's registered.

### Step 5: Create Error Handling Middleware

Create middleware that handles errors (has 4 parameters: err, req, res, next).

## Key Concepts

- **Middleware Chain**: Middleware executes sequentially
- **next()**: Calls the next middleware in the chain
- **Request Modification**: Middleware can add properties to `req`
- **Response Modification**: Middleware can modify headers, status, etc.
- **Error Middleware**: Special middleware with 4 parameters for error handling

## Manual Testing (Gherkin Format)

### Feature: Request Logging Middleware

```gherkin
Scenario: Log request details
  Given logging middleware is registered
  When I send a GET request to /api/comedians
  Then the request details should be logged to console
    And the request should proceed normally
    And I should receive a 200 status code

Scenario: Log different request types
  Given logging middleware is registered
  When I send a POST request to /api/comedians
  Then the log should show POST method
    And when I send a DELETE request
    Then the log should show DELETE method
```

**Expected Console Output:**
```
[2024-01-15T10:30:00.000Z] GET /api/comedians - ::1
[2024-01-15T10:30:05.000Z] POST /api/comedians - ::1
```

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians
```

**Expected Response:**
```json
{
  "data": [...],
  "count": 5
}
```

### Feature: Request Modification Middleware

```gherkin
Scenario: Add custom property to request
  Given middleware adds requestId to request object
  When I send a request to any endpoint
  Then the request object should have a requestId property
    And the requestId should be accessible in route handlers
```

**Expected Behavior:**
- Middleware adds `req.requestId = generateId()`
- Route handler can access `req.requestId`
- Response includes requestId in headers

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians
```

**Expected Response Headers:**
```
X-Request-ID: abc-123-def-456
```

### Feature: Middleware Execution Order

```gherkin
Scenario: Middleware executes in registration order
  Given middleware A logs "A"
    And middleware B logs "B"
    And middleware C logs "C"
  When I send a request
  Then the logs should appear in order: A, B, C
    And the response should be successful
```

**Expected Console Output:**
```
Middleware A executed
Middleware B executed
Middleware C executed
```

### Feature: Error Handling Middleware

```gherkin
Scenario: Catch and handle errors
  Given an error occurs in a route handler
  When the error middleware is registered
  Then the error should be caught by error middleware
    And I should receive an appropriate error response
    And the error should be logged

Scenario: Handle different error types
  Given different types of errors can occur
  When a 404 error occurs
  Then I should receive a 404 status code
    And when a 500 error occurs
    Then I should receive a 500 status code
```

**Expected Request (Non-existent route):**
```bash
GET http://localhost:3000/api/non-existent
```

**Expected Response:**
```json
{
  "error": {
    "message": "Route not found",
    "statusCode": 404
  }
}
```

**Expected Request (Server error):**
```bash
GET http://localhost:3000/api/comedians/invalid-id
```

**Expected Response:**
```json
{
  "error": {
    "message": "Internal Server Error",
    "statusCode": 500
  }
}
```

## Code Examples

### Basic Middleware

```typescript
// src/middleware/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Important: call next() to continue
};
```

### Request Modification Middleware

```typescript
// src/middleware/request-id.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.requestId = randomUUID();
  res.setHeader('X-Request-ID', req.requestId);
  next();
};
```

### Error Handling Middleware

```typescript
// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: {
      message: err.message,
      statusCode: 500,
    },
  });
};
```

### Using Middleware

```typescript
// src/server.ts
import express from 'express';
import { loggerMiddleware } from './middleware/logger.middleware';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Apply middleware globally (before routes)
app.use(loggerMiddleware);

// Routes
app.get('/api/comedians', getComedians);

// Error middleware (must be last)
app.use(errorMiddleware);
```

## Testing Examples

### Using cURL

```bash
# Test logging middleware
curl http://localhost:3000/api/comedians
# Check console for log output

# Test error middleware
curl http://localhost:3000/api/non-existent
# Should return 404 error response
```

## Important Notes

1. **Call next()**: Always call `next()` in middleware unless you're ending the request
2. **Order matters**: Middleware executes in registration order
3. **Error middleware**: Must have 4 parameters and be registered last
4. **Global vs Route-specific**: Use `app.use()` for global, `router.use()` for router-specific
5. **Async middleware**: If middleware is async, handle errors properly

## Next Steps

After completing this task, you'll move on to Task 5: Database Connection & Drizzle Setup, where you'll learn to connect to PostgreSQL and set up Drizzle ORM.

