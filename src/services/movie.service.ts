import { InferInsertModel, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

export type NewMovie = InferInsertModel<typeof schema.movies>;

export const movieService = (db: PostgresJsDatabase<typeof schema>) => ({
	createMovie: async (data: NewMovie, genreIds: number[]) => {
		return await db.transaction(async (tx) => {
			const [movie] = await tx.insert(schema.movies).values(data).returning();

			if (genreIds && genreIds.length > 0) {
				const links = genreIds.map((id) => ({
					movieId: movie.id,
					genreId: id,
				}));

				await tx.insert(schema.moviesToGenres).values(links);
			}

			return movie;
		});
	},

	updateMovie: async (id: number, data: Partial<NewMovie>) => {
		const [updatedMovie] = await db
			.update(schema.movies)
			.set(data)
			.where(eq(schema.movies.id, id))
			.returning();

		return updatedMovie;
	},

	deleteMovie: async (id: number) => {
		const [deletedMovie] = await db
			.delete(schema.movies)
			.where(eq(schema.movies.id, id))
			.returning();

		return deletedMovie;
	},
});
