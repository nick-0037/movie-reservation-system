import { db } from "./index";
import { profiles } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
	console.log("Seeding database...");

	const userId = process.env.SUPABASE_ID!;

	await db
		.update(profiles)
		.set({ role: "admin" })
		.where(eq(profiles.id, userId));

	console.log("Seed completed!");
}

seed();
