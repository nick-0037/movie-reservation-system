import { InferInsertModel, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

export type NewRoom = InferInsertModel<typeof schema.rooms>;

export const roomService = (db: PostgresJsDatabase<typeof schema>) => ({
	createRoom: async (data: NewRoom) => {
		const [room] = await db.insert(schema.rooms).values(data).returning();

		return room;
	},
});
