import { Suspense } from "react";
import EditUserForm from "@/src/components/users/EditUserForm";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import LoadingMarker from "@/src/components/LoadingMarker";
import PageTitle from "@/src/components/PageTitle";

interface Props {
	params: { locale: string };
}

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["auth", "management"];

export default async function EditUserPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<>
			<PageTitle>{t("edit-user-title", { ns: "management" })}</PageTitle>
			<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
				<Suspense fallback={<LoadingMarker />}>
					<EditUserForm />
				</Suspense>
			</TranslationsProvider>
		</>
	);
}
