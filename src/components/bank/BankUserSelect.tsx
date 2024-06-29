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

const namespaces = ["common"];

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
				placeholder={t("user-selector-placeholder")}
				options={users.map(({ id }) => ({ id }))}
				value={user_id !== undefined ? { id: user_id } : undefined}
				onChange={({ id }) => set_user_id(id)}
				render_option={(option) => {
					let option_user = users.find((user_data) => user_data.id == option.id);
					if (!option_user) return;

					return (
						<div className="flex flex-row items-center columns-2">
							<IconImage
								icon={option_user.image || option_user.display_name || option_user.name}
								className="justify-self-start basis-1/4"
							/>
							<div className="flex justify-self-center basis-3/4 justify-center">
								<p>{option_user.display_name || option_user.name}</p>
							</div>
						</div>
					);
				}}
				render_label={(option) => {
					let option_user = users.find((user_data) => user_data.id == option.id);
					return option_user?.display_name;
				}}
			/>
			{selected_user !== undefined && <BankUserCard user={selected_user} />}
		</div>
	);
}
