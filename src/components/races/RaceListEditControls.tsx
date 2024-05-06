import React from "react";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import Button from "../Button";
import RaceOpenBetsButton from "./RaceOpenBetsButton";
import RaceEndButton from "./RaceEndButton";
import ProtectedLink from "../ProtectedLink";
import RaceDeleteButton from "./RaceDeleteButton";

interface Props {
	id: bigint;
	isOpenBets: boolean;
	isEnded: boolean;
	locale: Locale;
}

const namespaces = ["races"];

export default async function RaceListEditControls({
	id,
	isOpenBets,
	isEnded,
	locale,
}: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const is_editable = !isOpenBets && !isEnded;

	return (
		<>
			<td>
				<RaceOpenBetsButton id={id} isOpenBets={isOpenBets} disabled={isEnded} />
			</td>
			<td>
				<RaceEndButton id={id} />
			</td>
			<td>
				<ProtectedLink href={`/management/races/${id}/bets`} locale={locale}>
					<Button>{t("race-bets-button")}</Button>
				</ProtectedLink>
			</td>
			<td>
				<ProtectedLink href={`/management/races/${id}/edit`} locale={locale}>
					<Button disabled={!is_editable}>{t("race-edit-button")}</Button>
				</ProtectedLink>
			</td>
			<td>
				<RaceDeleteButton id={id} disabled={!is_editable} />
			</td>
		</>
	);
}
