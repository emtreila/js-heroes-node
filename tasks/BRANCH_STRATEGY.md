# Branch Strategy for Workshop Tasks

This document defines the exact state of each starter branch for the workshop tasks. Each branch represents the "before" state that participants will start from.

## 🎯 Application Overview

**What We're Building**: A Comedian Catalog API - a RESTful API for managing comedians, their performances, and user favorites.

**Main Entities**:

- **Comedians**: Comedians with name, bio, birth date, nationality
- **Performances**: Comedy performances/shows linked to comedians
- **Users**: User accounts for authentication
- **Favorites**: User's favorite comedians (many-to-many relationship)

**Tech Stack**:

- Express.js v5
- TypeScript
- PostgreSQL with Drizzle ORM
- JWT authentication with Passport.js
- Swagger/OpenAPI documentation

**Development Environment**:

- **Docker & Docker Compose**: The application runs in Docker from the very beginning (Task 1)
- All tasks use `docker-compose up` to run the application
- PostgreSQL service is included in docker-compose (even if not used in early tasks)

---

## 📋 Branch Strategy by Task

### Branch: `task-1-http-basics` (Starter)

**Purpose**: Start with minimal Express setup, ready to add basic endpoints.

**What's Included**:

- Basic Express app setup in `src/server.ts`
- `package.json` with Express and TypeScript dependencies
- Basic TypeScript configuration
- `.env` file template
- `README.md` with setup instructions
- **`docker-compose.yml`** - Docker Compose configuration (app + postgres services)
- **`Dockerfile`** - Node.js application container

**What's NOT Included**:

- No routes yet
- No controllers
- No database connection/usage (PostgreSQL service exists in docker-compose but not used yet)
- No middleware

**Note**: Even though the database isn't used yet, `docker-compose.yml` includes both the app and postgres services. Participants will use `docker-compose up` to run the application from Task 1.

**Hardcoded Data to Provide**:
Create a file `src/data/mockData.ts` with:

```typescript
export const mockComedians = [
  {
    id: '1',
    name: 'Dave Chappelle',
    bio: 'American stand-up comedian, actor, and writer',
    nationality: 'US',
    birthDate: '1973-08-24',
  },
  {
    id: '2',
    name: 'Bo Burnham',
    bio: 'American comedian, musician, and filmmaker',
    nationality: 'US',
    birthDate: '1990-08-21',
  },
  {
    id: '3',
    name: 'Ricky Gervais',
    bio: 'English comedian, actor, and writer',
    nationality: 'UK',
    birthDate: '1961-06-25',
  },
];

export const mockPerformances = [
  {
    id: '1',
    comedianId: '1',
    title: 'Sticks & Stones',
    venue: 'Netflix Special',
    date: '2019-08-26',
  },
  {
    id: '2',
    comedianId: '2',
    title: 'Inside',
    venue: 'Netflix Special',
    date: '2021-05-30',
  },
];
```

**Expected End State**:

- Health check endpoint `/health`
- GET `/api/comedians` returning hardcoded array
- POST `/api/comedians` accepting JSON and returning created item
- Understanding of HTTP verbs and status codes

---

### Branch: `task-2-dynamic-routes` (Starter)

**Purpose**: Start with basic endpoints from Task 1, ready to add dynamic routes and query parameters.

**What's Included**:

- All code from Task 1 completion
- Health check endpoint
- Basic GET and POST endpoints for comedians
- Hardcoded data in `src/data/mockData.ts`

**What's NOT Included**:

- Dynamic route parameters (`:id`)
- Query parameters handling
- Filtering or pagination

**Expected End State**:

- GET `/api/comedians/:id` - get comedian by ID
- GET `/api/comedians?nationality=US` - filter by nationality
- GET `/api/comedians?limit=5&offset=0` - pagination
- Understanding of `req.params` and `req.query`

---

### Branch: `task-3-router-structure` (Starter)

**Purpose**: Start with all routes in `server.ts`, ready to organize into routers and controllers.

**What's Included**:

- All code from Task 2 completion
- All routes defined directly in `server.ts`
- Route handlers as inline functions or basic handlers
- Dynamic routes and query parameters working

**What's NOT Included**:

- No `routes/` directory yet
- No `controllers/` directory yet
- No router modules
- No separated controllers

**Expected End State**:

- `src/routes/comedians.routes.ts` - router for comedians
- `src/routes/performances.routes.ts` - router for performances
- `src/controllers/comedian.controller.ts` - controller functions
- `src/controllers/performance.controller.ts` - controller functions
- Routers mounted in `server.ts` with `app.use()`
- Clean separation of routes and controllers

---

### Branch: `task-4-middleware-pipeline` (Starter)

**Purpose**: Start with organized routers and controllers, ready to add middleware.

**What's Included**:

- All code from Task 3 completion
- Organized routers in `routes/` directory
- Controllers in `controllers/` directory
- Routes mounted in `server.ts`
- Only built-in Express middleware (express.json, etc.)

**What's NOT Included**:

