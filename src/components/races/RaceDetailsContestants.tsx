import { ContestantDisplayData } from "@/src/lib/types";
import React from "react";
import RaceDetailsRacer from "./RaceDetailsRacer";

interface Props {
	contestants: ContestantDisplayData[];
}

export default async function RaceDetailsContestants({ contestants }: Props) {
	return (
		<div className="rounded-box grid grid-cols-3 justify-items-center lg:block lg:carousel">
			{contestants?.map((contestant, i) => (
				<RaceDetailsRacer key={i} contestant={contestant} />
			))}
		</div>
	);
}
