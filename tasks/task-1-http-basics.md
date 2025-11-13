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
- No routes yet - you'll create them in this task

**To run the application**: Use `docker-compose up` (the app runs in a Docker container)

## Instructions

### Step 1: Create a Health Check Endpoint

Create a simple GET endpoint at `/health` that returns server status.

```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});
```

### Step 2: Create a Simple GET Endpoint

Create a GET endpoint at `/api/comedians` that returns a list of comedians.

**Important**: The starter branch includes `src/data/mockData.ts` with sample comedian data. Import and use this data:

```typescript
import { mockComedians } from './data/mockData';

app.get('/api/comedians', (req, res) => {
  res.status(200).json({
    data: mockComedians,
    count: mockComedians.length,
  });
});
```

This is temporary hardcoded data - we'll replace it with a database in Task 6.

### Step 3: Create a POST Endpoint

Create a POST endpoint at `/api/comedians` that accepts JSON data in the request body and returns the created comedian.

For now, you can add the new comedian to the `mockComedians` array (this is temporary - data won't persist after server restart). In Task 6, we'll use a database for persistence.

```typescript
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

## Testing Tools

You can test these endpoints using:

- **cURL**: Command-line tool
- **Postman**: GUI tool
- **Thunder Client**: VS Code extension
- **Swagger UI**: Available at `/api-docs` (after setup)

## Example cURL Commands

**Note**: Make sure the app is running with `docker-compose up` before testing.

```bash
# Health check
curl http://localhost:3000/health

# GET request (get all comedians)
curl http://localhost:3000/api/comedians

# POST request (create a comedian)
curl -X POST http://localhost:3000/api/comedians \
  -H "Content-Type: application/json" \
  -d '{"name":"New Comedian","bio":"A funny person","nationality":"US"}'
```

## Next Steps

After completing this task, you'll move on to Task 2: Dynamic Routes & Query Parameters, where you'll learn to handle URL parameters and query strings to make your endpoints more flexible.
