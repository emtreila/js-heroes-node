# Task 1: HTTP Basics

## Learning Objectives

- Understand HTTP verbs (GET, POST, PUT, DELETE)
- Learn about HTTP status codes
- Work with request headers
- Handle request payloads (JSON bodies)
- Set appropriate response headers

## Overview

In this task, you'll create basic endpoints that demonstrate HTTP fundamentals. You'll learn how Express handles different HTTP methods and how to properly respond to requests.

## Instructions

### Step 1: Create a Health Check Endpoint

Create a simple GET endpoint at `/health` that returns server status.

```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
```

### Step 2: Create a Simple GET Endpoint

Create a GET endpoint that returns a list of items (you can use a hardcoded array for now).

### Step 3: Create a POST Endpoint

Create a POST endpoint that accepts JSON data in the request body and returns the created item.

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

## Manual Testing (Gherkin Format)

### Feature: Health Check Endpoint

```gherkin
Scenario: Check server health
  Given the server is running
  When I send a GET request to /health
  Then I should receive a 200 status code
    And the response body should contain a "status" field with value "ok"
    And the response body should contain a "timestamp" field
    And the response should have Content-Type header set to "application/json"
```

**Expected Request:**
```bash
GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Feature: Create Resource with POST

```gherkin
Scenario: Successfully create a new resource
  Given I have valid resource data
  When I send a POST request to /api/items
    And the request body contains JSON data
    And the Content-Type header is set to "application/json"
  Then I should receive a 201 status code
    And the response body should contain the created resource
    And the response should include a "Location" header with the resource URL

Scenario: Fail to create resource with invalid data
  Given I have invalid resource data
  When I send a POST request to /api/items
    And the request body is missing required fields
  Then I should receive a 400 status code
    And the response body should contain an error message
```

**Expected Request:**
```bash
POST http://localhost:3000/api/items
Content-Type: application/json

{
  "name": "Test Item",
  "description": "A test item"
}
```

**Expected Response (Success):**
```json
{
  "id": "123",
  "name": "Test Item",
  "description": "A test item",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Expected Response (Error):**
```json
{
  "error": {
    "message": "Validation error",
    "statusCode": 400
  }
}
```

### Feature: Retrieve Resource with GET

```gherkin
Scenario: Successfully retrieve a resource
  Given a resource exists with id "123"
  When I send a GET request to /api/items/123
  Then I should receive a 200 status code
    And the response body should contain the resource data

Scenario: Fail to retrieve non-existent resource
  Given no resource exists with id "999"
  When I send a GET request to /api/items/999
  Then I should receive a 404 status code
    And the response body should contain an error message
```

**Expected Request:**
```bash
GET http://localhost:3000/api/items/123
```

**Expected Response (Success):**
```json
{
  "id": "123",
  "name": "Test Item",
  "description": "A test item"
}
```

**Expected Response (Not Found):**
```json
{
  "error": {
    "message": "Resource not found",
    "statusCode": 404
  }
}
```

### Feature: Update Resource with PUT

```gherkin
Scenario: Successfully update a resource
  Given a resource exists with id "123"
  When I send a PUT request to /api/items/123
    And the request body contains updated data
  Then I should receive a 200 status code
    And the response body should contain the updated resource
```

**Expected Request:**
```bash
PUT http://localhost:3000/api/items/123
Content-Type: application/json

{
  "name": "Updated Item",
  "description": "Updated description"
}
```

**Expected Response:**
```json
{
  "id": "123",
  "name": "Updated Item",
  "description": "Updated description",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

### Feature: Delete Resource with DELETE

```gherkin
Scenario: Successfully delete a resource
  Given a resource exists with id "123"
  When I send a DELETE request to /api/items/123
  Then I should receive a 204 status code
    And the response body should be empty

Scenario: Fail to delete non-existent resource
  Given no resource exists with id "999"
  When I send a DELETE request to /api/items/999
  Then I should receive a 404 status code
```

**Expected Request:**
```bash
DELETE http://localhost:3000/api/items/123
```

**Expected Response (Success):**
- Status: 204 No Content
- Body: (empty)

## Testing Tools

You can test these endpoints using:
- **cURL**: Command-line tool
- **Postman**: GUI tool
- **Thunder Client**: VS Code extension
- **Swagger UI**: Available at `/api-docs` (after setup)

## Example cURL Commands

```bash
# Health check
curl http://localhost:3000/health

# GET request
curl http://localhost:3000/api/items

# POST request
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"A test"}'

# PUT request
curl -X PUT http://localhost:3000/api/items/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Item"}'

# DELETE request
curl -X DELETE http://localhost:3000/api/items/123
```

## Next Steps

After completing this task, you'll move on to Task 2: Dynamic Routes & Query Parameters, where you'll learn to handle URL parameters and query strings.

