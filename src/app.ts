// This file sets up the Express application, middleware, and routes.
import express from "express";
import cors from "cors";
import dutyRoutes from "./routes/dutyRoutes";
import dutyTypeRoutes from "./routes/dutyTypeRoutes";
import dutyWorkerRoutes from "./routes/dutyWorkerRoutes";
import { errorHandler } from "./utils/errorHandler";

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());

// Routes
app.use("/api/v1/duties", dutyRoutes);
app.use("/api/v1/dutyTypes", dutyTypeRoutes);
app.use("/api/v1/dutyWorkers", dutyWorkerRoutes);

// Global error handler (must be last middleware)
app.use(errorHandler);

export default app;
