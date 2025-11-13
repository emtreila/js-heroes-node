# Extra Assignments

These assignments are for participants who finish the core tasks early. They are exploratory and don't have starting branches - you'll need to implement them from scratch!

## Assignment 1: Pagination & Sorting

### Objective
Enhance the GET endpoints to support pagination and sorting.

### Requirements
- Add `page` and `limit` query parameters (or use `offset` and `limit`)
- Add `sortBy` and `sortOrder` query parameters
- Return pagination metadata (total count, current page, total pages)
- Apply sorting to database queries

### Example
```
GET /api/comedians?page=1&limit=10&sortBy=name&sortOrder=asc
```

### Expected Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## Assignment 2: Search Functionality

### Objective
Add search capabilities to find comedians by name or bio.

### Requirements
- Add `search` query parameter
- Search across multiple fields (name, bio)
- Use case-insensitive matching
- Return results ranked by relevance (optional)

### Example
```
GET /api/comedians?search=chappelle
```

### Expected Response
```json
{
  "data": [
    {
      "id": "...",
      "name": "Dave Chappelle",
      "bio": "...",
      "matchScore": 0.95
    }
  ],
  "count": 1
}
```

## Assignment 3: User Profiles

### Objective
Allow users to view and update their own profile.

### Requirements
- Create `GET /api/users/me` endpoint (get current user profile)
- Create `PUT /api/users/me` endpoint (update profile)
- Add user profile fields (name, bio, avatar URL, etc.)
- Ensure users can only update their own profile

### Example
```
GET /api/users/me
Authorization: Bearer <token>
```

### Expected Response
```json
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "Comedy enthusiast",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

## Assignment 4: Performance Statistics

### Objective
Create endpoints that provide statistics about performances.

### Requirements
- `GET /api/statistics/performances` - Get performance statistics
- Calculate total number of performances
- Calculate performances per comedian
- Calculate performances by year/month
- Return aggregated data

### Example
```
GET /api/statistics/performances
```

### Expected Response
```json
{
  "data": {
    "total": 25,
    "byComedian": [
      {
        "comedianId": "abc-123",
        "comedianName": "Dave Chappelle",
        "count": 5
      }
    ],
    "byYear": {
      "2023": 10,
      "2024": 15
    }
  }
}
```

## Assignment 5: Rate Limiting Middleware

### Objective
Implement rate limiting to prevent API abuse.

### Requirements
- Install `express-rate-limit` package
- Create rate limiting middleware
- Apply different limits to different endpoints
- Return appropriate error responses when limit is exceeded
- Include rate limit information in response headers

### Example
```typescript
// Apply to auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
});
```

### Expected Response (When Limit Exceeded)
```json
{
  "error": {
    "message": "Too many requests, please try again later",
    "statusCode": 429
  }
}
```

### Expected Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705315200
```

## Assignment 6: File Upload (Advanced)

### Objective
Allow users to upload comedian photos or avatars.

### Requirements
- Install `multer` for file uploads
- Create upload endpoint
- Validate file types and sizes
- Store files (local filesystem or cloud storage)
- Update comedian schema to include image URL

### Example
```
POST /api/comedians/:id/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: <image file>
```

## Assignment 7: Caching (Advanced)

### Objective
Implement caching for frequently accessed data.

### Requirements
- Install `node-cache` or use Redis
- Cache GET requests for comedians
- Implement cache invalidation on updates
- Set appropriate TTL (Time To Live)
- Return cached data when available

### Example
```typescript
// Cache for 5 minutes
cache.set(`comedian:${id}`, data, 300);
```

## Assignment 8: Webhooks (Advanced)

### Objective
Implement webhook notifications for events.

### Requirements
- Create webhook registration endpoint
- Store webhook URLs in database
- Send HTTP POST requests to webhooks on events
- Handle webhook delivery failures
- Implement retry logic

### Example
```
POST /api/webhooks
Authorization: Bearer <token>

{
  "url": "https://example.com/webhook",
  "events": ["comedian.created", "performance.updated"]
}
```

## Tips for Extra Assignments

1. **Start Simple**: Begin with basic implementation, then add features
2. **Test Thoroughly**: Write manual test cases in Gherkin format
3. **Document**: Update Swagger documentation for new endpoints
4. **Error Handling**: Don't forget error handling for new features
5. **Code Quality**: Follow the same patterns used in core tasks
6. **Ask for Help**: Don't hesitate to ask instructors for guidance

## Submission

When you complete an extra assignment:
1. Test it thoroughly
2. Document it in Swagger
3. Share your implementation with instructors
4. Be ready to explain your approach

Good luck! 🚀

