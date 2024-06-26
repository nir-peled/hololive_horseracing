"use client";
import React from "react";
import { ContestantDisplayData, SelectOptionState } from "@/src/lib/types";
import IconImage from "../IconImage";

interface Props {
	data: ContestantDisplayData;
	state?: SelectOptionState;
}

export default function ContestantSelectOption({
	data: { jockey, horse },
	state,
}: Props) {
	const colour_style =
		state && state.isDisabled
			? "text-neutral-300 border-neutral-300"
			: "text-black border-black";

	return (
		<div
			className={`inline-grid grid-rows-2 grid-flow-col place-between w-full ${colour_style}`}>
			<b>{jockey.name}</b>
			<IconImage icon={jockey.image} />
			<b>{horse.name}</b>
			<IconImage icon={horse.image} />
		</div>
	);
}
