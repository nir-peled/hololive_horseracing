"use client";
import React from "react";
import { ContestantDisplayData } from "@/src/lib/types";
import { Draggable } from "react-beautiful-dnd";
import IconImage from "../IconImage";

interface Props {
	contestant: ContestantDisplayData;
	id: string;
	index: number;
}

export default function DraggableRaceContestant({
	contestant: { jockey, horse },
	id,
	index,
}: Props) {
	return (
		<Draggable key={id} draggableId={id} index={index}>
			{(draggable_provided) => (
				<div
					ref={draggable_provided.innerRef}
					{...draggable_provided.draggableProps}
					{...draggable_provided.dragHandleProps}>
					<div className="inline-grid grid-flow-col grid-rows-1">
						<IconImage icon={jockey.image} />
						<div>{jockey.name}</div>
						<IconImage icon={horse.image} />
						<div>{horse.name}</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}
