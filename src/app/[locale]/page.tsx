import TranslationsProvider from "@/src/components/TranslationProvider";
import { generate_locale_params } from "@/src/lib/utils";
import { database_factory } from "@/src/lib/database";
import initTranslations from "@/src/lib/i18n";
import PageTitle from "@/src/components/PageTitle";

const namespaces = ["home"];

interface Props {
	params: {
		locale: string;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

export default async function Home({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	const user = await database_factory.user_database().get_user_data();
	// console.log(`Home: user:`); // debug
	// console.log(user?.name); // debug

	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle size="large">{t("home-welcome")}</PageTitle>
			{user && (
				<h2 className="text-xl p-2">{t("home-greeting", { name: user.display_name })}</h2>
			)}
		</TranslationsProvider>
	);
}
