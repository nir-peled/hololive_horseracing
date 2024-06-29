import React from "react";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import { get_image_buffer_as_str } from "@/src/lib/images";
import PageTitle from "@/src/components/PageTitle";
import { database_factory } from "@/src/lib/database";
import BankUserSelect from "@/src/components/bank/BankUserSelect";
import TranslationsProvider from "@/src/components/TranslationProvider";

export const dynamic = "force-dynamic";

const namespaces = ["bank", "common"];

interface Props {
	params: {
		locale: Locale;
	};
}

export default async function BankPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);

	const users = await database_factory.user_database().get_user_data_all();
	users.forEach((user) => {
		if (user.image && typeof user.image !== "string")
			user.image = get_image_buffer_as_str(user.image);
	});

	return (
		<>
			<PageTitle>{t("bank-page-title", { ns: "bank" })}</PageTitle>
			<TranslationsProvider locale={locale} namespaces={namespaces} resources={resources}>
				<BankUserSelect users={users} />
			</TranslationsProvider>
		</>
	);
}
