import React from "react";
import type { Metadata } from "next";
import { generate_locale_params } from "@/src/lib/utils";
import type { Locale } from "@/src/lib/types";
import RacesSidebar from "@/src/components/races/RacesSidebar";

export const metadata: Metadata = {
	title: "HoloRacing: Races",
	description: "Hololive Minecraft Horseracing Manager App",
};

interface Props {
	children: React.ReactNode;
	params: {
		locale: Locale;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

function RacesLayout({ children, params: { locale } }: Props) {
	return (
		<div>
			<RacesSidebar />
			{children}
		</div>
	);
}

export default RacesLayout;
