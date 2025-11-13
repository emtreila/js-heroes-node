import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { initializeDatabase } from './db/init';
import { jwtStrategy } from './strategies/jwt.strategy';

import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import comedianRoutes from './routes/comedians.routes';
import favoriteRoutes from './routes/favorites.routes';
import performanceRoutes from './routes/performances.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(jwtStrategy);
app.use(passport.initialize());

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
    uptime: process.uptime(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/comedians', comedianRoutes);
app.use('/api/performances', performanceRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
});

app.use(errorMiddleware);

// Initialize database and start server
async function startServer() {
  try {
    // Run migrations and optionally seed based on environment variables
    const shouldRunMigrations = process.env.RUN_MIGRATIONS_ON_START !== 'false';
    const shouldRunSeed = process.env.RUN_SEED_ON_START === 'true';

    if (shouldRunMigrations || shouldRunSeed) {
      await initializeDatabase({
        runMigrations: shouldRunMigrations,
        runSeed: shouldRunSeed,
      });
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
