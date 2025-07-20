// This file handles the request and response logic for duty-related API calls.

import { Request, Response, NextFunction } from "express";
import { dutyService } from "../services/dutyService";
import { dutyWorkerService } from "../services/dutyWorkerService";

export const dutyController = {
  getAllDuties: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { date, dutyWorker } = req.query; // Extract query parameters
      const allDuties = await dutyService.getAllDuties(
        date as string | undefined,
        dutyWorker as string | undefined
      );
      res.status(200).json(allDuties);
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  },

  getDutyById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const duty = await dutyService.getDutyById(id);
      if (!duty) {
        res.status(404).json({
          error: "Resource not found",
          details: `Duty with ID '${id}' could not be found.`,
        });
      } else {
        res.status(200).json(duty);
      }
    } catch (error) {
      next(error);
    }
  },

  createDuty: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { date, dutyTypeId, dutyWorkerId } = req.body;
      // Basic validation
      if (!date || !dutyTypeId || !dutyWorkerId) {
        res.status(400).json({
          error: "Invalid input data",
          details:
            "All fields (date, dutyTypeId, dutyWorkerId) are required.",
        });
      } else {
        const dutyWorker = await dutyWorkerService.getDutyWorkerById(
          dutyWorkerId
        );
        const dutyType = await dutyService.getDutyTypeById(
          dutyTypeId
        );
        if (!dutyType) {
          res.status(404).json({
            error: "DutyType not found",
            details: "Duty type with given id was not found",
          });
        } else if (!dutyWorker) {
          res.status(404).json({
            error: "DutyWorker not found",
            details: "Duty worker worker with given id was not found",
          });
        } else {
          const newDuty = await dutyService.createDuty({
            date,
            type: dutyType,
            dutyWorker: dutyWorker,
          });
          res.status(201).json(newDuty);
        }
      }
    } catch (error) {
      next(error);
    }
  },

  updateDuty: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedDuty = await dutyService.updateDuty(id, req.body);
      if (!updatedDuty) {
        res.status(404).json({
          error: "Resource not found",
          details: `Duty with ID '${id}' could not be found.`,
        });
      } else {
        res.status(200).json(updatedDuty);
      }
    } catch (error) {
      next(error);
    }
  },

  deleteDuty: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const deleted = await dutyService.deleteDuty(id);
      if (!deleted) {
        res.status(404).json({
          error: "Resource not found",
          details: `Duty with ID '${id}' could not be found.`,
        });
      } else {
        res.status(204).send(); // No content for successful deletion
      }
    } catch (error) {
      next(error);
    }
  },
};
