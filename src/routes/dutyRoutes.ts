// This file defines the API routes for duties.

import { Router } from "express";
import { dutyController } from "../controllers/dutyController";

const router = Router();

router.get("/", dutyController.getAllDuties);
router.get("/:id", dutyController.getDutyById);
router.post("/", dutyController.createDuty);
router.put("/:id", dutyController.updateDuty);
router.delete("/:id", dutyController.deleteDuty);

export default router;
