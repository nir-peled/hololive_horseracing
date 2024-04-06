import React from "react";
import type { Locale } from "@/src/lib/types";
import RacesListRow from "./RacesListRow";
import initTranslations from "@/src/lib/i18n";
import { database_factory } from "@/src/lib/database";

interface Props {
	locale: Locale;
	is_management?: boolean;
}

const namespaces = ["races"];

export default async function RacesList({ locale, is_management }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const races = await database_factory.race_database().get_active_races();
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
							key={race.id}
							race={race}
							locale={locale}
							is_management={is_management}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
