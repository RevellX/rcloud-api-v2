// This file handles the request and response logic for dutyWorker-related API calls.

import { Request, Response, NextFunction } from "express";
import { dutyWorkerService } from "../services/dutyWorkerService";

export const dutyWorkerController = {
  getAllDutyWorkers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name } = req.query; // Extract query parameters
      const allDuties = await dutyWorkerService.getAllDutyWorkers(
        name as string | undefined
      );
      res.status(200).json(allDuties);
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  },

  getDutyWorkerById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const duty = await dutyWorkerService.getDutyWorkerById(id);
      if (!duty) {
        res.status(404).json({
          error: "Resource not found",
          details: `DutyWorker with ID '${id}' could not be found.`,
        });
      } else {
        res.status(200).json(duty);
      }
    } catch (error) {
      next(error);
    }
  },

  createDutyWorker: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, name } = req.body;
      // Basic validation
      if (!id || !name) {
        res.status(400).json({
          error: "Invalid input data",
          details: "All fields (id, name) are required.",
        });
      } else {
        const dutyWorker = await dutyWorkerService.getDutyWorkerById(
          id
        );
        if (dutyWorker) {
          res.status(409).json({
            error: "DutyWorker already exists",
            details: "DutyWorker with given id is already created",
          });
        } else {
          const newDutyWorker =
            await dutyWorkerService.createDutyWorker({
              id,
              name,
            });
          res.status(201).json(newDutyWorker);
        }
      }
    } catch (error) {
      next(error);
    }
  },

  updateDutyWorker: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedDutyWorker =
        await dutyWorkerService.updateDutyWorker(id, req.body);
      if (!updatedDutyWorker) {
        res.status(404).json({
          error: "Resource not found",
          details: `DutyWorker with ID '${id}' could not be found.`,
        });
      } else {
        res.status(200).json(updatedDutyWorker);
      }
    } catch (error) {
      next(error);
    }
  },

  deleteDutyWorker: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const deleted = await dutyWorkerService.deleteDutyWorker(id);
      if (!deleted) {
        res.status(404).json({
          error: "Resource not found",
          details: `DutyWorker with ID '${id}' could not be found.`,
        });
      } else {
        res.status(204).send(); // No content for successful deletion
      }
    } catch (error) {
      next(error);
    }
  },
};
