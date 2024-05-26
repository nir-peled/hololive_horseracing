import React from "react";
import Image from "next/image";
import { database_factory } from "@/src/lib/database";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import { auth } from "@/src/lib/auth";
import LanguageSelector from "./LanguageSelector";
import UserIconMenu from "./UserIconMenu";
import NavbarLinks from "./NavbarLinks";

const namespaces = ["common"];

interface Props {
	locale: Locale;
}

export default async function Navbar({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const user = (await auth())?.user;

	return (
		<div className="navbar bg-secondary-content">
			<div className="navbar-start">
				{/* <div className="avatar">
					<div className="w-12 h-16 mx-2">
						
					</div>
				</div> */}
				<div className="dropdown">
					<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
						<NavbarLinks locale={locale} />
					</ul>
				</div>
				<Image
					src="/logo.svg"
					alt="HoloRacing Logo"
					width={40}
					height={50}
					priority
					className="min-w-12"
				/>
			</div>
			<div className="navbar-center hidden lg:flex">
				{/* maybe grid? tried but did't work, consider trying again */}
				<ul className="menu menu-horizontal px-1 mt-3 z-[1] p-2">
					<NavbarLinks locale={locale} />
				</ul>
			</div>
			<div className="navbar-end space-x-1">
				{user && <UserIconMenu label={t("signout-button")} locale={locale} user={user} />}
				<LanguageSelector locale={locale} />
			</div>
		</div>
	);
}
