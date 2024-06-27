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

		let updates = this.#get_pool_contestants_odds_updates(
			pool,
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
		pool: BetData[],
		total_amount: number,
		type: bet_type,
		MAX_ODDS_PRECISION: number
	): ContestantOddsUpdate[] {
		let contestants_bet_amounts = this.#get_contestnant_bets_amount(pool);

		let updates: ContestantOddsUpdate[] = [];
		for (let [contestant, amount] of contestants_bet_amounts) {
			// you receive what wasn't bet on this competitor
			let reward = total_amount - amount;

			updates.push({
				id: contestant,
				type,
				...this.#calc_odds_from_part(reward, amount, MAX_ODDS_PRECISION),
			});
		}

		return updates;
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
