import React from "react";
import { Locale, UserData } from "@/src/lib/types";
import { database_factory } from "@/src/lib/database";
import AmountDisplay from "../AmountDisplay";
import LogoutButton from "./LogoutButton";
import IconImage from "../IconImage";

interface Props {
	label: string;
	locale: Locale;
	user: UserData;
}

export default async function UserIconMenu({ label, locale, user }: Props) {
	const image = await database_factory.user_database().get_user_image_as_str(user.name);
	return (
		<div className="dropdown dropdown-end">
			<div tabIndex={0} role="button" className="btn btn-ghost avatar">
				{image && image.length > 2 ? (
					<IconImage icon={image} />
				) : (
					<div className="avatar placeholder w-12 h-12">
						<div className="bg-netural text-black rounded-full">
							<span className="text-xl">{image}</span>
						</div>
					</div>
				)}
			</div>
			<ul tabIndex={0} className="dropdown-content p-2 bg-base-100 mt-3 z-[1] ">
				<li>
					<AmountDisplay amount={user.balance} />
				</li>
				<li role="button" className="btn btn-ghost avatar h-12 w-20">
					<LogoutButton locale={locale} label={label} />
				</li>
			</ul>
		</div>
	);
}
