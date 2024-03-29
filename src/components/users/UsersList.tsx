"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useUsersList } from "@/src/lib/hooks";
import { users_filtered_by_display_name } from "@/src/lib/utils";
import FilterSearchBar from "../FilterSearchBar";
import Button from "../Button";
import DeleteUserButton from "./DeleteUserButton";
import Alert from "../Alert";
import UserListRow from "./UserListRow";

const namespaces = ["management"];

export default function UsersList() {
	const { t } = useTranslation(namespaces);
	let { users, mutate } = useUsersList();
	const [filter, set_filter] = useState<string>("");
	const [error, set_error] = useState<string | undefined>();
	const [deleted_name, set_deleted_name] = useState<string | undefined>();

	const filtered_users = users_filtered_by_display_name(users, filter);

	return (
		<div>
			<Alert type="error" active={!!error} message={error} />
			<Alert
				type="success"
				active={!!deleted_name}
				message={t("user-deleted-message", { name: deleted_name })}
			/>
			<FilterSearchBar name="username-select" update_filter={set_filter} />
			<br />
			<div className="overflow-x-auto">
				<table className="table">
					<thead>
						<tr>
							<th>{t("user-display-name-label")}</th>
							<th>{t("username-label")}</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<UserListRow user={{ name: "", display_name: "" }} hidden />
						{filtered_users.map((user, i) => (
							<UserListRow
								user={user}
								key={i}
								on_error={set_error}
								on_delete={(name) => {
									set_deleted_name(name);
									mutate(users.filter((user_) => user_.name != name));
								}}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
