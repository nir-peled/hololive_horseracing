import React from "react";
import type { Locale, RaceData } from "@/src/lib/types";
import RaceRowRacer from "./RaceRowRacer";
import ProtectedLink from "../ProtectedLink";
import DeadlineCounter from "./DeadlineCounter";
import RaceListEditControls from "./RaceListEditControls";

interface Props {
	locale: Locale;
	race: RaceData;
	is_management?: boolean;
}

// const namespaces = ["races"];

export default async function RacesListRow({
	locale,
	race: { id, name, contestants, deadline, isEnded, isOpenBets },
	is_management,
}: Props) {
	return (
		<tr className="min-h-12">
			{/* make page /races/[id] */}
			<ProtectedLink href={`/races/${id}`} locale={locale} className="btn btn-ghost">
				<td>{name}</td>
			</ProtectedLink>
			<td className="grid grid-rows-2 grid-flow-col gap-1">
				{contestants.map((racer, i) => (
					<RaceRowRacer key={i} user={racer.jockey} horse={racer.horse} />
				))}
			</td>
			<td>{deadline && <DeadlineCounter deadline={deadline} />}</td>
			{is_management && (
				<RaceListEditControls
					id={id}
					isOpenBets={isOpenBets}
					isEnded={isEnded}
					locale={locale}
				/>
			)}
		</tr>
	);
}
