import { InferInsertModel, and, eq, inArray, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

export type NewReservation = InferInsertModel<typeof schema.reservations>;

export const reservationService = (db: PostgresJsDatabase<typeof schema>) => ({
	createReservation: async (data: NewReservation, seatIds: number[]) => {
		return await db.transaction(async (tx) => {
			const existingReservations = await tx
				.select()
				.from(schema.reservationSeats)
				.innerJoin(
					schema.reservations,
					eq(schema.reservationSeats.reservationId, schema.reservations.id),
				)
				.where(
					and(
						eq(schema.reservations.showtimeId, data.showtimeId),
						inArray(schema.reservationSeats.seatId, seatIds),
						sql`${schema.reservations.status} != 'cancelled'`,
					),
				);

			if (existingReservations.length > 0) {
				throw new Error("One or more seats have been reserved");
			}

			const [reservation] = await tx
				.insert(schema.reservations)
				.values(data)
				.returning();

			const seatRecords = seatIds.map((id) => ({
				reservationId: reservation.id,
				seatId: id,
			}));

			await tx.insert(schema.reservationSeats).values(seatRecords);

			return reservation;
		});
	},

	getUserReservations: async (userId: string) => {
		return await db.query.reservations.findMany({
			where: eq(schema.reservations.userId, userId),
			with: {
				showtime: {
					with: {
						movie: true,
						room: true,
					},
				},
				seats: {
					with: {
						seat: true,
					},
				},
			},
			orderBy: (reservations, { desc }) => [desc(reservations.createdAt)],
		});
	},

	cancelReservation: async (reservationId: number, userId: string) => {
		return await db.transaction(async (tx) => {
			const reservation = await tx.query.reservations.findFirst({
				where: and(
					eq(schema.reservations.id, reservationId),
					eq(schema.reservations.userId, userId),
				),
				with: {
					showtime: true,
				},
			});

			if (!reservation) {
				throw new Error("Reservation not found");
			}

			if (reservation.status === "cancelled") {
				throw new Error("Already cancelled");
			}

			const now = new Date();
			const showtimeDate = new Date(reservation.showtime.startTime);

			if (now >= showtimeDate) {
				throw new Error("Cannot cancel past showtime");
			}

			return await tx
				.update(schema.reservations)
				.set({ status: "cancelled" })
				.where(eq(schema.reservations.id, reservationId))
				.returning();
		});
	},
});
