"use server";
import { AuthError } from "next-auth";
import { check_server_action_authorized, signIn, signOut } from "./auth";
import { Locale, UserData, UserDataSelect, UserFormData } from "./types";
import {
	create_user,
	get_horse_image,
	get_race_parameters,
	get_user_as_form_data,
	get_user_data,
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

export async function fetch_user_data(username: string, select?: (keyof UserData)[]) {
	let select_fields = select
		? select.reduce((obj, key) => ((obj[key] = true), obj), {} as UserDataSelect)
		: undefined;

	return await get_user_data({ user: username, select: select_fields });
}

export async function fetch_horse_image(horse: string): Promise<Buffer | null> {
	return await get_horse_image(horse);
}

export async function get_is_race_editable(id: bigint): Promise<boolean> {
	let race_params = await get_race_parameters(id);
	return !!race_params && !race_params.isOpenBets && !race_params.isEnded;
}

export async function get_race_flags(id: bigint) {
	let params = await get_race_parameters(id);
	if (!params) return undefined;
	return {
		isOpenBets: params.isOpenBets,
		isEnded: params.isEnded,
	};
}
