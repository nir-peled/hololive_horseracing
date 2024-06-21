import React from "react";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import UpwardsLinkImpl from "./UpwardsLinkImpl";

const namespaces = ["common"];

interface Props {
	locale: Locale;
}

export default async function UpwardLink({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);

	return <UpwardsLinkImpl>{t("up-link")}</UpwardsLinkImpl>;
}
