import React from "react";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";

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
	const { t, resources } = await initTranslations(locale, namespaces);
	return <div>BetsPage</div>;
}
