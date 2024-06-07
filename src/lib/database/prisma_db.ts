import { Prisma, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
	UserDatabase,
	HorseDatabase,
	RaceDatabase,
	QueryResult,
	GetUserDataOptions,
	user_data_select,
	Select,
	horse_data_select,
	race_data_select,
	race_parameters_select,
	competitors_display_data_select,
	BetsDatabase,
	bet_data_select,
	CacheDatabase,
} from ".";
import {
	UserFormData,
	UserData,
	UserDefaultValues,
	RaceContestantsData,
	HorseData,
	RaceData,
	RaceFormData,
	RaceParameters,
	ContestantData,
	ContestantDisplayData,
	BetData,
	FullBetData,
	BetDetails,
	FullBetOdds,
	FullBetFormData,
	bet_type,
	FormBetDetails,
	ContestantPlacementData,
	Cuts,
	Reward,
	BETS_TYPES,
	ContestantOddsUpdate,
} from "../types";
import { Encryptor } from "../encryptor";
import { default_user_image, get_image_buffer_as_str, image_as_buffer } from "../images";
import { auth } from "../auth";
import { race_result_to_race_data } from "./db_utils";
import { sum, to_lowercase, to_uppercase } from "../utils";

// export interface PrismaOptions extends Prisma.PrismaClientOptions {
// 	accelerate?: boolean;
// }

function create_prisma_client() {
	return new PrismaClient().$extends(withAccelerate());
}

type prisma_t = ReturnType<typeof create_prisma_client>;
type contestant_t = { jockey: string; horse: string };

