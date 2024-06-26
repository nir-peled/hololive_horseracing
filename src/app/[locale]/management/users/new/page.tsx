import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import TranslationsProvider from "@/src/components/TranslationProvider";
import UserDetailsForm from "@/src/components/users/UserDetailsForm";
import PageTitle from "@/src/components/PageTitle";

interface Props {
	params: { locale: Locale };
}

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["auth", "management"];

export default async function NewUserPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle>{t("new-user-title", { ns: "management" })}</PageTitle>
			<UserDetailsForm />
		</TranslationsProvider>
	);
}
