import { Request, Response } from "express";
import { db } from "../db/index";
import { movieService } from "../services/movie.service";

const service = movieService(db);

export const createMovie = async (req: Request, res: Response) => {
	try {
		const { genreIds, ...data } = req.body;
		const movie = await service.createMovie(data, genreIds);

		return res.status(201).json({
			message: "Movie created successfully",
			data: {
				...movie,
				genreIds: data.genreIds,
			},
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const updateMovie = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		const data = req.body;
		const movie = await service.updateMovie(id, data);

		if (!movie) {
			return res.status(404).json({ message: "Movie not found" });
		}

		return res.status(200).json({
			message: "Movie updated successfully",
			data: movie,
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteMovie = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		const movie = await service.deleteMovie(id);

		if (!movie) {
			return res.status(404).json({ message: "Movie not found" });
		}

		return res.status(204).json({
			message: "Movie deleted successfully",
			data: movie,
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
};