export class PrismaDatabase
	implements UserDatabase, HorseDatabase, RaceDatabase, BetsDatabase, CacheDatabase
{
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
			return false;
		}

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
	}: GetUserDataOptions = {}): Promise<UserData | null> {
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

	async get_race_contestants_data(id: bigint): Promise<RaceContestantsData | null> {
		let result = await this.prisma.race.findUnique({
			where: { id },
			select: {
				competitors: race_data_select.competitors,
			},
		});

		if (!result) return null;
		return result.competitors as RaceContestantsData;
	}

	async get_race_contestants(id: bigint): Promise<ContestantData[] | null> {
		let result = await this.prisma.race.findUnique({
			where: { id },
			select: {
				competitors: {
					select: competitors_display_data_select,
				},
			},
		});

		if (!result) return null;
		return result.competitors.map((contestant) => ({
			id: contestant.id,
			race_id: id,
			jockey: contestant.jockey.name,
			horse: contestant.horse.name,
			place: contestant.place != null ? contestant.place : undefined,
			odds: this.#odds_from_contestant_query(contestant),
		}));
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

	async close_races_bets_at_deadline(): Promise<bigint[]> {
		let races_result = await this.prisma.race.findMany({
			where: {
				isEnded: false,
				isOpenBets: true,
				deadline: {
					lte: new Date(),
				},
			},
			select: { id: true },
		});

		let races = races_result.map((data) => data.id);

		let result = await this.prisma.race.updateMany({
			where: {
				id: {
					in: races,
				},
			},
			data: { isOpenBets: false },
		});

		return races;
	}

	async get_contestants_display_data(id: bigint): Promise<ContestantDisplayData[]> {
		let result = await this.prisma.race.findUnique({
			where: { id },
			select: {
				competitors: {
					select: competitors_display_data_select,
				},
			},
		});

		if (!result) return [];

		// Promise.all bc async functions return promises
		return Promise.all(
			result.competitors.map((data) => this.#contestant_display_data_from_query(data))
		);
	}

	async get_user_bets(user: string, op?: { active?: boolean }): Promise<BetData[]> {
		const active_select =
			op?.active == undefined
				? undefined
				: {
						race: { isEnded: !op.active },
				  };

		const result = await this.prisma.bet.findMany({
			where: {
				user: { name: user },
				contestant: active_select,
			},
			select: bet_data_select,
		});

		return Promise.all(result.map(async (bet) => this.#bet_data_from_query(bet)));
	}

	async get_user_bets_on_race(
		user: string,
		race_id: bigint
	): Promise<FullBetData | undefined> {
		let result = await this.prisma.bet.findMany({
			where: {
				user: {
					name: user,
				},
				contestant: {
					race_id,
				},
			},
			select: bet_data_select,
		});

		if (!result) return;

		let data: FullBetData = { user, race: race_id };

		for (let bet of result) {
			let bet_details = this.#bet_details_from_result(bet);
			switch (bet.type) {
				case "WIN":
					data.win = bet_details;
					break;
				case "PLACE":
					data.place = bet_details;
					break;
				case "SHOW":
					data.show = bet_details;
					break;
			}
		}

		return data;
	}

	async get_race_bets(race: bigint): Promise<BetData[]> {
		let result = await this.prisma.bet.findMany({
			where: {
				contestant: {
					race_id: race,
				},
			},
			select: bet_data_select,
		});

		return Promise.all(result.map(async (bet) => this.#bet_data_from_query(bet)));
	}

	async update_user_race_bets(
		user: string,
		race: bigint,
		bets: FullBetFormData
	): Promise<number> {
		let user_id = (
			await this.prisma.user.findUnique({
				where: { name: user },
				select: { id: true },
			})
		)?.id;
		if (!user_id) throw Error("user-not-found");

		let previous_bets = await this.prisma.bet.findMany({
			where: {
				user_id,
				contestant: {
					race_id: race,
				},
			},
			select: { amount: true },
		});

		let updates = Object.entries<FormBetDetails>(bets).map(([type, bet]) =>
			this.prisma.bet.upsert({
				where: {
					user_id_contestant_id: {
						user_id,
						contestant_id: bet.contestant,
					},
					type: to_uppercase(type as bet_type),
				},
				update: {
					amount: bet.amount,
				},
				create: {
					user_id,
					contestant_id: bet.contestant,
					amount: bet.amount,
					type: to_uppercase(type as bet_type),
				},
			})
		);

		let results = await this.prisma.$transaction(updates);

		let amount_delta = this.#bet_sum(previous_bets) - this.#bet_sum(results);
		await this.prisma.user.update({
			where: { id: user_id },
			data: { balance: { decrement: amount_delta } },
		});

		return amount_delta;
	}

	async set_race_placements(
		id: bigint,
		placements: ContestantPlacementData
	): Promise<boolean> {
		try {
			let result = await this.prisma.$transaction([
				this.prisma.raceContestant.update({
					where: { id: placements.first },
					data: { place: 1 },
				}),
				this.prisma.raceContestant.update({
					where: { id: placements.second },
					data: { place: 2 },
				}),
				this.prisma.raceContestant.update({
					where: { id: placements.second },
					data: { place: 3 },
				}),
				this.prisma.race.update({
					where: { id },
					data: { isEnded: true, isOpenBets: false },
				}),
			]);

			return result.length == Object.keys(placements).length;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async get_cuts(): Promise<Cuts> {
		let management_cut = await this.#cache("management_cut");
		let jockeys_cuts_raw = await await this.#cache("jockeys_cut");

		return {
			management: management_cut ? Number(management_cut) : 0,
			jockeys: jockeys_cuts_raw ? JSON.parse(jockeys_cuts_raw) : [],
		};
	}

	async get_management_reward_target(): Promise<string | undefined> {
		return await this.#cache("management_reward_target");
	}

	async reward_users(rewards: Reward[]): Promise<void> {
		let queries = rewards.map((reward) =>
			this.prisma.user.update({
				where: { name: reward.user },
				data: { balance: { increment: reward.amount } },
				select: { name: true, balance: true },
			})
		);

		await this.prisma.$transaction(queries);
	}

	async get_race_bets_by_pools(race: bigint): Promise<Record<bet_type, BetData[]>> {
		let bets = await this.get_race_bets(race);
		let grouped_bets = Object.groupBy(bets, (bet) => bet.type);
		for (let type of BETS_TYPES)
			if (grouped_bets[type] === undefined) grouped_bets[type] = [];

		return grouped_bets as Record<bet_type, BetData[]>;
	}

	async update_race_odds(updates: ContestantOddsUpdate[]): Promise<void> {
		let updates_data = new Map<bigint, Prisma.RaceContestantUpdateInput>();
		for (let update of updates) {
			let current = updates_data.get(update.id);
			let new_update: Prisma.RaceContestantUpdateInput = {};
			new_update[`${update.type}_numerator`] = update.numerator;
			new_update[`${update.type}_denominator`] = update.denominator;

			updates_data.set(update.id, { ...current, ...new_update });
		}

		let queries = Array.from(updates_data.entries(), ([id, data]) =>
			this.prisma.raceContestant.update({
				where: { id },
				data,
			})
		);

		await this.prisma.$transaction(queries);
	}

	async #get_image_as_str(
		table: "user" | "horse",
		user: string | UserData | HorseData
	): Promise<string> {
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

	async #contestant_display_data_from_query(
		data: Prisma.RaceContestantGetPayload<{
			select: typeof competitors_display_data_select;
		}>
	): Promise<ContestantDisplayData> {
		return {
			id: data.id,
			race_id: data.race_id,
			place: data.place != null ? data.place : undefined,
			odds: this.#odds_from_contestant_query(data),
			jockey: {
				name: data.jockey.display_name || data.jockey.name,
				image: await this.#get_image_as_str("user", data.jockey as UserData),
			},
			horse: {
				name: data.horse.name,
				image: await this.#get_image_as_str("horse", data.horse as HorseData),
			},
		};
	}

	async #bet_data_from_query(
		bet: Prisma.BetGetPayload<{ select: typeof bet_data_select }>
	): Promise<BetData> {
		return {
			id: bet.id,
			race: bet.contestant.race.id,
			race_name: bet.contestant.race.name,
			active: !bet.contestant.race.isEnded,
			user: bet.user.name,
			contestant: await this.#contestant_display_data_from_query(bet.contestant),
			amount: bet.amount,
			type: to_lowercase(bet.type),
		};
	}

	#bet_details_from_result(
		bet: Prisma.BetGetPayload<{ select: typeof bet_data_select }>
	): BetDetails {
		return {
			contestant: bet.contestant.id,
			active: !bet.contestant.race.isEnded,
			amount: bet.amount,
		};
	}

	#odds_from_contestant_query(
		contestant: Prisma.RaceContestantGetPayload<{
			select: typeof competitors_display_data_select;
		}>
	): FullBetOdds {
		return {
			win: {
				numerator: contestant.win_numerator,
				denominator: contestant.win_denominator,
			},
			place: {
				numerator: contestant.place_numerator,
				denominator: contestant.place_denominator,
			},
			show: {
				numerator: contestant.show_numerator,
				denominator: contestant.show_denominator,
			},
		};
	}

	#bet_sum(bets: Prisma.BetGetPayload<{ select: { amount: true } }>[]): number {
		return sum(bets, ({ amount }) => amount);
	}

	async #cache(key: string): Promise<string | undefined> {
		let result = await this.prisma.cache.findUnique({
			where: { key },
			select: { value: true },
		});
		if (result && result.value) return result.value;
	}
}
