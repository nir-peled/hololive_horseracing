"use client";
import React from "react";
import Button from "../Button";
import { useTranslation } from "react-i18next";

const namespaces = ["races"];

const cuts_names = ["house", "win", "place", "show"] as const;

interface Props {
	id: bigint;
	isEnded: boolean;
}

// TO BE FILLED LATER
export default function RaceEndButton({ id, isEnded }: Props) {
	const { t } = useTranslation(namespaces);

	return <Button>{t("race-end-button")}</Button>;
}
