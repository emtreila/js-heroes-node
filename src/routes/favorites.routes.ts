import { Router } from 'express';
import { z } from 'zod';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorite.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const addFavoriteSchema = z.object({
  comedianId: z.uuid('Invalid comedian ID format'),
});

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
// TODO: Add passport.authenticate('jwt', { session: false }) middleware
router.get('/', getFavorites);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add comedian to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comedianId
 *             properties:
 *               comedianId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Comedian added to favorites
 *       404:
 *         description: Comedian not found
 *       409:
 *         description: Already in favorites
 *       401:
 *         description: Unauthorized
 */
// TODO: Add passport.authenticate('jwt', { session: false }) middleware
router.post('/', validate(addFavoriteSchema), addFavorite);

/**
 * @swagger
 * /api/favorites/{comedianId}:
 *   delete:
 *     summary: Remove comedian from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comedianId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Comedian removed from favorites
 *       404:
 *         description: Favorite not found
 *       401:
 *         description: Unauthorized
 */
// TODO: Add passport.authenticate('jwt', { session: false }) middleware
router.delete('/:comedianId', removeFavorite);

export default router;
