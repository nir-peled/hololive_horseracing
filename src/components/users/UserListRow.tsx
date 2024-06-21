import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import type { Locale } from "@/src/lib/types";
import Button from "../Button";
import DeleteUserButton from "./DeleteUserButton";

interface Props {
	user: { name: string; display_name: string };
	on_error?: (error: string) => void;
	on_delete?: (name: string) => void;
	hidden?: true | undefined;
}

const namespaces = ["management"];

export default function UserListRow({
	user: { name, display_name },
	on_error,
	on_delete,
	hidden,
}: Props) {
	const { t, i18n } = useTranslation(namespaces);

	return (
		<tr className={hidden && "collapse max-h-0"}>
			<td>{display_name}</td>
			<td>{name}</td>
			<td>
				<Button className={hidden && "max-h-0"}>
					<Link
						href={{
							pathname: "management/users/edit",
							query: { user: name },
						}}
						locale={i18n.language as Locale}>
						{t("edit-user-button")}
					</Link>
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
