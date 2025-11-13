import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { mockComedians, mockPerformances } from './data/mockData';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

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
app.get('/api/comedians', (req: Request, res: Response) => {
  const { nationality, limit, offset } = req.query;
  
  let filteredComedians = [...mockComedians];
  
  // Filter by nationality if provided
  if (nationality) {
    filteredComedians = filteredComedians.filter(
      (c) => c.nationality === nationality
    );
  }
  
  // Apply pagination
  const startIndex = offset ? Number(offset) : 0;
  const endIndex = limit
    ? startIndex + Number(limit)
    : filteredComedians.length;
  const paginatedComedians = filteredComedians.slice(startIndex, endIndex);
  
  res.status(200).json({
    data: paginatedComedians,
    count: paginatedComedians.length,
  });
});

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
app.get('/api/comedians/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const comedian = mockComedians.find((c) => c.id === id);
  
  if (!comedian) {
    return res.status(404).json({
      error: { message: 'Comedian not found', statusCode: 404 },
    });
  }
  
  res.json({ data: comedian });
});

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
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dave Chappelle"
 *               bio:
 *                 type: string
 *               nationality:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Comedian created successfully
 */
app.post('/api/comedians', (req: Request, res: Response) => {
  const newComedian = {
    id: Date.now().toString(),
    ...req.body,
  };
  mockComedians.push(newComedian);
  res.status(201).json({
    message: 'Comedian created successfully',
    data: newComedian,
  });
});

/**
 * @swagger
 * /api/performances:
 *   get:
 *     summary: Get all performances
 *     tags: [Performances]
 *     parameters:
 *       - in: query
 *         name: comedianId
 *         schema:
 *           type: string
 *         description: Filter by comedian ID
 *     responses:
 *       200:
 *         description: List of performances
 */
app.get('/api/performances', (req: Request, res: Response) => {
  const { comedianId } = req.query;
  
  let filteredPerformances = [...mockPerformances];
  
  if (comedianId) {
    filteredPerformances = filteredPerformances.filter(
      (p) => p.comedianId === comedianId
    );
  }
  
  res.status(200).json({
    data: filteredPerformances,
    count: filteredPerformances.length,
  });
});

/**
 * @swagger
 * /api/performances/{id}:
 *   get:
 *     summary: Get performance by ID
 *     tags: [Performances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Performance details
 *       404:
 *         description: Performance not found
 */
app.get('/api/performances/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const performance = mockPerformances.find((p) => p.id === id);
  
  if (!performance) {
    return res.status(404).json({
      error: { message: 'Performance not found', statusCode: 404 },
    });
  }
  
  res.json({ data: performance });
});

/**
 * @swagger
 * /api/performances:
 *   post:
 *     summary: Create a new performance
 *     tags: [Performances]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comedianId
 *               - title
 *             properties:
 *               comedianId:
 *                 type: string
 *               title:
 *                 type: string
 *               venue:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Performance created successfully
 */
app.post('/api/performances', (req: Request, res: Response) => {
  const newPerformance = {
    id: Date.now().toString(),
    ...req.body,
  };
  mockPerformances.push(newPerformance);
  res.status(201).json({
    message: 'Performance created successfully',
    data: newPerformance,
  });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;
