"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "@/src/lib/i18n";
import { Resource, createInstance } from "i18next";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
	locale: string;
	namespaces: string[];
	resources: Resource;
}

export default function TranslationsProvider({
	children,
	locale,
	namespaces,
	resources,
}: Props) {
	const i18n = createInstance();

	initTranslations(locale, namespaces, i18n, resources);

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
