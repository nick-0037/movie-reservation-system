import { Router } from "express";
import * as roomController from "../controllers/room.controller";
import { isAdmin } from "../middlewares/admin.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post("/", authenticate, isAdmin, roomController.createRoom);

export default router;
