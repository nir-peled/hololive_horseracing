import React from "react";
import { database_factory } from "@/src/lib/database";
import type { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import RacesListRow from "./RacesListRow";

interface Props {
	locale: Locale;
	is_management?: boolean;
	active?: boolean;
}

const namespaces = ["races"];

export default async function RacesList({ locale, is_management, active }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const races = await database_factory.race_database().get_all_races({ active });
	return (
		<div className="overflow-x-auto">
			<table className="table">
				<thead>
					<tr>
						<th>{t("races-list-header-name")}</th>
						<th>{t("races-list-header-competitiors")}</th>
						<th>{t("races-list-header-deadline")}</th>
						<th></th>
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
