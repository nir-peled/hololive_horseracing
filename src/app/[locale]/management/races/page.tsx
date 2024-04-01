import React from "react";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import TranslationsProvider from "@/src/components/TranslationProvider";
import Button from "@/src/components/Button";
import ProtectedLink from "@/src/components/ProtectedLink";
import RacesList from "@/src/components/races/RacesList";

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
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<main className="flex min-h-screen flex-col items-center p-24">
				<h1 className="text-2xl font-bold underline p-10">{t("new-horse-title")}</h1>
				<Button>
					<ProtectedLink href="/management/races/new" locale={locale}>
						{t("new-race-page-button")}
					</ProtectedLink>
				</Button>
				<RacesList locale={locale} is_management={true} />
			</main>
		</TranslationsProvider>
	);
}
