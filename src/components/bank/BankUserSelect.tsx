"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserData } from "@/src/lib/types";
import SelectFormInput from "../forms/SelectFormInput";
import BankUserCard from "./BankUserCard";
import IconImage from "../IconImage";

interface Props {
	users: UserData[];
}

const namespaces = ["bank"];

export default function BankUserSelect({ users }: Props) {
	const [user_id, set_user_id] = useState<bigint | undefined>();
	const { t } = useTranslation(namespaces);

	const selected_user =
		user_id !== undefined
			? users.find((user_data) => user_data.id == user_id)
			: undefined;

	return (
		<div>
			<SelectFormInput
				name="user_selector"
				placeholder={t("bank-user-select-paceholder")}
				options={users.map(({ id }) => id)}
				value={user_id}
				onChange={set_user_id}
				render_option={(option_id) => {
					let option_user = users.find((user_data) => user_data.id == option_id);
					if (!option_user) return;

					return (
						<div className="inline-block">
							<IconImage
								icon={option_user.image || option_user.display_name || option_user.name}
							/>
							<p>{option_user.display_name || option_user.name}</p>
						</div>
					);
				}}
			/>
			{selected_user !== undefined && <BankUserCard user={selected_user} />}
		</div>
	);
}
