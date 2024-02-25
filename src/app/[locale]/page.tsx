import TranslationsProvider from "@/src/components/TranslationProvider";
import { get_user_data } from "@/src/lib/database";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";

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
	const user = await get_user_data();
	console.log(`Home: user:`); // debug
	console.log(user?.name); // debug

	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<main className="flex min-h-screen flex-col items-center p-24">
				<h1 className="text-3xl font-bold underline p-2">{t("home-welcome")}</h1>
				{user && (
					<h2 className="text-xl p-2">
						{t("home-greeting", { name: user.display_name })}
					</h2>
				)}
			</main>
		</TranslationsProvider>
	);
}
