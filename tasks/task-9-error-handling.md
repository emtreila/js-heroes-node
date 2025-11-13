# Task 9: Error Handling

## Learning Objectives

- Create centralized error handling middleware
- Handle different types of errors
- Return consistent error responses
- Log errors appropriately
- Handle async errors in Express

## Overview

In this task, you'll learn to create a centralized error handling system that catches all errors, logs them appropriately, and returns consistent error responses to clients.

## Instructions

### Step 1: Create Error Middleware

Create error handling middleware with 4 parameters (err, req, res, next).

### Step 2: Create Custom Error Class

Create a custom error class that includes status codes.

### Step 3: Handle Different Error Types

Handle validation errors, database errors, authentication errors, etc.

### Step 4: Log Errors

Implement error logging for debugging.

### Step 5: Return Consistent Error Format

Ensure all errors return the same response structure.

## Key Concepts

- **Error Middleware**: Special middleware with 4 parameters
- **Error Propagation**: Errors bubble up through middleware chain
- **Error Types**: Different errors need different handling
- **Error Logging**: Important for debugging and monitoring
- **Consistent Responses**: Same error format across all endpoints

## Manual Testing (Gherkin Format)

### Feature: Handle Application Errors

```gherkin
Scenario: Catch and handle application error
  Given an error occurs in a route handler
  When the error middleware is registered
  Then the error should be caught
    And I should receive an appropriate error response
    And the error should be logged
    And the response should have consistent error format

Scenario: Handle different error status codes
  Given different types of errors can occur
  When a 404 error occurs
  Then I should receive a 404 status code
    And when a 400 error occurs
    Then I should receive a 400 status code
    And when a 500 error occurs
    Then I should receive a 500 status code
```

**Expected Request (404 Error):**
```bash
GET http://localhost:3000/api/comedians/non-existent-id
```

**Expected Response:**
```json
{
  "error": {
    "message": "Comedian not found",
    "statusCode": 404
  }
}
```

**Expected Request (400 Error):**
```bash
POST http://localhost:3000/api/comedians
Content-Type: application/json

{
  "invalid": "data"
}
```

**Expected Response:**
```json
{
  "error": {
    "message": "Validation error",
    "statusCode": 400,
    "details": [
      {
        "path": ["name"],
        "message": "Required"
      }
    ]
  }
}
```

### Feature: Handle Database Errors

```gherkin
Scenario: Handle database connection errors
  Given the database is unavailable
  When I send a request that requires database access
  Then I should receive a 500 status code
    And the response should indicate a server error
    And the error should be logged with details

Scenario: Handle database constraint violations
  Given I try to create a duplicate record
  When I send a POST request with duplicate data
  Then I should receive a 409 status code
    And the response should indicate conflict
```

**Expected Request (Duplicate):**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "existing@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "error": {
    "message": "User with this email already exists",
    "statusCode": 409
  }
}
```

### Feature: Handle Validation Errors

```gherkin
Scenario: Return validation errors
  Given I send invalid data
  When validation fails
  Then I should receive a 400 status code
    And the response should contain validation details
    And each validation error should specify the field
```

**Expected Request:**
```bash
POST http://localhost:3000/api/comedians
Content-Type: application/json

{}
```

**Expected Response:**
```json
{
  "error": {
    "message": "Validation error",
    "statusCode": 400,
    "details": [
      {
        "path": ["name"],
        "message": "Required"
      }
    ]
  }
}
```

### Feature: Handle Unhandled Routes

```gherkin
Scenario: Handle 404 for non-existent routes
  Given I send a request to a non-existent route
  When the route is not found
  Then I should receive a 404 status code
    And the response should indicate route not found
```

**Expected Request:**
```bash
GET http://localhost:3000/api/non-existent-route
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

## Code Examples

### Custom Error Class

```typescript
// src/middleware/error.middleware.ts
export interface AppError extends Error {
  statusCode?: number;
}

export class CustomError extends Error implements AppError {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Error Middleware

```typescript
// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  console.error(`Error ${statusCode}: ${message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Return error response
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
```

### Using Errors in Controllers

```typescript
// src/controllers/comedian.controller.ts
import { CustomError } from '../middleware/error.middleware';

export const getComedianById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const [comedian] = await db
      .select()
      .from(comedians)
      .where(eq(comedians.id, id))
      .limit(1);

    if (!comedian) {
      throw new CustomError('Comedian not found', 404);
    }

    res.json({ data: comedian });
  } catch (error) {
    next(error); // Pass error to error middleware
  }
};
```

### Async Error Wrapper

```typescript
// src/utils/async-handler.ts
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
export const getComedianById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [comedian] = await db.select()...;
  
  if (!comedian) {
    throw new CustomError('Comedian not found', 404);
  }
  
  res.json({ data: comedian });
});
```

### 404 Handler

```typescript
// src/server.ts
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
});
```

## Testing Examples

### Using cURL

```bash
# Test 404 error
curl http://localhost:3000/api/non-existent

# Test validation error
curl -X POST http://localhost:3000/api/comedians \
  -H "Content-Type: application/json" \
  -d '{}'

# Test database error (with invalid data)
curl -X POST http://localhost:3000/api/comedians \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","nationality":"INVALID"}'
```

## Important Notes

1. **Error Middleware Order**: Must be registered last (after all routes)
2. **Error Propagation**: Use `next(error)` to pass errors to error middleware
3. **Async Errors**: Wrap async route handlers to catch errors
4. **Error Logging**: Log errors with context (URL, method, stack)
5. **Error Format**: Keep error response format consistent
6. **Sensitive Information**: Don't expose sensitive error details in production

## Next Steps

After completing this task, you'll move on to Task 10: Swagger Documentation, where you'll learn to document your API with Swagger/OpenAPI.

