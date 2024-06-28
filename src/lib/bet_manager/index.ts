import { database_factory } from "../database";
import {
	BetData,
	bet_type,
	ContestantData,
	FullBetFormData,
	ContestantOddsUpdate,
	ContestantPlacementData,
} from "../types";
import { sum } from "../utils";
import { BetsCloser } from "./bets_closer";

interface BetManager {
	close_race_bets(race: bigint, placements: ContestantPlacementData): Promise<void>;
	make_full_bet(user: string, race: bigint, bets: FullBetFormData): Promise<void>;
	update_race_odds(race: bigint): Promise<void>;
	update_race_odds_all(): Promise<void>;
}

class DatabaseBetManager implements BetManager {
	async close_race_bets(race: bigint, placements: ContestantPlacementData) {
		await new BetsCloser(race, placements).close();
	}

	async make_full_bet(user: string, race: bigint, bets: FullBetFormData): Promise<void> {
		await database_factory.bets_database().update_user_race_bets(user, race, bets);
		await this.update_race_odds(race);
	}

	async update_race_odds(race: bigint) {
		console.log(`updating odds in race ${race}`); // debug
		let contestants = await database_factory.race_database().get_race_contestants(race);
		if (contestants == null) return;

		let bets_pools = await database_factory.bets_database().get_race_bets_by_pools(race);
		let cuts = await database_factory.cache_database().get_cuts();
		let total_cuts = cuts.house + sum(cuts.jockeys);
		let updates: ContestantOddsUpdate[] = [];

		for (let [type, pool] of Object.entries(bets_pools)) {
			let pool_updates = this.#calc_pool_updates(
				pool,
				type as bet_type,
				total_cuts,
				contestants
			);
			updates = updates.concat(pool_updates);
		}

