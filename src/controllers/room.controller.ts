import { Request, Response } from "express";
import { db } from "../db/index";
import { roomService } from "../services/room.service";
import { seatsService } from "../services/seat.service";

const rService = roomService(db);
const sService = seatsService(db);

export const createRoom = async (req: Request, res: Response) => {
	try {
		const { name, capacity, rows, seatsPerRow } = req.body;

		const room = await rService.createRoom({ name, capacity });

		const generatedSeats = await sService.generateSeatsForRoom(
			room.id,
			rows,
			seatsPerRow,
		);

		res.status(201).json({
			message: "Room and seats created successfully",
			data: {
				room,
				seatsCount: generatedSeats.length,
			},
		});
	} catch (e) {
		res.status(500).json({ message: "Internal server error" });
	}
};
