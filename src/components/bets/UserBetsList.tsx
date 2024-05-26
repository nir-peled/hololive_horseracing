import React from "react";
import { redirect } from "next/navigation";
import { database_factory } from "@/src/lib/database";
import { Locale } from "@/src/lib/types";
import { auth } from "@/src/lib/auth";
import BetDisplayLine from "./BetDisplayLine";

// const namespaces = ["bets"];

interface Props {
	locale: Locale;
}

export default async function UserBetsList({ locale }: Props) {
	const user = (await auth())?.user?.name;
	if (!user) redirect(`/${locale}/login`);

	const bets = await database_factory
		.bets_database()
		.get_user_bets(user, { active: true });

	return (
		<table className="table">
			<tbody>
				{bets.map((bet) => (
					<BetDisplayLine key={bet.race} bet={bet} locale={locale} />
				))}
			</tbody>
		</table>
	);
}
