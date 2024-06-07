"use client";
import React from "react";
import { ContestantDisplayData, SelectOptionState } from "@/src/lib/types";
import IconImage from "../IconImage";

interface Props {
	state: SelectOptionState;
	data: ContestantDisplayData;
}

export default function ContestantSelectOption({
	data: { jockey, horse },
	state: { isDisabled },
}: Props) {
	const colour_style = isDisabled
		? "text-neutral-300 border-neutral-300"
		: "text-black border-black hover:text-white hover:border-white";

	return (
		<div
			className={`inline-grid grid-rows-1 justify-between ${colour_style} bg-white hover:bg-blue-600`}>
			<b>{jockey.name}</b>
			<IconImage icon={jockey.image} />
			<b>{horse.name}</b>
			<IconImage icon={horse.image} />
		</div>
	);
}
