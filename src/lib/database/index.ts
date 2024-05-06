import { Session } from "next-auth";
import {
	HorseData,
	RaceContestantsData,
	RaceData,
	RaceFormData,
	UserData,
	UserDataSelect,
	UserDefaultValues,
	UserFormData,
} from "../types";
import { Encryptor } from "../encryptor";
import { CryptoEncryptor } from "../encryptor/crypto_encryptor";
import { PrismaDatabase } from "./prisma_db";

export interface UserDataOps {
	session?: Session | null;
	user?: string;
	to_token?: boolean;
	select?: UserDataSelect;
}

export interface RaceParameters {
	name: string;
	isOpenBets: boolean;
	isEnded: boolean;
	deadline?: Date | null;
}

export const user_data_select = {
	name: true,
	role: true,
	display_name: true,
	balance: true,
	dept: true,
	image: true,
};

export const horse_data_select = {
	id: true,
	name: true,
	image: true,
};

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
};

export const race_parameters_select = {
	name: true,
	isOpenBets: true,
	isEnded: true,
	deadline: true,
};

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

	get_user_data(options?: UserDataOps): Promise<UserData | null>;

	get_user_image(name: string): Promise<Buffer | null>;

	get_user_as_form_data(username: string | undefined): Promise<UserDefaultValues>;

	get_usernames(options: {
		filter?: string;
		select?: Select<UserData>;
	}): Promise<QueryResult<UserData, Select<UserData>>[]>;

	get_user_image_as_str(user: string | UserData): Promise<string>;
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

	get_race_contestants(id: bigint): Promise<RaceContestantsData | null>;

	create_race(race_data: RaceFormData): Promise<boolean>;

	try_delete_race(id: bigint): Promise<boolean>;

	try_edit_race(id: bigint, race_data: Partial<RaceFormData>): Promise<boolean>;

	close_races_bets_at_deadline(): Promise<number>;
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

	get_encryptor(): Encryptor {
		return this.encryptor;
	}

	set_encryptor(encryptor: Encryptor) {
		this.encryptor = encryptor;
	}

	#create_db() {
		this.user_db = this.race_db = this.horse_db = new PrismaDatabase(this.encryptor);
	}
}

export const database_factory = new BasicDatabaseFactory(new CryptoEncryptor());
