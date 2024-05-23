import React from "react";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
// import TranslationsProvider from "@/src/components/TranslationProvider";
import HorsesList from "@/src/components/horses/HorsesList";
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

export default async function HorsesPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		// <TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
		<>
			<h1 className="text-2xl font-bold underline p-10">{t("new-horse-title")}</h1>
			<Button>
				<ProtectedLink href="/management/horses/new" locale={locale}>
					{t("new-horse-page-button")}
				</ProtectedLink>
			</Button>
			<HorsesList locale={locale} />
		</>

		// </TranslationsProvider>
	);
}
