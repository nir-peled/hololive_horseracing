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
	bet: { id, race_name, contestant, amount, race },
	locale,
}: Props) {
	const { t } = await initTranslations(locale, namespaces);

	return (
		<tr className="border-none glass shadow-sm">
			<td>{race_name}</td>
			<td className="inline-grid grid-rows-2">
				<IconImage icon={contestant.jockey.image} />
				<IconImage icon={contestant.horse.image} />
				<b>{contestant.jockey.name}</b>
				<b>{contestant.horse.name}</b>
			</td>
			<td>
				<AmountDisplay amount={amount} />
			</td>
			<td>
				<Link href={`/${locale}/bets/${race}`}>{t("edit-bet-button")}</Link>
			</td>
		</tr>
	);
}
