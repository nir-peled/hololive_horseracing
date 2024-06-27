import { ContestantDisplayData, Locale } from "@/src/lib/types";
import React from "react";
import RaceDetailsRacer from "./RaceDetailsRacer";
import initTranslations from "@/src/lib/i18n";
import OddsExplanationTooltip from "../bets/OddsExplanationTooltip";
import TranslationsProvider from "../TranslationProvider";

interface Props {
	contestants: ContestantDisplayData[];
	locale: Locale;
	with_place?: boolean;
}

const namespaces = ["bets"];

export default async function RaceDetailsContestants({
	contestants,
	locale,
	with_place = false,
}: Props) {
	const { resources } = await initTranslations(locale, namespaces);

	return (
		<table className="table">
			<thead>
				<tr>
					{with_place && <td></td>}
					<td></td>
					<td></td>
					<td className="flex flex-row justify-center">
						<TranslationsProvider
							namespaces={namespaces}
							resources={resources}
							locale={locale}>
							<OddsExplanationTooltip />
						</TranslationsProvider>
					</td>
				</tr>
			</thead>
			{contestants?.map((contestant, i) => (
				<RaceDetailsRacer key={i} contestant={contestant} with_place={with_place} />
			))}
		</table>
	);
}
