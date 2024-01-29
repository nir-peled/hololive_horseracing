import NewUserForm from "@/src/components/NewUserForm";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";

interface Props {
	params: { locale: string };
}

const namespaces = ["auth"];

export default async function NewUserPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<main className="flex min-h-screen flex-col items-center p-24">
				<h1 className="text-2xl font-bold underline p-10">{t("login-title")}</h1>
				<NewUserForm locale={locale} />
			</main>
		</TranslationsProvider>
	);
}
