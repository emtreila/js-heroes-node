import { Router } from 'express';
import { z } from 'zod';
import {
  createPerformance,
  deletePerformance,
  getAllPerformances,
  getPerformanceById,
  updatePerformance,
} from '../controllers/performance.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const createPerformanceSchema = z.object({
  comedianId: z.uuid('Invalid comedian ID format'),
  title: z.string().min(1, 'Title is required'),
  venue: z.string().optional(),
  date: z.iso.date().optional(),
  description: z.string().optional(),
});

const updatePerformanceSchema = z.object({
  comedianId: z.uuid().optional(),
  title: z.string().min(1).optional(),
  venue: z.string().optional(),
  date: z.iso.date().optional(),
  description: z.string().optional(),
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
router.get('/', getAllPerformances);

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
router.get('/:id', getPerformanceById);

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
 *                 format: uuid
 *               title:
 *                 type: string
 *               venue:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Performance created successfully
 *       404:
 *         description: Comedian not found
 *       400:
 *         description: Validation error
 */
router.post('/', validate(createPerformanceSchema), createPerformance);

/**
 * @swagger
 * /api/performances/{id}:
 *   put:
 *     summary: Update a performance
 *     tags: [Performances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comedianId:
 *                 type: string
 *               title:
 *                 type: string
 *               venue:
 *                 type: string
 *               date:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Performance updated successfully
 *       404:
 *         description: Performance not found
 */
router.put('/:id', validate(updatePerformanceSchema), updatePerformance);

/**
 * @swagger
 * /api/performances/{id}:
 *   delete:
 *     summary: Delete a performance
 *     tags: [Performances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Performance deleted successfully
 *       404:
 *         description: Performance not found
 */
router.delete('/:id', deletePerformance);

export default router;
