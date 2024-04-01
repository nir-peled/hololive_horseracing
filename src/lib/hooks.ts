import { useEffect, useState } from "react";
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
	return use_swr_list<UseUsersData>("/api/management/users/all");
}

export function useRaceData(
	id: string,
	select?: Partial<{ [key in keyof RaceData]: true }>
) {
	// params type so it wouldn't shout at me
	let params: { id: string; select?: string } = { id };
	if (select) params.select = Object.keys(select).join("-");

	const { data, error, isLoading, mutate } = useSWR<RaceData>(
		"api/races/read?" + new URLSearchParams(params),
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
	}, [deadline]);

	return get_countdown_parts(countdown);
}

export function useHorsesList(images: boolean = false): UseListReturnType<UseHorsesData> {
	const url = "/api/horses/all" + (images ? "?images=true" : "");
	return use_swr_list<UseHorsesData>(url);
}

function use_swr_list<TValue>(url: string): UseListReturnType<TValue> {
	const { data, error, isLoading, mutate } = useSWR<TValue[]>(url, json_fetcher);

	return { data: data ? data : [], loading: isLoading, error, mutate };
}

function get_countdown_parts(countdown: number) {
	// seperate countdown (milliseconds) to parts down to seconds
	const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
	const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

	return { days, hours, minutes, seconds };
}
