"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ContestantFromType } from "@/src/lib/types";
import Button from "../Button";
import HorseSelector from "../horses/HorseSelector";
import FormInput from "../forms/FormInput";
import UserSelector from "../users/UserSelector";

const namespaces = ["management"];

interface Props {
	contestants: ContestantFromType[];
	add_contestant: (data: ContestantFromType) => void;
}

/** select jockey with UserSelector and horse with HorseSelector,
 * and sends them to add_contestant, if both are not null.
 *
 * @param {function} add_contestant the function to call when trying to add a contestant pair
 */
export default function AddContestantSelect({ contestants, add_contestant }: Props) {
	const { t } = useTranslation(namespaces);
	const [jockey, set_jockey] = useState<string | null>(null);
	const [horse, set_horse] = useState<string | null>(null);
	const [is_failed, set_is_failed] = useState<boolean>(false);

	function try_add() {
		if (!jockey || !horse) {
			set_is_failed(true);
			return;
		}

		add_contestant({ jockey, horse });
		set_jockey(null);
		set_horse(null);
		set_is_failed(false);
	}

	return (
		<div className="columns-1 lg:columns-3">
			<FormInput
				label={t("race-add-contestant", { ns: "management" })}
				error={
					is_failed ? t("race-add-contestant-missing", { ns: "management" }) : undefined
				}>
				<HorseSelector
					value={horse}
					set_horse={set_horse}
					disabled_options={contestants.map((con) => con.horse)}
				/>
				<UserSelector
					value={jockey}
					set_user={set_jockey}
					disabled_options={contestants.map((con) => con.jockey)}
				/>
				<Button onClick={try_add}>
					{t("race-add-contestant-button", { ns: "management" })}
				</Button>
			</FormInput>
		</div>
	);
}
