import LoginForm from "@/src/components/LoginForm";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";

interface Props {
	params: { locale: string };
}

const namespaces = ["home", "auth"];

export default async function Home({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<main className="flex min-h-screen flex-col items-center p-24">
				<h1 className="text-3xl font-bold underline p-10">
					{t("login-title", { ns: "auth" })}
				</h1>
				<LoginForm locale={locale} />
			</main>
		</TranslationsProvider>
	);
}
