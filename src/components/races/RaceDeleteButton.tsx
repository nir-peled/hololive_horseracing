"use client";
import React from "react";
import Button from "../Button";
import { useTranslation } from "react-i18next";

const namespaces = ["races"];

interface Props {
	id: bigint;
	disabled?: boolean;
}

// TO BE FILLED LATER
export default function RaceDeleteButton({ id, disabled }: Props) {
	const { t } = useTranslation(namespaces);

	return <Button>{t("race-delete-button")}</Button>;
}
