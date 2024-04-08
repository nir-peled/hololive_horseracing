import { Prisma, PrismaClient, Race } from "@prisma/client";
import {
	UserDatabase,
	HorseDatabase,
	RaceDatabase,
	QueryResult,
	UserDataOps,
	RaceParameters,
	user_data_select,
	Select,
	horse_data_select,
	race_data_select,
	race_parameters_select,
} from ".";
import { withAccelerate } from "@prisma/extension-accelerate";
import { UserFormData, UserData, UserDefaultValues, RaceContestantsData } from "../types";
import { HorseData } from "../types";
import { RaceData, RaceFormData } from "../types";
import { Encryptor } from "../encryptor";
import { default_user_image, get_image_buffer_as_str, image_as_buffer } from "../images";
import { auth } from "../auth";
import { race_result_to_race_data } from "./db_utils";

// export interface PrismaOptions extends Prisma.PrismaClientOptions {
// 	accelerate?: boolean;
// }

function create_prisma_client() {
	return new PrismaClient().$extends(withAccelerate());
}

type prisma_t = ReturnType<typeof create_prisma_client>;
type contestant_t = { jockey: string; horse: string };

export class PrismaDatabase implements UserDatabase, HorseDatabase, RaceDatabase {
	private readonly prisma: prisma_t;
	private encryptor: Encryptor;

	constructor(encryptor: Encryptor) {
		this.prisma = create_prisma_client();
		this.encryptor = encryptor;
	}

	set_encryptor(encryptor: Encryptor): void {
		this.encryptor = encryptor;
	}

	async is_user_password(name: string, password: string): Promise<boolean> {
		let user = await this.prisma.user.findUnique({
			where: { name },
			select: { name: true, password: true },
		});
		if (!user) {
			console.log(`user .${name}. not found`); // debug
			return false;
		}

		console.log("found user, comparing passwords"); // debug
		return await this.encryptor.compare_passwords(password, user.password);
	}

	async is_user_exists(name: string): Promise<boolean> {
		let user = await this.prisma.user.findUnique({
			where: { name },
			select: { name: true },
		});
		return user != null;
	}

	async create_user(params: UserFormData): Promise<boolean> {
		let hashed_pass = await this.encryptor?.hash_password(params.password);
		let image_buffer = await image_as_buffer(params.image);

		let user_params: Prisma.UserCreateInput = {
			name: params.username,
			password: hashed_pass,
			display_name: params.display_name,
			role: params.role,
			image: image_buffer,
		};

		let user = await this.prisma.user.create({ data: user_params });
		return !!user;
	}

	async edit_user(name: string, data: Partial<UserFormData>): Promise<boolean> {
		let image_buffer = await image_as_buffer(data.image);
		try {
			let _ = await this.prisma.user.update({
				where: { name },
				data: {
					...data,
					image: image_buffer,
				},
			});
			return true;
		} catch (e) {
			console.log(e); // deubg
			return false;
		}
	}

	async get_user_data({
		session,
		user,
		to_token,
		select,
	}: UserDataOps = {}): Promise<UserData | null> {
		if (!user) {
			if (!session) session = await auth();
			// console.log("session: "); // debug
			// console.log(session); // debug
			user = session?.user?.name;
		}

		if (!user) return null;

		let select_fields = select
			? select
			: {
					...user_data_select,
					image: !to_token,
			  };

		let user_data = (await this.prisma.user.findUnique({
			where: { name: user },
			select: select_fields,
		})) as UserData | null;

		return user_data;
	}

	async get_user_image(name: string): Promise<Buffer | null> {
		let user_data = await this.prisma.user.findUnique({
			where: { name },
			select: { image: true },
		});

		if (!user_data?.image) return null;
		return user_data.image;
	}

	async get_user_as_form_data(username: string | undefined): Promise<UserDefaultValues> {
		const result = await this.prisma.user.findUnique({
			where: { name: username },
			select: {
				name: true,
				display_name: true,
				role: true,
				image: true,
			},
		});

		if (!result)
			return {
				username: "",
				role: "select_role",
				display_name: "",
			};

		return {
			username: result.name,
			role: result.role,
			display_name: result.display_name,
			image: result.image,
		};
	}

