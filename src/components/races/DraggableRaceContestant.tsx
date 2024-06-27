"use client";
import React from "react";
import { ContestantDisplayData } from "@/src/lib/types";
import { Draggable } from "@hello-pangea/dnd";
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
		<Draggable draggableId={id} index={index}>
			{(draggable_provided, snapshot) => (
				<div
					ref={draggable_provided.innerRef}
					{...draggable_provided.draggableProps}
					{...draggable_provided.dragHandleProps}
					className={`card ${
						snapshot.isDragging ? "shadow-xl" : "border border-solid"
					} bg-base-100 border-black p-2`}>
					<div className="inline-grid grid-flow-col grid-rows-2 gap-2">
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
