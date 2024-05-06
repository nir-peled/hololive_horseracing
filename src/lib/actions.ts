"use server";
import { AuthError } from "next-auth";
import { check_server_action_authorized, signIn, signOut } from "./auth";
import { Locale, UserData, UserDataSelect, UserFormData } from "./types";
import { database_factory } from "./database";

export async function authenticate(prevState: string | undefined, form_data: FormData) {
	try {
		await signIn("credentials", form_data);
	} catch (error) {
		if (error instanceof AuthError) {
			return get_auth_error(error);
		}
		throw error;
	}
}

export async function logout(locale: Locale) {
	try {
		await signOut({ redirect: true, redirectTo: `/${locale}/login` });
	} catch (error) {
		if (error instanceof AuthError) {
			return get_auth_error(error);
		}
		throw error;
	}
	// await signOut();
}

function get_auth_error(error: AuthError): string {
	switch (error.type) {
		case "CredentialsSignin":
			return "login-credentials-invalid";
		default:
			return "login-something-wrong";
	}
}

export async function new_user(params: UserFormData): Promise<boolean> {
	check_server_action_authorized("manager");

	try {
		await database_factory.user_database().create_user(params);
		return true;
	} catch (error) {
		// console.log("error creating user:"); // debug
		// console.log(error); // debug
		return false;
	}
}

export async function fetch_usernames(
	select?: Partial<{ [key in keyof UserData]: true }>
) {
	check_server_action_authorized("manager"); // maybe change?
	let database = database_factory.user_database();
	return await database.get_usernames({ select });
}

export async function fetch_user_form_data(username: string | undefined) {
	check_server_action_authorized("manager");
	return await database_factory.user_database().get_user_as_form_data(username);
}

export async function fetch_user_data(username: string, select?: (keyof UserData)[]) {
	let select_fields = select
		? select.reduce((obj, key) => ((obj[key] = true), obj), {} as UserDataSelect)
		: undefined;

	return await database_factory
		.user_database()
		.get_user_data({ user: username, select: select_fields });
}

export async function fetch_horse_image(horse: string): Promise<Buffer | null> {
	return await database_factory.horse_database().get_horse_image(horse);
}

export async function get_is_race_editable(id: bigint): Promise<boolean> {
	let race_params = await database_factory.race_database().get_race_parameters(id);
	return !!race_params && !race_params.isOpenBets && !race_params.isEnded;
}

export async function get_race_flags(id: bigint) {
	let params = await database_factory.race_database().get_race_parameters(id);
	if (!params) return undefined;
	return {
		isOpenBets: params.isOpenBets,
		isEnded: params.isEnded,
	};
}
