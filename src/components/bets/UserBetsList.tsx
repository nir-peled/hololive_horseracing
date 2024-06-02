import React from "react";
import { redirect } from "next/navigation";
import initTranslations from "@/src/lib/i18n";
import { database_factory } from "@/src/lib/database";
import { Locale } from "@/src/lib/types";
import { auth } from "@/src/lib/auth";
import BetDisplayLine from "./BetDisplayLine";

const namespaces = ["bets"];

interface Props {
	locale: Locale;
}

export default async function UserBetsList({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const user = (await auth())?.user?.name;
	if (!user) redirect(`/${locale}/login`); // should never happen

	const bets = await database_factory
		.bets_database()
		.get_user_bets(user, { active: true });

	return (
		<table className="table">
			<thead>
				<tr>
					<th>{t("bet-race-name-header")}</th>
					<th>{t("bet-contestants-header")}</th>
					<th>{t("bet-amount-header")}</th>
					<th>{t("bet-odds-header")}</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{bets.map((bet) => (
					<BetDisplayLine key={bet.race} bet={bet} locale={locale} />
				))}
			</tbody>
		</table>
	);
}
