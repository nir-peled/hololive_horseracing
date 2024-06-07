import { database_factory } from "../database";
import { ContestantOddsUpdate } from "../types";
import { bet_type, BetData, ContestantPlacementData, FullBetFormData } from "../types";
import { sum } from "../utils";
import { BetsCloser } from "./bets_closer";

interface BetManager {
	close_race_bets(race: bigint, placements: ContestantPlacementData): Promise<void>;
	make_full_bet(user: string, race: bigint, bets: FullBetFormData): Promise<void>;
}

class DatabaseBetManager implements BetManager {
	async close_race_bets(race: bigint, placements: ContestantPlacementData) {
		await new BetsCloser(race, placements).close();
	}

	async make_full_bet(user: string, race: bigint, bets: FullBetFormData): Promise<void> {
		await database_factory.bets_database().update_user_race_bets(user, race, bets);
		await this.#update_race_odds(race);
	}

	async #update_race_odds(race: bigint) {
		let bets_pools = await database_factory.bets_database().get_race_bets_by_pools(race);
		let cuts = await database_factory.cache_database().get_cuts();
		let total_cuts = cuts.house + sum(cuts.jockeys);
		let updates: ContestantOddsUpdate[] = [];

		for (let [type, pool] of Object.entries(bets_pools)) {
			let total_pool_amount = sum(pool, ({ amount }) => amount);
			let total_reward_amount = (total_pool_amount * (100 - total_cuts)) / 100;
			if (total_reward_amount < 0) total_reward_amount = 0;

			let pool_updates = (updates = updates.concat(
				this.#get_pool_contestants_odds_updates(
					pool,
					total_reward_amount,
					type as bet_type
				)
			));

			updates = updates.concat(pool_updates);
		}

		await database_factory.race_database().update_race_odds(updates);
	}

	#get_pool_contestants_odds_updates(
		pool: BetData[],
		total_amount: number,
		type: bet_type
	): ContestantOddsUpdate[] {
		const MAX_ODDS_PRECISION = Number(process.env.MAX_ODDS_PECISION || 100);
		let contestants_bet_amounts = this.#get_contestnant_bets_amount(pool);

		let updates: ContestantOddsUpdate[] = [];
		for (let [contestant, amount] of contestants_bet_amounts) {
			let part_in_contestant = amount / total_amount;
			// round to precision
			part_in_contestant =
				Math.floor(part_in_contestant * MAX_ODDS_PRECISION) / MAX_ODDS_PRECISION;

			updates.push({
				id: contestant,
				type,
				...this.#calc_odds_from_part(part_in_contestant, MAX_ODDS_PRECISION),
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
		part: number,
		precision: number
	): { numerator: number; denominator: number } {
		const fraction = (part * precision) % precision;
		const whole = part * precision - fraction;
		for (let i = precision; i >= 2; --i) {
			let fraction_div = fraction / i;
			let precision_div = precision / i;

			if (
				Math.floor(fraction_div) == fraction_div &&
				Math.floor(precision_div) == precision_div
			)
				return {
					numerator: whole * precision_div + fraction_div,
					denominator: precision_div,
				};
		}

		return {
			numerator: whole + fraction,
			denominator: precision,
		};
	}
}

export const bet_manager = new DatabaseBetManager();
