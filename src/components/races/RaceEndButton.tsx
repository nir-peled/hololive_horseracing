import React from "react";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import ProtectedLink from "../ProtectedLink";

const namespaces = ["races"];

interface Props {
	id: bigint;
	locale: Locale;
}

export default async function RaceEndButton({ id, locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);

	return (
		<ProtectedLink href={`/management/races/${id}/results`} className="btn">
			{t("race-end-button")}
		</ProtectedLink>
	);
}
