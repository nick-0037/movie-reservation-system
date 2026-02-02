import { Request, Response } from "express";
import { db } from "../db/index";
import { showtimeService } from "../services/showtime.service";

const service = showtimeService(db);

export const createShowtime = async (req: Request, res: Response) => {
	try {
		const data = req.body;
		const showtime = await service.createShowtime(data);

		return res.status(201).json({
			message: "Showtime created successfully",
			data: showtime,
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json("Internal server error");
	}
};

export const getShowtime = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		const showtime = await service.getShowtimeByMovie(id);

		if (!showtime) {
			return res.status(404).json({
				message: "Showtime not found",
			});
		}

		return res.status(200).json({
			message: "Showtime created successfully",
			data: showtime,
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json("Internal server error");
	}
};
