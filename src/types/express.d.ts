import { User } from "@supabase/supabase-js";
import { profiles } from "../db/schema";

type Profile = typeof profiles.$inferSelect;

declare global {
	namespace Express {
		interface Request {
			user?: User;
			profile?: Profile;
		}
	}
}

export {};