	async get_usernames({
		filter,
		select,
	}: {
		filter?: string | undefined;
		select?: Select<UserData>;
	} = {}): Promise<QueryResult<UserData, Select<UserData>>[]> {
		let select_params: Select<UserData> | undefined = select;
		if (!filter) filter = "";
		if (!select_params) select_params = { name: true, display_name: true };

		let data = await this.prisma.user.findMany({
			select: select_params,
			where: {
				name: { contains: filter },
			},
		});

		return data as QueryResult<UserData, typeof select>[];
	}

	async get_user_image_as_str(user: string | UserData): Promise<string> {
		return this.#get_image_as_str("user", user);
	}

	async create_horse(horse_data: Omit<HorseData, "id">): Promise<boolean> {
		let horse = await this.prisma.horse.create({ data: horse_data });
		return !!horse;
	}

	async get_horses(
		from?: number | undefined,
		count?: number | undefined
	): Promise<HorseData[]> {
		return await this.prisma.horse.findMany({
			select: horse_data_select,
			skip: from,
			take: count,
		});
	}

	async get_horse_data(name: string): Promise<HorseData | null> {
		return await this.prisma.horse.findUnique({
			where: { name },
			select: horse_data_select,
		});
	}

	async try_delete_horse(name: string): Promise<boolean> {
		let result = await this.prisma.horse.delete({ where: { name } });
		return result && result.name == name;
	}

	async get_horse_image(name: string): Promise<Buffer | null> {
		let result = await this.prisma.horse.findUnique({
			where: { name },
			select: { image: true },
		});

		return result && result.image;
	}

	async get_horse_image_as_str(horse: string | HorseData): Promise<string> {
		return this.#get_image_as_str("horse", horse);
	}

	async get_active_races(): Promise<RaceData[]> {
		let results = await this.prisma.race.findMany({
			where: { isEnded: false },
			select: race_data_select,
		});

		return results.map(race_result_to_race_data);
	}

	async get_race_parameters(id: bigint): Promise<RaceParameters | null> {
		return await this.prisma.race.findUnique({
			where: { id },
			select: race_parameters_select,
		});
	}

	async set_race_parameters(
		id: bigint,
		parameters: Partial<RaceParameters>
	): Promise<boolean> {
		let result = await this.prisma.race.update({
			where: { id },
			data: parameters,
		});

		return result && result.id == id;
	}

	async get_race_data(id: bigint): Promise<RaceData | null> {
		let result = await this.prisma.race.findUnique({
			where: { id },
			select: race_data_select,
		});

		if (!result) return null;
		return race_result_to_race_data(result);
	}

	async get_race_contestants(id: bigint): Promise<RaceContestantsData | null> {
		let result = await this.prisma.race.findUnique({
			where: { id },
			select: {
				competitors: race_data_select.competitors,
			},
		});

		if (!result) return null;
		return result.competitors as RaceContestantsData;
	}

