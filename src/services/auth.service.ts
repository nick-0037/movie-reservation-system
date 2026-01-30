import { supabase } from "../lib/supabase";

export const signUp = async (email: string, pass: string) => {
	return await supabase.auth.signUp({ email, password: pass });
};

export const signIn = async (email: string, pass: string) => {
	return await supabase.auth.signInWithPassword({
		email,
		password: pass,
	});
};
