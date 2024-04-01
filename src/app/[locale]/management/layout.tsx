import UpwardLink from "@/src/components/UpwardLink";
import { Locale } from "@/src/lib/types";
import { generate_locale_params } from "@/src/lib/utils";
import React from "react";

interface Props {
	children: React.ReactNode;
	params: {
		locale: Locale;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

// empty for no, TODO later
export default async function ManagementLayout({ children, params: { locale } }: Props) {
	return (
		<>
			<UpwardLink locale={locale} />
			{children}
		</>
	);
}
