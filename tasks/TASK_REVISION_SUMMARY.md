# Task Revision Summary

This document summarizes all the changes needed for each task based on the review and feedback.

## 📋 Revised Task Structure

**Final Task List** (7 tasks):

1. Task 1: HTTP Basics
2. Task 2: Dynamic Routes & Query Parameters
3. Task 3: Router Structure & Code Organization
4. Task 4: Middleware Pipeline (Validation + Error Handling)
5. ~~Task 5: Database Connection~~ (REMOVED - provided in Task 6 starter)
6. Task 6: CRUD Operations with Drizzle
7. Task 7: Authentication & Protected Routes (merged Task 8)
8. ~~Task 8: Protected Routes~~ (REMOVED - merged into Task 7)
9. ~~Task 9: Error Handling~~ (REMOVED - merged into Task 4)
10. Task 9: Swagger Documentation (renumbered from Task 10)

---

## 🔧 Required Changes by Task

### Task 1: HTTP Basics

**Changes Needed**:

1. **Add Introduction Section**:
   - Explain what we're building: "Comedian Catalog API"
   - List main entities: Comedians, Performances (mention Users and Favorites will come later)
   - Explain the purpose: RESTful API for managing comedian data

2. **Update Instructions**:
   - Clarify that hardcoded data will be provided in the starter branch
   - Reference `src/data/mockData.ts` with sample comedians
   - Make it clear this is temporary data (will be replaced with database later)

