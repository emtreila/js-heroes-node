# Task 3: Router Structure & Code Organization

## Learning Objectives

- Understand Express Router
- Organize routes into separate modules
- Create modular, maintainable route structure
- Use router mounting with `app.use()`
- Separate concerns (routes, controllers, middleware)

## Why This Matters

Organizing code into routers and controllers provides several benefits:

- **Separation of Concerns**: Routes define endpoints, controllers handle business logic
- **Maintainability**: Easier to find and modify code when it's organized by feature
- **Scalability**: Adding new resources is as simple as creating new router/controller files
- **Testability**: Controllers can be tested independently
- **Reusability**: Controller functions can be reused across different routes

This structure is standard in Express applications and makes code much easier to work with as your API grows.

## Overview

In this task, you'll learn how to organize your Express application by splitting routes into separate router modules and extracting route handlers into controller functions. This makes your code more maintainable and scalable.

**Important**: In this task, you'll create both the `controllers/` directory and the `routes/` directory. Controllers are created here (not in earlier tasks).

## Starter Branch

This task starts with:

- All routes defined directly in `server.ts`
- Route handlers as inline functions or basic handlers
- No `controllers/` directory yet
- No `routes/` directory yet
- Dynamic routes and query parameters working from Task 2

## Instructions

### Step 1: Extract Route Handlers into Controllers

**This is where controllers are created!** Extract your route handler functions into separate controller files.

1. Create the `src/controllers/` directory
2. Create `src/controllers/comedian.controller.ts`
3. Move your route handler logic into controller functions:

```typescript
// src/controllers/comedian.controller.ts
import { Request, Response } from 'express';
import { mockComedians } from '../data/mockData';

export const getAllComedians = (req: Request, res: Response) => {
  res.status(200).json({
    data: mockComedians,
    count: mockComedians.length,
  });
};

export const getComedianById = (req: Request, res: Response) => {
  const { id } = req.params;
  const comedian = mockComedians.find((c) => c.id === id);

  if (!comedian) {
    return res.status(404).json({
      error: { message: 'Comedian not found', statusCode: 404 },
    });
  }

  res.json({ data: comedian });
};

// Add other controller functions...
```

### Step 2: Create Express Router

Create router modules using `express.Router()`.

1. Create the `src/routes/` directory
2. Create `src/routes/comedians.routes.ts`
3. Import your controller functions and define routes:

```typescript
import { Router } from 'express';
import {
  getAllComedians,
  getComedianById,
  createComedian,
} from '../controllers/comedian.controller';

const router = Router();

/**
 * @swagger
 * /api/comedians:
 *   get:
 *     summary: Get all comedians
 *     tags: [Comedians]
 *     responses:
 *       200:
 *         description: List of comedians
 */
router.get('/', getAllComedians);

/**
 * @swagger
 * /api/comedians/{id}:
 *   get:
 *     summary: Get comedian by ID
 *     tags: [Comedians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comedian details
 *       404:
 *         description: Not found
 */
router.get('/:id', getComedianById);

/**
 * @swagger
 * /api/comedians:
 *   post:
 *     summary: Create a new comedian
 *     tags: [Comedians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comedian created
 */
router.post('/', createComedian);

export default router;
```

**Important**: When moving routes to separate files, **keep the Swagger annotations**! They should be in the route files, not in controllers. Swagger reads from route files.

### Step 3: Mount Routers in Main App

Mount the routers in your main `server.ts` file using `app.use()`.

```typescript
import comedianRoutes from './routes/comedians.routes';
import performanceRoutes from './routes/performances.routes';

app.use('/api/comedians', comedianRoutes);
app.use('/api/performances', performanceRoutes);
```

### Step 4: Organize Multiple Routers

Create separate router files for different resources (comedians, performances, etc.).

## Key Concepts

- **Router**: A mini-application that can have its own middleware and routes
- **Mounting**: Attaching a router to a specific path prefix
- **Modularity**: Separating routes by feature/resource
- **Separation of Concerns**: Routes define endpoints, controllers handle logic

## File Structure

**Before this task**: All routes in `server.ts`

**After this task**:

```
src/
├── routes/
│   ├── comedians.routes.ts      ← Created in this task
│   └── performances.routes.ts   ← Created in this task
├── controllers/
│   ├── comedian.controller.ts   ← Created in this task
│   └── performance.controller.ts ← Created in this task
└── server.ts                     ← Updated to mount routers
```

**Key Point**: Both `routes/` and `controllers/` directories are created in this task.

## Code Examples

### Creating a Router

```typescript
// src/routes/comedians.routes.ts
import { Router } from 'express';
import {
  getAllComedians,
  getComedianById,
  createComedian,
} from '../controllers/comedian.controller';

const router = Router();

router.get('/', getAllComedians);
router.get('/:id', getComedianById);
router.post('/', createComedian);

export default router;
```

### Mounting Routers

```typescript
// src/server.ts
import express from 'express';
import comedianRoutes from './routes/comedians.routes';
import performanceRoutes from './routes/performances.routes';

const app = express();

app.use('/api/comedians', comedianRoutes);
app.use('/api/performances', performanceRoutes);

app.listen(3000);
```

### Router with Middleware

```typescript
// src/routes/favorites.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getFavorites } from '../controllers/favorite.controller';

const router = Router();

// Apply middleware to all routes in this router
router.use(authenticate);

router.get('/', getFavorites);

export default router;
```

## Testing Examples

### Using cURL

```bash
# Test comedian router
curl http://localhost:3000/api/comedians
curl http://localhost:3000/api/comedians/abc-123

# Test performance router
curl http://localhost:3000/api/performances
curl http://localhost:3000/api/performances/perf-1

# Test protected router (should fail without auth)
curl http://localhost:3000/api/favorites
```

## Best Practices

1. **One router per resource**: Create separate router files for each main resource
2. **Consistent naming**: Use `*.routes.ts` for route files, `*.controller.ts` for controllers
3. **Mount at logical paths**: Use RESTful conventions (`/api/resource-name`)
4. **Router-specific middleware**: Apply middleware at router level when all routes need it
5. **Export default**: Use default exports for routers for cleaner imports

## Next Steps

After completing this task, you'll move on to Task 4: Middleware Pipeline, where you'll learn how middleware functions work and how to create custom middleware for validation and error handling.
