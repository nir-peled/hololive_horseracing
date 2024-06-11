"use client";

import { useFormStatus } from "react-dom";
import { useTranslation } from "react-i18next";
import React from "react";
import Button from "../Button";

interface Props {
	name: string;
	on_error?: (error: string) => void;
	on_delete?: (name: string) => void;
	hidden?: true | undefined;
}

const namespaces = ["management"];

export default function DeleteUserButton({ name, on_error, on_delete, hidden }: Props) {
	const { t } = useTranslation(namespaces);
	const { pending } = useFormStatus();

	async function send_delete() {
		if (!confirm(t("user-delete-confirm", { name }))) return;
		const response = await fetch("/api/management/users/delete", {
			method: "POST",
			body: JSON.stringify({ name }),
		});

		if (response.ok) {
			if (on_delete) on_delete(name);
		} else if (on_error)
			response
				.json()
				.then((data) => on_error(data.message))
				.catch(() => on_error("user-delete-error"));
	}

	return (
		<form action={send_delete}>
			<Button disabled={pending} className={hidden && "max-h-0"}>
				{t("user-delete-button")}
			</Button>
		</form>
	);
}
