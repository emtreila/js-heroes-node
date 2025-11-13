# Task 10: Swagger Documentation

## Learning Objectives

- Set up Swagger/OpenAPI documentation
- Document API endpoints
- Define request/response schemas
- Add authentication documentation
- Serve interactive API documentation

## Overview

In this task, you'll learn to document your API using Swagger/OpenAPI. You'll create interactive documentation that allows users to test endpoints directly from the browser.

## Instructions

### Step 1: Install Dependencies

Install Swagger packages:

```bash
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

### Step 2: Configure Swagger

Create Swagger configuration file.

### Step 3: Document Endpoints

Add JSDoc comments to your routes with Swagger annotations.

### Step 4: Define Schemas

Document request and response schemas.

### Step 5: Add Authentication Documentation

Document JWT authentication requirements.

### Step 6: Serve Swagger UI

Mount Swagger UI in your Express app.

## Key Concepts

- **OpenAPI/Swagger**: Standard for API documentation
- **JSDoc Comments**: Comments that Swagger reads to generate docs
- **Schemas**: Definitions of data structures
- **Swagger UI**: Interactive documentation interface
- **Authentication**: Documenting security requirements

## Manual Testing (Gherkin Format)

### Feature: Access Swagger Documentation

```gherkin
Scenario: View Swagger documentation
  Given the server is running
  When I navigate to /api-docs in a browser
  Then I should see the Swagger UI interface
    And all API endpoints should be listed
    And each endpoint should have documentation

Scenario: View endpoint details
  Given I am viewing the Swagger documentation
  When I expand an endpoint
  Then I should see the endpoint description
    And I should see request parameters
    And I should see response schemas
    And I should see example requests/responses
```

**Expected URL:**
```
http://localhost:3000/api-docs
```

**Expected Behavior:**
- Swagger UI loads in browser
- All endpoints are visible
- Endpoints are grouped by tags
- Each endpoint can be expanded to see details

### Feature: Test Endpoints from Swagger

```gherkin
Scenario: Execute request from Swagger UI
  Given I am viewing the Swagger documentation
  When I click "Try it out" on an endpoint
    And I fill in the required parameters
    And I click "Execute"
  Then the request should be sent to the server
    And I should see the response
    And the response should match the documented schema

Scenario: Test authenticated endpoint
  Given I am viewing the Swagger documentation
  When I click the "Authorize" button
    And I enter a JWT token
    And I click "Authorize"
  Then I should be able to test protected endpoints
    And the Authorization header should be included in requests
```

**Expected Behavior:**
- "Try it out" button makes endpoints interactive
- Can fill in parameters and execute requests
- Responses are displayed in the UI
- Authorization can be set globally

### Feature: View Request/Response Schemas

```gherkin
Scenario: View request schema
  Given I am viewing an endpoint in Swagger
  When the endpoint requires a request body
  Then I should see the request schema
    And I should see required fields
    And I should see field types and descriptions

Scenario: View response schemas
  Given I am viewing an endpoint in Swagger
  Then I should see possible response codes
    And I should see response schemas for each code
    And I should see example response bodies
```

**Expected Schema Display:**
- Request body structure
- Field types (string, number, etc.)
- Required vs optional fields
- Response examples for different status codes

## Code Examples

### Swagger Configuration

```typescript
// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comedian Catalog API',
      version: '1.0.0',
      description: 'A RESTful API for managing a comedian catalog',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Documenting Endpoints

```typescript
// src/routes/comedians.routes.ts
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
 *         description: Filter by nationality
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
 *                     $ref: '#/components/schemas/Comedian'
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
 *         description: Comedian not found
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
 *             $ref: '#/components/schemas/NewComedian'
 *     responses:
 *       201:
 *         description: Comedian created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validate(createComedianSchema), createComedian);
```

### Defining Schemas

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Comedian:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *         nationality:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     NewComedian:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *         nationality:
 *           type: string
 */
```

### Documenting Authentication

```typescript
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
router.get('/', authenticate, getFavorites);
```

### Serving Swagger UI

```typescript
// src/server.ts
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

## Testing Examples

### Access Swagger UI

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:3000/api-docs`
3. Explore endpoints
4. Click "Try it out" to test endpoints
5. Use "Authorize" button to set JWT token

### Test Endpoint from Swagger

1. Navigate to an endpoint in Swagger UI
2. Click "Try it out"
3. Fill in parameters (if any)
4. Click "Execute"
5. View response

## Important Notes

1. **JSDoc Format**: Swagger reads JSDoc comments, so format matters
2. **Schema References**: Use `$ref` to reference shared schemas
3. **Tags**: Group related endpoints with tags
4. **Examples**: Include example requests/responses
5. **Security**: Document authentication requirements
6. **Keep Updated**: Update documentation when API changes

## Next Steps

Congratulations! You've completed all the core tasks. You can now explore the extra assignments or review what you've learned.

