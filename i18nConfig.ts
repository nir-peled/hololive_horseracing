const locales = ["en", "ja", "he"];

const locale_direction: { [locale: string]: "lrt" | "rtl" | "auto" } = {
	en: "lrt",
	ja: "lrt",
	he: "rtl",
	ar: "rtl",
};

const i18nConfig = {
	locales: locales,
	defaultLocale: locales[0],
	prefixDefault: true,
	localizationFolder: "@/locales",
};

export default i18nConfig;
export { locales, locale_direction };
