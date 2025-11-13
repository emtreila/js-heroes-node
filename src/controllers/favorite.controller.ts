import { and, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { comedians } from '../db/schema/comedians';
import { favorites } from '../db/schema/favorites';
import { assertAuthenticated } from '../utils/auth.util';

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;

    const userFavorites = await db
      .select({
        comedian: comedians,
      })
      .from(favorites)
      .innerJoin(comedians, eq(favorites.comedianId, comedians.id))
      .where(eq(favorites.userId, userId));

    res.json({
      data: userFavorites.map((fav) => fav.comedian),
      count: userFavorites.length,
    });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;
    const { comedianId } = req.body;

    // Verify comedian exists
    const [comedian] = await db
      .select()
      .from(comedians)
      .where(eq(comedians.id, comedianId))
      .limit(1);

    if (!comedian) {
      const error = new Error('Comedian not found');
      res.status(404).json({ error: { message: error.message } });
      return;
    }

    // Check if already favorited
    const [existing] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.comedianId, comedianId)))
      .limit(1);

    if (existing) {
      const error = new Error('Comedian already in favorites');
      res.status(409).json({ error: { message: error.message } });
      return;
    }

    await db.insert(favorites).values({
      userId,
      comedianId,
    });

    res.status(201).json({
      message: 'Comedian added to favorites',
      data: comedian,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;
    const { comedianId } = req.params;

    // Check if favorite exists
    const [existing] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.comedianId, comedianId)))
      .limit(1);

    if (!existing) {
      const error = new Error('Favorite not found');
      res.status(404).json({ error: { message: error.message } });
      return;
    }

    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.comedianId, comedianId)));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
