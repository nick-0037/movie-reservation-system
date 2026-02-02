import { Router } from "express";
import * as genreController from "../controllers/genre.controller";
import { isAdmin } from "../middlewares/admin.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.get("/:id/movies", authenticate, isAdmin, genreController.getMoviesByGenre);

export default router;
