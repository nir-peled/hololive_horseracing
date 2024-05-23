import React from "react";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import UsersList from "@/src/components/users/UsersList";
import Button from "@/src/components/Button";
import ProtectedLink from "@/src/components/ProtectedLink";
import { Locale } from "@/src/lib/types";
import PageTitle from "@/src/components/PageTitle";

interface Props {
	params: { locale: Locale };
}

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["auth", "management"];

export default async function UsersPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle>{t("users-title", { ns: "management" })}</PageTitle>
			<Button className="self-start mb-2">
				<ProtectedLink href="/management/users/new" locale={locale}>
					{t("new-user-button")}
				</ProtectedLink>
			</Button>
			<UsersList />
		</TranslationsProvider>
	);
}
