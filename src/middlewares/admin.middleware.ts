import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";

export const isAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authUser = req.user;

	if (!authUser) {
		return res.status(401).json({ error: "Not authenticated" });
	}

	try {
		const [userProfile] = await db
			.select()
			.from(profiles)
			.where(eq(profiles.id, authUser.id))
			.limit(1);

		if (!userProfile || userProfile.role !== "admin") {
			return res.status(403).json({
				error: "Access denied. Administrator permissions are required.",
			});
		}

		req.profile = userProfile;

		next();
	} catch (e) {
		res.status(500).json({ error: "Error checking permissions" });
	}
};
