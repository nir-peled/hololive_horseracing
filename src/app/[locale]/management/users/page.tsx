import React from "react";
import Link from "next/link";
import TranslationsProvider from "@/src/components/TranslationProvider";
import initTranslations from "@/src/lib/i18n";
import { generate_locale_params } from "@/src/lib/utils";
import UsersList from "@/src/components/users/UsersList";
import Button from "@/src/components/Button";

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
			<main className="flex min-h-screen flex-col items-center p-24 w-fit self-center">
				<h1 className="text-2xl font-bold underline p-10">
					{t("users-title", { ns: "management" })}
				</h1>
				<Button className="self-start mb-2">
					<Link href="/management/users/new">{t("new-user-button")}</Link>
				</Button>
				<UsersList />
			</main>
		</TranslationsProvider>
	);
}
