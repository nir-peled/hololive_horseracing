import React from "react";
import { ContestantDisplayData } from "@/src/lib/types";
import OddsDisplay from "../OddsDisplay";
import IconImage from "../IconImage";

interface Props {
	contestant: ContestantDisplayData;
}

export default async function RaceDetailsRacer({
	contestant: { jockey, horse, place, odds },
}: Props) {
	let border_style = "border-2";
	switch (place) {
		case 1:
			border_style += "border-amber-200";
			break;
		case 2:
			border_style += "border-blue-100";
			break;
		case 3:
			border_style += "border-yellow-600";
			break;
		default:
			border_style = "border";
	}

	return (
		<div className={`${border_style} table-row m-4`}>
			<div className="table-cell m-4">
				<div className="flex flex-col m-4">
					<b>{jockey.name}</b>
					<IconImage icon={jockey.image} />
				</div>
			</div>
			<div className="table-cell m-4">
				<div className="flex flex-col m-4">
					<b>{horse.name}</b>
					<IconImage icon={horse.image} />
				</div>
			</div>
			<div className="table-cell m-4">
				<OddsDisplay odds={odds} />
			</div>
		</div>
	);
}
