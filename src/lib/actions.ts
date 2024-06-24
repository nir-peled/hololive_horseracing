"use server";
import { AuthError } from "next-auth";
import { auth, check_server_action_authorized, signIn, signOut } from "./auth";
import {
	ContestantPlacementData,
	Cuts,
	FullBetFormData,
	Locale,
	UserData,
	UserDataSelect,
	UserEditFormData,
	UserFormData,
} from "./types";
import { database_factory } from "./database";
import { bet_manager } from "./bet_manager";
import { get_image_buffer_as_str } from "./images";

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

export async function edit_user(params: UserEditFormData): Promise<boolean> {
	check_server_action_authorized("manager");

	let is_successful = await database_factory
		.user_database()
		.edit_user(params.username, params);
	return is_successful;
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

	let result = await database_factory
		.user_database()
		.get_user_data({ user: username, select: select_fields });
	return (
		result && {
			...result,
			image: result.image && get_image_buffer_as_str(result.image),
		}
	);
}

export async function fetch_horse_image(
	horse: string
): Promise<string | null | undefined> {
	let result = await database_factory.horse_database().get_horse_image(horse);
	return result && get_image_buffer_as_str(result);
}

/*
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
*/

export async function make_full_bet(
	user: string,
	race: bigint,
	bet: FullBetFormData
): Promise<boolean> {
	const logged_user = (await auth())?.user?.name;
	if (logged_user != user) throw Error("unauthorized");

	try {
		await bet_manager.make_full_bet(user, race, bet);
		return true;
	} catch (e) {
		console.log(e); // debug
		return false;
	}
}

export async function set_race_results(
	id: bigint,
	results: ContestantPlacementData
): Promise<boolean> {
	try {
		await database_factory.race_database().set_race_placements(id, results);
		await bet_manager.close_race_bets(id, results);
		return true;
	} catch (e) {
		console.log(e); // debug
		return false;
	}
}

export async function delete_race(id: bigint): Promise<boolean> {
	let result = await database_factory.race_database().try_delete_race(id);
	return result;
}

export async function set_house_reward_target(user: string | null): Promise<boolean> {
	let result = await database_factory.cache_database().set_house_reward_target(user);
	return result;
}

export async function set_global_cuts(cuts: Cuts): Promise<boolean> {
	return await database_factory.cache_database().set_cuts(cuts);
}

export async function deposit_to_user(user: string, amount: number): Promise<boolean> {
	if (amount <= 0 || Math.floor(amount) != amount) return false;
	return await database_factory.user_database().update_user_balance(user, amount);
}

export async function withdraw_from_user(user: string, amount: number): Promise<boolean> {
	if (amount <= 0 || Math.floor(amount) != amount) return false;
	return await database_factory.user_database().update_user_balance(user, -amount);
}

export async function echo(param: any): Promise<any> {
	console.log(JSON.stringify(param));
	return param;
}

export async function set_race_bets_open(
	id: bigint,
	isOpenBets: boolean
): Promise<boolean> {
	let result = await database_factory
		.race_database()
		.set_race_parameters(id, { isOpenBets });
	return result;
}
