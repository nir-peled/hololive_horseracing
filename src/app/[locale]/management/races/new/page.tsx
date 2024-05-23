import React from "react";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import TranslationsProvider from "@/src/components/TranslationProvider";
import EditRaceForm from "@/src/components/races/EditRaceForm";

// race id is dynamic
export const dynamicParams = true;

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["races", "management"];

interface Props {
	params: {
		locale: Locale;
	};
}

export default async function NewRacePage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);

	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<h1 className="text-2xl font-bold underline p-10">
				{t("new-race-title", { ns: "management" })}
			</h1>
			<EditRaceForm />
		</TranslationsProvider>
	);
}
