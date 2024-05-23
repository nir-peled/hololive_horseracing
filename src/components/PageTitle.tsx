import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	size?: "regular" | "large" | "small";
}

export default function PageTitle({ children, size = "regular" }: Props) {
	const text_size =
		size == "regular" ? "text-2xl" : size == "large" ? "text-3xl" : "text-xl";

	return <h1 className={`${text_size} font-bold underline p-2`}>{children}</h1>;
}
