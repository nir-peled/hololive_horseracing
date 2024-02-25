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
				<div className="w-10 rounded-full">{image && <IconImage icon={image} />}</div>
			</div>
			<ul tabIndex={0} className="dropdown-content p-2 bg-base-100 mt-3 z-[1] ">
				<li role="button" className="btn btn-ghost avatar">
					<div className="h-10 w-20">
						<LogoutButton locale={locale} label={label} />
					</div>
				</li>
			</ul>
		</div>
	);
}
