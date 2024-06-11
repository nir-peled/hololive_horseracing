"use client";
import React from "react";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { delete_race } from "@/src/lib/actions";

const namespaces = ["races"];

interface Props {
	id: bigint;
	disabled?: boolean;
}

// TO BE FILLED LATER
export default function RaceDeleteButton({ id, disabled }: Props) {
	const { t } = useTranslation(namespaces);

	async function submit() {
		if (!confirm(t("delete-race-confirm"))) return;

		let result = await delete_race(id);
		if (result) {
			alert(t("race-deleted-success"));
			window.location.reload();
		} else alert(t("race-deleted-fail"));
	}

	return (
		<form action={submit}>
			<Button type="submit" disabled={disabled}>
				{t("race-delete-button")}
			</Button>
		</form>
	);
}
