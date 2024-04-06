"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import ProtectedLink from "../ProtectedLink";

const namespaces = ["races"];

interface Props {
	id: bigint;
}

// TO BE FILLED LATER
export default function RaceEndButton({ id }: Props) {
	const { t } = useTranslation(namespaces);

	return (
		<Button>
			<ProtectedLink href={`/management/races/${id}/end`}>
				{t("race-end-button")}
			</ProtectedLink>
		</Button>
	);
}
