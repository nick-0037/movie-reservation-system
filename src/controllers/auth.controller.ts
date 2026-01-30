import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const handleSignUp = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	const { data, error } = await authService.signUp(email, password);

	if (error) {
		return res.status(400).json({ error: error.message });
	}

	res.json(data);
};

export const handleSignIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	const { data, error } = await authService.signIn(email, password);

	if (error) {
		return res.status(400).json({ error: error.message });
	}

	res.json(data);
};
