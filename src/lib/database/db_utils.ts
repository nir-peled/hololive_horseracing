import { RaceData } from "../types";

export function race_result_to_race_data(race: {
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
