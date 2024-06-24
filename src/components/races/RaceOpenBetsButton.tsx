"use client";
import React from "react";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { set_race_bets_open } from "@/src/lib/actions";

const namespaces = ["races"];

interface Props {
	id: bigint;
	isOpenBets: boolean;
	disabled?: boolean;
}

export default function RaceOpenBetsButton({ id, isOpenBets, disabled }: Props) {
	const { t } = useTranslation(namespaces);
	const endpoint = `/api/races/${id}/set_open_bets`;

	async function toggle_bets() {
		const new_state = !isOpenBets;
		let response = await set_race_bets_open(id, new_state);
		if (!response) return alert(t("race-toggle-bets-failed-message"));

		window.location.reload();
	}

	return (
		<Button disabled={disabled} onClick={toggle_bets}>
			{t("race-open-bets-button")}
		</Button>
	);
}
