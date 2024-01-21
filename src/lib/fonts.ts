import { NextFont } from "next/dist/compiled/@next/font";
import { Inter, Noto_Serif_JP, Rubik } from "next/font/google";
import { Locale } from "./types";
import { locales } from "@/i18nConfig";

export type FontMap = { [language: Locale]: NextFont };

export const inter = Inter({ subsets: ["latin"] });
export const noto_serif = Noto_Serif_JP({
	subsets: ["latin"],
	weight: "400",
});
export const rubik = Rubik({ weight: "400", subsets: ["arabic", "hebrew", "latin"] });

export const fonts: FontMap = {
	en: inter,
	ja: noto_serif,
	he: rubik,
	ar: rubik,
};

export function get_font(locale: Locale): NextFont {
	if (locale in fonts) return fonts[locale];
	return fonts[locales[0]];
}
