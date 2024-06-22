import { BaseSyntheticEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { RaceData, UserData } from "./types";
import { get_image_buffer_as_str, image_as_buffer } from "./images";

// type UsersList = Awaited<ReturnType<typeof fetch_usernames>>;
type UseUsersData = { name: string; display_name: string };
type UseHorsesData = { id: bigint; name: string; image: string };

interface UseListReturnType<TValue> {
	data: TValue[];
	loading: boolean;
	error: any | undefined;
	mutate: (data: TValue[]) => void;
}

export const json_fetcher = (input: URL | RequestInfo, init?: RequestInit | undefined) =>
	fetch(input, init).then((res) => res.json());

export function useUsersList(
	select?: Partial<{ [key in keyof UserData]: true }> // ignored for now
): UseListReturnType<UseUsersData> {
	return useFetchList<UseUsersData>("/api/management/users/all");
}

export function useRaceData(
	id: string,
	select?: Partial<{ [key in keyof RaceData]: true }>
) {
	let param_select = select && Object.keys(select).join("-");

	const { data, error, isLoading, mutate } = useSWR<RaceData>(
		`/api/races/${id}?` + new URLSearchParams(param_select),
		json_fetcher
	);

	return { data, error, loading: isLoading, mutate };
}

export function useCountdown(deadline: Date) {
	const deadline_time = deadline.getTime();
	const [countdown, set_countdown] = useState(deadline_time - new Date().getTime());

	useEffect(() => {
		const interval = setInterval(() => {
			set_countdown(deadline_time - new Date().getTime());
		}, 1000);

		return () => clearInterval(interval);
	}, [deadline_time]);

	// if (countdown < 0) window.location.reload;

	return get_countdown_parts(countdown);
}

export function useHorsesList(images: boolean = false): UseListReturnType<UseHorsesData> {
	const url = "/api/horses/list" + (images ? "?images=true" : "");
	return useFetchList<UseHorsesData>(url);
}

export function useFetchList<TValue>(url: string): UseListReturnType<TValue> {
	const { data, error, isLoading, mutate } = useSWR<TValue[]>(url, json_fetcher);

	return { data: data ? data : [], loading: isLoading, error, mutate };
}

interface UseSubmitterParams<
	T extends Record<string, any>,
	D extends Record<string, any> = T
> {
	is_failed?: boolean;
	set_is_failed?: (is_failure: boolean) => void;
	default_values?: { [K in keyof D]?: D[K] | undefined } | undefined;
	reset?: (data?: Partial<T> | undefined) => void;
	method?: string;
	on_success?: (data: Partial<T>, response?: Response) => void;
	transform?: (data: T) => D;
	fetch_options?: RequestInit;
	confirmation?: string;
}

/**
 * Create a function that submits form data to an endpoint, and
 * handles default values, form reset and failed flag
 *
 * @param endpoint the endpoint to submit to
 * @param is_failed the current form failed flag
 * @param set_is_failed form failed flag setter
 * @param default_values the form's default values - submit only values not in here
 * @param reset form reset hook
 * @param method fetch HTTP method - default is POST
 * @returns the submitter function, can use with handleSubmit
 */
export function useSubmitter<
	T extends Record<string, any>,
	D extends Record<string, any> = T
>(
	destination: string | ((data: D) => boolean | Promise<boolean>),
	{
		is_failed,
		set_is_failed,
		default_values,
		reset,
		method = "POST",
		on_success,
		transform,
		fetch_options,
		confirmation,
	}: UseSubmitterParams<T, D>
): (data: T, event?: BaseSyntheticEvent) => Promise<void> {
	return async (data: T, event?: BaseSyntheticEvent) => {
		if (event) event.preventDefault();
		let transed_data = transform ? transform(data) : data;

		let submit_ok = false;
		let response: Response | undefined;
		if (confirmation && !confirm(confirmation)) return;
		try {
			if (typeof destination == "string") {
				let form_data = await to_form_data_without_default(
					transed_data as D,
					default_values
				);

				response = await fetch(destination, {
					method,
					body: form_data,
					...fetch_options,
				});
				submit_ok = response && response.ok;
			} else {
				console.log("try call destination function"); // debug
				submit_ok = await destination(transed_data as D);
			}
		} catch (e) {
			console.log(e); // debug
		} finally {
			if (submit_ok) {
				// if form is used for new user, reset the form to empty
				if (reset) reset();
				if (is_failed && set_is_failed) set_is_failed(false);
				if (on_success) on_success(data, response);
			} else {
				if (reset) reset(data);
				if (set_is_failed) set_is_failed(true);
			}
		}
	};
}

function get_countdown_parts(countdown: number) {
	// seperate countdown (milliseconds) to parts down to seconds
	const MILLI_IN_SEC = 1000;
	const MILLIES_IN_MINUTE = MILLI_IN_SEC * 60;
	const MILLIES_IN_HOUR = MILLIES_IN_MINUTE * 60;
	const MILLIES_IN_DAY = MILLIES_IN_HOUR * 24;

	const days = Math.floor(countdown / MILLIES_IN_DAY);
	const hours = Math.floor((countdown % MILLIES_IN_DAY) / MILLIES_IN_HOUR);
	const minutes = Math.floor((countdown % MILLIES_IN_HOUR) / MILLIES_IN_MINUTE);
	const seconds = Math.floor((countdown % MILLIES_IN_MINUTE) / MILLI_IN_SEC);

	return { days, hours, minutes, seconds };
}

async function to_form_data_without_default<T extends Record<string, any>>(
	data: T,
	default_data?: T
): Promise<FormData> {
	let form_data = new FormData();
	for (let [key, value] of Object.entries(data)) {
		if (
			value &&
			(!default_data || !(await is_same_values(value, default_data[key as keyof T])))
		) {
			console.log(`adding ${key}`);
			const form_value =
				typeof value == "string" || value instanceof File ? value : JSON.stringify(value);
			form_data.append(key, form_value);
		}
	}

	return form_data;
}

async function is_same_values<T, D extends T | string | Buffer | Blob>(
	value: T,
	default_value: D | string
): Promise<boolean> {
	console.log(`checking value:`); // debug
	console.log(value); // debug
	console.log("vs default:"); // debug
	console.log(default_value); // debug
	if (!default_value) return false;
	if (value instanceof File)
		return await is_same_files(value, default_value as string | Buffer | Blob);

	if (typeof default_value == "string" && typeof value != "string")
		return JSON.stringify(value) == default_value;
	return value == default_value;
}

async function is_same_files(
	value: File,
	default_value: Blob | string | Buffer
): Promise<boolean> {
	let value_buffer = await image_as_buffer(value);
	let value_str = get_image_buffer_as_str(value_buffer);

	let default_str: string | undefined;
	if (typeof default_value == "string") default_str = default_value;
	else if (default_value instanceof Buffer || default_value.type == "Buffer")
		default_str = get_image_buffer_as_str(default_value as Buffer);
	else {
		let default_buffer = await image_as_buffer(default_value);
		default_str = get_image_buffer_as_str(default_buffer);
	}

	return value_str != default_str;
}
