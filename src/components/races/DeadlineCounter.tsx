"use client";
import React, { CSSProperties } from "react";
import { useCountdown } from "@/src/lib/hooks";

interface Props {
	deadline: Date;
}

interface CostumCSS extends CSSProperties {
	"--value": number;
}

export default function DeadlineCounter({ deadline }: Props) {
	const { days, hours, minutes, seconds } = useCountdown(deadline);
	const is_ended = days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0;
	const display = {
		hours: Math.max(hours, 0),
		minutes: Math.max(minutes, 0),
		seconds: Math.max(seconds, 0),
	};

	return (
		<span className={`countdown text-2xl ${is_ended && "text-error"}`}>
			{days > 0 && <span style={{ "--value": days } as CostumCSS} />}:
			<span style={{ "--value": display.hours } as CostumCSS} />:
			<span style={{ "--value": display.minutes } as CostumCSS} />:
			<span style={{ "--value": display.seconds } as CostumCSS} />
		</span>
	);
}
