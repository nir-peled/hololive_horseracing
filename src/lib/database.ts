import { Session, User as AuthUser } from "next-auth";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { auth } from "./auth";
import {
	UserData,
	UserFormData,
	UserDefaultValues,
	RaceData,
	HorseData,
	UserDataSelect,
	RaceContestantData,
	RaceFormData,
} from "./types";
import { compare_passwords, hash_password } from "./auth";
import { image_as_buffer } from "./utils";

const prisma = new PrismaClient().$extends(withAccelerate());

interface UserDataOps {
	session?: Session | null;
	user?: string;
	to_token?: boolean;
	select?: UserDataSelect;
}

export type Select<T> = Partial<Record<keyof T, boolean> & { id: boolean }>;
export type QueryResult<TBase, TSelect> = {
	[key in keyof (TBase | TSelect)]: TBase[key];
} & { id?: bigint };

type transaction_t = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

const user_data_select = {
	name: true,
	role: true,
	display_name: true,
	balance: true,
	dept: true,
	image: true,
};

const horse_data_select = {
	name: true,
	image: true,
};

const race_data_select = {
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

export async function is_user_password(name: string, password: string) {
	console.log("check if user password"); // debug

	let user = await prisma.user.findUnique({
		where: { name },
		select: { name: true, password: true },
	});
	if (!user) {
		console.log(`user .${name}. not found`); // debug
		return false;
	}

	console.log("found user, comparing passwords"); // debug
	return await compare_passwords(password, user.password);
}

export async function is_user_exists(name: string) {
	let user = await prisma.user.findUnique({ where: { name }, select: { name: true } });
	return user != null;
}

export async function create_user(params: UserFormData) {
	let hashed_pass = await hash_password(params.password);
	let image_buffer = await image_as_buffer(params.image);

	let user_params: Prisma.UserCreateInput = {
		name: params.username,
		password: hashed_pass,
		display_name: params.display_name,
		role: params.role,
		image: image_buffer,
	};

	let user = await prisma.user.create({ data: user_params });
	return !!user;
}

export async function edit_user(
	name: string,
	data: Partial<UserFormData>
): Promise<boolean> {
	let image_buffer = await image_as_buffer(data.image);
	try {
		let _ = await prisma.user.update({
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

export async function get_user_data({
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

	let user_data = (await prisma.user.findUnique({
		where: { name: user },
		select: select_fields,
	})) as UserData | null;

	return user_data;
}

export async function get_user_image(name: string): Promise<Buffer | null> {
	let user_data = await prisma.user.findUnique({
		where: { name },
		select: { image: true },
	});

	if (!user_data?.image) return null;
	return user_data.image;
}

export async function get_user_as_form_data(
	username: string | undefined
): Promise<UserDefaultValues> {
	const result =
		username &&
		(await prisma.user.findUnique({
			where: { name: username },
			select: {
				name: true,
				display_name: true,
				role: true,
				image: true,
			},
		}));

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

export async function get_usernames({
	filter,
	select,
}: {
	filter?: string;
	select?: Select<UserData>;
} = {}): Promise<QueryResult<UserData, typeof select>[]> {
	let select_params: Select<UserData> | undefined = select;
	if (!filter) filter = "";
	if (!select_params) select_params = { name: true, display_name: true };

	let data = await prisma.user.findMany({
		select: select_params,
		where: {
			name: { contains: filter },
		},
	});

	return data as QueryResult<UserData, typeof select>[];
}

function race_result_to_race_data(race: {
	id: bigint;
	name: string;
	deadline: Date | null;
	house_cut_percent: number;
	win_cut_percent: number;
	place_cut_percent: number;
	show_cut_percent: number;
	competitors: { jockey: any; horse: any }[];
	isOpenBets: boolean;
	isEnded: boolean;
}): RaceData {
	return {
		id: race.id,
		name: race.name,
		isOpenBets: race.isOpenBets,
		isEnded: race.isEnded,
		deadline: race.deadline,
		cuts: {
			house_percent: race.house_cut_percent,
			win_percent: race.win_cut_percent,
			place_percent: race.place_cut_percent,
			show_percent: race.show_cut_percent,
		},
		contestants: race.competitors,
	};
}

export async function get_active_races(): Promise<RaceData[]> {
	let results = await prisma.race.findMany({
		where: { isOpenBets: true },
		select: race_data_select,
	});

	return results.map(race_result_to_race_data) as RaceData[];
}

export async function create_horse(horse_data: HorseData): Promise<boolean> {
	let horse = await prisma.horse.create({ data: horse_data });
	return !!horse;
}

export async function get_horses(): Promise<HorseData[]> {
	let result = await prisma.horse.findMany({
		select: horse_data_select,
	});

	return result;
}

export async function get_race_parameters(id: bigint) {
	return await prisma.race.findUnique({
		where: { id },
		select: {
			name: true,
			isOpenBets: true,
			isEnded: true,
			deadline: true,
		},
	});
}

export async function get_race_data(id: number): Promise<RaceData | null> {
	let result = await prisma.race.findUnique({
		where: { id },
		select: race_data_select,
	});

	if (!result) return null;
	return race_result_to_race_data(result);
}

export async function get_horse_image(name: string): Promise<Buffer | null> {
	let result = await prisma.horse.findUnique({
		where: { name },
		select: { image: true },
	});

	return result && result.image;
}

export async function create_race(race_data: RaceFormData): Promise<boolean> {
	try {
		let contestants_ids = await get_contestant_members_ids(race_data.contestants);
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

		let race = await prisma.race.create({ data });
		return !!race;
	} catch (e) {
		console.log(e);
		return false;
	}
}

/** Delete race with id. First delete all bets of contestants
 * in the race, and all contestants in the race. Relying on
 * cascading deletion.
 *
 * @param id The race to delete
 * @returns If the delete was successful
 */
export async function try_delete_race(id: bigint): Promise<boolean> {
	// add something to do with bets of removed contestants?
	try {
		// let race_contestants = await get_contestants_of_race(id, { id: true });
		// let contestants_ids = race_contestants.map((c) => c.id);
		let result = await prisma.$transaction([
			prisma.raceContestant.deleteMany({
				where: { race_id: id },
			}),
			prisma.race.delete({ where: { id } }),
		]);

		// return if second transaction operation was performed
		return result[1].id == id;
	} catch (e) {
		console.log(e); // debug
		return false;
	}
}

export async function try_edit_race(
	id: bigint,
	race_data: Partial<RaceFormData>
): Promise<boolean> {
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
			? await find_contestants_to_new_remove(id, race_data.contestants)
			: { new_contestants: [], remove_contestants: [] };

		// add something to do with bets of removed contestants?
		// make sure the updated race is not open bets, and is not ended
		let result = await prisma.$transaction([
			prisma.race.update({ where: { id, isOpenBets: false, isEnded: false }, data }),
			prisma.raceContestant.deleteMany({ where: { id: { in: remove_contestants } } }),
			prisma.raceContestant.createMany({
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

type contestant_t = { jockey: string; horse: string };

async function get_contestant_members_ids(
	contestants: contestant_t[]
): Promise<{ jockey_id: bigint; horse_id: bigint }[]> {
	let data = contestants.map(async ({ jockey, horse }) => {
		let jockey_result = await prisma.user.findUnique({
			where: { name: jockey },
			select: { id: true },
		});
		let horse_result = await prisma.horse.findUnique({
			where: { name: horse },
			select: { id: true },
		});

		if (!jockey_result || !horse_result) throw new Error("contestant-not-found");
		return { jockey_id: jockey_result.id, horse_id: horse_result.id };
	});

	return await Promise.all(data);
}

async function get_contestants_of_race(
	race_id: bigint,
	select: Select<RaceContestantData>
	// ): Promise<QueryResult<RaceContestantData, typeof select>> {
): Promise<{ id: bigint }[]> {
	let result = await prisma.raceContestant.findMany({
		where: { race_id },
		select: { id: true },
	});
	return result;
}

async function find_contestants_to_new_remove(
	race_id: bigint,
	contestants: contestant_t[],
	using_prisma?: transaction_t
) {
	if (!using_prisma) using_prisma = prisma;
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

	let new_contestants_ids = await get_contestant_members_ids(new_competitors);
	return {
		new_contestants: new_contestants_ids,
		remove_contestants: remove_competitors.map((comp) => comp.id),
	};

	// await using_prisma.raceContestant.deleteMany({
	// 	where: { id: { in: removed_competitors.map((comp) => comp.id) } },
	// });

	// await using_prisma.raceContestant.createMany({
	// 	data: new_contestants_ids.map((contestant) => ({
	// 		race_id,
	// 		...contestant,
	// 	})),
	// });
}
