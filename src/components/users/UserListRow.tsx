import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import ProtectedLink from "../ProtectedLink";
import DeleteUserButton from "./DeleteUserButton";

interface Props {
	user: { name: string; display_name: string };
	// key: number;
	on_error?: (error: string) => void;
	on_delete?: (name: string) => void;
	hidden?: true | undefined;
}

const namespaces = ["management"];

export default function UserListRow({
	user: { name, display_name },
	// key,
	on_error,
	on_delete,
	hidden,
}: Props) {
	const { t } = useTranslation(namespaces);

	return (
		<tr className={hidden && "collapse max-h-0"}>
			<td>{display_name}</td>
			<td>{name}</td>
			<td>
				<Button className={hidden && "max-h-0"}>
					<ProtectedLink
						href={{
							pathname: "/management/users/edit",
							query: { user: name },
						}}>
						{t("edit-user-button")}
					</ProtectedLink>
				</Button>
			</td>
			<td>
				<DeleteUserButton
					name={name}
					on_error={(e) => on_error && on_error(t(e))}
					on_delete={on_delete}
					hidden={hidden}
				/>
			</td>
		</tr>
	);
}
