"use client";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetch_user_data, fetch_horse_image } from "@/src/lib/actions";
import { ContestantFormType, UserData } from "@/src/lib/types";
import IconImage from "../IconImage";
import Button from "../Button";
import RaceContestantRow from "./RaceContestantRow";

interface Props {
	contestants: (ContestantFormType & { id: string })[];
	remove_contestant: (index: number) => void;
}

const namespaces = ["races", "management"];

/** TODO: change images to large once I manage to implement it
 *
 */
export default function EditRaceContestantsTable({
	contestants,
	remove_contestant,
}: Props) {
	const { t } = useTranslation(namespaces);

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th>{t("jockey-title", { ns: "races" })}</th>
						<th>{t("horse-title", { ns: "races" })}</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{contestants.map((contestant, i) => (
						<RaceContestantRow
							key={contestant.id}
							jockey={contestant.jockey}
							horse={contestant.horse}
							remove={() => remove_contestant(i)}
						/>
					))}
					{/* {contestants_to_jsx(
						contestants_data,
						remove_contestant,
						t("race-remove-contestant", { ns: "management" })
					)} */}
				</tbody>
			</table>
		</div>
	);
}
