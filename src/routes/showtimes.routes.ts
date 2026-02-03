import { Router } from "express";
import * as showtimeController from "../controllers/showtime.controller";
import { isAdmin } from "../middlewares/admin.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post("/", authenticate, isAdmin, showtimeController.createShowtime);
router.get("/", authenticate, isAdmin, showtimeController.getShowtimesByDate);
router.get("/:id", authenticate, isAdmin, showtimeController.getShowtime);
router.get(
	"/:id/seats",
	authenticate,
	isAdmin,
	showtimeController.getAvailableSeats,
);

export default router;
