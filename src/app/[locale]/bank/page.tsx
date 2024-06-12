import React from "react";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import PageTitle from "@/src/components/PageTitle";
import { database_factory } from "@/src/lib/database";
import BankUserSelect from "@/src/components/bank/BankUserSelect";

export const dynamic = "force-dynamic";

const namespaces = ["bank"];

interface Props {
	params: {
		locale: Locale;
	};
}

export default async function BankPage({ params: { locale } }: Props) {
	const { t } = await initTranslations(locale, namespaces);

	const users = await database_factory.user_database().get_user_data_all();

	return (
		<>
			<PageTitle>{t("bank-page-title")}</PageTitle>
			<BankUserSelect users={users} />
		</>
	);
}
