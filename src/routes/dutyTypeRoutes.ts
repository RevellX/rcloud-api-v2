// This file defines the API routes for duty types.

import { Router } from "express";
import { dutyTypeController } from "../controllers/dutyTypeController";
import { authorize, requirePermission } from "../middlewares/auth";

const router = Router();

router.get("/", dutyTypeController.getAllDutyTypes);
router.get("/:id", dutyTypeController.getDutyTypeById);
router.post(
  "/",
  authorize,
  requirePermission("dutyTypes.add"),
  dutyTypeController.createDutyType
);
router.put(
  "/:id",
  authorize,
  requirePermission("dutyTypes.edit"),
  dutyTypeController.updateDutyType
);
router.delete(
  "/:id",
  authorize,
  requirePermission("dutyTypes.remove"),
  dutyTypeController.deleteDutyType
);

export default router;
