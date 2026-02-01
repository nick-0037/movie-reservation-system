import { InferInsertModel, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

export type NewMovie = InferInsertModel<typeof schema.movies>;

export const movieService = (db: PostgresJsDatabase<typeof schema>) => ({
	createMovie: async (data: NewMovie) => {
		const [movie] = await db.insert(schema.movies).values(data).returning();
		return movie;
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
