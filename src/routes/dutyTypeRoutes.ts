// This file defines the API routes for duty types.

import { Router } from "express";
import { dutyTypeController } from "../controllers/dutyTypeController";

const router = Router();

router.get("/", dutyTypeController.getAllDutyTypes);
router.get("/:id", dutyTypeController.getDutyTypeById);
router.post("/", dutyTypeController.createDutyType);
router.put("/:id", dutyTypeController.updateDutyType);
router.delete("/:id", dutyTypeController.deleteDutyType);

export default router;
