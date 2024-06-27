import { ContestantDisplayData } from "@/src/lib/types";
import React from "react";
import RaceDetailsRacer from "./RaceDetailsRacer";

interface Props {
	contestants: ContestantDisplayData[];
	with_place?: boolean;
}

export default async function RaceDetailsContestants({
	contestants,
	with_place = false,
}: Props) {
	return (
		<table className="table">
			{contestants?.map((contestant, i) => (
				<RaceDetailsRacer key={i} contestant={contestant} with_place={with_place} />
			))}
		</table>
	);
}
