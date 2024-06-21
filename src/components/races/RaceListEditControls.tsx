import React from "react";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import Button from "../Button";
import RaceOpenBetsButton from "./RaceOpenBetsButton";
import ProtectedLink from "../ProtectedLink";
import RaceDeleteButton from "./RaceDeleteButton";
import { auth, is_path_authorized } from "@/src/lib/auth";
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
	const is_management = is_path_authorized(
		`/management/races/${id}/bets`,
		session?.user?.role
	);

	return (
		<SessionProvider session={session}>
			<td>
				{is_management && (
					<RaceOpenBetsButton id={id} isOpenBets={isOpenBets} disabled={isEnded} />
				)}
			</td>
			<td>
				<ProtectedLink href={`/management/races/${id}/results`} className="btn">
					{t("race-end-button")}
				</ProtectedLink>
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
