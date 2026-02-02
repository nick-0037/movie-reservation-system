import { InferInsertModel, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

export type NewGenre = InferInsertModel<typeof schema.genres>;

export const genreService = (db: PostgresJsDatabase<typeof schema>) => ({
	getMoviesByGenre: async (id: number) => {
		const result = await db.query.genres.findFirst({
			where: eq(schema.genres.id, id),
			with: {
				movies: {
					with: {
						movie: true,
					},
				},
			},
		});

		if (!result) return null;

		return {
			genre: result.name,
			movies: result.movies.map((m) => m.movie),
		};
	},
});
