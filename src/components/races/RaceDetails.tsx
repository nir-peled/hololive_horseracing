import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import initTranslations from "@/src/lib/i18n";
import { database_factory } from "@/src/lib/database";
import { Locale, RaceParameters } from "@/src/lib/types";
import { date_to_datetime_local } from "@/src/lib/utils";
import { auth, is_path_authorized } from "@/src/lib/auth";
// import TranslationsProvider from "../TranslationProvider";
import RaceDetailsContestants from "./RaceDetailsContestants";
import RaceOpenBetsButton from "./RaceOpenBetsButton";
import ProtectedLink from "../ProtectedLink";
import RaceEndButton from "./RaceEndButton";
import MarkedNote from "../MarkedNote";

interface Props {
	id: bigint;
	race_data?: RaceParameters | null;
	locale: Locale;
}

const namespaces = ["races"];

export default async function RaceDetails({ id, race_data, locale }: Props) {
	const { t /*, resources*/ } = await initTranslations(locale, namespaces);
	const contestants = await database_factory
		.race_database()
		.get_contestants_display_data(id);
	const session = await auth();
	const is_manager = is_path_authorized(
		`/management/races/${id}/edit`,
		session?.user?.role
	);

	if (!race_data) {
		race_data = await database_factory.race_database().get_race_parameters(id);
		if (!race_data) notFound();
	}
	const { isEnded, deadline, isOpenBets } = race_data;

	// sort contestants: if one is undefined, the other is first
	// if both aren't undefined, the usual compare
	if (isEnded)
		contestants?.sort(({ place: a_place }, { place: b_place }) =>
			a_place == undefined
				? b_place == undefined
					? 0
					: 1
				: b_place == undefined
				? -1
				: a_place - b_place
		);

	return (
		<div className="flex flex-col gap-y-2">
			<ProtectedLink href={`/management/races/${id}/edit`} className="btn">
				{t("race-edit-button")}
			</ProtectedLink>
			{deadline &&
				t("race-deadline", {
					deadline: date_to_datetime_local(deadline),
					timezone: process.env.NEXT_PUBLIC_DEADLINE_TIMEZONE,
				})}
			<br />
			{isEnded ? (
				<h3>{t("race-ended")}</h3>
			) : (
				is_manager && (
					<>
						<div className="grid grid-cols-2 justify-content-between pad-2">
							{isOpenBets ? t("race-bets-open") : t("race-bets-closed")}
							<RaceOpenBetsButton id={id} isOpenBets={isOpenBets} />
						</div>
						<br />
						<RaceEndButton locale={locale} id={id} />
					</>
				)
			)}
			<hr />
			<br />
			{isOpenBets && (
				<>
					<Link href={`/bets/${id}`} className="btn btn-success">
						{t("race-bet-link")}
					</Link>
					<MarkedNote>{t("bets-odds-change")}</MarkedNote>
				</>
			)}
			<br />
			<RaceDetailsContestants
				contestants={contestants}
				with_place={isEnded}
				locale={locale}
			/>
		</div>
	);
}
