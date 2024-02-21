import React from "react";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import UsersList from "@/src/components/users/UsersList";

interface Props {
	params: { locale: string };
}

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["auth", "management"];

export default async function UsersPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<main className="flex min-h-screen flex-col items-center p-24">
				<h1 className="text-2xl font-bold underline p-10">
					{t("edit-user-title", { ns: "management" })}
				</h1>
				<UsersList />
			</main>
		</TranslationsProvider>
	);
}
