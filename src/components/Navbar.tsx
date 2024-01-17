import React from "react";
import Link from "next/link";
import Image from "next/image";
import LanguageSelector from "./LanguageSelector";
import initTranslations from "@/src/i18n";
import { Locale } from "@/i18nConfig";

const namespaces = ["common"];

interface Props {
	locale: Locale;
}

export default async function Navbar({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);

	return (
		<div className="navbar bg-secondary-content">
			<div className="navbar-start">
				<div className="avatar">
					<div className="w-12 h-16">
						<Image
							src="/logo.svg"
							alt="Hololive Horseracing Logo"
							width={40}
							height={50}
							priority
						/>
					</div>
				</div>
			</div>
			<div className="navbar-center justify-between">
				<ul className="menu menu-horizontal px-1 justify-between space-x-10">
					<li>
						<Link href="/races" className="btn btn-ghost text-xl">
							{t("races-link")}
						</Link>
					</li>
					<li>
						<Link href="/bets" className="btn btn-ghost text-xl">
							{t("bets-link")}
						</Link>
					</li>
					<li>
						<Link href="/bank" className="btn btn-ghost text-xl">
							{t("bank-link")}
						</Link>
					</li>
				</ul>
			</div>
			<div className="navbar-end">
				<LanguageSelector locale={locale} />
			</div>
		</div>
	);
}