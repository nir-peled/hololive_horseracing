import { Suspense } from "react";
import EditUserForm from "@/src/components/users/EditUserForm";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import LoadingMarker from "@/src/components/LoadingMarker";

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
		<main className="flex min-h-screen flex-col items-center p-24">
			<h1 className="text-2xl font-bold underline p-10">
				{t("edit-user-title", { ns: "management" })}
			</h1>
			<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
				<Suspense fallback={<LoadingMarker />}>
					<EditUserForm />
				</Suspense>
			</TranslationsProvider>
		</main>
	);
}
