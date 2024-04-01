import React from "react";
import type { Locale } from "@/src/lib/types";
import { get_active_races } from "@/src/lib/database";
import RacesListRow from "./RacesListRow";
import initTranslations from "@/src/lib/i18n";

interface Props {
	locale: Locale;
	is_management?: boolean;
}

const namespaces = ["races"];

export default async function RacesList({ locale, is_management }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const races = await get_active_races();
	return (
		<div className="overflow-x-auto">
			<table className="table">
				<thead>
					<tr>
						<th>{t("races-list-header-name")}</th>
						<th>{t("races-list-header-competitiors")}</th>
						<th>{t("races-list-header-deadline")}</th>
						{is_management && (
							<>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
							</>
						)}
					</tr>
				</thead>
				<tbody>
					{races.map(async (race) => (
						<RacesListRow
							id={race.id}
							name={race.name}
							contestants={race.contestants}
							deadline={race.deadline}
							locale={locale}
							is_management={is_management}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
