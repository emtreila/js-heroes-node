# Task 2: Dynamic Routes & Query Parameters

## Learning Objectives

- Understand dynamic path segments (`:id`)
- Work with route parameters
- Handle query parameters
- Filter and paginate data using query strings
- Validate and sanitize input parameters

## Why This Matters

Dynamic routes and query parameters make your API flexible and powerful:

- **Dynamic routes** allow accessing specific resources by ID (`/api/comedians/:id`)
- **Query parameters** enable filtering, searching, and pagination without creating separate endpoints
- **RESTful design** follows standard conventions that developers expect
- **User experience** improves when clients can filter and paginate large datasets

These patterns are essential for building scalable, user-friendly APIs.

## Overview

In this task, you'll learn how to create flexible routes that accept dynamic values and how to use query parameters for filtering, searching, and pagination.

## Instructions

### Step 1: Create Dynamic Route Segments

Learn to use `:parameterName` syntax in Express routes to capture dynamic values from the URL.

**Important**: Document path parameters in Swagger using the `parameters` section:

```typescript
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
 *         description: Comedian ID
 *     responses:
 *       200:
 *         description: Comedian details
 *       404:
 *         description: Comedian not found
 */
app.get('/api/comedians/:id', (req, res) => {
  const { id } = req.params;
  // Use id to find the comedian
});
```

### Step 2: Access Route Parameters

Understand how to access route parameters using `req.params`. The `{id}` in the Swagger path matches the `:id` in your route.

### Step 3: Handle Query Parameters

Learn to read query parameters from `req.query` and use them for filtering.

**Important**: Document query parameters in Swagger using the `parameters` section with `in: query`:

```typescript
/**
 * @swagger
 * /api/comedians:
 *   get:
 *     summary: Get all comedians
 *     tags: [Comedians]
 *     parameters:
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *         description: Filter by nationality (e.g., US, UK)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of comedians
 */
app.get('/api/comedians', (req, res) => {
  const { nationality, limit, offset } = req.query;
  // Use query params to filter results
});
```

### Step 4: Implement Filtering

Use query parameters to filter comedians by nationality. Make sure to document the `nationality` query parameter in Swagger!

### Step 5: Implement Pagination

Add `limit` and `offset` query parameters for pagination. Document both parameters in Swagger so users know how to paginate.

## Key Concepts

- **Route Parameters**: Dynamic segments in the URL path (`/api/comedians/:id`)
- **Query Parameters**: Key-value pairs after `?` in the URL (`?nationality=US&limit=10`)
- **req.params**: Object containing route parameters
- **req.query**: Object containing query parameters (always strings)

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
  .then((res) => res.json())
  .then((data) => console.log(data));

// Filter with query params
const params = new URLSearchParams({ nationality: 'US', limit: '5' });
fetch(`http://localhost:3000/api/comedians?${params}`)
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## Important Notes

1. **Query parameters are always strings**: Convert to numbers when needed using `Number()` or `parseInt()`
2. **Validate input**: Always validate and sanitize user input from query parameters
3. **Default values**: Provide sensible defaults for optional parameters
4. **URL encoding**: Query parameter values are automatically URL-decoded by Express
5. **Document in Swagger**: Always add query parameters to your Swagger annotations - users can then test them directly in Swagger UI!

## Next Steps

After completing this task, you'll move on to Task 3: Router Structure, where you'll learn to organize your routes into separate router modules.
