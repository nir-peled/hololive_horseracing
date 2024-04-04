"use client";

import React /*, { useState }*/ from "react";
// import FilterSearchBar from "../FilterSearchBar";
import SelectOption from "../SelectOption";
import { useUsersList } from "@/src/lib/hooks";
// import { users_filtered_by_display_name } from "@/src/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
	field_name?: string;
	value?: string | null | undefined;
	set_user: (user: string | null) => void;
	disabled_options?: string[];
}

const namespaces = ["management"];

/*
 * read all usernames from DB, filter which are showed.
 * fits only for small systems, if scaled consider fetching by filter/page?
 */
export default function UserSelector({
	field_name,
	value,
	set_user,
	disabled_options,
}: Props) {
	const { t } = useTranslation(namespaces);
	// const [filter, set_filter] = useState<string>("");
	const { data, loading } = useUsersList();

	// const filtered_users = users_filtered_by_display_name(users, filter);

	return (
		<div>
			{/* maybe try moving the filter inside the select? might look better */}
			{/* <FilterSearchBar name="username-filter" update_filter={set_filter} /> */}
			{/* <br /> */}
			<SelectOption
				name={field_name}
				loading={loading}
				onChange={set_user}
				options={data.map((user) => user.name)}
				labels={data.map((user) => user.display_name)}
				placeholder={t("user-selector-placeholder")}
				value={value}
				filter={true}
				disabled_options={disabled_options}
			/>
		</div>
	);
}
