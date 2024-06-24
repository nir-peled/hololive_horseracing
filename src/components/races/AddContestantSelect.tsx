"use client";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContestantFormType } from "@/src/lib/types";
import Button from "../Button";
import HorseSelector from "../horses/HorseSelector";
import FormInput from "../forms/FormInput";
import UserSelector from "../users/UserSelector";

const namespaces = ["management"];

interface Props {
	contestants: ContestantFormType[];
	add_contestant: (data: ContestantFormType) => void;
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

	const disabled_users = useMemo<string[]>(
		() => contestants.map((con) => con.jockey),
		[contestants]
	);
	const disabled_horses = useMemo<string[]>(
		() => contestants.map((con) => con.horse),
		[contestants]
	);

	function try_add() {
		console.log("try add");
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
		<div>
			<FormInput
				className="grid grid-cols-3 gap-4"
				label={t("race-add-contestant", { ns: "management" })}
				error={
					is_failed ? t("race-add-contestant-missing", { ns: "management" }) : undefined
				}>
				<UserSelector
					field_name="user_selector"
					value={jockey}
					set_user={set_jockey}
					disabled_options={disabled_users}
				/>
				<HorseSelector
					field_name="horse_selector"
					value={horse}
					set_horse={set_horse}
					disabled_options={disabled_horses}
				/>
				<Button onClick={try_add}>
					{t("race-add-contestant-button", { ns: "management" })}
				</Button>
			</FormInput>
		</div>
	);
}
