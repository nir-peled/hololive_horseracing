import React, { Suspense } from "react";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import TranslationsProvider from "@/src/components/TranslationProvider";
import EditRaceForm from "@/src/components/races/EditRaceForm";
import LoadingMarker from "@/src/components/LoadingMarker";
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

export default async function RaceEditPage({ params: { locale, id } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);

	return (
		<>
			<PageTitle>{t("edit-race-title", { ns: "management" })}</PageTitle>
			<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
				<Suspense fallback={<LoadingMarker />}>
					<EditRaceForm id={Number(id)} />
				</Suspense>
			</TranslationsProvider>
		</>
	);
}
