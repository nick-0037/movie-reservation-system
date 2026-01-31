import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer")) {
			return res.status(401).json({ error: "Not provided access token" });
		}

		const token = authHeader.split(" ")[1];

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error || !user) {
			return res.status(401).json({ error: "Token is invalid or expired" });
		}

		req.user = user;
		next();
	} catch (e) {
		res.status(500).json({ error: "Internal error" });
	}
};
