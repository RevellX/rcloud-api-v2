// This file defines the API routes for duties.

import { Router } from "express";
import { dutyWorkerController } from "../controllers/dutyWorkersController";

const router = Router();

router.get("/", dutyWorkerController.getAllDutyWorkers);
router.get("/:id", dutyWorkerController.getDutyWorkerById);
router.post("/", dutyWorkerController.createDutyWorker);
router.put("/:id", dutyWorkerController.updateDutyWorker);
router.delete("/:id", dutyWorkerController.deleteDutyWorker);

export default router;
