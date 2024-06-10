import React from "react";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import { generate_locale_params } from "@/src/lib/utils";
import UserBetsList from "@/src/components/bets/UserBetsList";
import MarkedNote from "@/src/components/MarkedNote";
import PageTitle from "@/src/components/PageTitle";

const namespaces = ["bets"];

interface Props {
	params: {
		locale: Locale;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

export default async function BetsPage({ params: { locale } }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	return (
		<>
			<PageTitle>{t("bets-page-title")}</PageTitle>
			<MarkedNote>{t("bets-rounded-down-note")}</MarkedNote>
			<UserBetsList locale={locale} />
		</>
	);
}
