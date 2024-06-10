import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function MarkedNote({ children }: Props) {
	return <span className="block text-base">{children}</span>;
}
