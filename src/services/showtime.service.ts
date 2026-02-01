import { InferInsertModel, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

export type NewShowtime = InferInsertModel<typeof schema.showtimes>;

export const showtimeService = (db: PostgresJsDatabase<typeof schema>) => ({
	createShowtime: async (data: NewShowtime) => {
		const [showtime] = await db
			.insert(schema.showtimes)
			.values(data)
			.returning();

		return showtime;
	},

	getShowtimeByMovie: async (id: number) => {
		const [showtime] = await db
			.select()
			.from(schema.showtimes)
			.where(eq(schema.showtimes, id));
		return showtime;
	},
});
