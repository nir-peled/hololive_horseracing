import UserDetailsForm from "@/src/components/users/UserDetailsForm";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";

interface Props {
	params: { locale: string };
}

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["auth", "management"];

export default async function NewUserPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<h1 className="text-2xl font-bold underline p-10">
				{t("new-user-title", { ns: "management" })}
			</h1>
			<UserDetailsForm />
		</TranslationsProvider>
	);
}
