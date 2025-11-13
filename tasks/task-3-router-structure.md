# Task 3: Router Structure & Code Organization

## Learning Objectives

- Understand Express Router
- Organize routes into separate modules
- Create modular, maintainable route structure
- Use router mounting with `app.use()`
- Separate concerns (routes, controllers, middleware)

## Overview

In this task, you'll learn how to organize your Express application by splitting routes into separate router modules. This makes your code more maintainable and scalable.

## Instructions

### Step 1: Create Express Router

Learn to use `express.Router()` to create modular route handlers.

```typescript
import { Router } from 'express';
const router = Router();
```

### Step 2: Define Routes on Router

Define routes on the router instead of directly on the app.

```typescript
router.get('/', getAllComedians);
router.get('/:id', getComedianById);
router.post('/', createComedian);
```

### Step 3: Export Router

Export the router to use in your main application file.

```typescript
export default router;
```

### Step 4: Mount Router in Main App

Mount the router in your main `server.ts` file using `app.use()`.

```typescript
import comedianRoutes from './routes/comedians.routes';
app.use('/api/comedians', comedianRoutes);
```

### Step 5: Organize Multiple Routers

Create separate router files for different resources (comedians, performances, etc.).

## Key Concepts

- **Router**: A mini-application that can have its own middleware and routes
- **Mounting**: Attaching a router to a specific path prefix
- **Modularity**: Separating routes by feature/resource
- **Separation of Concerns**: Routes define endpoints, controllers handle logic

## File Structure

```
src/
├── routes/
│   ├── comedians.routes.ts
│   ├── performances.routes.ts
│   └── auth.routes.ts
├── controllers/
│   ├── comedian.controller.ts
│   ├── performance.controller.ts
│   └── auth.controller.ts
└── server.ts
```

## Manual Testing (Gherkin Format)

### Feature: Router Organization

```gherkin
Scenario: Access comedian routes through mounted router
  Given the comedian router is mounted at /api/comedians
  When I send a GET request to /api/comedians
  Then I should receive a 200 status code
    And the response should contain a list of comedians

Scenario: Access nested route through router
  Given the comedian router is mounted at /api/comedians
  When I send a GET request to /api/comedians/abc-123
  Then I should receive a 200 status code
    And the response should contain the comedian with id "abc-123"
```

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians
```

**Expected Response:**
```json
{
  "data": [
    { "id": "1", "name": "Comedian 1" },
    { "id": "2", "name": "Comedian 2" }
  ],
  "count": 2
}
```

### Feature: Multiple Routers

```gherkin
Scenario: Access different resource through separate router
  Given the performance router is mounted at /api/performances
  When I send a GET request to /api/performances
  Then I should receive a 200 status code
    And the response should contain a list of performances

Scenario: Verify routers are independent
  Given both comedian and performance routers are mounted
  When I send a GET request to /api/comedians
  Then I should receive comedian data
    And when I send a GET request to /api/performances
    Then I should receive performance data
    And the responses should be independent
```

**Expected Request:**
```bash
GET http://localhost:3000/api/performances
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "perf-1",
      "title": "Special Show",
      "comedianId": "abc-123"
    }
  ],
  "count": 1
}
```

### Feature: Router with Middleware

```gherkin
Scenario: Apply middleware to specific router
  Given the favorites router has authentication middleware
  When I send a GET request to /api/favorites without authentication
  Then I should receive a 401 status code
    And the response should indicate authentication is required

Scenario: Access protected route with authentication
  Given I have a valid JWT token
  When I send a GET request to /api/favorites
    And I include the Authorization header with Bearer token
  Then I should receive a 200 status code
    And the response should contain favorite comedians
```

**Expected Request (Unauthorized):**
```bash
GET http://localhost:3000/api/favorites
```

**Expected Response:**
```json
{
  "error": {
    "message": "Unauthorized - Invalid or missing token",
    "statusCode": 401
  }
}
```

**Expected Request (Authorized):**
```bash
GET http://localhost:3000/api/favorites
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**
```json
{
  "data": [
    { "id": "1", "name": "Favorite Comedian 1" }
  ],
  "count": 1
}
```

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

After completing this task, you'll move on to Task 4: Middleware Pipeline, where you'll learn how middleware functions work and how to create custom middleware.

