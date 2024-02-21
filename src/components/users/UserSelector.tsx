"use client";

import React, { useState } from "react";
import FilterSearchBar from "../FilterSearchBar";
import SelectOption from "../SelectOption";
import { useUsersList } from "@/src/lib/hooks";
import { users_filtered_by_display_name } from "@/src/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
	user?: string | null | undefined;
	set_user: (user: string) => void;
}

const namespaces = ["management"];

/*
 * read all usernames from DB, filter which are showed.
 * fits only for small systems, if scaled consider fetching by filter/page?
 */
export default function UserSelector({ user, set_user }: Props) {
	const { t } = useTranslation(namespaces);
	const [filter, set_filter] = useState<string>("");
	const { users, loading } = useUsersList();

	const filtered_users = users_filtered_by_display_name(users, filter);

	console.log(`user selector - user ${user}`); // debug

	return (
		<div>
			{/* maybe try moving the filter inside the select? might look better */}
			<FilterSearchBar name="username-filter" update_filter={set_filter} />
			<br />
			<SelectOption
				name="username-select"
				loading={loading}
				onChange={set_user}
				options={filtered_users.map((user) => user.name)}
				labels={filtered_users.map((user) => user.display_name)}
				placeholder={t("user-selector-placeholder")}
				defaultValue={user}
			/>
		</div>
	);
}
