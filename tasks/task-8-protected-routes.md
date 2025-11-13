# Task 8: Protected Routes & Authorization

## Learning Objectives

- Protect routes with authentication middleware
- Access authenticated user information
- Handle unauthorized requests
- Apply middleware to specific routes
- Understand authorization vs authentication

## Overview

In this task, you'll learn how to protect routes so only authenticated users can access them. You'll use the authentication middleware created with Passport.js to verify JWT tokens and attach user information to requests.

## Instructions

### Step 1: Create Authentication Middleware

Create middleware that uses Passport to verify JWT tokens.

### Step 2: Apply Middleware to Routes

Protect routes by applying authentication middleware.

### Step 3: Access User Information

Access the authenticated user from `req.user` in route handlers.

### Step 4: Handle Unauthorized Requests

Return appropriate error responses for missing or invalid tokens.

### Step 5: Protect Multiple Routes

Apply authentication to router-level or individual routes.

## Key Concepts

- **Authentication**: Verifying who the user is
- **Authorization**: Determining what the user can do
- **Protected Routes**: Routes requiring authentication
- **Bearer Token**: Token sent in Authorization header
- **req.user**: Authenticated user attached to request

## Manual Testing (Gherkin Format)

### Feature: Access Protected Route

```gherkin
Scenario: Successfully access protected route with valid token
  Given I have a valid JWT token
  When I send a GET request to /api/favorites
    And I include the Authorization header with Bearer token
  Then I should receive a 200 status code
    And the response should contain user-specific data
    And the request should have access to user information

Scenario: Fail to access protected route without token
  Given I do not have a JWT token
  When I send a GET request to /api/favorites
    And I do not include the Authorization header
  Then I should receive a 401 status code
    And the response should indicate authentication is required
    And no data should be returned

Scenario: Fail to access protected route with invalid token
  Given I have an invalid or expired JWT token
  When I send a GET request to /api/favorites
    And I include the Authorization header with invalid token
  Then I should receive a 401 status code
    And the response should indicate invalid token
```

**Expected Request (Authorized):**
```bash
GET http://localhost:3000/api/favorites
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response (Success):**
```json
{
  "data": [
    {
      "id": "comedian-1",
      "name": "Favorite Comedian"
    }
  ],
  "count": 1
}
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

### Feature: User-Specific Operations

```gherkin
Scenario: Add favorite for authenticated user
  Given I am authenticated with user id "user-123"
  When I send a POST request to /api/favorites
    And the request body contains comedianId
    And I include the Authorization header
  Then the favorite should be associated with user "user-123"
    And I should receive a 201 status code

Scenario: Retrieve only user's favorites
  Given I am authenticated with user id "user-123"
    And user "user-123" has favorites
    And another user has different favorites
  When I send a GET request to /api/favorites
    And I include the Authorization header
  Then I should only receive favorites for user "user-123"
    And I should not see other users' favorites
```

**Expected Request:**
```bash
POST http://localhost:3000/api/favorites
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "comedianId": "comedian-123"
}
```

**Expected Response:**
```json
{
  "message": "Comedian added to favorites",
  "data": {
    "id": "comedian-123",
    "name": "Dave Chappelle"
  }
}
```

### Feature: Mixed Protected and Public Routes

```gherkin
Scenario: Access public route without authentication
  Given /api/comedians is a public route
  When I send a GET request to /api/comedians
    And I do not include authentication
  Then I should receive a 200 status code
    And the response should contain comedian data

Scenario: Access protected route requires authentication
  Given /api/favorites is a protected route
  When I send a GET request to /api/favorites
    And I do not include authentication
  Then I should receive a 401 status code
```

**Expected Request (Public Route):**
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

## Code Examples

### Authentication Middleware

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized - Invalid or missing token',
          statusCode: 401,
        },
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};
```

### Protecting Individual Routes

```typescript
// src/routes/favorites.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getFavorites } from '../controllers/favorite.controller';

const router = Router();

// Protect all routes in this router
router.use(authenticate);

router.get('/', getFavorites);
router.post('/', addFavorite);

export default router;
```

### Protecting Specific Routes

```typescript
// src/routes/comedians.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllComedians);
router.get('/:id', getComedianById);

// Protected routes
router.post('/', authenticate, createComedian);
router.put('/:id', authenticate, updateComedian);
router.delete('/:id', authenticate, deleteComedian);

export default router;
```

### Using User Information in Controllers

```typescript
// src/controllers/favorite.controller.ts
export const getFavorites = async (req: Request, res: Response) => {
  // req.user is available after authentication middleware
  const userId = req.user!.id;

  const userFavorites = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId));

  res.json({ data: userFavorites });
};
```

### TypeScript Declaration

```typescript
// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}
```

## Testing Examples

### Using cURL

```bash
# Get token first (from login)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Access protected route
curl http://localhost:3000/api/favorites \
  -H "Authorization: Bearer $TOKEN"

# Try without token (should fail)
curl http://localhost:3000/api/favorites
```

## Important Notes

1. **Middleware Order**: Authentication middleware must run before route handlers
2. **Token Format**: Tokens must be in format `Bearer <token>`
3. **User Object**: `req.user` is only available after authentication middleware
4. **Error Handling**: Always return 401 for authentication failures
5. **Public Routes**: Not all routes need authentication

## Next Steps

After completing this task, you'll move on to Task 9: Error Handling, where you'll learn to create centralized error handling middleware.

