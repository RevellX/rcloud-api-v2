import { Router } from "express";
import { authController } from "../controllers/authController";
import { authorize, hello, ping, requirePermission } from "../middlewares/auth";

const router = Router();

router.post("/login", authController.login);

router.post("/refresh", authController.refresh);

export default router;
