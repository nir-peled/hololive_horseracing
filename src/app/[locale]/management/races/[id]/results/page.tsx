import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import RaceResultsEditor from "@/src/components/races/RaceResultsEditor";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import PageTitle from "@/src/components/PageTitle";

// race id is dynamic
export const dynamicParams = true;

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

		return (
			<>
				<PageTitle>{t("race-submit-results-title", { ns: "management" })}</PageTitle>
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
		if (error instanceof TypeError) return notFound();
		throw error;
	}
}
