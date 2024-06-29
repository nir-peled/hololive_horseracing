import React from "react";
import { notFound } from "next/navigation";
import initTranslations from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/types";
import { database_factory } from "@/src/lib/database";
import TranslationsProvider from "@/src/components/TranslationProvider";
import RaceDetails from "@/src/components/races/RaceDetails";
import PageTitle from "@/src/components/PageTitle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const namespaces = ["races"];

interface Props {
	params: {
		locale: Locale;
		id: string;
	};
}

export default async function RacePage({ params: { locale, id } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	let id_num: bigint;
	try {
		id_num = BigInt(id);
	} catch (e) {
		notFound();
	}

	const race_data = await database_factory.race_database().get_race_parameters(id_num);
	if (!race_data) notFound();

	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle size="large">{t("race-page-title", { name: race_data.name })}</PageTitle>
			<RaceDetails id={id_num} locale={locale} />
		</TranslationsProvider>
	);
}
