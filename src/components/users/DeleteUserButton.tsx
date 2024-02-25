"use client";

import React from "react";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { useFormState, useFormStatus } from "react-dom";

interface Props {
	name: string;
	on_error?: (error: string) => void;
	on_delete?: (name: string) => void;
	hidden?: true | undefined;
}

const namespaces = ["management"];

export default function DeleteUserButton({ name, on_error, on_delete, hidden }: Props) {
	const { t } = useTranslation(namespaces);
	const [_, dispatch] = useFormState(send_delete, undefined);
	const { pending } = useFormStatus();

	async function send_delete() {
		if (!confirm(t("user-delete-confirm"))) return;
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
		// on_error(t("user-delete-error"));
	}

	return (
		<form action={dispatch}>
			<Button disabled={pending} className={hidden && "max-h-0"}>
				{t("user-delete-button")}
			</Button>
		</form>
	);
}
