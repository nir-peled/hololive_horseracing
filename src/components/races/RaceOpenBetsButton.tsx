"use client";
import React from "react";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { is_path_authorized } from "@/src/lib/auth";
import { useSession } from "next-auth/react";
import { useIsAuthorized } from "@/src/lib/hooks";

const namespaces = ["races"];

interface Props {
	id: bigint;
	isOpenBets: boolean;
	disabled?: boolean;
}

export default function RaceOpenBetsButton({ id, isOpenBets, disabled }: Props) {
	const { t } = useTranslation(namespaces);
	const endpoint = `/api/races/${id}/set_open_bets`;
	const is_authorized = useIsAuthorized(endpoint);

	if (!is_authorized) return;

	async function toggle_bets() {
		const new_state = !isOpenBets;
		let response = await fetch(endpoint, {
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
