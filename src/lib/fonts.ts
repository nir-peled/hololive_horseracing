import { NextFont } from "next/dist/compiled/@next/font";
import { Inter, Noto_Serif_JP, Rubik } from "next/font/google";
import { Locale } from "./types";
import { locales } from "@/i18nConfig";

export type FontMap = { [language: Locale]: NextFont };

export const fonts: FontMap = {
	en: Inter({ subsets: ["latin"] }),
	ja: Noto_Serif_JP({
		subsets: ["latin"],
		weight: "400",
	}),
	he: Rubik({ weight: "400" }),
	ar: Rubik({ weight: "400" }),
};

export function get_font(locale: Locale): NextFont {
	if (locale in fonts) return fonts[locale];
	return fonts[locales[0]];
}
