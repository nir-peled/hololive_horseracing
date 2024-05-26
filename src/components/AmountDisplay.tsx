import React from "react";
import Image from "next/image";

interface Props {
	amount: number;
}

export default function AmountDisplay({ amount }: Props) {
	return (
		<span className="flex justify-center">
			<b>{Math.floor(amount)}</b>
			<Image src="/diamond.png" alt="diamond" width={5} height={5} />
		</span>
	);
}
