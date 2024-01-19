import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import { locales } from "@/i18nConfig";
import { Locale } from "@/src/lib/types";
import { get_font } from "@/src/lib/fonts";

export const metadata: Metadata = {
	title: "HoloRacing",
	description: "Hololive Minecraft Horseracing Manager App",
};

interface Props {
	children: React.ReactNode;
	params: {
		locale: string;
	};
}

export async function generateStaticParams() {
	return locales.map((locale: Locale) => {
		locale;
	});
}

export default async function RootLayout({ children, params: { locale } }: Props) {
	const font = get_font(locale);

	return (
		<html lang={locale}>
			<body className={font.className}>
				<Navbar locale={locale} />
				{children}
			</body>
		</html>
	);
}
