import { FullBetFormData } from "../types";

interface BetManager {
	close_races_bets(races: bigint[]): Promise<void>;
	make_full_bet(user: string, race: bigint, bets: FullBetFormData): Promise<void>;
}

class DatabaseBetManager implements BetManager {
	async close_races_bets(races: bigint[]): Promise<void> {}

	async make_full_bet(user: string, race: bigint, bets: FullBetFormData): Promise<void> {}
}

export const bet_manager = new DatabaseBetManager();
