import React from "react";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
// import TranslationsProvider from "@/src/components/TranslationProvider";
import HorsesList from "@/src/components/horses/HorsesList";
import ProtectedLink from "@/src/components/ProtectedLink";
import PageTitle from "@/src/components/PageTitle";

export const dynamic = "force-dynamic";

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
			<PageTitle>{t("horse-list-title")}</PageTitle>
			<ProtectedLink href="/management/horses/new" locale={locale} className="btn">
				{t("new-horse-page-button")}
			</ProtectedLink>
			<HorsesList locale={locale} />
		</>

		// </TranslationsProvider>
	);
}
