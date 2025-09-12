// Simple error handling middleware.

import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({
    error: "Internal server error",
    // details: err.message || "An unexpected error occurred.",
  });
};
