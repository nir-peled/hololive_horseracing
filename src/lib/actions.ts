"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "./auth";
import { Locale, UserFormData } from "./types";
import { create_user, is_user_exists } from "./database";

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
	const isUser = await is_user_exists(params.username);
	if (isUser) return false;

	try {
		await create_user(params);
		return true;
	} catch (error) {
		console.log("error creating user:"); // debug
		console.log(error); // debug
		return false;
	}
}
