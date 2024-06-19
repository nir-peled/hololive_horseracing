import React from "react";
import { generate_locale_params } from "@/src/lib/utils";
import initTranslations from "@/src/lib/i18n";
import TranslationsProvider from "@/src/components/TranslationProvider";
import RacesList from "@/src/components/races/RacesList";
import type { Locale } from "@/src/lib/types";
import ProtectedLink from "@/src/components/ProtectedLink";
import PageTitle from "@/src/components/PageTitle";

export const dynamic = "force-dynamic";

const namespaces = ["races"];

interface Props {
	params: {
		locale: Locale;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

export default async function RacesPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle size="large">{t("races-list-title")}</PageTitle>
			<ProtectedLink href="/races/history" locale={locale}>
				{t("races-history-label")}
			</ProtectedLink>
			<RacesList locale={locale} />
		</TranslationsProvider>
	);
}
