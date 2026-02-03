import { InferInsertModel, eq, sql } from "drizzle-orm";
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
			.where(eq(schema.showtimes.id, id));
		return showtime;
	},

	getShowtimesByDate: async (date: Date) => {
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		return await db.query.showtimes.findMany({
			where: (st, { and, gte, lte }) =>
				and(gte(st.startTime, startOfDay), lte(st.startTime, endOfDay)),
			with: {
				movie: true,
				room: true,
			},
		});
	},

	getAvailableSeats: async (showtimeId: number) => {
		const showtime = await db.query.showtimes.findFirst({
			where: eq(schema.showtimes.id, showtimeId),
		});

		if (!showtime) throw new Error("Showtime not found");

		const s = schema.seats;

		const seatsWithAvailability = await db
			.select({
				id: s.id,
				row: s.row,
				number: s.number,
				idAvailable: sql<boolean>`NOT EXISTS (
				SELECT 1 FROM ${schema.reservationSeats} rs
				JOIN ${schema.reservations} r ON rs.reservation_id = r.id
				WHERE rs.seat_id = ${sql`${s.id}`}
				AND r.showtime_id = ${showtimeId}
				AND r.status != 'cancelled'
			)`,
			})
			.from(s)
			.where(eq(s.roomId, showtime.roomId));

		return seatsWithAvailability;
	},
});
