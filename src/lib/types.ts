import { locales } from "@/i18nConfig";
// import { NextMiddleware } from "next/server";

export type Locale = (typeof locales)[number];

export const userRoles = ["user", "banker", "manager"] as const;
export type UserRole = (typeof userRoles)[number];

export type Concat<T extends string[]> = T extends [
	infer F extends string,
	...infer R extends string[]
]
	? `${F}${Concat<R>}`
	: "";

export type PrependIfDefined<T extends string, S extends string> = T extends ""
	? T
	: `${S}${T}`;

export type ConcatSeperator<T extends string[], S extends string> = T extends [
	infer F extends string,
	...infer R extends string[]
]
	? `${F}${PrependIfDefined<ConcatSeperator<R, S>, S>}`
	: "";

export interface UserFormData {
	username: string;
	password: string;
	confirm_password?: string;
	role: UserRole;
	display_name: string;
	image?: File;
}

export interface UserData {
	name: string;
	role: UserRole;
	display_name: string;
	image?: Buffer;
	balance: Number;
	dept: Number;
}

export type UserDataSelect = Partial<Record<keyof UserData, true>>;

export interface UserDefaultValues {
	username: string;
	role: string;
	display_name: string;
	image?: Buffer | null;
}

export interface HorseData {
	id: bigint;
	name: string;
	image?: Buffer | null;
}

export interface ContestantData {
	jockey: string;
	horse: string;
	race_id: number;
	place?: number;
	odds_denominator: number;
	odds_numerator: number;
}

export interface RaceData {
	id: bigint;
	name: string;
	isOpenBets: boolean;
	isEnded: boolean;
	deadline?: Date | null;
	cuts?: {
		house_percent: number;
		win_percent: number;
		place_percent: number;
		show_percent: number;
	};
	contestants: { jockey: UserData; horse: HorseData }[];
}

export type RaceContestantsData = RaceData["contestants"];

export type ContestantFormType = { jockey: string; horse: string };

export interface RaceFormData {
	name: string;
	deadline?: Date | null;
	house_cut?: number;
	win_cut?: number;
	place_cut?: number;
	show_cut?: number;
	contestants: ContestantFormType[];
}

// currently unused
// export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;
