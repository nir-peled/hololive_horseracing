import React from "react";
import { BetData, Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import BetDisplayLine from "./BetDisplayLine";

interface Props {
	locale: Locale;
	bets: BetData[];
}

const namespaces = ["bets"];

export default async function BetsTable({ locale, bets }: Props) {
	const { t } = await initTranslations(locale, namespaces);

	return (
		<table className="table">
			<thead>
				<tr>
					<th>{t("bet-race-name-header")}</th>
					<th>{t("bet-contestants-header")}</th>
					<th>{t("bet-amount-header")}</th>
					<th>{t("bet-type-header")}</th>
					<th>{t("bet-odds-header")}</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{bets.map((bet) => (
					<BetDisplayLine key={bet.id} bet={bet} locale={locale} />
				))}
			</tbody>
		</table>
	);
}
