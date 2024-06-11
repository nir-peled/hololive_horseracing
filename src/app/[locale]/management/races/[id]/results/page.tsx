import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import RaceResultsEditor from "@/src/components/races/RaceResultsEditor";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import PageTitle from "@/src/components/PageTitle";
import { database_factory } from "@/src/lib/database";

export const dynamic = "force-dynamic";

const namespaces = ["races", "management"];

interface Props {
	params: {
		locale: Locale;
		id: string;
	};
}

export default async function RaceSubmitResultsPage({ params: { locale, id } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	try {
		const id_number = BigInt(id);
		const race_details = await database_factory
			.race_database()
			.get_race_parameters(id_number);
		if (!race_details) notFound();

		return (
			<>
				<PageTitle>
					{t("race-submit-results-title", {
						ns: "management",
						race_name: race_details.name,
					})}
				</PageTitle>
				<TranslationsProvider
					namespaces={namespaces}
					locale={locale}
					resources={resources}>
					<Suspense>
						<RaceResultsEditor id={id_number} />
					</Suspense>
				</TranslationsProvider>
			</>
		);
	} catch (error) {
		console.log(error);
		return notFound();
	}
}
