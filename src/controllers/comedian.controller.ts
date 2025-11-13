import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { db } from '../db';
import { comedians } from '../db/schema/comedians';
import { CustomError } from '../middleware/error.middleware';

export const getAllComedians = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nationality, limit, offset } = req.query;

    let query = db.select().from(comedians);

    if (nationality) {
      query = query.where(eq(comedians.nationality, nationality as string)) as any;
    }

    if (limit) {
      query = query.limit(Number(limit)) as any;
    }

    if (offset) {
      query = query.offset(Number(offset)) as any;
    }

    const allComedians = await query;

    res.json({
      data: allComedians,
      count: allComedians.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getComedianById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const [comedian] = await db.select().from(comedians).where(eq(comedians.id, id)).limit(1);

    if (!comedian) {
      throw new CustomError('Comedian not found', 404);
    }

    res.json({ data: comedian });
  } catch (error) {
    next(error);
  }
};

export const createComedian = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, bio, birthDate, nationality } = req.body;

    const [newComedian] = await db
      .insert(comedians)
      .values({
        name,
        bio,
        birthDate,
        nationality,
      })
      .returning();

    res.status(201).json({
      message: 'Comedian created successfully',
      data: newComedian,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComedian = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, bio, birthDate, nationality } = req.body;

    // Check if comedian exists
    const [existing] = await db.select().from(comedians).where(eq(comedians.id, id)).limit(1);

    if (!existing) {
      throw new CustomError('Comedian not found', 404);
    }

    const [updated] = await db
      .update(comedians)
      .set({
        name: name || existing.name,
        bio: bio !== undefined ? bio : existing.bio,
        birthDate: birthDate || existing.birthDate,
        nationality: nationality || existing.nationality,
        updatedAt: new Date(),
      })
      .where(eq(comedians.id, id))
      .returning();

    res.json({
      message: 'Comedian updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComedian = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if comedian exists
    const [existing] = await db.select().from(comedians).where(eq(comedians.id, id)).limit(1);

    if (!existing) {
      throw new CustomError('Comedian not found', 404);
    }

    await db.delete(comedians).where(eq(comedians.id, id));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
