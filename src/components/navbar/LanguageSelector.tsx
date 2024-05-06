"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/i18nConfig";
import { Locale } from "@/src/lib/types";

interface Props {
	locale: Locale;
}

export default function LanguageSelector({ locale: current_locale }: Props) {
	const other_locales = locales.filter((locale: Locale) => locale != current_locale);
	const current_pathname = usePathname();

	return (
		<div className="dropdown dropdown-end">
			<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
				<div className="w-12 rounded-full">
					<Image
						src={`/locale_icons/${current_locale}.svg`}
						width={10}
						height={10}
						alt={current_locale}
					/>
				</div>
			</div>
			<ul
				tabIndex={0}
				className="dropdown-content p-2 bg-base-100 rounded-box mt-3 z-[1] ">
				{other_locales.map((new_locale: Locale) => (
					<li key={new_locale} role="button" className="btn btn-ghost btn-circle avatar">
						<div className="h-12 w-12 rounded-full">
							{/* not using protected link because there is no reason to, since
							it's going to the same page */}
							<Link
								href={current_pathname.replace(`/${current_locale}`, `/${new_locale}`)}>
								<Image
									src={`/locale_icons/${new_locale}.svg`}
									width={10}
									height={10}
									alt={new_locale}
								/>
							</Link>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
