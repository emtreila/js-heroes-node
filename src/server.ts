import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { mockComedians } from './data/mockData';

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// /**
//  * @swagger
//  * /api/comedians:
//  *   get:
//  *     summary: Get all comedians
//  *     tags: [Comedians]
//  *     responses:
//  *       200:
//  *         description: List of comedians
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                 count:
//  *                   type: number
//  */
// app.get('/api/comedians', (_req: Request, res: Response) => {
//   res.status(200).json({
//     data: mockComedians,
//     count: mockComedians.length,
//   });
// });

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
 *                 example: "American stand-up comedian"
 *               nationality:
 *                 type: string
 *                 example: "US"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1973-08-24"
 *     responses:
 *       201:
 *         description: Comedian created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
app.post('/api/comedians', (req: Request, res: Response) => {
  const newComedian = {
    id: Date.now().toString(), // Simple ID generation for now
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
    const comedian = mockComedians.find((c) => c.id === id);
    if (comedian) {
      res.status(200).json({
        data: comedian,
      });
    } else {
      res.status(404).json({
        message: 'Comedian not found',
      });
    }
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
app.get('/api/comedians', (req, res) => {
    const { nationality, limit, offset } = req.query;
    // Use query params to filter results
    let limitCopy = Number(limit);
    let offsetCopy = Number(offset) -1;

    if (!limit){
        limitCopy = 10;
    }
    if (!offset){
        offsetCopy = 1;
    }
    let comedians = mockComedians.filter((c) => c.nationality === nationality);
    if (!comedians) {
        res.status(404).json({
            message: 'Comedian not found',
        });
    }
    if (Number(limitCopy) <= 0) {
        res.status(400).json({
            message: 'Invalid limit',
        })
    }
    if (Number(offsetCopy) < 0) {
        res.status(400).json({
            message: 'Invalid offset',
        })
    }
    console.log("offset = ", offset, "limit = ", limit)
    let comedians2 = comedians.slice(Number(offsetCopy),Number(offsetCopy)+Number(limitCopy));
    res .status(200).json({
        data: comedians2,
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
