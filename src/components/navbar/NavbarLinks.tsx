import React from "react";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import ProtectedLink from "../ProtectedLink";

interface Props {
	locale: Locale;
}

const namespaces = ["common"];

export default async function NavbarLinks({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	return (
		<>
			<li>
				<ProtectedLink
					href="/races"
					locale={locale}
					className="btn btn-ghost place-content-center text-base lg:text-xl"
					use_role="user">
					{t("races-link")}
				</ProtectedLink>
			</li>
			<li>
				<ProtectedLink
					href="/bets"
					locale={locale}
					className="btn btn-ghost place-content-center text-base lg:text-xl"
					use_role="user">
					{t("bets-link")}
				</ProtectedLink>
			</li>
			<li>
				<ProtectedLink
					href="/bank"
					locale={locale}
					className="btn btn-ghost place-content-center text-base lg:text-xl"
					use_role="banker">
					{t("bank-link")}
				</ProtectedLink>
			</li>
			<li>
				<ProtectedLink
					href="/management"
					locale={locale}
					className="btn btn-ghost place-content-center text-base lg:text-xl"
					use_role="manager">
					{t("management-link")}
				</ProtectedLink>
			</li>
		</>
	);
}
