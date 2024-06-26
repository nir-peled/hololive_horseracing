import React from "react";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
// import TranslationsProvider from "@/src/components/TranslationProvider";
import ProtectedLink from "@/src/components/ProtectedLink";
import RacesList from "@/src/components/races/RacesList";
import PageTitle from "@/src/components/PageTitle";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["races", "management"];

interface Props {
	params: {
		locale: Locale;
	};
}

export default async function RacesPage({ params: { locale } }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	return (
		// <TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
		<>
			<PageTitle>{t("races-management-title", { ns: "management" })}</PageTitle>
			<ProtectedLink href="/management/races/new" locale={locale} className="btn mb-5">
				{t("new-race-page-button", { ns: "management" })}
			</ProtectedLink>
			<RacesList locale={locale} is_management={true} />
		</>
	);
}
