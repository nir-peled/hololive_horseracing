import { fetch_usernames } from "./actions";
import { UserData } from "./types";
import useSWR from "swr";

type UsersList = Awaited<ReturnType<typeof fetch_usernames>>;

interface UseUsersListReturn {
	users: UsersList;
	loading: boolean;
	error: any | undefined;
	mutate: (data: UsersList) => void;
}

export const json_fetcher = (input: URL | RequestInfo, init?: RequestInit | undefined) =>
	fetch(input, init).then((res) => res.json());

export function useUsersList(
	select?: Partial<{ [key in keyof UserData | "name"]: true }>
): UseUsersListReturn {
	const { data, error, isLoading, mutate } = useSWR<UsersList>(
		"/api/users/all",
		json_fetcher
	);

	return { users: data ? data : [], loading: isLoading, error, mutate };
}
