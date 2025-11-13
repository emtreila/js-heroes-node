# Task 6: Authentication & Protected Routes

## Learning Objectives

- Understand JWT (JSON Web Tokens)
- Set up Passport.js with JWT strategy
- Create user registration endpoint
- Create user login endpoint
- Generate and verify JWT tokens
- Hash passwords securely
- Protect routes with authentication middleware
- Access authenticated user information in controllers

## Overview

In this task, you'll implement user authentication using JWT tokens and Passport.js. After setting up authentication, you'll immediately apply it to protect the favorites resource, creating a user-specific feature.

**This task combines**:

- Part 1: Authentication setup (register, login, JWT)
- Part 2: Protected routes (applying auth to favorites)

## Starter Branch

This task starts with:

- All code from Task 6 completion (CRUD operations with database)
- Comedians and performances CRUD working with database
- **User schema already defined** (`src/db/schema/users.ts`) - provided for you
- **User table already created** (migration included) - provided for you
- **Auth controller structure** (`src/controllers/auth.controller.ts`) - function signatures provided, you implement the logic
- **Password utility file** (`src/utils/password.util.ts`) - empty file, ready for implementation
- **JWT utility file** (`src/utils/jwt.util.ts`) - empty file, ready for implementation
- **Favorites schema** (`src/db/schema/favorites.ts`) - provided for you
- No JWT strategy yet
- No protected routes yet

**What's Provided and Why**:

- **User schema**: Database schema setup is complex - we provide it so you can focus on authentication logic
- **Auth controller structure**: Function signatures are provided - you implement the business logic
- **Utility file structure**: Files exist but are empty - you implement the functions
- **Favorites schema**: Provided so you can focus on applying authentication

## Why Authentication is Necessary

**Problem**: Without authentication:

- Anyone can access or modify any user's data
- No way to identify who is making requests
- No user-specific features possible

**Solution**: JWT authentication provides:

- **User identification**: Know who is making each request
- **Secure access**: Only authenticated users can access protected resources
- **User-specific data**: Each user can have their own favorites, profile, etc.
- **Stateless**: No server-side session storage needed

## Instructions

### Part 1: Authentication Setup

#### Step 1: Install Dependencies

Install authentication-related packages:

```bash
npm install jsonwebtoken passport passport-jwt bcrypt
npm install -D @types/jsonwebtoken @types/passport-jwt @types/bcrypt
```

#### Step 2: Implement Password Utilities

Implement password hashing in `src/utils/password.util.ts`:

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
```

**Why bcrypt?**: Bcrypt is a secure password hashing algorithm that:

- One-way encryption (can't reverse the hash)
- Includes salt automatically
- Slow by design (prevents brute force attacks)

#### Step 3: Implement JWT Utilities

Implement JWT token generation in `src/utils/jwt.util.ts`:

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
```

**Why JWT?**: JWT tokens are:

- Stateless (no server-side storage)
- Self-contained (user info in the token)
- Secure (signed with secret key)
- Standard (widely used in APIs)

#### Step 4: Create Passport JWT Strategy

Create `src/strategies/jwt.strategy.ts`:

```typescript
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { db } from '../db';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

export const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});
```

**How it works**:

- Extracts JWT from `Authorization: Bearer <token>` header
- Verifies token signature
- Looks up user in database
- Attaches user to request as `req.user`

#### Step 5: Initialize Passport in server.ts

Add Passport initialization to `src/server.ts`:

```typescript
import passport from 'passport';
import { jwtStrategy } from './strategies/jwt.strategy';

passport.use(jwtStrategy);
app.use(passport.initialize());
```

#### Step 6: Implement Registration

Implement the `register` function in `src/controllers/auth.controller.ts`:

```typescript
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema/users';
import { generateToken } from '../utils/jwt.util';
import { hashPassword } from '../utils/password.util';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing) {
      res.status(409).json({
        error: { message: 'User with this email already exists', statusCode: 409 },
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};
```

#### Step 7: Implement Login

Implement the `login` function in `src/controllers/auth.controller.ts`:

```typescript
import { comparePassword } from '../utils/password.util';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      res.status(401).json({
        error: { message: 'Invalid email or password', statusCode: 401 },
      });
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        error: { message: 'Invalid email or password', statusCode: 401 },
      });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
```

#### Step 8: Create Auth Routes

Create `src/routes/auth.routes.ts`:

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { login, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Validation error
 */
router.post('/login', validate(loginSchema), login);

export default router;
```

**Important**: Document auth endpoints in Swagger so users can test registration and login directly in Swagger UI!

Mount in `server.ts`:

```typescript
import authRoutes from './routes/auth.routes';
app.use('/api/auth', authRoutes);
```

### Part 2: Protected Routes

Now that authentication is working, let's protect the favorites resource.

#### Step 9: Extend Express Request Type

Create or update `src/types/express.d.ts`:

```typescript
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
    }
    interface Request {
      user?: User;
    }
  }
}

