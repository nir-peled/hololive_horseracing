import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import { Locale, locales } from "@/i18nConfig";

// const inter = Inter({ subsets: ["latin"] });
const noto_serif = Noto_Serif_JP({
	subsets: ["latin"],
	weight: "400",
});

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
	return (
		<html lang={locale}>
			<body className={noto_serif.className}>
				<Navbar locale={locale} />
				{children}
			</body>
		</html>
	);
}
