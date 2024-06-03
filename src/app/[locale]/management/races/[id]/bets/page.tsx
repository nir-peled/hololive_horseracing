import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/src/lib/types";
import { database_factory } from "@/src/lib/database";
import PageTitle from "@/src/components/PageTitle";
import initTranslations from "@/src/lib/i18n";
import BetsTable from "@/src/components/bets/BetsTable";

interface Props {
	params: {
		locale: Locale;
		id: string;
	};
}

const namespaces = ["races", "bets"];

export default async function RaceAllBetsPage({ params: { locale, id } }: Props) {
	try {
		const { t } = await initTranslations(locale, namespaces);
		const race_id = BigInt(id);
		const race_parameters = await database_factory
			.race_database()
			.get_race_parameters(race_id);

		if (!race_parameters) throw Error(`race ${id} not found`);

		const race_bets = await database_factory.bets_database().get_race_bets(race_id);

		return (
			<>
				<PageTitle>
					{t("race-all-bets-title", { ns: "races", name: race_parameters.name })}
				</PageTitle>
				<BetsTable locale={locale} bets={race_bets} />
			</>
		);
	} catch (e) {
		console.log(e);
		notFound();
	}
}
