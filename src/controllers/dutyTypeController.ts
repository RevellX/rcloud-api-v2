// This file handles the request and response logic for dutyType-related API calls.

import { Request, Response, NextFunction } from "express";
import { dutyTypeService } from "../services/dutyTypeService";

export const dutyTypeController = {
  getAllDutyTypes: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, time, address } = req.query; // Extract query parameters
      const allDuties = await dutyTypeService.getAllDutyTypes(
        name as string | undefined,
        address as string | undefined,
        time as string | undefined
      );
      res.status(200).json(allDuties);
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  },

  getDutyTypeById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const duty = await dutyTypeService.getDutyTypeById(id);
      if (!duty) {
        res.status(404).json({
          error: "Resource not found",
          details: `DutyType with ID '${id}' could not be found.`,
        });
      } else {
        res.status(200).json(duty);
      }
    } catch (error) {
      next(error);
    }
  },

  createDutyType: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, time, address } = req.body;
      // Basic validation
      if (!name || !time) {
        res.status(400).json({
          error: "Invalid input data",
          details: "All fields (name, time) are required.",
        });
      } else {
        const newDuty = await dutyTypeService.createDutyType({
          name,
          time,
          address,
        });
        res.status(201).json(newDuty);
      }
    } catch (error) {
      next(error);
    }
  },

  updateDutyType: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedDutyType = await dutyTypeService.updateDutyType(
        id,
        req.body
      );
      if (!updatedDutyType) {
        res.status(404).json({
          error: "Resource not found",
          details: `Duty with ID '${id}' could not be found.`,
        });
      } else {
        res.status(200).json(updatedDutyType);
      }
    } catch (error) {
      next(error);
    }
  },

  deleteDutyType: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const deleted = await dutyTypeService.deleteDutyType(id);
      if (!deleted) {
        res.status(404).json({
          error: "Resource not found",
          details: `DutyType with ID '${id}' could not be found.`,
        });
      } else {
        res.status(204).send(); // No content for successful deletion
      }
    } catch (error) {
      next(error);
    }
  },
};
