import { Request, Response } from 'express';
import { mockComedians } from '../data/mockData';

export const getAllComedians = (req: Request, res: Response): void => {
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

    res.json({
    data: paginatedComedians,
    count: paginatedComedians.length,
    });
};

export const getComedianById = (req: Request, res: Response): void => {
    const { id } = req.params;
  const comedian = mockComedians.find((c) => c.id === id);

    if (!comedian) {
    res.status(404).json({
      error: { message: 'Comedian not found', statusCode: 404 },
    });
    return;
    }

    res.json({ data: comedian });
};

export const createComedian = (req: Request, res: Response): void => {
  const newComedian = {
    id: Date.now().toString(),
    ...req.body,
  };
  mockComedians.push(newComedian);
    res.status(201).json({
      message: 'Comedian created successfully',
      data: newComedian,
    });
};

export const updateComedian = (req: Request, res: Response): void => {
    const { id } = req.params;
  const comedianIndex = mockComedians.findIndex((c) => c.id === id);

  if (comedianIndex === -1) {
    res.status(404).json({
      error: { message: 'Comedian not found', statusCode: 404 },
    });
    return;
    }

  const updatedComedian = {
    ...mockComedians[comedianIndex],
    ...req.body,
  };
  mockComedians[comedianIndex] = updatedComedian;

    res.json({
      message: 'Comedian updated successfully',
    data: updatedComedian,
    });
};

export const deleteComedian = (req: Request, res: Response): void => {
    const { id } = req.params;
  const comedianIndex = mockComedians.findIndex((c) => c.id === id);

  if (comedianIndex === -1) {
    res.status(404).json({
      error: { message: 'Comedian not found', statusCode: 404 },
    });
    return;
    }

  mockComedians.splice(comedianIndex, 1);
    res.status(204).send();
};
