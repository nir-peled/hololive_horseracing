import React from "react";
import { Locale } from "@/src/lib/types";
import { generate_locale_params } from "@/src/lib/utils";
import { database_factory } from "@/src/lib/database";
import initTranslations from "@/src/lib/i18n";
import TranslationsProvider from "@/src/components/TranslationProvider";
import PageTitle from "@/src/components/PageTitle";
import MenuCard from "@/src/components/MenuCard";
import SetGlobalCutsForm from "@/src/components/management/SetGlobalCutsForm";
import HouseRewardTargetForm from "@/src/components/management/HouseRewardTargetForm";

interface Props {
	params: {
		locale: Locale;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["management"];

export default async function GlobalSettingsPage({ params: { locale } }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	const cuts = await database_factory.cache_database().get_cuts();
	const house_target = await database_factory.cache_database().get_house_reward_target();

	return (
		<TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
			<PageTitle>{t("management-settings-title")}</PageTitle>
			<MenuCard title={t("set-global-cuts-title")} default_open={true}>
				<SetGlobalCutsForm cuts={cuts} />
			</MenuCard>
			<MenuCard title={t("set-global-cuts-title")}>
				<HouseRewardTargetForm target={house_target} />
			</MenuCard>
		</TranslationsProvider>
	);
}