		await database_factory.race_database().update_race_odds(updates);
	}

	async update_race_odds_all() {
		let races = await database_factory.race_database().get_all_races({ active: true });
		for (let race of races) {
			this.update_race_odds(race.id);
		}
	}

	#calc_pool_updates(
		pool: BetData[],
		type: bet_type,
		total_cuts: number,
		contestants: ContestantData[]
	): ContestantOddsUpdate[] {
		const MAX_ODDS_PRECISION = Number(process.env.MAX_ODDS_PECISION || 100);

		let total_pool_amount = sum(pool, ({ amount }) => amount);
		if (total_pool_amount == 0)
			return contestants.map(({ id }) => ({
				id,
				type,
				numerator: 1,
				denominator: 1,
			}));

		let missing_contestans = contestants.filter(
			(c) => pool.findIndex((b) => b.contestant.id == c.id) == -1
		);

		let total_reward_amount = (total_pool_amount * (100 - total_cuts)) / 100;
		if (total_reward_amount <= 0) total_reward_amount = 0;

		let contestants_bet_amounts = this.#get_contestnant_bets_amount(pool);
		let updates = this.#get_pool_contestants_odds_updates(
			contestants_bet_amounts,
			total_reward_amount,
			type,
			MAX_ODDS_PRECISION
		);

		updates = updates.concat(
			missing_contestans.map(({ id }) => ({
				id,
				type,
				numerator: Math.min(MAX_ODDS_PRECISION, total_reward_amount),
				denominator: 1,
			}))
		);

		return updates;
	}

	#get_pool_contestants_odds_updates(
		contestants_bet_amounts: Map<bigint, number>,
		total_amount: number,
		type: bet_type,
		MAX_ODDS_PRECISION: number
	): ContestantOddsUpdate[] {
		if (contestants_bet_amounts.size == 0) return [];

		let total_reward = this.#total_reward_by_type(total_amount, type);
		let updates: ContestantOddsUpdate[] = [];

		for (let [contestant, amount] of contestants_bet_amounts) {
			// you receive what wasn't bet on this competitor
			updates.push({
				id: contestant,
				type,
				...this.#calc_odds_from_part(total_reward, amount, MAX_ODDS_PRECISION),
			});
		}

		if (
			total_reward !== total_amount &&
			updates.find(({ numerator, denominator }) => numerator < denominator) !== undefined
		) {
			let new_updates = this.#fix_updates_with_negative_payout(
				contestants_bet_amounts,
				total_amount,
				type,
				MAX_ODDS_PRECISION
			);

			if (new_updates !== undefined) updates = new_updates;
		}

		// if could not fix
		updates.forEach((u) => {
			if (u.numerator < u.denominator) {
				u.numerator = 0;
				u.denominator = 1;
			}
		});

		return updates;
	}

	#fix_updates_with_negative_payout(
		contestants_bet_amounts: Map<bigint, number>,
		total_amount: number,
		type: bet_type,
		MAX_ODDS_PRECISION: number
	): ContestantOddsUpdate[] | undefined {
		let [max_bets_contestant, max_bets_amount] = [
			...contestants_bet_amounts.entries(),
		].reduce((c1, c2) => (c1[1] >= c2[1] ? c1 : c2));

		let min_reward_for_max_bet =
			(max_bets_amount * (MAX_ODDS_PRECISION + 1)) / MAX_ODDS_PRECISION;

		if (min_reward_for_max_bet > total_amount)
			// nothing we can do, cuts took too much or not enough other bets
			return;

		let regular_reward_amount = this.#total_reward_by_type(total_amount, type);
		if (max_bets_amount < regular_reward_amount)
			// all is fine
			return;

		// give this contestant minimum reward ratio
		let updates: ContestantOddsUpdate[] = [
			{
				id: max_bets_contestant,
				type,
				numerator: 1,
				denominator: MAX_ODDS_PRECISION,
			},
		];
		contestants_bet_amounts.delete(max_bets_contestant);

		if (contestants_bet_amounts.size != 0) {
			// calc other contestants odds recursively, with what's left of the pot
			let updates_for_the_rest = this.#get_pool_contestants_odds_updates(
				contestants_bet_amounts,
				total_amount - min_reward_for_max_bet,
				this.#type_up(type),
				MAX_ODDS_PRECISION
			);

			updates = updates.concat(
				updates_for_the_rest.map((u) => ({
					...u,
					type,
				}))
			);
		}

		return updates;
	}

	#type_up(type: bet_type): bet_type {
		switch (type) {
			case "place":
				return "win";
			case "show":
				return "place";
			default:
				throw Error(`cannot up type ${type}`);
		}
	}

	#total_reward_by_type(total_amount: number, type: bet_type) {
		switch (type) {
			case "win":
				return total_amount;
			case "place":
				return Math.floor(total_amount / 2);
			case "show":
				return Math.floor(total_amount / 3);
		}
	}

	#get_contestnant_bets_amount(pool: BetData[]): Map<bigint, number> {
		let contestants_bet_amounts = new Map<bigint, number>();
		for (let bet of pool) {
			let key = bet.contestant.id;

			let current = contestants_bet_amounts.get(key);
			if (current === undefined) current = 0;

			contestants_bet_amounts.set(key, current + bet.amount);
		}

		return contestants_bet_amounts;
	}

	#calc_odds_from_part(
		numerator: number,
		denominator: number,
		precision: number
	): { numerator: number; denominator: number } {
		let gcd = this.#find_gcd(numerator, denominator);
		let reduced_numerator = numerator / gcd;
		let reduced_denominator = denominator / gcd;
		let max_val = Math.max(reduced_numerator, reduced_numerator);

		if (max_val > precision) {
			let reduce_factor = max_val / precision;
			reduced_numerator = Math.floor(reduced_numerator / reduce_factor);
			reduced_denominator = Math.ceil(reduced_denominator / reduce_factor);
		}

		return {
			numerator: reduced_numerator,
			denominator: reduced_denominator,
		};
	}

	#find_gcd(numerator: number, denominator: number): number {
		let a = denominator,
			b = numerator;

		while (b !== 0) {
			let tmp = a % b;
			a = b;
			b = tmp;
		}

		return a;
	}
}

export const bet_manager: BetManager = new DatabaseBetManager();
