# Task 2: Dynamic Routes & Query Parameters

## Learning Objectives

- Understand dynamic path segments (`:id`)
- Work with route parameters
- Handle query parameters
- Filter and paginate data using query strings
- Validate and sanitize input parameters

## Overview

In this task, you'll learn how to create flexible routes that accept dynamic values and how to use query parameters for filtering, searching, and pagination.

## Instructions

### Step 1: Create Dynamic Route Segments

Learn to use `:parameterName` syntax in Express routes to capture dynamic values from the URL.

```typescript
app.get('/api/comedians/:id', (req, res) => {
  const { id } = req.params;
  // Use id to find the comedian
});
```

### Step 2: Access Route Parameters

Understand how to access route parameters using `req.params`.

### Step 3: Handle Query Parameters

Learn to read query parameters from `req.query` and use them for filtering.

```typescript
app.get('/api/comedians', (req, res) => {
  const { nationality, limit } = req.query;
  // Use query params to filter results
});
```

### Step 4: Implement Filtering

Use query parameters to filter comedians by nationality.

### Step 5: Implement Pagination

Add `limit` and `offset` query parameters for pagination.

## Key Concepts

- **Route Parameters**: Dynamic segments in the URL path (`/api/comedians/:id`)
- **Query Parameters**: Key-value pairs after `?` in the URL (`?nationality=US&limit=10`)
- **req.params**: Object containing route parameters
- **req.query**: Object containing query parameters (always strings)

## Manual Testing (Gherkin Format)

### Feature: Dynamic Route Parameters

```gherkin
Scenario: Retrieve comedian by ID
  Given a comedian exists with id "abc-123"
  When I send a GET request to /api/comedians/abc-123
  Then I should receive a 200 status code
    And the response body should contain the comedian with id "abc-123"

Scenario: Retrieve non-existent comedian
  Given no comedian exists with id "non-existent"
  When I send a GET request to /api/comedians/non-existent
  Then I should receive a 404 status code
    And the response body should contain an error message
```

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians/abc-123
```

**Expected Response (Success):**
```json
{
  "data": {
    "id": "abc-123",
    "name": "Dave Chappelle",
    "nationality": "US",
    "bio": "American comedian..."
  }
}
```

**Expected Response (Not Found):**
```json
{
  "error": {
    "message": "Comedian not found",
    "statusCode": 404
  }
}
```

### Feature: Query Parameters for Filtering

```gherkin
Scenario: Filter comedians by nationality
  Given there are comedians with different nationalities
  When I send a GET request to /api/comedians?nationality=US
  Then I should receive a 200 status code
    And all returned comedians should have nationality "US"

Scenario: Get all comedians without filter
  Given there are multiple comedians in the database
  When I send a GET request to /api/comedians
  Then I should receive a 200 status code
    And the response should contain all comedians
```

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians?nationality=US
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "abc-123",
      "name": "Dave Chappelle",
      "nationality": "US"
    },
    {
      "id": "def-456",
      "name": "Bo Burnham",
      "nationality": "US"
    }
  ],
  "count": 2
}
```

### Feature: Query Parameters for Pagination

```gherkin
Scenario: Get limited number of comedians
  Given there are 10 comedians in the database
  When I send a GET request to /api/comedians?limit=5
  Then I should receive a 200 status code
    And the response should contain exactly 5 comedians

Scenario: Get comedians with offset
  Given there are 10 comedians in the database
  When I send a GET request to /api/comedians?limit=5&offset=5
  Then I should receive a 200 status code
    And the response should contain comedians starting from the 6th item
```

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians?limit=5&offset=0
```

**Expected Response:**
```json
{
  "data": [
    { "id": "1", "name": "Comedian 1" },
    { "id": "2", "name": "Comedian 2" },
    { "id": "3", "name": "Comedian 3" },
    { "id": "4", "name": "Comedian 4" },
    { "id": "5", "name": "Comedian 5" }
  ],
  "count": 5
}
```

### Feature: Multiple Query Parameters

```gherkin
Scenario: Combine filtering and pagination
  Given there are comedians with different nationalities
  When I send a GET request to /api/comedians?nationality=US&limit=3&offset=0
  Then I should receive a 200 status code
    And all returned comedians should have nationality "US"
    And the response should contain at most 3 comedians
```

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians?nationality=US&limit=3&offset=0
```

**Expected Response:**
```json
{
  "data": [
    { "id": "1", "name": "US Comedian 1", "nationality": "US" },
    { "id": "2", "name": "US Comedian 2", "nationality": "US" },
    { "id": "3", "name": "US Comedian 3", "nationality": "US" }
  ],
  "count": 3
}
```

### Feature: Invalid Query Parameters

```gherkin
Scenario: Handle invalid limit value
  When I send a GET request to /api/comedians?limit=invalid
  Then I should receive a 400 status code
    And the response body should contain a validation error message
```

**Expected Request:**
```bash
GET http://localhost:3000/api/comedians?limit=invalid
```

**Expected Response:**
```json
{
  "error": {
    "message": "Invalid limit parameter",
    "statusCode": 400
  }
}
```

## Testing Examples

### Using cURL

```bash
# Get comedian by ID
curl http://localhost:3000/api/comedians/abc-123

# Filter by nationality
curl "http://localhost:3000/api/comedians?nationality=US"

# Pagination
curl "http://localhost:3000/api/comedians?limit=5&offset=0"

# Combined
curl "http://localhost:3000/api/comedians?nationality=US&limit=3"
```

### Using JavaScript Fetch

```javascript
// Get comedian by ID
fetch('http://localhost:3000/api/comedians/abc-123')
  .then(res => res.json())
  .then(data => console.log(data));

// Filter with query params
const params = new URLSearchParams({ nationality: 'US', limit: '5' });
fetch(`http://localhost:3000/api/comedians?${params}`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## Important Notes

1. **Query parameters are always strings**: Convert to numbers when needed using `Number()` or `parseInt()`
2. **Validate input**: Always validate and sanitize user input from query parameters
3. **Default values**: Provide sensible defaults for optional parameters
4. **URL encoding**: Query parameter values are automatically URL-decoded by Express

## Next Steps

After completing this task, you'll move on to Task 3: Router Structure, where you'll learn to organize your routes into separate router modules.

