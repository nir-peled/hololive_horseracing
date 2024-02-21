import React from "react";
import Link from "next/link";
import Button from "../Button";
import DeleteUserButton from "./DeleteUserButton";
import { useTranslation } from "react-i18next";

interface Props {
	user: { name: string; display_name: string };
	key: number;
	on_error?: (error: string) => void;
	on_delete?: (name: string) => void;
}

const namespaces = ["management"];

export default function UserListRow({
	user: { name, display_name },
	key,
	on_error,
	on_delete,
}: Props) {
	const { t } = useTranslation(namespaces);

	return (
		<tr key={key}>
			<td>{display_name}</td>
			<td>{name}</td>
			<td>
				<Button>
					<Link
						href={{
							pathname: "/management/users/edit",
							query: { user: name },
						}}>
						{t("edit-user-button-label")}
					</Link>
				</Button>
			</td>
			<td>
				<DeleteUserButton
					name={name}
					on_error={(e) => on_error && on_error(t(e))}
					on_delete={on_delete}
				/>
			</td>
		</tr>
	);
}
