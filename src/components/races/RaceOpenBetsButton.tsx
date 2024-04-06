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

// TO BE FILLED LATER
export default function RaceOpenBetsButton({ id, isOpenBets, disabled }: Props) {
	const { t } = useTranslation(namespaces);

	async function toggle_bets() {
		const new_state = !isOpenBets;
		let response = await fetch(`/api/races/${id}/set_open_bets`, {
			method: "POST",
			body: JSON.stringify({
				isOpenBets: new_state,
			}),
		});
		if (!response.ok) return alert(t("race-toggle-bets-failed-message"));

		alert(t("race-ended-message"));
		window.location.reload();
	}

	return (
		<Button disabled={disabled} onClick={toggle_bets}>
			{t("race-open-bets-button")}
		</Button>
	);
}
