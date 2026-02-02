import { Request, Response } from "express";
import { db } from "../db/index";
import { genreService } from "../services/genre.service";

const service = genreService(db);

export const getMoviesByGenre = async (req: Request, res: Response) => {
	try {
		const movieId = Number(req.params.id);
		const genres = await service.getMoviesByGenre(movieId);

		return res.status(200).json({
			message: "Movies retrieved by genre",
			data: genres,
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
};
