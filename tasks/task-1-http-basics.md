# Task 1: HTTP Basics

## Introduction: What We're Building

Welcome to the **Comedian Catalog API** workshop! Throughout these tasks, you'll build a RESTful API for managing a comedian catalog. This API will allow users to:

- Browse comedians and their performances
- Register and authenticate
- Save favorite comedians

**Main Entities**:

- **Comedians**: Comedians with name, bio, birth date, and nationality
- **Performances**: Comedy performances/shows linked to comedians
- **Users**: User accounts for authentication (introduced in Task 7)
- **Favorites**: User's favorite comedians (introduced in Task 7)

In this first task, we'll start with the basics: creating endpoints for comedians using hardcoded data. Later tasks will add a database, authentication, and more features.

## Learning Objectives

- Understand HTTP verbs (GET, POST, PUT, DELETE)
- Learn about HTTP status codes
- Work with request headers
- Handle request payloads (JSON bodies)
- Set appropriate response headers
- Document endpoints with Swagger annotations
- Test endpoints using Swagger UI

## Why This Matters

Understanding HTTP basics is fundamental to building APIs:

- **HTTP verbs** define what action you want to perform (GET = read, POST = create)
- **Status codes** communicate the result to clients (200 = success, 404 = not found)
- **Request/response cycle** is the foundation of all web APIs

These concepts apply to every API you'll ever build, regardless of the framework or language.

## Overview

In this task, you'll create basic endpoints that demonstrate HTTP fundamentals. You'll learn how Express handles different HTTP methods and how to properly respond to requests.

**Note**: We'll use hardcoded data (provided in the starter branch) for now. This temporary data will be replaced with a database in later tasks.

## Starter Branch

This task starts with:

- Basic Express app setup in `src/server.ts`
- `docker-compose.yml` and `Dockerfile` (the app runs in Docker)
- `src/data/mockData.ts` with sample comedians and performances data
- **Swagger UI already configured** - available at `http://localhost:3000/api-docs`
- Health check endpoint with Swagger documentation (as an example)
- No other routes yet - you'll create them in this task

**To run the application**: Use `docker-compose up` (the app runs in a Docker container)

**To view Swagger UI**: Once the server is running, open `http://localhost:3000/api-docs` in your browser

## Instructions

### Step 1: Understand Swagger Setup

**Swagger is already configured!** The starter branch includes:

- Swagger UI available at `/api-docs`
- Basic Swagger configuration in `src/config/swagger.ts`
- The health endpoint is already documented as an example

**Important**: To make your endpoints appear in Swagger UI, you need to add Swagger annotations (JSDoc comments) above each endpoint. This is a best practice - document as you build!

### Step 2: Create a Simple GET Endpoint

Create a GET endpoint at `/api/comedians` that returns a list of comedians.

**Important**: The starter branch includes `src/data/mockData.ts` with sample comedian data. Import and use this data:

```typescript
import { mockComedians } from './data/mockData';

/**
 * @swagger
 * /api/comedians:
 *   get:
 *     summary: Get all comedians
 *     tags: [Comedians]
 *     responses:
 *       200:
 *         description: List of comedians
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: number
 */
app.get('/api/comedians', (req, res) => {
  res.status(200).json({
    data: mockComedians,
    count: mockComedians.length,
  });
});
```

**Note**: The Swagger annotation (the `@swagger` comment block) makes this endpoint appear in Swagger UI. Try it - refresh `http://localhost:3000/api-docs` after adding this endpoint!

This is temporary hardcoded data - we'll replace it with a database in Task 5.

### Step 3: Create a POST Endpoint

Create a POST endpoint at `/api/comedians` that accepts JSON data in the request body and returns the created comedian.

For now, you can add the new comedian to the `mockComedians` array (this is temporary - data won't persist after server restart). In Task 5, we'll use a database for persistence.

```typescript
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
 *                 example: "Dave Chappelle"
 *               bio:
 *                 type: string
 *                 example: "American stand-up comedian"
 *               nationality:
 *                 type: string
 *                 example: "US"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1973-08-24"
 *     responses:
 *       201:
 *         description: Comedian created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
app.post('/api/comedians', (req, res) => {
  const newComedian = {
    id: Date.now().toString(), // Simple ID generation for now
    ...req.body,
  };
  mockComedians.push(newComedian);
  res.status(201).json({
    message: 'Comedian created successfully',
    data: newComedian,
  });
});
```

**Tip**: After adding this endpoint, refresh Swagger UI and you'll see a "Try it out" button that lets you test the endpoint directly in the browser!

### Step 4: Set Response Headers

Learn to set custom response headers using `res.set()` or `res.header()`.

### Step 5: Handle Different Status Codes

Practice returning different status codes:

- 200 (OK)
- 201 (Created)
- 400 (Bad Request)
- 404 (Not Found)

## Key Concepts

- **HTTP Verbs**: GET (read), POST (create), PUT (update), DELETE (remove)
- **Status Codes**:
  - 2xx: Success
  - 4xx: Client errors
  - 5xx: Server errors
- **Headers**: Metadata about the request/response
- **Body**: Data sent with POST/PUT requests (usually JSON)

## Testing with Swagger UI

**Swagger UI is already set up!** This is the easiest way to test your endpoints:

1. Start the server: `docker-compose up`
2. Open `http://localhost:3000/api-docs` in your browser
3. You'll see all documented endpoints
4. Click "Try it out" on any endpoint
5. Fill in parameters and click "Execute"
6. See the response immediately!

**Why document endpoints?**

- Endpoints only appear in Swagger UI if they have `@swagger` annotations
- Swagger UI lets you test endpoints without external tools
- Documentation helps you and others understand the API
- It's a professional best practice

## Important Notes

1. **Always document endpoints**: Add `@swagger` annotations above every endpoint you create
2. **Test in Swagger UI**: Use the interactive Swagger UI to test your endpoints
3. **Document as you build**: It's easier to document while the code is fresh in your mind
4. **Swagger updates automatically**: Refresh the Swagger UI page after adding new endpoints

## Next Steps

After completing this task, you'll move on to Task 2: Dynamic Routes & Query Parameters, where you'll learn to handle URL parameters and query strings. You'll also learn to document query parameters in Swagger!
