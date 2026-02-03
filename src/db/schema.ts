import { relations } from "drizzle-orm";
import {
	pgTable,
	serial,
	text,
	integer,
	varchar,
	timestamp,
	unique,
	uuid,
	doublePrecision
} from "drizzle-orm/pg-core";

// Profiles (requirements: Admin, User)
export const profiles = pgTable("profiles", {
	id: uuid("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull(),
	role: varchar("role", { length: 20 }).default("user").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Movies (Requirements: Title, Desc, Poster, Genre)
export const movies = pgTable("movies", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	posterImage: varchar("poster_image", { length: 500 }),
	durationInMinutes: integer("duration_in_minutes").notNull(),
});

export const genres = pgTable("genres", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 50 }).notNull().unique(),
});

export const moviesToGenres = pgTable(
	"movies_to_genres",
	{
		movieId: integer("movie_id")
			.references(() => movies.id, { onDelete: "cascade" })
			.notNull(),
		genreId: integer("genre_id")
			.references(() => genres.id, { onDelete: "cascade" })
			.notNull(),
	},
	(t) => [unique().on(t.movieId, t.genreId)],
);

// Cinema (Requirements: Rooms, Seats)
export const rooms = pgTable("rooms", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 50 }).notNull(),
	capacity: integer("capacity").notNull(),
});

export const seats = pgTable(
	"seats",
	{
		id: serial("id").primaryKey(),
		roomId: integer("room_id")
			.references(() => rooms.id, { onDelete: "cascade" })
			.notNull(),
		row: varchar("row", { length: 2 }).notNull(),
		number: integer("number").notNull(),
	},
	(t) => [unique().on(t.roomId, t.row, t.number)],
);

// Reservations (Requirements: Showtimes, Reserve seats, Revenue, Cancel)
export const showtimes = pgTable("showtimes", {
	id: serial("id").primaryKey(),
	movieId: integer("movie_id")
		.references(() => movies.id, { onDelete: "cascade" })
		.notNull(),
	roomId: integer("room_id")
		.references(() => rooms.id, { onDelete: "cascade" })
		.notNull(),
	startTime: timestamp("start_time", { withTimezone: true }).notNull(),
	price: integer("price").notNull(), // Revenue calculation
});

export const reservations = pgTable("reservations", {
	id: serial("id").primaryKey(),
	userId: uuid("user_id")
		.references(() => profiles.id, { onDelete: "cascade" })
		.notNull(), // Supabase user reference
	showtimeId: integer("showtime_id")
		.references(() => showtimes.id)
		.notNull(),
	totalPrice: doublePrecision("total_price").notNull(),
	status: varchar("status", { length: 20 }).default("pending").notNull(), // For cancellations
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reservationSeats = pgTable(
	"reservation_seats",
	{
		id: serial("id").primaryKey(),
		reservationId: integer("reservation_id")
			.references(() => reservations.id, { onDelete: "cascade" })
			.notNull(),
		seatId: integer("seat_id")
			.references(() => seats.id)
			.notNull(),
	},
	(t) => [unique().on(t.reservationId, t.seatId)],
);

// ------- Drizzle Relations -------

export const moviesRelations = relations(movies, ({ many }) => ({
	genres: many(moviesToGenres),
	showtimes: many(showtimes),
}));

export const showtimesRelations = relations(showtimes, ({ one, many }) => ({
	movie: one(movies, { fields: [showtimes.movieId], references: [movies.id] }),
	room: one(rooms, { fields: [showtimes.roomId], references: [rooms.id] }),
	reservations: many(reservations),
}));

export const reservationsRelations = relations(
	reservations,
	({ one, many }) => ({
		user: one(profiles, {
			fields: [reservations.userId],
			references: [profiles.id],
		}),
		showtime: one(showtimes, {
			fields: [reservations.showtimeId],
			references: [showtimes.id],
		}),
		seats: many(reservationSeats),
	}),
);

export const reservationSeatsRelations = relations(
	reservationSeats,
	({ one }) => ({
		reservation: one(reservations, {
			fields: [reservationSeats.reservationId],
			references: [reservations.id],
		}),
		seat: one(seats, {
			fields: [reservationSeats.seatId],
			references: [seats.id],
		}),
	}),
);

export const moviesToGenresRelations = relations(moviesToGenres, ({ one }) => ({
	movie: one(movies, {
		fields: [moviesToGenres.movieId],
		references: [movies.id],
	}),
	genre: one(genres, {
		fields: [moviesToGenres.genreId],
		references: [genres.id],
	}),
}));

export const genresRelations = relations(genres, ({ many }) => ({
	movies: many(moviesToGenres),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
	reservations: many(reservations),
}));
