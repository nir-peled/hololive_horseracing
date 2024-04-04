import React from "react";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import TranslationsProvider from "@/src/components/TranslationProvider";
import NewHorseForm from "@/src/components/horses/NewHorseForm";
import Button from "@/src/components/Button";
import ProtectedLink from "@/src/components/ProtectedLink";

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
			<main className="flex min-h-screen flex-col items-center p-24">
				<h1 className="text-2xl font-bold underline p-10">{t("new-horse-title")}</h1>
				<NewHorseForm />
			</main>
		</TranslationsProvider>
	);
}
