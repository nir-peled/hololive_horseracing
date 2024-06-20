"use client";
import React from "react";
import Button from "../Button";
import { useTranslation } from "react-i18next";

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
		let response = await fetch(endpoint, {
			method: "POST",
			body: JSON.stringify({
				isOpenBets: new_state,
			}),
		});
		if (!response.ok) return alert(t("race-toggle-bets-failed-message"));

		window.location.reload();
	}

	return (
		<Button disabled={disabled} onClick={toggle_bets}>
			{t("race-open-bets-button")}
		</Button>
	);
}
