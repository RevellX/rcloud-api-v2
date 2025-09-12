// This file sets up the Express application, middleware, and routes.
import express from "express";
import cors from "cors";
import dutyRoutes from "./routes/dutyRoutes";
import dutyTypeRoutes from "./routes/dutyTypeRoutes";
import dutyWorkerRoutes from "./routes/dutyWorkerRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./utils/errorHandler";
import { initializeDatabase } from "./utils/database";
import User from "./models/User";
const bcrypt = require("bcrypt");

const app = express();

// DB
initializeDatabase();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());

// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/duties", dutyRoutes);
app.use("/v1/dutyTypes", dutyTypeRoutes);
app.use("/v1/dutyWorkers", dutyWorkerRoutes);

app.use(errorHandler);

export default app;
