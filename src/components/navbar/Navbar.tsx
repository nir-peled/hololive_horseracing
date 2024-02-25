import React from "react";
import Link from "next/link";
import Image from "next/image";
import initTranslations from "@/src/lib/i18n";
import { auth } from "@/src/lib/auth";
import { Locale, UserData } from "@/src/lib/types";
import { get_user_image_as_str } from "@/src/lib/utils";
import LanguageSelector from "./LanguageSelector";
import UserIconMenu from "./UserIconMenu";

const namespaces = ["common"];

interface Props {
	locale: Locale;
}

export default async function Navbar({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	// const user = await get_user_data();
	const user = (await auth())?.user as UserData | null;
	const user_image = user && (await get_user_image_as_str(user));
	console.log("user image:"); // debug
	console.log(user_image); // debug

	return (
		<div className="navbar bg-secondary-content">
			<div className="navbar-start">
				<div className="avatar">
					<div className="w-12 h-16 mx-2">
						<Image
							src="/logo.svg"
							alt="HoloRacing Logo"
							width={40}
							height={50}
							priority
						/>
					</div>
				</div>
			</div>
			<div className="navbar-center justify-between">
				<ul className="menu menu-horizontal px-1 justify-between mt-3 z-[1] p-2 space-x-1">
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
					<li>
						<Link href="/management" className="btn btn-ghost text-xl">
							{t("management-link")}
						</Link>
					</li>
				</ul>
			</div>
			<div className="navbar-end space-x-1">
				{user && (
					<UserIconMenu
						label={t("signout-button")}
						locale={locale}
						image={user_image || undefined}
					/>
				)}
				<LanguageSelector locale={locale} />
			</div>
		</div>
	);
}
