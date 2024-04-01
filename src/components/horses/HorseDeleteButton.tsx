"use client";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useTranslation } from "react-i18next";
import Button from "../Button";

interface Props {
	name: string;
	on_delete?: (name: string) => void;
	on_error?: (error: string) => void;
	hidden?: boolean | undefined;
}

const namespaces = ["races"];

export default function HorseDeleteButton({ name, on_delete, on_error, hidden }: Props) {
	const { t } = useTranslation(namespaces);
	const [_, dispatch] = useFormState(send_delete, undefined);
	const { pending } = useFormStatus();

	if (hidden) return;

	async function send_delete() {
		if (!confirm(t("horse-delete-confirm"))) return;
		const response = await fetch("/api/management/horses/delete", {
			method: "POST",
			body: JSON.stringify({ name }),
		});

		if (response.ok) if (on_delete) return on_delete(name);
		if (on_error) {
			response
				.json()
				.then((data) => on_error(data.message))
				.catch(() => on_error("horse-delete-error"));
		}
	}

	return (
		<form action={dispatch}>
			<Button disabled={pending}>{t("horse-delete-button")}</Button>
		</form>
	);
}