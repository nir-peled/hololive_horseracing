import { Session } from "next-auth";
import {
	BetData,
	ContestantData,
	ContestantDisplayData,
	HorseData,
	RaceContestantsData,
	RaceData,
	RaceFormData,
	UserData,
	UserDataSelect,
	UserDefaultValues,
	UserFormData,
	RaceParameters,
	FullBetData,
	FullBetFormData,
	ContestantPlacementData,
	Cuts,
	Reward,
	bet_type,
	ContestantOddsUpdate,
} from "../types";
import { Encryptor } from "../encryptor";
import { CryptoEncryptor } from "../encryptor/crypto_encryptor";
import { PrismaDatabase } from "./prisma_db";

export interface GetUserDataOptions {
	session?: Session | null;
	user?: string;
	to_token?: boolean;
	select?: UserDataSelect;
}

export const user_data_select = {
	id: true,
	name: true,
	role: true,
	display_name: true,
	balance: true,
	dept: true,
	image: true,
} as const;

export const horse_data_select = {
	id: true,
	name: true,
	image: true,
} as const;

export const race_data_select = {
	id: true,
	name: true,
	house_cut_percent: true,
	win_cut_percent: true,
	place_cut_percent: true,
	show_cut_percent: true,
	deadline: true,
	isOpenBets: true,
	isEnded: true,
	competitors: {
		select: {
			jockey: { select: user_data_select },
			horse: { select: horse_data_select },
		},
	},
} as const;

export const race_form_data_select = {
	name: true,
	deadline: true,
	house_cut_percent: true,
	win_cut_percent: true,
	place_cut_percent: true,
	show_cut_percent: true,
	competitors: {
		select: {
			jockey: { select: { name: true } },
			horse: { select: { name: true } },
		},
	},
} as const;

export const race_parameters_select = {
	name: true,
	isOpenBets: true,
	isEnded: true,
	deadline: true,
} as const;

export const competitors_display_data_select = {
	id: true,
	race_id: true,
	place: true,
	win_denominator: true,
	win_numerator: true,
	place_denominator: true,
	place_numerator: true,
	show_denominator: true,
	show_numerator: true,
	jockey: {
		select: {
			name: true,
			display_name: true,
			image: true,
		},
	},
	horse: {
		select: {
			name: true,
			image: true,
		},
	},
} as const;

export const bet_data_select = {
	id: true,
	amount: true,
	type: true,
	contestant: {
		select: {
			...competitors_display_data_select,
			race: { select: { id: true, name: true, isEnded: true } },
		},
	},
	user: {
		select: { name: true },
	},
} as const;

export type Select<T> = Partial<Record<keyof T, boolean> & { id: boolean }>;
export type QueryResult<TBase, TSelect> = {
	[key in keyof (TBase | TSelect)]: TBase[key];
} & { id?: bigint };

export interface UserDatabase {
	set_encryptor(encryptor: Encryptor): void;

	is_user_password(name: string, password: string): Promise<boolean>;

	is_user_exists(name: string): Promise<boolean>;

	create_user(params: UserFormData): Promise<boolean>;

	edit_user(name: string, data: Partial<UserFormData>): Promise<boolean>;

	get_user_data(options?: GetUserDataOptions): Promise<UserData | null>;

	get_user_data_all(where?: Partial<UserData>): Promise<UserData[]>;

	get_user_image(name: string): Promise<Buffer | null>;

	get_user_as_form_data(username: string | undefined): Promise<UserDefaultValues>;

	get_usernames(options: {
		filter?: string;
		select?: Select<UserData>;
	}): Promise<QueryResult<UserData, Select<UserData>>[]>;

	get_user_image_as_str(user: string | UserData): Promise<string>;

	reward_users(rewards: Reward[]): Promise<void>;

	update_user_balance(name: string, delta: number): Promise<boolean>;

	get_user_balance(id: bigint): Promise<number | null>;
}

export interface HorseDatabase {
	create_horse(horse_data: Omit<HorseData, "id">): Promise<boolean>;

