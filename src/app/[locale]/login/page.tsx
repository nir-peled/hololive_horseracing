import LoginForm from "@/src/components/LoginForm";
import PageTitle from "@/src/components/PageTitle";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import { generate_locale_params } from "@/src/lib/utils";

interface Props {
	params: { locale: Locale };
}

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["home", "auth"];

export default async function LoginPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle size="large">{t("login-title", { ns: "auth" })}</PageTitle>
			<LoginForm locale={locale} />
		</TranslationsProvider>
	);
}
