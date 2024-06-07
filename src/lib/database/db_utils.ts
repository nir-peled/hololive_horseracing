import { RaceData } from "../types";

export function race_result_to_race_data(race: {
	id: bigint;
	name: string;
	deadline: Date | null;
	house_cut_percent: number | null;
	win_cut_percent: number | null;
	place_cut_percent: number | null;
	show_cut_percent: number | null;
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
		cuts:
			race.house_cut_percent !== null
				? {
						house_percent: race.house_cut_percent || 0,
						win_percent: race.win_cut_percent || 0,
						place_percent: race.place_cut_percent || 0,
						show_percent: race.show_cut_percent || 0,
				  }
				: undefined,
		contestants: race.competitors,
	};
}

export function or_undefined<T>(arg: T | null): T | undefined {
	return arg !== null ? arg : undefined;
}
