import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import movieRoutes from "./movies.routes";
import showtimeRoutes from "./showtimes.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/movies", movieRoutes);
router.use("/showtimes", showtimeRoutes);

export default router;
