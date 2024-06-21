"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
	children: string;
}

export default function UpwardsLinkImpl({ children }: Props) {
	const path = usePathname();
	const last_sep = path.lastIndexOf("/");
	const new_path = path.slice(0, last_sep);
	return (
		<Link href={new_path} className="btn self-start mb-2">
			{children}
		</Link>
	);
}
