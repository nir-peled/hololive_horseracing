import React from "react";
import Link from "next/link";
import Image from "next/image";
import LanguageSelector from "./LanguageSelector";
import initTranslations from "@/src/lib/i18n";
import Button from "./Button";
import { signOut } from "@/src/lib/auth";
import { get_user_data } from "../lib/database";
import LogoutButton from "./LogoutButton";

const namespaces = ["common"];

interface Props {
	locale: string;
}

export default async function Navbar({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const user = await get_user_data();

	const logout = async () => {
		"use server";
		// signOut({ redirectTo: `/${locale}/login`, redirect: true });
		signOut();
	};

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
				<ul className="menu menu-horizontal px-1 justify-between mt-3 z-[1] p-2">
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
				{/* {user && <Button onClick={logout}>{t("signout-button")}</Button>} */}
				{user && <LogoutButton label={t("signout-button")} locale={locale} />}
				<LanguageSelector locale={locale} />
			</div>
		</div>
	);
}
