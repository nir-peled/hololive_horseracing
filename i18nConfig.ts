const locales = ["en", "ja"];

const i18nConfig = {
	locales: locales,
	defaultLocale: "en",
	prefixDefault: true,
};

export default i18nConfig;
export { locales };
export type Locale = (typeof locales)[number];
