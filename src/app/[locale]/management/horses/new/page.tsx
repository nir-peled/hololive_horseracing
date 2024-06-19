import React from "react";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import TranslationsProvider from "@/src/components/TranslationProvider";
import NewHorseForm from "@/src/components/horses/NewHorseForm";
import PageTitle from "@/src/components/PageTitle";

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["management"];

interface Props {
	params: {
		locale: Locale;
	};
}

export default async function NewHorsePage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle>{t("new-horse-title")}</PageTitle>
			<NewHorseForm />
		</TranslationsProvider>
	);
}
