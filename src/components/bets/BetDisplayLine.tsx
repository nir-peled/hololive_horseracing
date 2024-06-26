import React from "react";
import Link from "next/link";
import { BetData, Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import AmountDisplay from "../AmountDisplay";
import IconImage from "../IconImage";

interface Props {
	bet: BetData;
	locale: Locale;
}

const namespaces = ["bets"];

export default async function BetDisplayLine({
	bet: {
		race_name,
		contestant: { jockey, horse, odds },
		amount,
		race,
		type,
		isActive,
		isEditable,
		isWon,
	},
	locale,
}: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const bet_odds = odds[type];

	return (
		<tr className="border-none glass shadow-sm">
			<td>{race_name}</td>
			<td className="inline-grid grid-rows-2">
				<IconImage icon={jockey.image} shape="square" />
				<IconImage icon={horse.image} shape="square" />
				<b>{jockey.name}</b>
				<b>{horse.name}</b>
			</td>
			<td>
				{isActive
					? t("bet-status-active")
					: isWon
					? t("bet-status-won")
					: t("bet-status-lost")}
			</td>
			<td>
				<AmountDisplay amount={amount} />
			</td>
			<td>{t(`bet-${type}`)}</td>
			<td>{`${bet_odds.numerator} / ${bet_odds.denominator}`}</td>
			<td>
				{isEditable && (
					<Link href={`/${locale}/bets/${race}`} className="btn">
						{t("edit-bet-button")}
					</Link>
				)}
			</td>
		</tr>
	);
}
