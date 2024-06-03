import { database_factory } from "../database";
import { FullBetFormData } from "../types";

interface BetManager {
	close_races_bets(races: bigint[]): Promise<void>;
	make_full_bet(user: string, race: bigint, bets: FullBetFormData): Promise<void>;
}

class DatabaseBetManager implements BetManager {
	async close_races_bets(races: bigint[]): Promise<void> {}

	async make_full_bet(user: string, race: bigint, bets: FullBetFormData): Promise<void> {
		await database_factory.bets_database().update_user_race_bets(user, race, bets);
		await this.#update_race_odds(race);
	}

	async #update_race_odds(race: bigint) {}
}

export const bet_manager = new DatabaseBetManager();
