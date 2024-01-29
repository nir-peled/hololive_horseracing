import { locales } from "@/i18nConfig";
import { Locale } from "@/src/lib/types";
import React from "react";

interface Props {
	children: React.ReactNode;
	params: {
		locale: string;
	};
}

export async function generateStaticParams() {
	return locales.map((locale: Locale) => ({
		locale,
	}));
}

// empty for no, TODO later
export default async function ManagementLayout({ children, params: { locale } }: Props) {
	return <div>{children}</div>;
}