export {};
```

#### Step 10: Create Favorites Controller

Create `src/controllers/favorite.controller.ts`:

```typescript
import { eq, and } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { favorites } from '../db/schema/favorites';
import { comedians } from '../db/schema/comedians';
import { CustomError } from '../middleware/error.middleware';

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.user is available after authentication middleware
    if (!req.user) {
      throw new CustomError('User not authenticated', 401);
    }

    const userId = req.user.id;

    // Get user's favorites with comedian details
    const userFavorites = await db
      .select({
        comedianId: favorites.comedianId,
        comedian: comedians,
      })
      .from(favorites)
      .innerJoin(comedians, eq(favorites.comedianId, comedians.id))
      .where(eq(favorites.userId, userId));

    res.json({
      data: userFavorites.map((fav) => fav.comedian),
      count: userFavorites.length,
    });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('User not authenticated', 401);
    }

    const userId = req.user.id;
    const { comedianId } = req.body;

    // Check if comedian exists
    const [comedian] = await db
      .select()
      .from(comedians)
      .where(eq(comedians.id, comedianId))
      .limit(1);

    if (!comedian) {
      throw new CustomError('Comedian not found', 404);
    }

    // Check if already favorited
    const [existing] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.comedianId, comedianId)))
      .limit(1);

    if (existing) {
      res.status(409).json({
        error: { message: 'Comedian already in favorites', statusCode: 409 },
      });
      return;
    }

    // Add to favorites
    await db.insert(favorites).values({
      userId,
      comedianId,
    });

    res.status(201).json({
      message: 'Comedian added to favorites',
      data: comedian,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('User not authenticated', 401);
    }

    const userId = req.user.id;
    const { comedianId } = req.params;

    // Check if favorite exists
    const [existing] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.comedianId, comedianId)))
      .limit(1);

    if (!existing) {
      throw new CustomError('Favorite not found', 404);
    }

    // Remove from favorites
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.comedianId, comedianId)));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
```

#### Step 11: Create Favorites Routes with Authentication

Create `src/routes/favorites.routes.ts`:

```typescript
import { Router } from 'express';
import passport from 'passport';
import { z } from 'zod';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorite.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const addFavoriteSchema = z.object({
  comedianId: z.string().uuid('Invalid comedian ID format'),
});

// Apply authentication middleware to all routes
router.use(passport.authenticate('jwt', { session: false }));

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get user's favorite comedians
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite comedians
 *       401:
 *         description: Unauthorized
 */
router.get('/', getFavorites);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add comedian to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comedianId
 *             properties:
 *               comedianId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Comedian added to favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comedian not found
 *       409:
 *         description: Already in favorites
 */
router.post('/', validate(addFavoriteSchema), addFavorite);

/**
 * @swagger
 * /api/favorites/{comedianId}:
 *   delete:
 *     summary: Remove comedian from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comedianId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Favorite removed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Favorite not found
 */
router.delete('/:comedianId', removeFavorite);

export default router;
```

**Important**:

- Add `security: [{ bearerAuth: [] }]` to all protected routes
- Document 401 responses for authentication failures
- This tells Swagger UI that these endpoints require authentication

Mount in `server.ts`:

```typescript
import favoriteRoutes from './routes/favorites.routes';
app.use('/api/favorites', favoriteRoutes);
```

**How it works**:

- `passport.authenticate('jwt', { session: false })` verifies the JWT token
- If valid, attaches user to `req.user`
- If invalid, returns 401 Unauthorized
- All routes in this router are protected

## Key Concepts

- **JWT**: Stateless authentication tokens containing user information
- **Password Hashing**: One-way encryption using bcrypt (never store plain passwords!)
- **Passport Strategy**: Authentication mechanism that verifies JWT tokens
- **Protected Routes**: Routes that require authentication
- **req.user**: Authenticated user attached to request after JWT verification

## Testing Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login (save token from response)
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

1. **Never store plain passwords**: Always hash passwords before storing
2. **JWT Secret**: Keep JWT secret secure and use environment variables
3. **Token Expiration**: Set reasonable expiration times (7 days default)
4. **Protected Routes**: Use `passport.authenticate('jwt', { session: false })` to protect routes
5. **req.user**: Available in controllers after authentication middleware
6. **User-specific data**: Always filter by `req.user.id` to ensure users only see their own data
7. **Swagger Documentation**:
   - Document auth endpoints (register, login) with request/response schemas
   - Add `security: [{ bearerAuth: [] }]` to protected routes (favorites)
   - Document 401 responses for protected routes
   - Use the `AuthRequest` and `AuthResponse` schemas (defined in Task 7)

## Next Steps

## Next Steps

Congratulations! You've completed all the core tasks. You can now explore the extra assignments or review what you've learned.
