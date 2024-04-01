import React from "react";
import type { HorseData, Locale, UserData } from "@/src/lib/types";
import ProtectedLink from "../ProtectedLink";
import RaceRowRacer from "./RaceRowRacer";
import DeadlineCounter from "./DeadlineCounter";
import RaceListEditControls from "./RaceListEditControls";

interface Props {
	locale: Locale;
	id: bigint;
	name: string;
	deadline?: Date | null;
	contestants: { jockey: UserData; horse: HorseData }[];
	is_management?: boolean;
}

const namespaces = ["races"];

export default async function RacesListRow({
	locale,
	id,
	name,
	contestants,
	deadline,
	is_management,
}: Props) {
	return (
		<ProtectedLink href={`/races/${id}`} locale={locale} className="btn btn-ghost">
			<tr className="min-h-12">
				<td>{name}</td>
				<td className="grid grid-rows-2 grid-flow-col gap-1">
					{contestants.map((racer, i) => (
						<RaceRowRacer key={i} user={racer.jockey} horse={racer.horse} />
					))}
				</td>
				<td>{deadline && <DeadlineCounter deadline={deadline} />}</td>
				{is_management && <RaceListEditControls id={id} locale={locale} />}
			</tr>
		</ProtectedLink>
	);
}
