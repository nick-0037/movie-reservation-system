import { Router } from "express";
import * as movieController from "../controllers/movie.controller";
import { isAdmin } from "../middlewares/admin.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post("/", authenticate, isAdmin, movieController.createMovie);
router.patch("/:id", authenticate, isAdmin, movieController.updateMovie);
router.delete("/:id", authenticate, isAdmin, movieController.deleteMovie);

export default router;
