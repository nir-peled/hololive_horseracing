import { ContestantDisplayData } from "@/src/lib/types";
import React from "react";
import IconImage from "../IconImage";

interface Props {
	contestants: ContestantDisplayData[];
}

export default async function RaceResultsTable({ contestants }: Props) {
	contestants.sort((a, b) => {
		if (a.place !== undefined && b.place !== undefined) return a.place - b.place;
		if (a.place !== undefined) return -1;
		return 1;
	});

	return (
		<table className="table">
			<tbody>
				{contestants.map(({ id, place, jockey, horse }) => (
					<tr key={id}>
						<th>{place}</th>
						<td className="grid grid-cols-1">
							<IconImage icon={jockey.image} />
							<b>{jockey.name}</b>
						</td>
						<td className="grid grid-cols-1">
							<IconImage icon={horse.image} />
							<b>{horse.name}</b>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
