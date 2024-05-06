import { BaseSyntheticEvent, useEffect, useState } from "react";
import { RaceData, UserData } from "./types";
import useSWR from "swr";

// type UsersList = Awaited<ReturnType<typeof fetch_usernames>>;
type UseUsersData = { name: string; display_name: string };
type UseHorsesData = string;

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
	const url = "/api/horses/all" + (images ? "?images=true" : "");
	return useFetchList<UseHorsesData>(url);
}

export function useFetchList<TValue>(url: string): UseListReturnType<TValue> {
	const { data, error, isLoading, mutate } = useSWR<TValue[]>(url, json_fetcher);

	return { data: data ? data : [], loading: isLoading, error, mutate };
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
 * @param method fetch method - default is POST
 * @returns the submitter function, can use with handleSubmit
 */
export function useSubmitter<T extends Record<string, any>>(
	endpoint: string,
	is_failed: boolean,
	set_is_failed: (is_success: boolean) => void,
	default_values?: { [K in keyof T]?: T[K] | undefined } | undefined,
	reset?: (data?: T | undefined) => void,
	method: string = "POST"
): (data: T, event?: BaseSyntheticEvent) => Promise<void> {
	return async (data: T, event?: BaseSyntheticEvent) => {
		if (event) event.preventDefault();

		let form_data = new FormData();
		for (let [key, value] of Object.entries(data))
			if (
				value != undefined &&
				(!default_values || default_values[key as keyof T] != value)
			)
				form_data.append(key, JSON.stringify(value));

		let result = await fetch(endpoint, {
			method,
			body: form_data,
		});

		if (result.ok) {
			// if form is used for new user, reset the form to empty
			if (reset) reset();
			if (is_failed) set_is_failed(false);
		} else {
			if (reset) reset(data);
			set_is_failed(true);
		}
	};
}

function get_countdown_parts(countdown: number) {
	// seperate countdown (milliseconds) to parts down to seconds
	const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
	const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

	return { days, hours, minutes, seconds };
}
