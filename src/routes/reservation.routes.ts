import { Router } from "express";
import * as reservationController from "../controllers/reservation.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post("/", authenticate, reservationController.createReservation);
router.get("/", authenticate, reservationController.getUsersReservations);
router.patch(
	"/:id/cancel",
	authenticate,
	reservationController.cancelReservation,
);

export default router;
