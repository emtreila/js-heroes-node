import { Request, Response } from 'express';
import { mockComedians, mockPerformances } from '../data/mockData';

export const getAllPerformances = (req: Request, res: Response): void => {
  const { comedianId } = req.query;

  let filteredPerformances = [...mockPerformances];

  if (comedianId) {
    filteredPerformances = filteredPerformances.filter(
      (p) => p.comedianId === comedianId
    );
  }

  res.json({
    data: filteredPerformances,
    count: filteredPerformances.length,
  });
};

export const getPerformanceById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const performance = mockPerformances.find((p) => p.id === id);

  if (!performance) {
    res.status(404).json({
      error: { message: 'Performance not found', statusCode: 404 },
    });
    return;
  }

  res.json({ data: performance });
};

export const createPerformance = (req: Request, res: Response): void => {
  const { comedianId } = req.body;

  // Verify comedian exists
  const comedian = mockComedians.find((c) => c.id === comedianId);
  if (!comedian) {
    res.status(404).json({
      error: { message: 'Comedian not found', statusCode: 404 },
    });
    return;
  }

  const newPerformance = {
    id: Date.now().toString(),
    ...req.body,
  };
  mockPerformances.push(newPerformance);
  res.status(201).json({
    message: 'Performance created successfully',
    data: newPerformance,
  });
};

export const updatePerformance = (req: Request, res: Response): void => {
  const { id } = req.params;
  const performanceIndex = mockPerformances.findIndex((p) => p.id === id);

  if (performanceIndex === -1) {
    res.status(404).json({
      error: { message: 'Performance not found', statusCode: 404 },
    });
    return;
  }

  // If comedianId is being updated, verify it exists
  if (req.body.comedianId) {
    const comedian = mockComedians.find((c) => c.id === req.body.comedianId);
    if (!comedian) {
      res.status(404).json({
        error: { message: 'Comedian not found', statusCode: 404 },
      });
      return;
    }
  }

  const updatedPerformance = {
    ...mockPerformances[performanceIndex],
    ...req.body,
  };
  mockPerformances[performanceIndex] = updatedPerformance;

  res.json({
    message: 'Performance updated successfully',
    data: updatedPerformance,
  });
};

export const deletePerformance = (req: Request, res: Response): void => {
  const { id } = req.params;
  const performanceIndex = mockPerformances.findIndex((p) => p.id === id);

  if (performanceIndex === -1) {
    res.status(404).json({
      error: { message: 'Performance not found', statusCode: 404 },
    });
    return;
  }

  mockPerformances.splice(performanceIndex, 1);
  res.status(204).send();
};
