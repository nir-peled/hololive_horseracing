"use server";

import { AuthError } from "next-auth";
import { check_server_action_authorized, signIn, signOut } from "./auth";
import { Locale, UserData, UserFormData } from "./types";
import {
	create_user,
	get_user_as_form_data,
	get_usernames,
	is_user_exists,
} from "./database";

export async function authenticate(prevState: string | undefined, form_data: FormData) {
	try {
		await signIn("credentials", form_data);
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "Invalid credentials.";
				default:
					return "Something went wrong.";
			}
		}
		throw error;
	}
}

export async function logout(locale: Locale) {
	try {
		await signOut({ redirect: true, redirectTo: `/${locale}/login` });
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "Invalid credentials.";
				default:
					return "Something went wrong.";
			}
		}
		throw error;
	}
	// await signOut();
}

export async function new_user(params: UserFormData): Promise<boolean> {
	check_server_action_authorized("manager");

	try {
		await create_user(params);
		return true;
	} catch (error) {
		console.log("error creating user:"); // debug
		console.log(error); // debug
		return false;
	}
}

export async function fetch_usernames(
	select?: Partial<{ [key in keyof UserData]: true }>
): Promise<ReturnType<typeof get_usernames>> {
	check_server_action_authorized("manager"); // maybe change?
	if (select) return await get_usernames({ select });
	return await get_usernames();
}

export async function fetch_user_form_data(username: string | undefined) {
	check_server_action_authorized("manager");
	return await get_user_as_form_data(username);
}
