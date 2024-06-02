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
		<div className={`${border_style} table-row`}>
			<div className="table-cell">
				<div className="flex flex-col">
					<h3>{jockey.name}</h3>
					<IconImage icon={jockey.image} />
				</div>
			</div>
			<div className="table-cell">
				<div className="flex flex-col">
					<h3>{horse.name}</h3>
					<IconImage icon={horse.image} />
				</div>
			</div>
			<div className="table-cell">
				<OddsDisplay odds={odds} />
			</div>
		</div>
	);
}
