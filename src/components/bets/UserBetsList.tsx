import React from "react";
import { redirect } from "next/navigation";
import { database_factory } from "@/src/lib/database";
import { Locale } from "@/src/lib/types";
import { auth } from "@/src/lib/auth";
import BetsTable from "./BetsTable";

interface Props {
	locale: Locale;
}

export default async function UserBetsList({ locale }: Props) {
	const user = (await auth())?.user?.name;
	if (!user) redirect(`/${locale}/login`); // should never happen

	const bets = await database_factory.bets_database().get_user_bets(user);

	bets.sort((bet1, bet2) => {
		if (bet1.active && !bet2.active) return -1;
		if (bet2.active && !bet1.active) return 1;
		return Number(bet1.race - bet2.race);
	});

	return <BetsTable locale={locale} bets={bets} />;
}
