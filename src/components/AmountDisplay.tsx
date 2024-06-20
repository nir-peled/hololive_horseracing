import React from "react";
import Image from "next/image";

interface Props {
	amount: number;
}

export default function AmountDisplay({ amount }: Props) {
	return (
		<span className="flex justify-center">
			<b>{Math.floor(amount)}</b>
			<div className="w-5">
				<Image src="/diamond.png" alt="diamond" width={20} height={20} />
			</div>
		</span>
	);
}
