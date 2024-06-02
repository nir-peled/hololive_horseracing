import React from "react";
import { notFound } from "next/navigation";
import { database_factory } from "@/src/lib/database";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import { auth } from "@/src/lib/auth";
import TranslationsProvider from "@/src/components/TranslationProvider";
import BetEditForm from "@/src/components/bets/BetEditForm";
import RaceDetails from "@/src/components/races/RaceDetails";

const namespaces = ["bets"];

interface Props {
	params: {
		locale: Locale;
		id: string;
	};
}

export default async function BetEditPage({ params: { locale, id: id_raw } }: Props) {
	try {
		const { resources } = await initTranslations(locale, namespaces);
		const race_id = BigInt(id_raw);
		const user = (await auth())?.user;
		if (!user) throw Error("No user logged in");

		const race_contestants = await database_factory
			.race_database()
			.get_contestants_display_data(race_id);
		if (race_contestants.length == 0) throw Error("Race not found, or no contestants");

		const existing_bet = await database_factory
			.bets_database()
			.get_user_bets_on_race(user.name, race_id);

		return (
			<TranslationsProvider locale={locale} resources={resources} namespaces={namespaces}>
				<BetEditForm
					race={race_id}
					user={user.name}
					contestants={race_contestants}
					existing_bet={existing_bet}
					balance={user.balance}
				/>
				<RaceDetails id={race_id} locale={locale} />
			</TranslationsProvider>
		);
	} catch (e) {
		console.log(e); // debug
		notFound();
	}
}
