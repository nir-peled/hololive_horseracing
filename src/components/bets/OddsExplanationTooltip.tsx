"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const namespaces = ["bets"];

export default function OddsExplanationTooltip() {
	const { t } = useTranslation(namespaces);
	return (
		<div className="dropdown">
			<div tabIndex={0} role="button" className="btn btn-circle btn-xs btn-outline m-1">
				?
			</div>
			<ul
				tabIndex={0}
				className="dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow fixed">
				<li>{t("explain-odds-win")}</li>
				<li>{t("explain-odds-place")}</li>
				<li>{t("explain-odds-show")}</li>
			</ul>
		</div>
	);
}
