import React from "react";
import { ContestantDisplayData } from "@/src/lib/types";
import OddsDisplay from "../OddsDisplay";
import IconImage from "../IconImage";

interface Props {
	contestant: ContestantDisplayData;
	with_place?: boolean;
}

export default async function RaceDetailsRacer({
	contestant: { jockey, horse, place, odds },
	with_place = false,
}: Props) {
	let text_style = "";
	switch (place) {
		case 1:
			text_style += "text-amber-200";
			break;
		case 2:
			text_style += "text-blue-200";
			break;
		case 3:
			text_style += "text-yellow-600";
			break;
	}

	return (
		<tr>
			{with_place && (
				<td className="m-4 align-middle">
					<b className={text_style}>{place}</b>
				</td>
			)}
			<td className="m-4">
				<div className="flex flex-col content-between">
					<b>{jockey.name}</b>
					<IconImage icon={jockey.image} />
				</div>
			</td>
			<td className="m-4">
				<div className="flex flex-col content-between">
					<b>{horse.name}</b>
					<IconImage icon={horse.image} />
				</div>
			</td>
			<td className="m-4">
				<OddsDisplay odds={odds} />
			</td>
		</tr>
	);
}
