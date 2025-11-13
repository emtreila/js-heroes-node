# Comedian Catalog API - Node.js Workshop

A RESTful API built with Express.js, TypeScript, and PostgreSQL for managing a comedian catalog. This project is designed as a 4-hour workshop for developers with frontend JavaScript experience who want to learn backend development.

## 🎯 Workshop Overview

This workshop covers essential backend concepts:
- **HTTP Fundamentals**: Verbs, status codes, headers, payloads, dynamic routes, query parameters
- **Endpoint Structure**: Organizing code with routers
- **Middleware**: Understanding the request pipeline
- **Authentication & Authorization**: JWT tokens with Passport.js
- **ORM Integration**: Working with databases using Drizzle ORM

## 🚀 Prerequisites

- Node.js (v20 or higher)
- Docker and Docker Compose
- Basic knowledge of JavaScript/TypeScript
- Familiarity with REST APIs (as a consumer)

## 📦 Tech Stack

- **Runtime**: Node.js (Latest LTS)
- **Framework**: Express.js v5.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js with JWT
- **Documentation**: Swagger/OpenAPI

## 🏗️ Project Structure

```
js-heroes-node/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/      # Request handlers
│   ├── db/              # Database schemas and migrations
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API route definitions
│   ├── strategies/     # Passport strategies
│   ├── utils/          # Utility functions
│   └── server.ts       # Application entry point
├── docker-compose.yml   # Docker services configuration
├── Dockerfile          # Node.js application container
└── drizzle.config.ts   # Drizzle ORM configuration
```

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd js-heroes-node

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/comedian_catalog
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 3. Start with Docker Compose

```bash
# Start PostgreSQL and the application
docker-compose up -d

# Wait for services to be ready, then run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Development Mode

If running locally (without Docker):

```bash
# Start PostgreSQL (if not using Docker)
# Then run migrations and seed
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation at:

**http://localhost:3000/api-docs**

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Comedians
- `GET /api/comedians` - Get all comedians (supports query params: `nationality`, `limit`, `offset`)
- `GET /api/comedians/:id` - Get comedian by ID
- `POST /api/comedians` - Create a new comedian
- `PUT /api/comedians/:id` - Update a comedian
- `DELETE /api/comedians/:id` - Delete a comedian

### Performances
- `GET /api/performances` - Get all performances (supports query param: `comedianId`)
- `GET /api/performances/:id` - Get performance by ID
- `POST /api/performances` - Create a new performance
- `PUT /api/performances/:id` - Update a performance
- `DELETE /api/performances/:id` - Delete a performance

### Favorites (Protected - Requires Authentication)
- `GET /api/favorites` - Get user's favorite comedians
- `POST /api/favorites` - Add comedian to favorites
- `DELETE /api/favorites/:comedianId` - Remove comedian from favorites

## 🔐 Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a token:
1. Register a new user: `POST /api/auth/register`
2. Or login: `POST /api/auth/login`

Both endpoints return a JWT token in the response.

## 📖 Workshop Structure

The workshop is divided into 10-15 minute tasks, each with its own branch and detailed README. Each task README includes:
- Learning objectives
- Step-by-step instructions
- Code examples
- **Gherkin-format manual testing scenarios** with expected results

### Task Branches

1. **HTTP Basics** - Verbs, status codes, headers, payloads
2. **Dynamic Routes & Query Parameters** - Path segments and query strings
3. **Router Structure** - Code organization with Express routers
4. **Middleware Pipeline** - Understanding request/response flow
5. **Database Connection** - Setting up Drizzle ORM
6. **CRUD Operations** - Create, Read, Update, Delete with Drizzle
7. **Authentication Setup** - JWT and Passport.js integration
8. **Protected Routes** - Authorization middleware
9. **Error Handling** - Centralized error management
10. **Swagger Documentation** - API documentation setup

### Extra Assignments (Exploratory)

For participants who finish early:
- Pagination & Sorting
- Search Functionality
- User Profiles
- Performance Statistics
- Rate Limiting Middleware

## 🧪 Testing

Each task includes Gherkin-format test scenarios. Example:

```gherkin
Feature: User Registration

  Scenario: Successfully register a new user
    Given I have valid user credentials
    When I send a POST request to /api/auth/register
      And the request body contains email and password
    Then I should receive a 201 status code
      And the response should contain a user object
      And the response should contain a JWT token
```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## 🤝 Contributing

This is a workshop repository. For questions or issues, please contact the workshop instructors.

## 📄 License

MIT

---

**Happy Coding! 🎭**
