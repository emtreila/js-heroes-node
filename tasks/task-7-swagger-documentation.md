# Task 7: Swagger Documentation

## Learning Objectives

- Set up Swagger/OpenAPI documentation
- Document API endpoints
- Define request/response schemas
- Add authentication documentation
- Serve interactive API documentation

## Why This Matters

API documentation is essential because:

- **Developer Experience**: Makes it easy for frontend developers to use your API
- **Testing**: Interactive documentation allows testing without writing code
- **Onboarding**: New team members can understand the API quickly
- **Contract**: Documents the API contract between frontend and backend
- **Standards**: OpenAPI/Swagger is an industry standard

Good documentation is a sign of a professional, production-ready API.

## Overview

In this task, you'll learn to document your API using Swagger/OpenAPI. You'll create interactive documentation that allows users to test endpoints directly from the browser.

**Important**: You must document **every single endpoint** in your API. This includes all HTTP methods, all parameters, all response codes, and all schemas.

## Starter Branch

This task starts with:

- Complete working API with all endpoints functional
- Full CRUD for comedians and performances
- Authentication working (register/login)
- Favorites resource with protected routes
- Error handling middleware
- Validation middleware
- No Swagger configuration yet
- No API documentation yet

## Documentation Requirements

You must document **all** of these endpoints:

### Health Endpoint

- `GET /health` - Health check

### Comedians Endpoints

- `GET /api/comedians` - Get all comedians (with query params: nationality, limit, offset)
- `GET /api/comedians/:id` - Get comedian by ID
- `POST /api/comedians` - Create a new comedian
- `PUT /api/comedians/:id` - Update a comedian
- `DELETE /api/comedians/:id` - Delete a comedian

### Performances Endpoints

- `GET /api/performances` - Get all performances (with query param: comedianId)
- `GET /api/performances/:id` - Get performance by ID
- `POST /api/performances` - Create a new performance
- `PUT /api/performances/:id` - Update a performance
- `DELETE /api/performances/:id` - Delete a performance

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Favorites Endpoints (Protected)

- `GET /api/favorites` - Get user's favorite comedians
- `POST /api/favorites` - Add comedian to favorites
- `DELETE /api/favorites/:comedianId` - Remove comedian from favorites

**Total: 16 endpoints to document**

## Instructions

### Step 1: Install Dependencies

Install Swagger packages:

```bash
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

### Step 2: Configure Swagger

Create Swagger configuration file.

### Step 3: Define Schemas

Define all schemas in your Swagger config. You must define:

- **Comedian** schema (all fields: id, name, bio, birthDate, nationality, createdAt, updatedAt)
- **Performance** schema (all fields: id, comedianId, title, venue, date, description, createdAt, updatedAt)
- **User** schema (id, email, createdAt, updatedAt - **do NOT include password**)
- **Favorite** schema (userId, comedianId)
- **Error** schema (message, statusCode, details?)
- **AuthRequest** schema (email, password)
- **AuthResponse** schema (message, user, token)

### Step 4: Document Every Endpoint

Add JSDoc comments to **every route** with Swagger annotations. Each endpoint must have:

- **summary**: Brief description
- **tags**: Group endpoints (e.g., [Comedians], [Authentication])
- **parameters**: Path parameters, query parameters
- **requestBody**: For POST/PUT (with schema reference)
- **responses**: **All possible status codes** with schemas:
  - 200: Success response
  - 201: Created response
  - 400: Validation error
  - 401: Unauthorized (for protected routes)
  - 404: Not found
  - 409: Conflict (duplicate)
  - 500: Server error
- **security**: For protected routes, add `security: [{ bearerAuth: [] }]`

### Step 5: Document Authentication

- Add `bearerAuth` security scheme to Swagger config
- Mark protected routes with `security: [{ bearerAuth: [] }]`
- Document auth endpoints clearly

### Step 6: Serve Swagger UI

Mount Swagger UI in your Express app at `/api-docs`

## Key Concepts

- **OpenAPI/Swagger**: Standard for API documentation
- **JSDoc Comments**: Comments that Swagger reads to generate docs
- **Schemas**: Definitions of data structures
- **Swagger UI**: Interactive documentation interface
- **Authentication**: Documenting security requirements

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

## Documentation Checklist

Before considering this task complete, verify:

- [ ] All 16 endpoints are documented
- [ ] All schemas are defined (Comedian, Performance, User, Favorite, Error, AuthRequest, AuthResponse)
- [ ] All status codes are documented for each endpoint (200, 201, 400, 401, 404, 409, 500)
- [ ] Query parameters are documented (nationality, limit, offset, comedianId)
- [ ] Path parameters are documented (:id, :comedianId)
- [ ] Request bodies are documented with schemas
- [ ] Response bodies are documented with schemas
- [ ] Protected routes have `security: [{ bearerAuth: [] }]`
- [ ] Authentication is documented (bearerAuth security scheme)
- [ ] Swagger UI is accessible at `/api-docs`
- [ ] All endpoints are testable from Swagger UI
- [ ] Examples are provided where helpful

## Next Steps

Congratulations! You've completed all the core tasks. You can now explore the extra assignments or review what you've learned.
