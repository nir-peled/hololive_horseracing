import { database_factory } from "../database";
import { Odds, Reward } from "../types";
import {
	bet_type,
	BetData,
	BETS_TYPES,
	ContestantData,
	ContestantPlacementData,
	Cuts,
} from "../types";
import { init_object, sum } from "../utils";

interface CutsDetails {
	cuts: Cuts;
	house: string | null;
}

export class BetsCloser {
	race: bigint;
	placements: ContestantPlacementData;
	bet_pools: Record<bet_type, BetData[]>;
	cuts_details: CutsDetails;
	contestants?: ContestantData[] | null;
	jockeys?: string[];
	rewards: Reward[];
	house_reward: number;
	total_bet_amount: number;
	constructor(race: bigint, placements: ContestantPlacementData) {
		this.race = race;
		this.placements = placements;
		this.bet_pools = init_object(BETS_TYPES, () => [] as BetData[]);

		this.cuts_details = { cuts: { house: 0, jockeys: [] }, house: null };
		this.rewards = [];
		this.house_reward = 0;
		this.total_bet_amount = 0;
	}

	async close() {
		this.bet_pools = await database_factory
			.bets_database()
			.get_race_bets_by_pools(this.race);

		this.cuts_details = await this.#get_cuts_details();
		this.contestants = await database_factory
			.race_database()
			.get_race_contestants(this.race);

		if (!this.contestants) this.contestants = [];
		this.jockeys = this.contestants.map((c) => c.jockey);

		for (let [type, bets] of Object.entries(this.bet_pools)) {
			this.#get_pool_rewards(type as bet_type, bets);
		}

		let total_rewards_amount = sum(this.rewards, ({ amount }) => amount);
		if (total_rewards_amount < this.total_bet_amount)
			this.house_reward += this.total_bet_amount - total_rewards_amount;

		await this.#pay_rewards();
	}

	#get_pool_rewards(type: bet_type, bets: BetData[]) {
		let total_pool_amount = sum(bets, ({ amount }) => amount);
		this.total_bet_amount += total_pool_amount;

		this.#add_house_reward(total_pool_amount);

		let racers_rewards = this.#get_pool_racers_rewards(
			total_pool_amount,
			this.jockeys || [],
			this.cuts_details.cuts
		);

		let bets_rewards = this.#get_pool_bets_rewards(type, bets);

		this.#combine_rewards(racers_rewards);
		this.#combine_rewards(bets_rewards);
	}

	#get_pool_racers_rewards(
		total_bet_amount: number,
		jockeys: string[],
		cuts: Cuts
	): (Reward | undefined)[] {
		let rewards: (Reward | undefined)[] = [];
		rewards = cuts.jockeys.map((cut, i) =>
			jockeys[i]
				? {
						user: jockeys[i],
						amount: this.#calc_reward_for_cut(total_bet_amount, cut),
				  }
				: undefined
		);

		return rewards;
	}

	#add_house_reward(total_bet_amount: number) {
		if (this.cuts_details.house)
			this.house_reward += this.#calc_reward_for_cut(
				total_bet_amount,
				this.cuts_details.cuts.house
			);
	}

	#calc_reward_for_cut(total_amount: number, cut: number): number {
		return Math.floor(cut * total_amount);
	}

	#calc_reward_for_bet(bet_amount: number, { numerator, denominator }: Odds): number {
		return Math.floor(bet_amount * (numerator / denominator + 1));
	}

	async #get_cuts_details(): Promise<CutsDetails> {
		let cuts = await database_factory.race_database().get_race_cuts(this.race);
		if (!cuts) cuts = await database_factory.cache_database().get_cuts();
		let house = await database_factory.cache_database().get_house_reward_target();
		return { cuts, house };
	}

	#combine_rewards(racers_rewards: (Reward | undefined)[]) {
		for (let racer_reward of racers_rewards) {
			if (racer_reward && !this.#is_reward_in(racer_reward)) {
				this.rewards.push(racer_reward);
			}
		}
	}

	#is_reward_in(reward: Reward) {
		for (let bet_reward of this.rewards) {
			if (reward && bet_reward.user == reward.user) {
				bet_reward.amount += reward.amount;
				return true;
			}
		}

		return false;
	}

	async #pay_rewards() {
		await database_factory.user_database().reward_users(this.rewards);
	}

	#get_pool_bets_rewards(type: bet_type, bets: BetData[]): Reward[] {
		let rewards = bets.map((bet) =>
			this.#is_bet_wins(bet.contestant.id, type)
				? {
						user: bet.user,
						amount: this.#calc_reward_for_bet(bet.amount, bet.contestant.odds[type]),
				  }
				: undefined
		);

		return rewards.filter((reward) => reward !== undefined) as Reward[];
	}

	#is_bet_wins(contestant: bigint, type: bet_type): boolean {
		let winners = [this.placements.placements[0].contestant];
		if (["place", "show"].includes(type))
			winners.push(this.placements.placements[1].contestant);
		if (type == "show") winners.push(this.placements.placements[2].contestant);

		return winners.includes(contestant);
	}
}