- No validation middleware
- No error handling middleware
- No custom middleware

**Expected End State**:

- `src/middleware/validate.middleware.ts` - Zod validation middleware
- `src/middleware/error.middleware.ts` - Centralized error handling
- `CustomError` class for custom errors
- Validation middleware applied to POST/PUT routes
- Error middleware registered in `server.ts` (after routes)
- Understanding of middleware execution order
- Understanding of why validation is necessary (data integrity)
- Understanding of why centralized error handling is necessary (consistency, logging)

---

### Branch: `task-5-database-connection` (SKIPPED)

**Status**: ❌ **This task is skipped entirely**

**Reason**: Database setup is too complex for participants to implement. Instead, provide a fully configured database setup as the starter branch for Task 6.

---

### Branch: `task-6-crud-operations` (Starter)

**Purpose**: Start with database fully configured, ready to replace hardcoded data with database queries.

**What's Included**:

- All code from Task 4 completion
- **Complete database setup** (this is the key difference):
  - `src/db/index.ts` - database connection
  - `src/db/schema/comedians.ts` - comedian schema
  - `src/db/schema/performances.ts` - performance schema
  - `drizzle.config.ts` - Drizzle configuration
  - `src/db/migrations/` - migration files (already run)
  - `src/db/init.ts` - database initialization
  - Database connection established
  - Migrations already applied
  - Database seeded with sample data (optional, or provide seed script)

**What's NOT Included**:

- Controllers still using hardcoded data from `mockData.ts`
- No database queries in controllers yet

**Expected End State**:

- Controllers use `db.select()`, `db.insert()`, `db.update()`, `db.delete()`
- Hardcoded data removed
- Only comedians and performances resources (no users, no favorites yet)
- Data persists in PostgreSQL
- Understanding of Drizzle ORM query methods

**Note**: This branch should have the database fully working. Participants just need to replace mock data with database queries.

---

### Branch: `task-7-authentication` (Starter)

**Purpose**: Start with CRUD operations working, ready to add authentication.

**What's Included**:

- All code from Task 6 completion
- Comedians and performances CRUD working with database
- **User schema already defined** (`src/db/schema/users.ts`)
- **User table already created** (migration included)
- **Auth controller structure** (`src/controllers/auth.controller.ts` with placeholder functions)
- Password utilities file structure (`src/utils/password.util.ts` - empty or with imports)
- JWT utilities file structure (`src/utils/jwt.util.ts` - empty or with imports)

**What's NOT Included**:

- No JWT strategy implementation
- No Passport configuration
- No actual registration/login logic
- No password hashing implementation
- No token generation

**Expected End State**:

- `src/strategies/jwt.strategy.ts` - Passport JWT strategy
- `src/utils/password.util.ts` - password hashing functions
- `src/utils/jwt.util.ts` - JWT token generation
- `src/controllers/auth.controller.ts` - register and login implemented
- `src/routes/auth.routes.ts` - auth routes with JWT strategy applied
- Passport initialized in `server.ts`
- Registration and login endpoints working
- JWT tokens returned on successful auth

**Focus**: JWT strategy setup and applying it to auth routes. The schema and controller structure are provided.

---

### Branch: `task-8-protected-routes` (REMOVED)

**Status**: ❌ **This task is removed**

**Reason**: Protected routes functionality is merged into Task 7. After implementing authentication, participants will immediately apply it to protect the favorites resource.

**Alternative**: Add a section in Task 7 about protecting routes, or create favorites as part of Task 7.

---

### Branch: `task-9-swagger-documentation` (Starter)

**Purpose**: Start with complete working API, ready to add Swagger documentation.

**What's Included**:

- All code from Task 7 completion
- Full CRUD for comedians and performances
- Authentication working (register/login)
- Favorites resource with protected routes (added in Task 7)
- All endpoints functional
- Error handling middleware
- Validation middleware

**What's NOT Included**:

- No Swagger configuration
- No API documentation
- No Swagger UI

**Expected End State**:

- `src/config/swagger.ts` - Swagger configuration
- All routes documented with JSDoc comments
- Request/response schemas documented
- Authentication documented (bearerAuth)
- Swagger UI accessible at `/api-docs`
- Clear documentation for each endpoint

**Documentation Requirements** (be very clear):

- Each endpoint must have:
  - Summary
  - Tags
  - Parameters (path, query, body)
  - Request body schema
  - Response schemas for each status code
  - Security requirements (if protected)
- Schemas must be defined for:
  - Comedian
  - Performance
  - User (without password)
  - Favorite
  - Error response
  - Auth request/response

---

## 🔄 Task Flow Summary

```
task-1-http-basics (starter: empty app)
  └─> task-2-dynamic-routes (starter: basic endpoints)
      └─> task-3-router-structure (starter: routes in server.ts)
          └─> task-4-middleware-pipeline (starter: organized routes)
              └─> task-6-crud-operations (starter: DB fully configured)
                  └─> task-7-authentication (starter: CRUD working, user schema ready)
                      └─> task-9-swagger-documentation (starter: complete API)
```

