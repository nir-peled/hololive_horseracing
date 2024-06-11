import React from "react";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import Button from "../Button";
import RaceOpenBetsButton from "./RaceOpenBetsButton";
import RaceEndButton from "./RaceEndButton";
import ProtectedLink from "../ProtectedLink";
import RaceDeleteButton from "./RaceDeleteButton";
import { auth } from "@/src/lib/auth";
import { SessionProvider } from "next-auth/react";

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
	const session = await auth();
	const is_editable = !isOpenBets && !isEnded;

	return (
		<SessionProvider session={session}>
			<td>
				<RaceOpenBetsButton id={id} isOpenBets={isOpenBets} disabled={isEnded} />
			</td>
			<td>
				<RaceEndButton id={id} />
			</td>
			<td>
				<ProtectedLink
					href={`/management/races/${id}/bets`}
					locale={locale}
					className="btn">
					{t("race-bets-button")}
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
		</SessionProvider>
	);
}
