"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, locales } from "@/i18nConfig";

interface Props {
	locale: Locale;
}

function LanguageSelector({ locale: current_locale }: Props) {
	const other_locales = locales.filter((locale: Locale) => locale != current_locale);
	const current_pathname = usePathname();

	return (
		<div className="dropdown dropdown-end">
			<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
				<div className="w-10 rounded-full">
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
				{other_locales.map((new_locale: Locale, i: number) => (
					<li key={i} role="button" className="btn btn-ghost btn-circle avatar">
						<div className="h-10 w-10 rounded-full">
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

export default LanguageSelector;
