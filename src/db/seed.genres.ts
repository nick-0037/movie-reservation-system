import { db } from "./index";
import { genres } from "./schema";

const genreList = [
	{ name: "Action" },
	{ name: "Comedy" },
	{ name: "Drama" },
	{ name: "Thriller" },
	{ name: "Romantic" },
];

async function seedGenres() {
	console.log("Seeding genres...");
	try {
		await db.insert(genres).values(genreList).onConflictDoNothing();
		console.log("Genres seeded successfully");
	} catch (e) {
		console.log("Error seeding genres:", e);
	}
}

seedGenres();
