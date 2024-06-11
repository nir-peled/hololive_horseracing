"use client";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { ContestantDisplayData, ContestantPlacementData } from "@/src/lib/types";
import { set_race_results } from "@/src/lib/actions";
import { useSubmitter } from "@/src/lib/hooks";
import DraggableRaceContestant from "./DraggableRaceContestant";
import Button from "../Button";

interface Props {
	id: bigint;
	contestants: ContestantDisplayData[];
}

const namespaces = ["races", "management"];

export function RaceResultsEditForm({ id, contestants }: Props) {
	const { t } = useTranslation(namespaces);
	const [is_failed, set_is_failed] = useState<boolean>(false);

	const {
		control,
		handleSubmit,
		formState: { isSubmitted, isSubmitSuccessful },
	} = useForm<ContestantPlacementData>({
		defaultValues: {
			placements: contestants.map((c) => ({ contestant: c.id })),
		},
	});

	const { fields, move } = useFieldArray({
		control,
		name: "placements",
		shouldUnregister: true,
	});

	const submit_results = useSubmitter<ContestantPlacementData>(
		(results) => set_race_results(id, results),
		{
			is_failed,
			set_is_failed,
			on_success: () => location.assign(`/races/${id}`),
		}
	);

	function onDragEnd(result: DropResult) {
		if (!result.destination) return;
		move(result.source.index, result.destination.index);
	}

	return (
		<form onSubmit={handleSubmit(submit_results)}>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable">
					{(droppable_provided) => (
						<div ref={droppable_provided.innerRef} {...droppable_provided.droppableProps}>
							{fields.map((item, i) => (
								<DraggableRaceContestant
									contestant={
										contestants.find(
											(c) => c.id == item.contestant
										) as ContestantDisplayData
									}
									id={item.id}
									index={i}
								/>
							))}
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
