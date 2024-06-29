"use client";

import React from "react";
import SelectOption from "../SelectOption";
import { useUsersList } from "@/src/lib/hooks";
import { useTranslation } from "react-i18next";

interface Props {
	field_name?: string;
	value?: string | null | undefined;
	set_user: (user: string | null) => void;
	disabled_options?: string[];
}

const namespaces = ["common"];

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
	const { data, loading } = useUsersList();

	return (
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
	);
}
