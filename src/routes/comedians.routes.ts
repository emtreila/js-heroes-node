import { Router } from 'express';
import {
  createComedian,
  deleteComedian,
  getAllComedians,
  getComedianById,
  updateComedian,
} from '../controllers/comedian.controller';

const router = Router();

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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: List of comedians
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
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               nationality:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comedian created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createComedian);

/**
 * @swagger
 * /api/comedians/{id}:
 *   put:
 *     summary: Update a comedian
 *     tags: [Comedians]
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
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               nationality:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comedian updated successfully
 *       404:
 *         description: Comedian not found
 */
router.put('/:id', updateComedian);

/**
 * @swagger
 * /api/comedians/{id}:
 *   delete:
 *     summary: Delete a comedian
 *     tags: [Comedians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comedian deleted successfully
 *       404:
 *         description: Comedian not found
 */
router.delete('/:id', deleteComedian);

export default router;