3. **Entity Context**:
   - Use "comedians" terminology consistently
   - Mention that we'll work with comedians and performances
   - Explain why we start with these entities (they're the core domain)

**Starter Branch Content**:

- `src/data/mockData.ts` with `mockComedians` and `mockPerformances` arrays
- Basic Express setup
- No routes yet

---

### Task 2: Dynamic Routes & Query Parameters

**Changes Needed**:

✅ **No changes needed** - Task is fine as is.

**Starter Branch Content**:

- All code from Task 1 completion
- Health check endpoint
- Basic GET/POST endpoints using mock data
- Ready to add `:id` routes and query parameters

---

### Task 3: Router Structure & Code Organization

**Changes Needed**:

1. **Clarify Controller Creation**:
   - **Important**: Controllers are created IN THIS TASK (not earlier)
   - Start with routes defined directly in `server.ts` (or as inline handlers)
   - Task is to extract handlers into controller functions
   - Then organize routes into router modules

2. **Update Instructions**:
   - Step 1: Extract route handlers into controller functions
   - Step 2: Create router modules
   - Step 3: Move routes to router files
   - Step 4: Mount routers in `server.ts`

3. **File Structure**:
   - Show that `controllers/` directory is created in this task
   - Show that `routes/` directory is created in this task

**Starter Branch Content**:

- All routes in `server.ts` (inline handlers or basic functions)
- No `controllers/` directory yet
- No `routes/` directory yet
- Ready to organize code

---

### Task 4: Middleware Pipeline

**Changes Needed**:

1. **Focus on Two Middlewares**:
   - **Validation Middleware** (Zod)
   - **Error Handling Middleware** (centralized)

2. **Remove**:
   - Logging middleware (not needed)
   - RequestId middleware (not needed)
   - Error handling as separate concept (it's one of the two middlewares)

3. **Add "Why" Explanations**:
   - **Why Validation?**:
     - Data integrity
     - Type safety
     - Prevents invalid data from reaching database
     - Better error messages for clients
   - **Why Centralized Error Handling?**:
     - Consistent error responses
     - Centralized logging
     - Easier to maintain
     - Better debugging

4. **Update Instructions**:
   - Step 1: Create validation middleware with Zod
   - Step 2: Apply validation to POST/PUT routes
   - Step 3: Create error handling middleware
   - Step 4: Create CustomError class
   - Step 5: Register error middleware in server.ts
   - Step 6: Update controllers to use `next(error)`

5. **Learning Objectives**:
   - Understand middleware execution order
   - Understand why validation is necessary
   - Understand why centralized error handling is necessary
   - Learn to create custom middleware

**Starter Branch Content**:

- Organized routers and controllers
- No custom middleware yet
- Only built-in Express middleware
- Ready to add validation and error handling

---

### Task 5: Database Connection (REMOVED)

**Status**: ❌ **Task removed entirely**

**Reason**: Database setup is too complex. Instead, provide fully configured database in Task 6 starter branch.

**Action**: Delete `task-5-database-connection.md` or mark as "Skipped - see Task 6 starter branch"

---

### Task 6: CRUD Operations with Drizzle

**Changes Needed**:

1. **Update Starter Branch Description**:
   - **Critical**: Database is FULLY CONFIGURED in starter branch
   - All schemas exist
   - Migrations are run
   - Database connection works
   - Seed data is available
   - Participants only need to replace mock data with database queries

2. **Scope Clarification**:
   - **Only cover**: Comedians and Performances
   - **Do NOT cover**: Users, Favorites (those come in Task 7)

3. **Update Instructions**:
   - Step 1: Understand the provided database setup (explain what's included)
   - Step 2: Replace `mockData` imports with database imports
   - Step 3: Update GET endpoints to use `db.select()`
   - Step 4: Update POST endpoints to use `db.insert()`
   - Step 5: Update PUT endpoints to use `db.update()`
   - Step 6: Update DELETE endpoints to use `db.delete()`
   - Step 7: Remove mock data files

4. **Add "What's Provided" Section**:
   - List all database files that are included
   - Explain why they're provided (too complex for this task)
   - Show how to use them

**Starter Branch Content**:

- Complete database setup:
  - `src/db/index.ts` - connection
  - `src/db/schema/comedians.ts` - schema
  - `src/db/schema/performances.ts` - schema
  - `drizzle.config.ts` - config
  - `src/db/migrations/` - migrations (run)
  - `src/db/init.ts` - initialization
  - Database seeded with data
- Controllers still using `mockData.ts`
- Ready to replace with database queries

---

### Task 7: Authentication & Protected Routes

**Changes Needed**:

1. **Merge Task 8 into Task 7**:
   - Authentication setup AND protected routes in one task
   - After implementing auth, immediately apply it to favorites

2. **Starter Branch Content**:
   - **User schema already exists** (`src/db/schema/users.ts`)
   - **User table already created** (migration included)
   - **Auth controller structure provided** (function signatures, no implementation)
   - **Password utility file exists** (empty, ready for implementation)
   - **JWT utility file exists** (empty, ready for implementation)
   - CRUD for comedians and performances working

3. **Focus Areas**:
   - JWT strategy setup (Passport)
   - Password hashing implementation
   - Token generation
   - Registration/login logic
   - **Applying JWT to routes** (protected routes)
   - **Creating favorites resource** (protected)
   - Accessing `req.user` in controllers

4. **Update Instructions**:
   - Part 1: Authentication Setup
     - Implement password utilities
     - Implement JWT utilities
     - Create Passport JWT strategy
     - Implement registration
     - Implement login
   - Part 2: Protected Routes
     - Create favorites schema (or provide it)
     - Create favorites routes
     - Apply authentication middleware
     - Implement favorites controller
     - Access `req.user` in protected routes

5. **Add "What's Provided" Section**:
   - User schema (explain why provided)
   - Auth controller structure (explain why provided)
   - File structure for utilities

**Starter Branch Content**:

- Database CRUD working
- User schema and table exist
- Auth controller with function signatures
- Empty utility files
- No JWT strategy yet
- No protected routes yet

---

### Task 8: Protected Routes (REMOVED)

**Status**: ❌ **Task removed - merged into Task 7**

**Action**: Delete `task-8-protected-routes.md` or mark as "Merged into Task 7"

---

### Task 9: Swagger Documentation (formerly Task 10)

**Changes Needed**:

1. **Be Very Clear on Requirements**:
   - **Every endpoint must be documented**
   - List all endpoints that need documentation:
     - `/health` (GET)
     - `/api/comedians` (GET, POST)
     - `/api/comedians/:id` (GET, PUT, DELETE)
     - `/api/performances` (GET, POST)
     - `/api/performances/:id` (GET, PUT, DELETE)
     - `/api/auth/register` (POST)
     - `/api/auth/login` (POST)
     - `/api/favorites` (GET, POST)
     - `/api/favorites/:comedianId` (DELETE)

2. **Documentation Requirements**:
   - Summary for each endpoint
   - Tags (grouping)
   - Parameters (path, query, body)
   - Request body schema
   - Response schemas for each status code (200, 201, 400, 401, 404, etc.)
   - Security requirements (bearerAuth for protected routes)
   - Examples

3. **Schema Definitions**:
   - Comedian schema
   - Performance schema
   - User schema (without password)
   - Favorite schema
   - Error response schema
   - Auth request/response schemas

4. **Update Instructions**:
   - Step 1: Configure Swagger
   - Step 2: Define schemas in Swagger config
   - Step 3: Document each endpoint with JSDoc
   - Step 4: Test Swagger UI
   - Step 5: Verify all endpoints are documented
   - Step 6: Add examples

5. **Add Checklist**:
   - [ ] All endpoints documented
   - [ ] All schemas defined
   - [ ] All status codes documented
   - [ ] Authentication documented
   - [ ] Examples provided
   - [ ] Swagger UI accessible

**Starter Branch Content**:

- Complete working API
- All endpoints functional
- Authentication working
- Protected routes working
- No documentation yet

---

## 📝 General Changes Needed

### 1. Add "Why" Explanations

Every task should explain:

- **Why this concept is necessary**
- **What problem it solves**
- **When to use it**

### 2. Clear Starter Branch Descriptions

Each task should have a section:

```markdown
## Starter Branch

This task starts with:

- [List what's included]
- [List what's NOT included]
- [What you'll build in this task]
```

### 3. Application Context

Add to Task 1 (and reference in others):

- What we're building
- Main entities
- Purpose of the API

### 4. Entity Progression

Make it clear when each entity is introduced:

- **Tasks 1-6**: Comedians, Performances
- **Task 7**: Users, Favorites
- **Task 9**: Documentation (all entities)

---

## ✅ Action Items

### Files to Update:

1. `task-1-http-basics.md` - Add intro, entity context, mock data reference
2. `task-3-router-structure.md` - Clarify controllers created here
3. `task-4-middleware-pipeline.md` - Focus on validation + error handling, add "why" explanations
4. `task-6-crud-operations.md` - Clarify database provided, scope to comedians/performances
5. `task-7-authentication-setup.md` - Merge protected routes, clarify what's provided
6. `task-9-swagger-documentation.md` (renumber from 10) - Be very explicit about requirements

### Files to Remove/Mark:

1. `task-5-database-connection.md` - Mark as skipped
2. `task-8-protected-routes.md` - Mark as merged into Task 7
3. `task-9-error-handling.md` - Mark as merged into Task 4

### Files to Create:

1. `BRANCH_STRATEGY.md` - ✅ Created
2. Update each task file with starter branch section

---

## 🎯 Priority Order

1. **High Priority**: Update Task 4 (middleware), Task 6 (database scope), Task 7 (merge Task 8)
2. **Medium Priority**: Update Task 1 (intro), Task 3 (controllers), Task 9 (documentation clarity)
3. **Low Priority**: Remove/update Task 5, Task 8, old Task 9

---

This revision ensures:

- Clear progression from simple to complex
- Each task has a defined starter state
- Participants focus on learning, not setup
- All concepts are explained with "why"
- Final app state is reached through all tasks
