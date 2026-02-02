import { Request, Response } from "express";
import { db } from "../db/index";
import { showtimeService } from "../services/showtime.service";

const service = showtimeService(db);

export const createShowtime = async (req: Request, res: Response) => {
	try {
		const data = req.body;

		const formattedData = {
			...data,
			startTime: new Date(data.startTime),
		};

		if (isNaN(formattedData.startTime.getTime())) {
			return res
				.status(400)
				.json({ message: "Invalid date format in startTime" });
		}

		const showtime = await service.createShowtime(formattedData);

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

export const getShowtimesByDate = async (req: Request, res: Response) => {
	try {
		const { date } = req.query;
		console.log("date query:", date);

		if (!date) {
			return res
				.status(400)
				.json({ message: "Date parameter is required (YYYY-MM-DD)" });
		}

		const searchDate = new Date(date as any);

		if (isNaN(searchDate.getTime())) {
			return res
				.status(400)
				.json({ message: "Invalid date format. Use YYYY-MM-DD" });
		}

		const showtimes = await service.getShowtimesByDate(searchDate);

		console.log("showtimes from service", showtimes);

		res.status(200).json({
			message: "Movie retrieved by showtime date",
			data: showtimes,
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
};
