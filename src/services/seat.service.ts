import { InferInsertModel, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

export type NewSeat = InferInsertModel<typeof schema.seats>;

export const seatsService = (db: PostgresJsDatabase<typeof schema>) => ({
	generateSeatsForRoom: async (
		roomId: number,
		rowList: string[],
		seatsPerRoom: number,
	) => {
		const newSeats: NewSeat[] = [];

		for (const rowLabel of rowList) {
			for (let num = 1; num <= seatsPerRoom; num++) {
				newSeats.push({
					roomId,
					row: rowLabel,
					number: num,
				});
			}
		}

		return await db.insert(schema.seats).values(newSeats).returning();
	},

	getSeatsByRoom: async (roomId: number) => {
		return await db
			.select()
			.from(schema.seats)
			.where(eq(schema.seats.roomId, roomId));
	},
});
