# Task 7: Authentication Setup (JWT & Passport)

## Learning Objectives

- Understand JWT (JSON Web Tokens)
- Set up Passport.js with JWT strategy
- Create user registration endpoint
- Create user login endpoint
- Generate and verify JWT tokens
- Hash passwords securely

## Overview

In this task, you'll implement user authentication using JWT tokens and Passport.js. You'll learn to register users, hash passwords, and generate tokens for authenticated sessions.

## Instructions

### Step 1: Install Dependencies

Install authentication-related packages:

```bash
npm install jsonwebtoken passport passport-jwt bcrypt
npm install -D @types/jsonwebtoken @types/passport-jwt @types/bcrypt
```

### Step 2: Create Password Utilities

Create functions to hash and compare passwords using bcrypt.

### Step 3: Create JWT Utilities

Create functions to generate and verify JWT tokens using the `jsonwebtoken` library.

### Step 4: Set Up Passport JWT Strategy

Configure Passport to use JWT strategy for token verification.

### Step 5: Create Registration Endpoint

Create a POST endpoint that registers new users and hashes their passwords.

### Step 6: Create Login Endpoint

Create a POST endpoint that verifies credentials and returns a JWT token.

## Key Concepts

- **JWT**: Stateless authentication tokens containing user information
- **Password Hashing**: One-way encryption using bcrypt
- **Passport Strategy**: Authentication mechanism for Passport.js
- **Token Generation**: Creating signed tokens with user ID
- **Token Verification**: Validating token signature and expiration

## Manual Testing (Gherkin Format)

### Feature: User Registration

```gherkin
Scenario: Successfully register a new user
  Given no user exists with email "test@example.com"
  When I send a POST request to /api/auth/register
    And the request body contains email and password
  Then a new user should be created in the database
    And the password should be hashed
    And I should receive a 201 status code
    And the response should contain a JWT token
    And the response should contain user data (without password)

Scenario: Fail to register with existing email
  Given a user exists with email "test@example.com"
  When I send a POST request to /api/auth/register
    And the request body contains the same email
  Then no new user should be created
    And I should receive a 409 status code
    And the response should indicate email already exists

Scenario: Fail to register with invalid data
  Given I have invalid registration data
  When I send a POST request to /api/auth/register
    And the request body is missing required fields
  Then I should receive a 400 status code
    And the response should contain validation errors
```

**Expected Request:**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Expected Response (Success):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response (Email Exists):**
```json
{
  "error": {
    "message": "User with this email already exists",
    "statusCode": 409
  }
}
```

### Feature: User Login

```gherkin
Scenario: Successfully login with valid credentials
  Given a user exists with email "user@example.com" and password "password123"
  When I send a POST request to /api/auth/login
    And the request body contains correct email and password
  Then I should receive a 200 status code
    And the response should contain a JWT token
    And the response should contain user data

Scenario: Fail to login with incorrect password
  Given a user exists with email "user@example.com"
  When I send a POST request to /api/auth/login
    And the request body contains correct email but wrong password
  Then I should receive a 401 status code
    And the response should indicate invalid credentials
    And no token should be returned

Scenario: Fail to login with non-existent email
  Given no user exists with email "nonexistent@example.com"
  When I send a POST request to /api/auth/login
    And the request body contains the non-existent email
  Then I should receive a 401 status code
    And the response should indicate invalid credentials
```

**Expected Request:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response (Success):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response (Invalid Credentials):**
```json
{
  "error": {
    "message": "Invalid email or password",
    "statusCode": 401
  }
}
```

### Feature: JWT Token Structure

```gherkin
Scenario: Token contains user information
  Given I successfully login
  When I decode the JWT token
  Then the token payload should contain userId
    And the token should have an expiration time
    And the token should be signed with the secret key
```

**Expected Token Payload (decoded):**
```json
{
  "userId": "user-uuid",
  "iat": 1705315200,
  "exp": 1705920000
}
```

## Code Examples

### Password Utilities

```typescript
// src/utils/password.util.ts
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

### JWT Utilities

```typescript
// src/utils/jwt.util.ts
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

### Passport JWT Strategy

```typescript
// src/strategies/jwt.strategy.ts
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
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});
```

### Registration Controller

```typescript
// src/controllers/auth.controller.ts
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user exists
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return res.status(409).json({
      error: { message: 'User already exists', statusCode: 409 },
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({ email, password: hashedPassword })
    .returning();

  // Generate token
  const token = generateToken(newUser.id);

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: newUser.id, email: newUser.email },
    token,
  });
};
```

### Login Controller

```typescript
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return res.status(401).json({
      error: { message: 'Invalid email or password', statusCode: 401 },
    });
  }

  // Verify password
  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return res.status(401).json({
      error: { message: 'Invalid email or password', statusCode: 401 },
    });
  }

  // Generate token
  const token = generateToken(user.id);

  res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email },
    token,
  });
};
```

## Testing Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Important Notes

1. **Never store plain passwords**: Always hash passwords before storing
2. **JWT Secret**: Keep JWT secret secure and use environment variables
3. **Token Expiration**: Set reasonable expiration times
4. **Password Strength**: Consider adding password validation
5. **Error Messages**: Don't reveal if email exists (security best practice)

## Next Steps

After completing this task, you'll move on to Task 8: Protected Routes & Authorization, where you'll learn to protect routes using authentication middleware.

