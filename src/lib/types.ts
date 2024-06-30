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
	image?: File | Buffer | null;
}

export type UserEditFormData = {
	[k in keyof UserFormData]?: UserFormData[k] | undefined;
} & {
	username: string;
};

export interface UserData {
	id: bigint;
	name: string;
	role: UserRole;
	display_name: string;
	image?: Buffer | string;
	balance: number;
	dept: number;
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

export interface Odds {
	numerator: number;
	denominator: number;
}

export type FullBetOdds = Record<bet_type, Odds>;

export interface ContestantData {
	id: bigint;
	jockey: string;
	horse: string;
	race_id: bigint;
	odds: FullBetOdds;
	place?: number;
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
	house_cut?: number | null;
	win_cut?: number | null;
	place_cut?: number | null;
	show_cut?: number | null;
	contestants: ContestantFormType[];
}

export interface RaceParameters {
	name: string;
	isOpenBets: boolean;
	isEnded: boolean;
	deadline?: Date | null;
}

export interface ContestantDisplayData
	extends Omit<Omit<ContestantData, "jockey">, "horse"> {
	jockey: {
		name: string;
		image: string;
	};
	horse: {
		name: string;
		image: string;
	};
}

export interface ContestantPlacementData {
	placements: {
		contestant: bigint;
	}[];
}

export const BETS_TYPES = ["win", "place", "show"] as const;
export type bet_type = (typeof BETS_TYPES)[number];

export interface BetData {
	id: bigint;
	race: bigint;
	race_name: string;
	user: string;
	contestant: ContestantDisplayData;
	active: boolean;
	amount: number;
	type: bet_type;
	isActive: boolean;
	isEditable: boolean;
	isWon?: boolean;
}

export interface FormBetDetails {
	contestant: bigint;
	amount: number;
}

export interface FullBetFormData extends Partial<Record<bet_type, FormBetDetails>> {}

export interface BetDetails extends FormBetDetails {
	active: boolean;
}

export interface FullBetData extends Partial<Record<bet_type, BetDetails>> {
	race: bigint;
	user: string;
}

export interface SelectOptionState {
	isDisabled: boolean;
	isFocused: boolean;
	isSelected: boolean;
}

export interface Cuts {
	house: number;
	jockeys: number[];
}

export interface Reward {
	user: string;
	amount: number;
}

export interface ContestantOddsUpdate {
	id: bigint;
	type: bet_type;
	numerator: number;
	denominator: number;
}

// currently unused
// export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;