	async create_race(race_data: RaceFormData): Promise<boolean> {
		try {
			let contestants_ids = await this.#get_contestant_members_ids(race_data.contestants);
			let data: Prisma.RaceCreateInput = {
				name: race_data.name,
				deadline: race_data.deadline || null,
				house_cut_percent: race_data.house_cut,
				win_cut_percent: race_data.win_cut,
				place_cut_percent: race_data.place_cut,
				show_cut_percent: race_data.show_cut,
				competitors: {
					createMany: {
						data: contestants_ids.map(({ jockey_id, horse_id }) => ({
							jockey_id,
							horse_id,
						})),
					},
				},
			};

			let race = await this.prisma.race.create({ data });
			return !!race;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async try_delete_race(id: bigint): Promise<boolean> {
		// add something to do with bets of removed contestants?
		try {
			// let race_contestants = await get_contestants_of_race(id, { id: true });
			// let contestants_ids = race_contestants.map((c) => c.id);
			let result = await this.prisma.$transaction([
				this.prisma.raceContestant.deleteMany({
					where: { race_id: id },
				}),
				this.prisma.race.delete({ where: { id } }),
			]);

			// return if second transaction operation was performed
			return result[1].id == id;
		} catch (e) {
			console.log(e); // debug
			return false;
		}
	}

	async try_edit_race(id: bigint, race_data: Partial<RaceFormData>): Promise<boolean> {
		try {
			let data: Prisma.RaceUpdateInput = {
				name: race_data.name,
				deadline: race_data.deadline,
				house_cut_percent: race_data.house_cut,
				win_cut_percent: race_data.win_cut,
				place_cut_percent: race_data.place_cut,
				show_cut_percent: race_data.show_cut,
			};

			let { new_contestants, remove_contestants } = race_data.contestants
				? await this.#find_contestants_to_new_remove(id, race_data.contestants)
				: { new_contestants: [], remove_contestants: [] };

			// add something to do with bets of removed contestants?
			// make sure the updated race is not open bets, and is not ended
			let result = await this.prisma.$transaction([
				this.prisma.race.update({
					where: { id, isOpenBets: false, isEnded: false },
					data,
				}),
				this.prisma.raceContestant.deleteMany({
					where: { id: { in: remove_contestants } },
				}),
				this.prisma.raceContestant.createMany({
					data: new_contestants.map((con) => ({
						race_id: id,
						...con,
					})),
				}),
			]);

			// check if all operations were performed
			return (
				result[0].id == id &&
				result[1].count == remove_contestants.length &&
				result[2].count == new_contestants.length
			);
		} catch (e) {
			return false;
		}
	}

	async close_races_bets_at_deadline(): Promise<number> {
		let result = await this.prisma.race.updateMany({
			where: {
				isEnded: false,
				isOpenBets: true,
				deadline: {
					lte: new Date(),
				},
			},
			data: { isOpenBets: false },
		});

		return result.count;
	}

	async #get_image_as_str(
		table: "user" | "horse",
		user: string | UserData | HorseData
	): Promise<string> {
		let name = typeof user == "string" ? user : user.name;
		let user_data =
			typeof user == "string" ? await this.#get_entry_data_for_image(table, user) : user;
		let image = user_data?.image;

		try {
			if (!image) throw new Error();
			let image_str = get_image_buffer_as_str(image);
			if (!image_str) throw new Error();
			return image_str;
		} catch (e) {
			return user_data ? default_user_image(user_data) : "";
		}
	}

	async #get_entry_data_for_image(
		table: "user" | "horse",
		name: string
	): Promise<UserData | HorseData | null> {
		switch (table) {
			case "user":
				return await this.get_user_data({ user: name, to_token: false });
			case "horse":
				return await this.get_horse_data(name);
			default:
				throw new Error("Invalid Table");
		}
	}

	async #get_contestant_members_ids(
		contestants: contestant_t[]
	): Promise<{ jockey_id: bigint; horse_id: bigint }[]> {
		let data = contestants.map(async ({ jockey, horse }) => {
			let jockey_result = await this.prisma.user.findUnique({
				where: { name: jockey },
				select: { id: true },
			});
			let horse_result = await this.prisma.horse.findUnique({
				where: { name: horse },
				select: { id: true },
			});

			if (!jockey_result || !horse_result) throw new Error("contestant-not-found");
			return { jockey_id: jockey_result.id, horse_id: horse_result.id };
		});

		return await Promise.all(data);
	}

	async #find_contestants_to_new_remove(
		race_id: bigint,
		contestants: contestant_t[],
		using_prisma?: prisma_t
	) {
		if (!using_prisma) using_prisma = this.prisma;
		let current_competitors = await using_prisma.raceContestant.findMany({
			where: { race_id },
			select: {
				id: true,
				jockey: { select: { name: true } },
				horse: { select: { name: true } },
			},
		});

		let new_competitors = contestants.filter(
			({ jockey, horse }) =>
				current_competitors.find(
					(comp) => comp.jockey.name == jockey && comp.horse.name == horse
				) === undefined
		);
		let remove_competitors = current_competitors.filter(
			({ jockey: { name: jockey }, horse: { name: horse } }) =>
				contestants.find((comp) => comp.jockey == jockey && comp.horse == horse) ===
				undefined
		);

		let new_contestants_ids = await this.#get_contestant_members_ids(new_competitors);
		return {
			new_contestants: new_contestants_ids,
			remove_contestants: remove_competitors.map((comp) => comp.id),
		};
	}
}