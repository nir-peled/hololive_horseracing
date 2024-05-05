"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import ProtectedLink from "../ProtectedLink";

const namespaces = ["races"];

interface Props {
	id: bigint;
}

export default function RaceEndButton({ id }: Props) {
	const { t } = useTranslation(namespaces);

	return (
		<ProtectedLink href={`/management/races/${id}/results`} className="btn">
			{t("race-end-button")}
		</ProtectedLink>
	);
}