**Removed Tasks**:

- Task 5: Database Connection (merged into Task 6 starter)
- Task 8: Protected Routes (merged into Task 7)

---

## 📦 Hardcoded Data Strategy

### Task 1 Starter Branch

Provide `src/data/mockData.ts` with:

- `mockComedians` array (3-5 comedians)
- `mockPerformances` array (2-3 performances)

### Task 2-3 Starter Branches

Same mock data, but now being used in routes/controllers.

### Task 4 Starter Branch

Still using mock data, but with middleware added.

### Task 6 Starter Branch

**Database seeded** with equivalent data:

- Run seed script or provide SQL inserts
- Same comedians and performances as mock data
- This ensures smooth transition from mock to database

---

## 🎯 Key Principles

1. **Each branch builds on previous**: No gaps, no missing dependencies
2. **Docker from the start**: All tasks use Docker Compose - participants run `docker-compose up` from Task 1
3. **Provide complex setup**: Database, schemas, migrations provided in Task 6 starter
4. **Focus on learning**: Participants implement the learning objective, not boilerplate
5. **Clear boundaries**: Each task has a clear "before" and "after" state
6. **Realistic progression**: Each step is manageable in 10-15 minutes with guidance

---

## 📝 Branch Checklist

For each starter branch, ensure:

- [ ] **`docker-compose.yml`** is present and includes both app and postgres services
- [ ] **`Dockerfile`** is present and builds correctly
- [ ] `docker-compose up` starts both services successfully
- [ ] Application runs in Docker container (not locally)
- [ ] All dependencies from previous tasks are included
- [ ] Code compiles and runs without errors in Docker
- [ ] Database service is available (postgres in docker-compose, even if not used yet)
- [ ] Sample data is available (hardcoded or seeded)
- [ ] File structure matches final app structure (where applicable)
- [ ] No "magic" - participants understand what's provided and why
- [ ] Clear README in branch explaining what's included and how to run with `docker-compose up`
- [ ] `.env` file template provided (or environment variables in docker-compose)
- [ ] `package.json` has all needed dependencies

---

## 🚨 Special Considerations

### Docker Setup (All Tasks)

**Important**: Docker Compose is used from Task 1:

- `docker-compose.yml` includes both `app` and `postgres` services from the beginning
- Even in early tasks (1-5), postgres service exists but may not be used
- Participants always run: `docker-compose up`
- The app runs in a Docker container, not locally
- Database connection string in docker-compose points to postgres service

### Database Setup (Task 6 Starter)

Since Task 5 is skipped, the Task 6 starter branch must include:

- Complete Drizzle configuration
- All schema files
- Migration files (already generated)
- Database connection working (using postgres service from docker-compose)
- Seed data script or instructions
- Clear documentation on what's provided and why
- Note: Database was always available via docker-compose, but now it's actually used

### Authentication Setup (Task 7 Starter)

Since schema and controller structure are provided:

- User schema file exists but is explained
- Auth controller has function signatures but no implementation
- Password/JWT utility files exist but are empty
- Clear explanation: "We're providing the structure, you implement the logic"

### Swagger Documentation (Task 9)

Be very explicit about:

- What needs to be documented (every endpoint)
- What format to use (JSDoc with @swagger tags)
- What schemas to define
- What examples to include
- How to test the documentation

---

## 📚 Additional Files to Include in Branches

### Every Branch Should Have:

- **`docker-compose.yml`** - Docker Compose configuration (app + postgres services)
- **`Dockerfile`** - Node.js application container
- `.env.example` - template for environment variables
- `README.md` - setup instructions for that branch (including `docker-compose up` command)
- `package.json` - with correct dependencies
- `tsconfig.json` - TypeScript configuration

### Task-Specific Files:

- **Task 1+**: `docker-compose.yml` - Docker Compose config (app + postgres) - **included from Task 1**
- **Task 1+**: `Dockerfile` - Node.js application container - **included from Task 1**
- **Task 1**: `src/data/mockData.ts` - hardcoded data
- **Task 6**: `src/db/seed.ts` - database seed script
- **Task 7**: User schema, auth controller structure
- **Task 9**: Swagger config template

---

## ✅ Validation

Before creating each branch, verify:

1. **Docker Compose**: `docker-compose up` starts both app and postgres services successfully
2. **Code runs**: Application runs in Docker container without errors
3. **Dependencies**: All packages install correctly in Docker
4. **Database**: If database is included, it connects successfully (postgres service is always available)
5. **Endpoints**: Existing endpoints work as expected (test via `http://localhost:3000`)
6. **No broken imports**: All imports resolve correctly
7. **TypeScript**: No type errors
8. **Clear state**: It's obvious what participants need to implement
9. **Docker setup**: `docker-compose.yml` and `Dockerfile` are present and working

---

This strategy ensures each task has a clear starting point and participants can focus on learning the specific concepts rather than setting up infrastructure.
