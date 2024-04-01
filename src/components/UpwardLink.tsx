import React from "react";
import Link from "next/link";
import { Locale } from "@/src/lib/types";
import initTranslations from "@/src/lib/i18n";
import Button from "./Button";

const namespaces = ["common"];

interface Props {
	locale: Locale;
}

export default async function UpwardLink({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);

	return (
		<Button>
			<Link href="..">{t("up-link")}</Link>
		</Button>
	);
}