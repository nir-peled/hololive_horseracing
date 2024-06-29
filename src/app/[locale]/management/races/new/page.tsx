import React from "react";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import TranslationsProvider from "@/src/components/TranslationProvider";
import EditRaceForm from "@/src/components/races/EditRaceForm";
import PageTitle from "@/src/components/PageTitle";

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["races", "management", "common"];

interface Props {
	params: {
		locale: Locale;
	};
}

export default async function NewRacePage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);

	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle>{t("new-race-title", { ns: "management" })}</PageTitle>
			<EditRaceForm />
		</TranslationsProvider>
	);
}