	get_horses(from?: number, count?: number): Promise<HorseData[]>;

	get_horse_data(name: string): Promise<HorseData | null>;

	try_delete_horse(name: string): Promise<boolean>;

	get_horse_image(name: string): Promise<Buffer | null>;

	get_horse_image_as_str(horse: string | HorseData): Promise<string>;
}

export interface RaceDatabase {
	get_active_races(): Promise<RaceData[]>;

	get_race_parameters(id: bigint): Promise<RaceParameters | null>;

	set_race_parameters(id: bigint, parameters: Partial<RaceParameters>): Promise<boolean>;

	get_race_data(id: bigint, select?: Select<RaceData>): Promise<RaceData | null>;

	get_race_form_data(id: bigint): Promise<RaceFormData | null>;

	get_race_contestants_data(id: bigint): Promise<RaceContestantsData | null>;

	get_race_contestants(id: bigint): Promise<ContestantData[] | null>;

	create_race(race_data: RaceFormData): Promise<boolean>;

	try_delete_race(id: bigint): Promise<boolean>;

	try_edit_race(id: bigint, race_data: Partial<RaceFormData>): Promise<boolean>;

	close_races_bets_at_deadline(): Promise<bigint[]>;

	get_contestants_display_data(id: bigint): Promise<ContestantDisplayData[]>;

	set_race_placements(id: bigint, placements: ContestantPlacementData): Promise<boolean>;

	update_race_odds(updates: ContestantOddsUpdate[]): Promise<void>;

	get_race_cuts(id: bigint): Promise<Cuts | null>;
}

export interface BetsDatabase {
	get_user_bets(user: string, op?: { active?: boolean }): Promise<BetData[]>;

	get_user_bets_on_race(user: string, race_id: bigint): Promise<FullBetData | undefined>;

	get_race_bets(race: bigint): Promise<BetData[]>;

	get_race_bets_by_pools(race: bigint): Promise<Record<bet_type, BetData[]>>;

	update_user_race_bets(
		user: string,
		race: bigint,
		bets: FullBetFormData
	): Promise<number>;
}

export interface CacheDatabase {
	get_cuts(): Promise<Cuts>;

	get_house_reward_target(): Promise<string | null>;

	set_house_reward_target(user: string | null): Promise<boolean>;

	set_cuts(cuts: Cuts): Promise<boolean>;
}

export interface DatabaseFactory {
	user_database(): UserDatabase;
	horse_database(): HorseDatabase;
	race_database(): RaceDatabase;

	get_encryptor(): Encryptor;
}

export class BasicDatabaseFactory implements DatabaseFactory {
	private encryptor: Encryptor;
	private user_db?: UserDatabase;
	private horse_db?: HorseDatabase;
	private race_db?: RaceDatabase;
	private bets_db?: BetsDatabase;
	private cache_db?: CacheDatabase;

	constructor(encryptor: Encryptor) {
		this.encryptor = encryptor;
	}

	user_database(): UserDatabase {
		if (!this.user_db) this.#create_db();
		return this.user_db as UserDatabase;
	}

	horse_database(): HorseDatabase {
		if (!this.horse_db) this.#create_db();
		return this.horse_db as HorseDatabase;
	}

	race_database(): RaceDatabase {
		if (!this.race_db) this.#create_db();
		return this.race_db as RaceDatabase;
	}

	bets_database(): BetsDatabase {
		if (!this.bets_db) this.#create_db();
		return this.bets_db as BetsDatabase;
	}

	cache_database(): CacheDatabase {
		if (!this.cache_db) this.#create_db();
		return this.cache_db as CacheDatabase;
	}

	get_encryptor(): Encryptor {
		return this.encryptor;
	}

	set_encryptor(encryptor: Encryptor) {
		this.encryptor = encryptor;
	}

	#create_db() {
		this.user_db =
			this.race_db =
			this.horse_db =
			this.bets_db =
			this.cache_db =
				new PrismaDatabase(this.encryptor);
	}
}

export const database_factory = new BasicDatabaseFactory(new CryptoEncryptor());
