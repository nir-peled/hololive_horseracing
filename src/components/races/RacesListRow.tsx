import React from "react";
import Link from "next/link";
import initTranslations from "@/src/lib/i18n";
import type { Locale, RaceData } from "@/src/lib/types";
import RaceListEditControls from "./RaceListEditControls";
import DeadlineCounter from "./DeadlineCounter";
import ProtectedLink from "../ProtectedLink";
import RaceRowRacer from "./RaceRowRacer";

interface Props {
	locale: Locale;
	race: RaceData;
	is_management?: boolean;
}

const namespaces = ["races"];

export default async function RacesListRow({
	locale,
	race: { id, name, contestants, deadline, isEnded, isOpenBets },
	is_management,
}: Props) {
	const { t } = await initTranslations(locale, namespaces);

	return (
		<tr className="min-h-12">
			{/* make page /races/[id] */}
			<td>
				<ProtectedLink href={`/races/${id}`} locale={locale} className="btn btn-ghost">
					{name}
				</ProtectedLink>
			</td>
			<td className="grid grid-rows-2 grid-flow-col gap-4">
				{contestants.map((racer, i) => (
					<RaceRowRacer key={i} user={racer.jockey} horse={racer.horse} />
				))}
			</td>
			<td>{deadline && <DeadlineCounter deadline={deadline} />}</td>
			<td>
				<Link href={`/bets/${id}`}>{t("race-bet-link")}</Link>
			</td>
			{is_management && (
				<RaceListEditControls
					id={id}
					isOpenBets={isOpenBets}
					isEnded={isEnded}
					locale={locale}
				/>
			)}
		</tr>
	);
}
