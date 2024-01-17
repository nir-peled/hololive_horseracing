import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/i18n";

interface Props {
	params: { locale: string };
}

const namespaces = ["home"];

export default async function Home({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<main className="flex min-h-screen flex-col items-center justify-between p-24">
				<h1 className="text-3xl font-bold underline">{t("home-hello")}</h1>
			</main>
		</TranslationsProvider>
	);
}
