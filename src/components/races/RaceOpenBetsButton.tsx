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

	return <Button>{t("race-open-bets-button")}</Button>;
}
