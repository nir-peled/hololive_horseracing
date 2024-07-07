"use client";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ContestantDisplayData, ContestantPlacementData } from "@/src/lib/types";
import { set_race_results } from "@/src/lib/actions";
import { useSubmitter } from "@/src/lib/hooks";
import DraggableRaceContestant from "./DraggableRaceContestant";
import Button from "../Button";
import LoadingMarker from "../LoadingMarker";

interface Props {
	id: bigint;
	contestants: ContestantDisplayData[];
}

const namespaces = ["races", "management"];

export function RaceResultsEditForm({ id, contestants }: Props) {
	const { t } = useTranslation(namespaces);
	const [is_failed, set_is_failed] = useState<boolean>(false);
	const [is_enabled, set_is_enabled] = useState<boolean>(false);
	// const [to_remove, set_to_remove] = useState<number | undefined>();

	useEffect(() => {
		const animation = requestAnimationFrame(() => set_is_enabled(true));
		return () => {
			cancelAnimationFrame(animation);
			set_is_enabled(false);
		};
	}, []);

	const {
		control,
		handleSubmit,
		formState: { isSubmitted, isSubmitSuccessful },
	} = useForm<ContestantPlacementData>({
		defaultValues: {
			placements: contestants.map((c) => ({ contestant: c.id })),
		},
	});

	const { fields, replace } = useFieldArray({
		control,
		name: "placements",
		shouldUnregister: true,
	});

	// set fields at the start
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		replace(fields);
	}, []);

	const submit_results = useSubmitter<ContestantPlacementData>(
		(results) => set_race_results(id, results),
		{
			is_failed,
			set_is_failed,
			on_success: () => location.assign(`/races/${id}`),
		}
	);

	function onDragEnd(result: DropResult) {
		let old_idx = result.source.index;
		let new_idx = result.destination?.index;
		if (new_idx === undefined || old_idx == new_idx) return;

		let new_fields = fields.slice(0, old_idx).concat(fields.slice(old_idx + 1));
		new_fields.splice(new_idx, 0, fields[old_idx]);
		replace(new_fields);
	}

	if (!is_enabled) return <LoadingMarker />;

	return (
		<form onSubmit={handleSubmit(submit_results)}>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable">
					{(droppable_provided) => (
						<div
							ref={droppable_provided.innerRef}
							{...droppable_provided.droppableProps}
							className="grid grid-cols-1 gap-4">
							{fields.map((item, i) => {
								return (
									<DraggableRaceContestant
										key={item.id}
										contestant={
											contestants.find(
												(c) => c.id == item.contestant
											) as ContestantDisplayData
										}
										id={item.id}
										index={i}
									/>
								);
							})}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<Button type="submit" disabled={isSubmitted && !isSubmitSuccessful}>
				{t("race-results-submit-label", { ns: "management" })}
			</Button>
		</form>
	);
}
