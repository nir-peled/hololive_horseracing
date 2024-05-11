import React from "react";
import Link from "next/link";
import { UrlObject } from "url";
import { Locale, UserRole } from "@/src/lib/types";
import { auth, is_path_authorized } from "@/src/lib/auth";

interface Props {
	href: string | UrlObject;
	replace?: boolean;
	scroll?: boolean;
	prefetch?: boolean;
	children?: React.ReactNode;
	force?: boolean;
	locale?: Locale;
	className?: string;
	use_role?: UserRole | undefined;
}

/*
 * This is a link that appears only if the user's role allowes
 * the user to visit it. If use_role is not given, then it is read
 * from the auth session
 */
export default async function ProtectedLink({
	href,
	replace,
	scroll,
	prefetch,
	children,
	force,
	locale,
	className,
	use_role,
}: Props) {
	if (!use_role) use_role = (await auth())?.user?.role;

	if (!is_path_authorized(href, use_role) && !force) return;

	if (locale) {
		if (typeof href == "string") href = `/${locale}${href}`;
		else href.pathname = `/${locale}${href.pathname}`;
	}

	return (
		<Link
			href={href}
			replace={replace}
			scroll={scroll}
			prefetch={prefetch}
			className={className}>
			{children}
		</Link>
	);
}
