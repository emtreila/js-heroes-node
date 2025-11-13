# Task 4: Middleware Pipeline

## Learning Objectives

- Understand the Express middleware concept
- Learn how the request/response pipeline works
- Create custom middleware functions
- Understand middleware execution order
- Implement validation middleware with Zod
- Implement centralized error handling middleware

## Overview

Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the next middleware function in the application's request-response cycle. They can execute code, make changes to the request and response objects, end the request-response cycle, and call the next middleware.

In this task, you'll create two critical middlewares:

1. **Validation Middleware** - Validates request data before it reaches controllers
2. **Error Handling Middleware** - Centralizes error handling for consistent responses

## Starter Branch

This task starts with:

- Organized routers in `routes/` directory
- Controllers in `controllers/` directory
- Routes mounted in `server.ts`
- Only built-in Express middleware (express.json, etc.)
- No custom middleware yet

## Why Middleware Matters

### Why Validation is Necessary

**Problem**: Without validation, invalid or malicious data can reach your controllers and database, causing:

- Data integrity issues
- Security vulnerabilities
- Poor error messages for clients
- Type safety problems

**Solution**: Validation middleware checks data before it reaches your controllers:

- Ensures data matches expected format
- Provides clear error messages
- Prevents invalid data from reaching the database
- Improves type safety with TypeScript

### Why Centralized Error Handling is Necessary

**Problem**: Without centralized error handling:

- Error responses are inconsistent across endpoints
- Error logging is scattered
- Hard to maintain and debug
- Duplicate error handling code

**Solution**: Centralized error middleware:

- Consistent error response format
- Centralized logging for debugging
- Easier to maintain
- Better user experience with clear error messages

## Instructions

### Step 1: Install Zod

Install Zod for schema validation:

```bash
npm install zod
```

### Step 2: Create Validation Middleware

Create `src/middleware/validate.middleware.ts`:

```typescript
import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            message: 'Validation error',
            details: error.errors,
          },
        });
      } else {
        next(error);
      }
    }
  };
};
```

**How it works**:

- Takes a Zod schema as parameter
- Returns a middleware function
- Validates `req.body` against the schema
- If valid, calls `next()` to continue
- If invalid, returns 400 with validation errors

### Step 3: Create Validation Schemas

Create Zod schemas for your request bodies. For example, in your routes file:

```typescript
import { z } from 'zod';

const createComedianSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
  birthDate: z.string().optional(),
  nationality: z.string().optional(),
});
```

### Step 4: Apply Validation to Routes

Apply validation middleware to POST and PUT routes:

```typescript
import { validate } from '../middleware/validate.middleware';

router.post('/', validate(createComedianSchema), createComedian);
router.put('/:id', validate(updateComedianSchema), updateComedian);
```

### Step 5: Create Custom Error Class

Create `src/middleware/error.middleware.ts` with a custom error class:

```typescript
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

### Step 6: Create Error Handling Middleware

Add the error handling middleware to the same file:

```typescript
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

  // Log error for debugging
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

**Important**: Error middleware must have 4 parameters: `(err, req, res, next)`

### Step 7: Register Error Middleware

Register the error middleware in `server.ts` **after all routes**:

```typescript
import { errorMiddleware } from './middleware/error.middleware';

// ... all your routes ...

// Error middleware must be last
app.use(errorMiddleware);
```

### Step 8: Update Controllers to Use CustomError

Update your controllers to throw `CustomError` and use `next(error)`:

```typescript
import { CustomError } from '../middleware/error.middleware';

export const getComedianById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const comedian = mockComedians.find((c) => c.id === id);

    if (!comedian) {
      throw new CustomError('Comedian not found', 404);
    }

    res.json({ data: comedian });
  } catch (error) {
    next(error); // Pass error to error middleware
  }
};
```

## Key Concepts

- **Middleware Chain**: Middleware executes sequentially in the order it's registered
- **next()**: Calls the next middleware in the chain
- **Validation Middleware**: Validates data before it reaches controllers
- **Error Middleware**: Special middleware with 4 parameters that catches all errors
- **CustomError**: Custom error class for consistent error handling

## Code Examples

### Complete Validation Middleware

```typescript
// src/middleware/validate.middleware.ts
import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: {
            message: 'Validation error',
            details: error.errors,
          },
        });
      } else {
        next(error);
      }
    }
  };
};
```

### Complete Error Middleware

```typescript
// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

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

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`Error ${statusCode}: ${message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
```

### Using Validation in Routes

```typescript
// src/routes/comedians.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import { createComedian } from '../controllers/comedian.controller';

const router = Router();

const createComedianSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
  nationality: z.string().optional(),
});

router.post('/', validate(createComedianSchema), createComedian);

export default router;
```

### Using CustomError in Controllers

```typescript
// src/controllers/comedian.controller.ts
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../middleware/error.middleware';

export const getComedianById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const comedian = mockComedians.find((c) => c.id === id);

    if (!comedian) {
      throw new CustomError('Comedian not found', 404);
    }

    res.json({ data: comedian });
  } catch (error) {
    next(error); // Pass to error middleware
  }
};
```

### Registering Middleware in server.ts

```typescript
// src/server.ts
import express from 'express';
import { errorMiddleware } from './middleware/error.middleware';
import comedianRoutes from './routes/comedians.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/comedians', comedianRoutes);

// Error middleware MUST be last (after all routes)
app.use(errorMiddleware);
```

## Testing Examples

### Using cURL

```bash
# Test validation (should fail)
curl -X POST http://localhost:3000/api/comedians \
  -H "Content-Type: application/json" \
  -d '{}'

# Test validation (should pass)
curl -X POST http://localhost:3000/api/comedians \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Comedian","nationality":"US"}'

# Test error handling (404)
curl http://localhost:3000/api/comedians/non-existent-id
```

## Important Notes

1. **Middleware Order**: Middleware executes in registration order - validation before routes, error handling after routes
2. **Error Middleware**: Must have 4 parameters and be registered last
3. **next()**: Always call `next()` in middleware unless you're ending the request
4. **Validation**: Apply validation to routes that accept request bodies (POST, PUT)
5. **Error Propagation**: Use `next(error)` in controllers to pass errors to error middleware
6. **CustomError**: Use for consistent error handling with status codes

## Next Steps

After completing this task, you'll move on to Task 5: CRUD Operations with Drizzle, where you'll replace hardcoded data with database queries.
