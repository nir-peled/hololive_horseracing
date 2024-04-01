import React from "react";
import { Locale } from "@/src/lib/types";
import IconImage from "../IconImage";
import LogoutButton from "./LogoutButton";

interface Props {
	label: string;
	locale: Locale;
	image: string | undefined;
}

export default function UserIconMenu({ label, locale, image }: Props) {
	return (
		<div className="dropdown dropdown-end">
			<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
				{image && image.length > 2 ? (
					<div className="w-12 h-12 rounded-full">
						<IconImage icon={image} />
					</div>
				) : (
					<div className="avatar placeholder w-12 h-12">
						<div className="bg-netural text-black rounded-full">
							<span className="text-xl">{image}</span>
						</div>
					</div>
				)}
			</div>
			<ul tabIndex={0} className="dropdown-content p-2 bg-base-100 mt-3 z-[1] ">
				<li role="button" className="btn btn-ghost avatar h-12 w-20">
					<LogoutButton locale={locale} label={label} />
				</li>
			</ul>
		</div>
	);
}
