import { Request, Response } from "express";
import { db } from "../db/index";
import { reservationService } from "../services/reservation.service";
import { User } from "@supabase/supabase-js";

const service = reservationService(db);

export const createReservation = async (req: Request, res: Response) => {
	try {
		const user = req.user as User;
		const { seatIds, ...restOfBody } = req.body;
		const reservationData = {
			...restOfBody,
			userId: user.id,
		};

		const reservation = await service.createReservation(
			reservationData,
			seatIds,
		);

		return res.status(201).json({
			message: "Reserved created successfully",
			data: reservation,
		});
	} catch (e: any) {
		if (e.message === "One or more seats have already been reserved") {
			return res.status(409).json({ message: e.message });
		}

		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const getUsersReservations = async (req: Request, res: Response) => {
	try {
		const user = req.user as User;

		const reservations = await service.getUserReservations(user.id);

		return res.status(200).json(reservations);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const cancelReservation = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params);
		const user = req.user as User;

		await service.cancelReservation(id, user.id);

		return res
			.status(200)
			.json({ message: "Reservation cancelled successfully" });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
};
