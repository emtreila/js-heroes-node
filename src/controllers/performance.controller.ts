import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { comedians } from '../db/schema/comedians';
import { performances } from '../db/schema/performances';

export const getAllPerformances = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { comedianId } = req.query;

    let query = db.select().from(performances);

    if (comedianId) {
      query = query.where(eq(performances.comedianId, comedianId as string)) as any;
    }

    const allPerformances = await query;

    res.json({
      data: allPerformances,
      count: allPerformances.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getPerformanceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const [performance] = await db
      .select()
      .from(performances)
      .where(eq(performances.id, id))
      .limit(1);

    if (!performance) {
      const error = new Error('Performance not found');
      res.status(404).json({ error: { message: error.message } });
      return;
    }

    res.json({ data: performance });
  } catch (error) {
    next(error);
  }
};

export const createPerformance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { comedianId, title, venue, date, description } = req.body;

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

    const [newPerformance] = await db
      .insert(performances)
      .values({
        comedianId,
        title,
        venue,
        date,
        description,
      })
      .returning();

    res.status(201).json({
      message: 'Performance created successfully',
      data: newPerformance,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePerformance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, venue, date, description, comedianId } = req.body;

    // Check if performance exists
    const [existing] = await db.select().from(performances).where(eq(performances.id, id)).limit(1);

    if (!existing) {
      const error = new Error('Performance not found');
      res.status(404).json({ error: { message: error.message } });
      return;
    }

    // If comedianId is being updated, verify it exists
    if (comedianId && comedianId !== existing.comedianId) {
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
    }

    const [updated] = await db
      .update(performances)
      .set({
        title: title || existing.title,
        venue: venue !== undefined ? venue : existing.venue,
        date: date || existing.date,
        description: description !== undefined ? description : existing.description,
        comedianId: comedianId || existing.comedianId,
        updatedAt: new Date(),
      })
      .where(eq(performances.id, id))
      .returning();

    res.json({
      message: 'Performance updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePerformance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if performance exists
    const [existing] = await db.select().from(performances).where(eq(performances.id, id)).limit(1);

    if (!existing) {
      const error = new Error('Performance not found');
      res.status(404).json({ error: { message: error.message } });
      return;
    }

    await db.delete(performances).where(eq(performances.id, id));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
