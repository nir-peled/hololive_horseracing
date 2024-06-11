import React from "react";
import { notFound } from "next/navigation";
import { database_factory } from "@/src/lib/database";
import initTranslations from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/types";
import PageTitle from "@/src/components/PageTitle";
import RaceResultsTable from "@/src/components/races/RaceResultsTable";

export const dynamic = "force-dynamic";

const namespaces = ["races"];

interface Props {
	params: {
		locale: Locale;
		id: string;
	};
}

export default async function RacePage({ params: { locale, id } }: Props) {
	const { t /*, resources*/ } = await initTranslations(locale, namespaces);
	let id_num: bigint;
	try {
		id_num = BigInt(id);
	} catch (e) {
		notFound();
	}

	const race_data = await database_factory.race_database().get_race_parameters(id_num);
	if (!race_data) notFound();

	const contestants = await database_factory
		.race_database()
		.get_contestants_display_data(id_num);

	return (
		// <TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
		<>
			<PageTitle size="large">
				{t("race-results-title", { name: race_data.name })}
			</PageTitle>
			<RaceResultsTable contestants={contestants} />
		</>
		// </TranslationsProvider>
	);
}
