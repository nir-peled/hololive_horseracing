import React, { Suspense } from "react";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import TranslationsProvider from "@/src/components/TranslationProvider";
import EditRaceForm from "@/src/components/races/EditRaceForm";

// race id is dynamic
export const dynamicParams = true;

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["races", "management"];

interface Props {
	params: {
		locale: Locale;
		id: string;
	};
}

export default async function RaceEditPage({ params: { locale, id } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);

	// return (
	// 	<main className="flex min-h-screen flex-col items-center p-24">
	// 		<h3>{t("page-not-allowed", { ns: "management" })}</h3>
	// 	</main>
	// );

	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<main className="flex min-h-screen flex-col items-center p-24">
				<h1 className="text-2xl font-bold underline p-10">
					{t("edit-race-title", { ns: "management" })}
				</h1>
				<Suspense>
					<EditRaceForm id={Number(id)} />
				</Suspense>
			</main>
		</TranslationsProvider>
	);
}
