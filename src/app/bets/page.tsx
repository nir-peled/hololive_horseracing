import React from "react";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import PageTitle from "@/src/components/PageTitle";

const namespaces = ["home", "bets"];

interface Props {
	params: {
		locale: string;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

export default async function BetsPage({ params: { locale } }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	return (
		<>
			<PageTitle>{t("bets-page-title", { ns: "bets" })}</PageTitle>
		</>
	);
}
