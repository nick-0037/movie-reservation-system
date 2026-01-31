import { Router } from "express";
import { isAdmin } from "../middlewares/admin.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { db } from "../db/index";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.patch("/promote/:id", authenticate, isAdmin, async (req, res) => {
	const id = req.params.id as string;
	try {
		await db.update(profiles).set({ role: "admin" }).where(eq(profiles.id, id));

		res.json({ message: "User successfully promoted to administrator" });
	} catch (e) {
		res.status(500).json({ e: "The promotion could not be carried out" });
	}
});

export default router;
