import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.handleSignUp);
router.post("/login", authController.handleSignIn);

export default router;
