import { notFound } from "next/navigation";
import { Suspense } from "react";
import RaceResultsEditor from "@/src/components/races/RaceResultsEditor";
import TranslationsProvider from "@/src/components/TranslationProvider";
import { generate_locale_params } from "@/src/lib/utils";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";

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

export default async function RaceSubmitResultsPage({ params: { locale, id } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	try {
		const id_number = BigInt(id);

		return (
			<main className="flex min-h-screen flex-col items-center p-24">
				<h1 className="text-2xl font-bold underline p-10">
					{t("race-submit-results-title", { ns: "management" })}
				</h1>
				<TranslationsProvider
					namespaces={namespaces}
					locale={locale}
					resources={resources}>
					<Suspense>
						<RaceResultsEditor id={id_number} />
					</Suspense>
				</TranslationsProvider>
			</main>
		);
	} catch (error) {
		if (error instanceof TypeError) return notFound();
		throw error;
	}
}
