import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/components/navbar/Navbar";
import { locale_direction } from "@/i18nConfig";
import { Locale } from "@/src/lib/types";
import { get_font } from "@/src/lib/fonts";
import { generate_locale_params } from "@/src/lib/utils";

export const metadata: Metadata = {
	title: "HoloRacing",
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

export default async function RootLayout({ children, params: { locale } }: Props) {
	const font = get_font(locale);
	const dir = locale_direction[locale];

	return (
		<html lang={locale} dir={dir}>
			<body className={font.className}>
				<Navbar locale={locale} />
				<main className="flex min-h-screen flex-col items-center p-24">
					<div className="flex justify-center">{children}</div>
				</main>
			</body>
		</html>
	);
}
