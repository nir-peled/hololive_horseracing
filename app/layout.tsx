import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "HoloHorseRacing",
	description: "Hololive Minecraft Horseracing Manager App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<body className={inter.className}>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
