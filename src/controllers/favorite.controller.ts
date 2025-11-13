import { NextFunction, Request, Response } from 'express';
// TODO: Import necessary dependencies (db, schemas, etc.)

/**
 * Get user's favorite comedians
 * TODO: Implement favorites retrieval
 * - Get authenticated user from req.user (after JWT strategy is set up)
 * - Query favorites table for user's favorites
 * - Join with comedians table to get full comedian data
 * - Return list of favorite comedians
 */
export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // TODO: Implement get favorites logic
  res.status(501).json({ message: 'Not implemented yet' });
};

/**
 * Add comedian to favorites
 * TODO: Implement add favorite
 * - Get authenticated user from req.user
 * - Verify comedian exists
 * - Check if already in favorites
 * - Add to favorites table
 */
export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // TODO: Implement add favorite logic
  res.status(501).json({ message: 'Not implemented yet' });
};

/**
 * Remove comedian from favorites
 * TODO: Implement remove favorite
 * - Get authenticated user from req.user
 * - Verify favorite exists
 * - Remove from favorites table
 */
export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // TODO: Implement remove favorite logic
  res.status(501).json({ message: 'Not implemented yet' });
};
