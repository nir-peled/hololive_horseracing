import React from "react";
import { FullBetOdds } from "../lib/types";

interface Props {
	odds: FullBetOdds;
}

export default function OddsDisplay({ odds }: Props) {
	return (
		<div className="grid grid-cols-3 grid-flow-col gap-2">
			{Object.entries(odds).map(([type, odds]) => (
				<div key={type}>
					<b>{type[0].toUpperCase()}</b>
					<p>{`${odds.numerator}/${odds.denominator}`}</p>
				</div>
			))}
		</div>
	);
}
