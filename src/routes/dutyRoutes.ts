// This file defines the API routes for duties.

import { Router } from "express";
import { dutyController } from "../controllers/dutyController";
import { authorize, requirePermission } from "../middlewares/auth";

const router = Router();

router.get("/", dutyController.getAllDuties);
router.get("/:id", dutyController.getDutyById);
router.post(
  "/",
  authorize,
  //   requirePermission("duty.add"),
  dutyController.createDuty
);
router.put(
  "/:id",
  authorize,
  requirePermission("duty.edit"),
  dutyController.updateDuty
);
router.delete(
  "/:id",
  authorize,
  requirePermission("duty.remove"),
  dutyController.deleteDuty
);

export default router;
